import os, datetime
from typing import Optional
from jose import jwt, JWTError
from passlib.context import CryptContext

SECRET_KEY = os.getenv("JWT_SECRET", "dev-secret-change-me")
ALGO = "HS256"
ACCESS_MIN = int(os.getenv("JWT_ACCESS_MIN", "60"))

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(p: str) -> str:
    return pwd.hash(p)

def verify_password(p: str, h: str) -> bool:
    return pwd.verify(p, h)

def create_access_token(sub: str, extra: Optional[dict]=None) -> str:
    to_encode = {"sub": sub, "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=ACCESS_MIN)}
    if extra: to_encode.update(extra)
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGO)

def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=[ALGO])
