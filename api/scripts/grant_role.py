# api/scripts/grant_role.py
import asyncio, os, sys
from argparse import ArgumentParser
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import select
sys.path.append("/app")

from app.models import Base, User, Role

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://mm:mm@db:5432/mm")
engine = create_async_engine(DATABASE_URL, future=True)
Session = async_sessionmaker(engine, expire_on_commit=False)

async def main():
    ap = ArgumentParser(description="Grant a role to a user")
    ap.add_argument("email")
    ap.add_argument("role", choices=["admin","recruiter","seeker"])
    args = ap.parse_args()

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with Session() as s:
        user = (await s.execute(select(User).where(User.email == args.email))).scalar_one_or_none()
        if not user:
            print(f"User not found: {args.email}")
            return

        role = (await s.execute(select(Role).where(Role.name == args.role))).scalar_one_or_none()
        if not role:
            print(f"Role '{args.role}' not found. Run seed_roles.py first.")
            return

        if any(r.name == args.role for r in user.roles):
            print(f"User already has role '{args.role}': {args.email}")
            return

        user.roles.append(role)
        await s.commit()
        print(f"Granted role '{args.role}' to {args.email}")

if __name__ == "__main__":
    asyncio.run(main())
