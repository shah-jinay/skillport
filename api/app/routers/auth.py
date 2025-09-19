from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..db import get_db
from ..models import User, Role
from ..schemas import RegisterIn, LoginIn, UserOut, TokenOut
from ..auth import hash_password, verify_password, create_access_token
from ..deps import current_user

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=UserOut)
async def register(body: RegisterIn, db: AsyncSession = Depends(get_db)):
    exists = (await db.execute(select(User).where(User.email == body.email))).scalar_one_or_none()
    if exists:
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(email=body.email, password_hash=hash_password(body.password))
    # default role: seeker
    seeker = (await db.execute(select(Role).where(Role.name=="seeker"))).scalar_one_or_none()
    if seeker: user.roles.append(seeker)

    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

@router.post("/login", response_model=TokenOut)
async def login(body: LoginIn, db: AsyncSession = Depends(get_db)):
    user = (await db.execute(select(User).where(User.email == body.email))).scalar_one_or_none()
    if not user or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    token = create_access_token(sub=user.email)
    return TokenOut(access_token=token)

@router.get("/me", response_model=UserOut)
async def me(user: User = Depends(current_user)):
    return user
