import asyncio, os, sys
from argparse import ArgumentParser
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import select, insert, exists
sys.path.append("/app")

from app.models import Base, User, Role, user_roles  # type: ignore

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://mm:mm@db:5432/mm")
engine = create_async_engine(DATABASE_URL, future=True)
Session = async_sessionmaker(engine, expire_on_commit=False)

async def main():
    ap = ArgumentParser(description="Promote a user to admin (idempotent)")
    ap.add_argument("email", help="User email to promote")
    args = ap.parse_args()

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with Session() as s:
        uid = (await s.execute(select(User.id).where(User.email == args.email))).scalar_one_or_none()
        if uid is None:
            print(f"User not found: {args.email}")
            return

        rid = (await s.execute(select(Role.id).where(Role.name == "admin"))).scalar_one_or_none()
        if rid is None:
            print("Role 'admin' not found. Run: docker compose exec api python scripts/seed_roles.py")
            return

        already = (await s.execute(
            select(exists().where((user_roles.c.user_id == uid) & (user_roles.c.role_id == rid)))
        )).scalar()

        if already:
            print(f"{args.email} is already admin.")
            return

        await s.execute(insert(user_roles).values(user_id=uid, role_id=rid))
        await s.commit()
        print(f"Promoted to admin: {args.email}")

if __name__ == "__main__":
    asyncio.run(main())
