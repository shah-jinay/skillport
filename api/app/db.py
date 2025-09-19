import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base

Base = declarative_base()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://mm:mm@localhost:5432/mm")
engine = create_async_engine(DATABASE_URL, echo=False, future=True)
async_session = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
