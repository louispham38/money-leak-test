import json
import os
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from passlib.context import CryptContext
from pydantic import BaseModel, EmailStr, Field

from database import get_db, init_db, row_to_dict, utc_now

SECRET_KEY = os.getenv("MLT_SECRET_KEY", "dev-secret-change-in-production-mlt-2026")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_DAYS = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)

app = FastAPI(title="MoneyLeakTest API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("MLT_CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def startup():
    init_db()


class RegisterBody(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=8, max_length=20)
    password: str = Field(min_length=6, max_length=128)


class LoginBody(BaseModel):
    email: EmailStr
    password: str


class TestResultBody(BaseModel):
    score: int
    level_key: str
    level_label: str
    top_leaks: list
    plan_title: str
    plan_intro: str
    plan_steps: list[str]
    leak_scores: dict
    readiness: Optional[str] = None


class GoalsBody(BaseModel):
    monthly_income: Optional[float] = None
    savings_target: Optional[float] = None
    emergency_fund: Optional[float] = None
    debt_payoff: Optional[float] = None
    goal_note: Optional[str] = None


def create_token(user_id: int, email: str) -> str:
    payload = {"sub": str(user_id), "email": email}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    creds: HTTPAuthorizationCredentials | None = Depends(security),
) -> dict:
    if not creds:
        raise HTTPException(401, "Chưa đăng nhập")
    try:
        payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = int(payload["sub"])
    except (JWTError, ValueError) as e:
        raise HTTPException(401, "Token không hợp lệ") from e

    with get_db() as conn:
        user = row_to_dict(
            conn.execute("SELECT id, email, full_name, phone, created_at FROM users WHERE id = ?", (user_id,)).fetchone()
        )
    if not user:
        raise HTTPException(401, "Tài khoản không tồn tại")
    return user


@app.get("/api/health")
def health():
    return {"ok": True}


@app.post("/api/auth/register")
def register(body: RegisterBody):
    password_hash = pwd_context.hash(body.password)
    with get_db() as conn:
        exists = conn.execute("SELECT id FROM users WHERE email = ?", (body.email.lower(),)).fetchone()
        if exists:
            raise HTTPException(400, "Email đã được đăng ký")
        cur = conn.execute(
            "INSERT INTO users (email, full_name, phone, password_hash, created_at) VALUES (?, ?, ?, ?, ?)",
            (body.email.lower(), body.full_name.strip(), body.phone.strip(), password_hash, utc_now()),
        )
        user_id = cur.lastrowid
        user = row_to_dict(
            conn.execute(
                "SELECT id, email, full_name, phone, created_at FROM users WHERE id = ?",
                (user_id,),
            ).fetchone()
        )
    token = create_token(user["id"], user["email"])
    return {"token": token, "user": user}


@app.post("/api/auth/login")
def login(body: LoginBody):
    with get_db() as conn:
        row = conn.execute(
            "SELECT id, email, full_name, phone, password_hash, created_at FROM users WHERE email = ?",
            (body.email.lower(),),
        ).fetchone()
    if not row or not pwd_context.verify(body.password, row["password_hash"]):
        raise HTTPException(401, "Email hoặc mật khẩu không đúng")
    user = row_to_dict(row)
    del user["password_hash"]
    token = create_token(user["id"], user["email"])
    return {"token": token, "user": user}


@app.get("/api/me")
def me(user: dict = Depends(get_current_user)):
    return user


@app.post("/api/test-results")
def save_test_result(body: TestResultBody, user: dict = Depends(get_current_user)):
    with get_db() as conn:
        cur = conn.execute(
            """
            INSERT INTO test_results
            (user_id, score, level_key, level_label, top_leaks, plan_title, plan_intro, plan_steps, leak_scores, readiness, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user["id"],
                body.score,
                body.level_key,
                body.level_label,
                json.dumps(body.top_leaks, ensure_ascii=False),
                body.plan_title,
                body.plan_intro,
                json.dumps(body.plan_steps, ensure_ascii=False),
                json.dumps(body.leak_scores, ensure_ascii=False),
                body.readiness,
                utc_now(),
            ),
        )
        result_id = cur.lastrowid
    return {"id": result_id, "message": "Đã lưu kết quả bài test"}


@app.get("/api/test-results/latest")
def latest_test_result(user: dict = Depends(get_current_user)):
    with get_db() as conn:
        row = conn.execute(
            """
            SELECT * FROM test_results WHERE user_id = ? ORDER BY id DESC LIMIT 1
            """,
            (user["id"],),
        ).fetchone()
    if not row:
        return None
    data = row_to_dict(row)
    data["top_leaks"] = json.loads(data["top_leaks"])
    data["plan_steps"] = json.loads(data["plan_steps"])
    data["leak_scores"] = json.loads(data["leak_scores"])
    return data


@app.get("/api/goals")
def get_goals(user: dict = Depends(get_current_user)):
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM financial_goals WHERE user_id = ?",
            (user["id"],),
        ).fetchone()
    return row_to_dict(row)


@app.put("/api/goals")
def upsert_goals(body: GoalsBody, user: dict = Depends(get_current_user)):
    now = utc_now()
    with get_db() as conn:
        existing = conn.execute(
            "SELECT user_id FROM financial_goals WHERE user_id = ?",
            (user["id"],),
        ).fetchone()
        if existing:
            conn.execute(
                """
                UPDATE financial_goals SET
                monthly_income = ?, savings_target = ?, emergency_fund = ?,
                debt_payoff = ?, goal_note = ?, updated_at = ?
                WHERE user_id = ?
                """,
                (
                    body.monthly_income,
                    body.savings_target,
                    body.emergency_fund,
                    body.debt_payoff,
                    body.goal_note,
                    now,
                    user["id"],
                ),
            )
        else:
            conn.execute(
                """
                INSERT INTO financial_goals
                (user_id, monthly_income, savings_target, emergency_fund, debt_payoff, goal_note, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    user["id"],
                    body.monthly_income,
                    body.savings_target,
                    body.emergency_fund,
                    body.debt_payoff,
                    body.goal_note,
                    now,
                ),
            )
        row = conn.execute(
            "SELECT * FROM financial_goals WHERE user_id = ?",
            (user["id"],),
        ).fetchone()
    return row_to_dict(row)
