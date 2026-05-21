import os

import bcrypt
from jose import jwt

SECRET_KEY = os.getenv("MLT_SECRET_KEY", "dev-secret-change-in-production-mlt-2026")
ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(password: str, password_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), password_hash.encode("utf-8"))


def create_token(user_id: int, email: str, role: str = "user") -> str:
    payload = {"sub": str(user_id), "email": email, "role": role}
    return jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
