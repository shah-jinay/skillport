# api/scripts/seed_roles.py
import asyncio, os, sys
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import select
sys.path.append("/app")  # container workdir

from app.models import Base, Role

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://mm:mm@db:5432/mm")
engine = create_async_engine(DATABASE_URL, future=True)
Session = async_sessionmaker(engine, expire_on_commit=False)

async def main():
    async with engine.begin() as conn:
        # no-op if alembic already created; helpful on fresh DBs
        await conn.run_sync(Base.metadata.create_all)

    roles = ["admin", "recruiter", "seeker"]
    async with Session() as s:
        created = 0
        for name in roles:
            existing = (await s.execute(select(Role).where(Role.name == name))).scalar_one_or_none()
            if not existing:
                s.add(Role(name=name))
                created += 1
        if created:
            await s.commit()
        print(f"Roles ensured. Created: {created}, total expected: {len(roles)}.")

if __name__ == "__main__":
    asyncio.run(main())
