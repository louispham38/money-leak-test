import json
import os

from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from pydantic import BaseModel, Field

from auth_core import ALGORITHM, SECRET_KEY, create_token, hash_password, verify_password
from database import get_db, row_to_dict, utc_now

ADMIN_EMAIL = "admin@mlt.internal"
ADMIN_USERNAME = "admin"
DEFAULT_ADMIN_PASSWORD = os.getenv("MLT_ADMIN_PASSWORD", "pAss123")

router = APIRouter(prefix="/api/admin", tags=["admin"])
admin_security = HTTPBearer(auto_error=False)


class AdminLoginBody(BaseModel):
    username: str = Field(min_length=1, max_length=64)
    password: str


def seed_admin():
    with get_db() as conn:
        row = conn.execute("SELECT id FROM users WHERE email = ?", (ADMIN_EMAIL,)).fetchone()
        pw_hash = hash_password(DEFAULT_ADMIN_PASSWORD)
        if row:
            conn.execute(
                "UPDATE users SET password_hash = ?, role = 'admin' WHERE id = ?",
                (pw_hash, row["id"]),
            )
        else:
            conn.execute(
                """
                INSERT INTO users (email, full_name, phone, password_hash, role, created_at)
                VALUES (?, ?, ?, ?, 'admin', ?)
                """,
                (ADMIN_EMAIL, "Administrator", "0000000000", pw_hash, utc_now()),
            )


def _resolve_admin_email(username: str) -> str:
    u = username.strip().lower()
    if u == ADMIN_USERNAME:
        return ADMIN_EMAIL
    return u


def get_current_admin(
    creds: HTTPAuthorizationCredentials | None = Depends(admin_security),
) -> dict:
    if not creds:
        raise HTTPException(401, "Chưa đăng nhập admin")
    try:
        payload = jwt.decode(creds.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(403, "Không có quyền admin")
        user_id = int(payload["sub"])
    except (JWTError, ValueError) as e:
        raise HTTPException(401, "Token không hợp lệ") from e

    with get_db() as conn:
        user = row_to_dict(
            conn.execute(
                "SELECT id, email, full_name, phone, role, created_at FROM users WHERE id = ? AND role = 'admin'",
                (user_id,),
            ).fetchone()
        )
    if not user:
        raise HTTPException(403, "Tài khoản admin không tồn tại")
    return user


def _parse_result_row(row: dict) -> dict:
    for key in ("top_leaks", "plan_steps", "leak_scores", "answers"):
        if row.get(key) and isinstance(row[key], str):
            try:
                row[key] = json.loads(row[key])
            except json.JSONDecodeError:
                row[key] = None
    return row


@router.post("/login")
def admin_login(body: AdminLoginBody):
    email = _resolve_admin_email(body.username)
    with get_db() as conn:
        row = conn.execute(
            "SELECT id, email, full_name, phone, password_hash, role, created_at FROM users WHERE email = ? AND role = 'admin'",
            (email,),
        ).fetchone()
    if not row or not verify_password(body.password, row["password_hash"]):
        raise HTTPException(401, "Tên đăng nhập hoặc mật khẩu không đúng")
    user = row_to_dict(row)
    del user["password_hash"]
    token = create_token(user["id"], user["email"], role="admin")
    return {"token": token, "user": user}


@router.get("/stats")
def admin_stats(_: dict = Depends(get_current_admin)):
    with get_db() as conn:
        total_users = conn.execute(
            "SELECT COUNT(*) AS c FROM users WHERE role IS NULL OR role != 'admin'"
        ).fetchone()["c"]
        users_with_test = conn.execute(
            "SELECT COUNT(DISTINCT user_id) AS c FROM test_results"
        ).fetchone()["c"]
        total_tests = conn.execute("SELECT COUNT(*) AS c FROM test_results").fetchone()["c"]
        thu_chi_users = conn.execute(
            "SELECT COUNT(DISTINCT user_id) AS c FROM app_events WHERE event_type = 'thu_chi_open'"
        ).fetchone()["c"]
        thu_chi_clicks = conn.execute(
            "SELECT COUNT(*) AS c FROM app_events WHERE event_type = 'thu_chi_open'"
        ).fetchone()["c"]
        goals_users = conn.execute(
            "SELECT COUNT(*) AS c FROM financial_goals"
        ).fetchone()["c"]
        recent = conn.execute(
            """
            SELECT DATE(created_at) AS day, COUNT(*) AS cnt
            FROM users
            WHERE (role IS NULL OR role != 'admin') AND created_at >= datetime('now', '-30 days')
            GROUP BY DATE(created_at)
            ORDER BY day DESC
            LIMIT 14
            """
        ).fetchall()
    return {
        "total_users": total_users,
        "users_with_test": users_with_test,
        "total_tests": total_tests,
        "thu_chi_unique_users": thu_chi_users,
        "thu_chi_total_clicks": thu_chi_clicks,
        "users_with_goals": goals_users,
        "registrations_by_day": [dict(r) for r in recent],
    }


@router.get("/users")
def admin_list_users(_: dict = Depends(get_current_admin)):
    with get_db() as conn:
        rows = conn.execute(
            """
            SELECT u.id, u.email, u.full_name, u.phone, u.created_at,
                   (SELECT COUNT(*) FROM test_results tr WHERE tr.user_id = u.id) AS test_count,
                   (SELECT tr.score FROM test_results tr WHERE tr.user_id = u.id ORDER BY tr.id DESC LIMIT 1) AS latest_score,
                   (SELECT tr.level_label FROM test_results tr WHERE tr.user_id = u.id ORDER BY tr.id DESC LIMIT 1) AS latest_level,
                   (SELECT tr.created_at FROM test_results tr WHERE tr.user_id = u.id ORDER BY tr.id DESC LIMIT 1) AS latest_test_at,
                   (SELECT COUNT(*) FROM app_events ae WHERE ae.user_id = u.id AND ae.event_type = 'thu_chi_open') AS thu_chi_clicks,
                   EXISTS(SELECT 1 FROM financial_goals fg WHERE fg.user_id = u.id) AS has_goals
            FROM users u
            WHERE u.role IS NULL OR u.role != 'admin'
            ORDER BY u.created_at DESC
            """
        ).fetchall()
    return {"users": [dict(r) for r in rows]}


@router.get("/users/{user_id}")
def admin_user_detail(user_id: int, _: dict = Depends(get_current_admin)):
    with get_db() as conn:
        user = row_to_dict(
            conn.execute(
                "SELECT id, email, full_name, phone, created_at FROM users WHERE id = ? AND (role IS NULL OR role != 'admin')",
                (user_id,),
            ).fetchone()
        )
        if not user:
            raise HTTPException(404, "Không tìm thấy thành viên")
        results = conn.execute(
            "SELECT * FROM test_results WHERE user_id = ? ORDER BY id DESC",
            (user_id,),
        ).fetchall()
        events = conn.execute(
            "SELECT event_type, created_at FROM app_events WHERE user_id = ? ORDER BY id DESC",
            (user_id,),
        ).fetchall()
        goals = row_to_dict(
            conn.execute("SELECT * FROM financial_goals WHERE user_id = ?", (user_id,)).fetchone()
        )
    return {
        "user": user,
        "results": [_parse_result_row(row_to_dict(r)) for r in results],
        "events": [dict(e) for e in events],
        "goals": goals,
    }
