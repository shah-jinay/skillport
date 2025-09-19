from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from .db import get_db
from .models import User, Role
from .auth import decode_token

bearer = HTTPBearer(auto_error=False)

async def current_user(creds: HTTPAuthorizationCredentials = Depends(bearer),
                       db: AsyncSession = Depends(get_db)) -> User:
    if not creds:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated")
    try:
        payload = decode_token(creds.credentials)
        email = payload.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    stmt = select(User).options(selectinload(User.roles)).where(User.email == email)
    res = await db.execute(stmt)
    user = res.scalar_one_or_none()
    if not user or not user.is_active:
        raise HTTPException(status_code=401, detail="Inactive or missing user")
    return user

def requires_roles(*roles: str):
    async def _guard(user: User = Depends(current_user)):
        names = {r.name for r in user.roles}
        if any(r in names for r in roles):
            return user
        raise HTTPException(status_code=403, detail="Forbidden")
    return _guard
