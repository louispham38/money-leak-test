import hashlib
import json
import os
import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel, EmailStr, Field

from admin import router as admin_router, seed_admin
from auth_core import SECRET_KEY, create_token, hash_password, verify_password
from database import get_db, init_db, row_to_dict, utc_now
from email_service import send_reset_email, smtp_configured

ALGORITHM = "HS256"
security = HTTPBearer(auto_error=False)

app = FastAPI(title="MoneyLeakTest API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("MLT_CORS_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(admin_router)


@app.on_event("startup")
def startup():
    init_db()
    seed_admin()


class RegisterBody(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)
    phone: str = Field(min_length=8, max_length=20)
    password: str = Field(min_length=6, max_length=128)


class LoginBody(BaseModel):
    email: EmailStr
    password: str


class ForgotPasswordBody(BaseModel):
    email: EmailStr


class ResetPasswordBody(BaseModel):
    token: str = Field(min_length=20)
    password: str = Field(min_length=6, max_length=128)


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
    answers: Optional[list] = None


class EventBody(BaseModel):
    event_type: str = Field(pattern="^(thu_chi_open)$")


class GoalProgressBody(BaseModel):
    period_label: str = Field(min_length=1, max_length=32)
    actual_savings: Optional[float] = None
    actual_emergency: Optional[float] = None
    actual_debt_paid: Optional[float] = None
    actual_income: Optional[float] = None
    note: Optional[str] = None


class GoalsBody(BaseModel):
    monthly_income: Optional[float] = None
    savings_target: Optional[float] = None
    emergency_fund: Optional[float] = None
    debt_payoff: Optional[float] = None
    goal_note: Optional[str] = None


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


@app.get("/ping")
@app.get("/api/health")
def health():
    return {"ok": True, "service": "money-leak-test-api"}


@app.post("/api/auth/register")
def register(body: RegisterBody):
    password_hash = hash_password(body.password)
    with get_db() as conn:
        exists = conn.execute("SELECT id FROM users WHERE email = ?", (body.email.lower(),)).fetchone()
        if exists:
            raise HTTPException(400, "Email đã được đăng ký")
        if body.email.lower() == "admin@mlt.internal":
            raise HTTPException(400, "Email này không dùng để đăng ký")
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


def _frontend_base() -> str:
    return os.getenv("MLT_FRONTEND_URL", "https://louispham38.github.io/money-leak-test").rstrip("/")


def _hash_token(token: str) -> str:
    return hashlib.sha256(token.encode()).hexdigest()


@app.post("/api/auth/forgot-password")
def forgot_password(body: ForgotPasswordBody):
    """Luôn trả message giống nhau để không lộ email có tồn tại hay không."""
    msg_ok = {
        "message": "Nếu email đã đăng ký, bạn sẽ nhận link đặt lại mật khẩu trong vài phút. Kiểm tra cả hộp thư spam."
    }
    if not smtp_configured():
        raise HTTPException(
            503,
            "Hệ thống email chưa sẵn sàng. Vui lòng liên hệ quản trị viên hoặc đăng ký lại tài khoản.",
        )

    email = body.email.lower()
    with get_db() as conn:
        user = conn.execute("SELECT id, email FROM users WHERE email = ?", (email,)).fetchone()
        if not user:
            return msg_ok

        raw_token = secrets.token_urlsafe(48)
        token_hash = _hash_token(raw_token)
        expires = (datetime.now(timezone.utc) + timedelta(hours=1)).isoformat()
        conn.execute(
            "UPDATE password_reset_tokens SET used_at = ? WHERE user_id = ? AND used_at IS NULL",
            (utc_now(), user["id"]),
        )
        conn.execute(
            """
            INSERT INTO password_reset_tokens (user_id, token_hash, expires_at, created_at)
            VALUES (?, ?, ?, ?)
            """,
            (user["id"], token_hash, expires, utc_now()),
        )

    reset_url = f"{_frontend_base()}/reset-password.html?token={raw_token}"
    try:
        send_reset_email(user["email"], reset_url)
    except Exception as e:
        raise HTTPException(500, f"Không gửi được email: {e}") from e

    return msg_ok


@app.post("/api/auth/reset-password")
def reset_password(body: ResetPasswordBody):
    token_hash = _hash_token(body.token.strip())
    now = datetime.now(timezone.utc)

    with get_db() as conn:
        row = conn.execute(
            """
            SELECT id, user_id, expires_at, used_at FROM password_reset_tokens
            WHERE token_hash = ? ORDER BY id DESC LIMIT 1
            """,
            (token_hash,),
        ).fetchone()
        if not row:
            raise HTTPException(400, "Link không hợp lệ hoặc đã hết hạn")
        if row["used_at"]:
            raise HTTPException(400, "Link đã được sử dụng. Vui lòng yêu cầu link mới.")
        expires = datetime.fromisoformat(row["expires_at"].replace("Z", "+00:00"))
        if now > expires:
            raise HTTPException(400, "Link đã hết hạn. Vui lòng yêu cầu link mới.")

        password_hash = hash_password(body.password)
        conn.execute(
            "UPDATE users SET password_hash = ? WHERE id = ?",
            (password_hash, row["user_id"]),
        )
        conn.execute(
            "UPDATE password_reset_tokens SET used_at = ? WHERE id = ?",
            (utc_now(), row["id"]),
        )

    return {"message": "Đã đặt lại mật khẩu thành công. Bạn có thể đăng nhập ngay."}


@app.post("/api/auth/login")
def login(body: LoginBody):
    with get_db() as conn:
        row = conn.execute(
            "SELECT id, email, full_name, phone, password_hash, created_at FROM users WHERE email = ?",
            (body.email.lower(),),
        ).fetchone()
    if not row or not verify_password(body.password, row["password_hash"]):
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
            (user_id, score, level_key, level_label, top_leaks, plan_title, plan_intro, plan_steps, leak_scores, readiness, answers, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
                json.dumps(body.answers or [], ensure_ascii=False),
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
    if data.get("answers"):
        data["answers"] = json.loads(data["answers"])
    else:
        data["answers"] = []
    return data


@app.post("/api/events")
def track_event(body: EventBody, user: dict = Depends(get_current_user)):
    with get_db() as conn:
        conn.execute(
            "INSERT INTO app_events (user_id, event_type, created_at) VALUES (?, ?, ?)",
            (user["id"], body.event_type, utc_now()),
        )
    return {"ok": True}


@app.get("/api/goals")
def get_goals(user: dict = Depends(get_current_user)):
    with get_db() as conn:
        row = conn.execute(
            "SELECT * FROM financial_goals WHERE user_id = ?",
            (user["id"],),
        ).fetchone()
    return row_to_dict(row)


@app.get("/api/goals/progress")
def list_goal_progress(user: dict = Depends(get_current_user)):
    with get_db() as conn:
        rows = conn.execute(
            "SELECT * FROM goal_progress WHERE user_id = ? ORDER BY period_label DESC, id DESC",
            (user["id"],),
        ).fetchall()
    return [row_to_dict(r) for r in rows]


@app.post("/api/goals/progress")
def add_goal_progress(body: GoalProgressBody, user: dict = Depends(get_current_user)):
    with get_db() as conn:
        existing = conn.execute(
            "SELECT id FROM goal_progress WHERE user_id = ? AND period_label = ?",
            (user["id"], body.period_label),
        ).fetchone()
        if existing:
            conn.execute(
                """
                UPDATE goal_progress SET
                actual_savings = ?, actual_emergency = ?, actual_debt_paid = ?,
                actual_income = ?, note = ?, created_at = ?
                WHERE id = ?
                """,
                (
                    body.actual_savings,
                    body.actual_emergency,
                    body.actual_debt_paid,
                    body.actual_income,
                    body.note,
                    utc_now(),
                    existing["id"],
                ),
            )
            row_id = existing["id"]
        else:
            cur = conn.execute(
                """
                INSERT INTO goal_progress
                (user_id, period_label, actual_savings, actual_emergency, actual_debt_paid, actual_income, note, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """,
                (
                    user["id"],
                    body.period_label,
                    body.actual_savings,
                    body.actual_emergency,
                    body.actual_debt_paid,
                    body.actual_income,
                    body.note,
                    utc_now(),
                ),
            )
            row_id = cur.lastrowid
        row = conn.execute("SELECT * FROM goal_progress WHERE id = ?", (row_id,)).fetchone()
    return row_to_dict(row)


@app.delete("/api/goals/progress/{progress_id}")
def delete_goal_progress(progress_id: int, user: dict = Depends(get_current_user)):
    with get_db() as conn:
        row = conn.execute(
            "SELECT id FROM goal_progress WHERE id = ? AND user_id = ?",
            (progress_id, user["id"]),
        ).fetchone()
        if not row:
            raise HTTPException(404, "Không tìm thấy bản ghi tiến độ")
        conn.execute("DELETE FROM goal_progress WHERE id = ?", (progress_id,))
    return {"ok": True}


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
