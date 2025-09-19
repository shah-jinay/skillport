# api/migrations/env.py
from __future__ import annotations

import asyncio
import os
import sys
from logging.config import fileConfig
from pathlib import Path

from alembic import context
from sqlalchemy import pool
from sqlalchemy.engine import Connection
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine

# Ensure "app" is importable when Alembic runs
BASE_DIR = Path(__file__).resolve().parents[1]  # points to api/
if str(BASE_DIR) not in sys.path:
    sys.path.append(str(BASE_DIR))

from app.models import Base  # noqa: E402

# Alembic Config object
config = context.config

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Target metadata
target_metadata = Base.metadata

# If alembic.ini didn't set the URL, fall back to env var (optional)
if not config.get_main_option("sqlalchemy.url"):
    config.set_main_option(
        "sqlalchemy.url",
        os.getenv("DATABASE_URL", "postgresql+asyncpg://mm:mm@db:5432/mm"),
    )

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        compare_type=True,
        compare_server_default=True,
        version_table="alembic_version",
        version_table_schema="public",
    )
    with context.begin_transaction():
        context.run_migrations()

def do_run_migrations(connection: Connection) -> None:
    """Sync callback used by AsyncEngine.run_sync()."""
    context.configure(
        connection=connection,
        target_metadata=target_metadata,
        compare_type=True,
        compare_server_default=True,
        version_table="alembic_version",
        version_table_schema="public",
    )
    with context.begin_transaction():
        context.run_migrations()

async def run_migrations_online() -> None:
    """Run migrations in 'online' (async) mode."""
    connectable: AsyncEngine = create_async_engine(
        config.get_main_option("sqlalchemy.url"),
        poolclass=pool.NullPool,
    )
    async with connectable.connect() as async_conn:
        await async_conn.run_sync(do_run_migrations)
    await connectable.dispose()

def run_migrations() -> None:
    if context.is_offline_mode():
        run_migrations_offline()
    else:
        asyncio.run(run_migrations_online())

run_migrations()
