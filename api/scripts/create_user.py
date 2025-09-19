# api/scripts/create_user.py
import asyncio, os, sys
from argparse import ArgumentParser
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import select
sys.path.append("/app")

from app.models import Base, User, Role
from app.auth import hash_password

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://mm:mm@db:5432/mm")
engine = create_async_engine(DATABASE_URL, future=True)
Session = async_sessionmaker(engine, expire_on_commit=False)

async def main():
    ap = ArgumentParser(description="Create a user")
    ap.add_argument("email")
    ap.add_argument("password")
    ap.add_argument("--role", choices=["admin","recruiter","seeker"], help="Optionally assign a role on create")
    args = ap.parse_args()

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with Session() as s:
        existing = (await s.execute(select(User).where(User.email == args.email))).scalar_one_or_none()
        if existing:
            print(f"User already exists: {args.email}")
            return

        user = User(email=args.email, password_hash=hash_password(args.password))
        if args.role:
            role = (await s.execute(select(Role).where(Role.name == args.role))).scalar_one_or_none()
            if not role:
                print(f"Role '{args.role}' not found. Run seed_roles.py first.")
                return
            user.roles.append(role)

        s.add(user)
        await s.commit()
        print(f"Created user: {args.email}{' with role '+args.role if args.role else ''}")

if __name__ == "__main__":
    asyncio.run(main())
