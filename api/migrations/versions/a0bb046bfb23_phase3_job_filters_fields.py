"""phase3 job filters fields

Revision ID: a0bb046bfb23
Revises: dce7c8993f07
Create Date: 2025-09-19 03:30:12.148040
"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "a0bb046bfb23"
down_revision: Union[str, None] = "dce7c8993f07"  # <-- make sure this matches your previous revision id
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # New columns on jobs
    op.add_column(
        "jobs",
        sa.Column("posted_at", sa.DateTime(timezone=True), server_default=sa.text("now()"), nullable=False),
    )
    op.add_column("jobs", sa.Column("employment_type", sa.String(length=50), nullable=True))
    op.add_column("jobs", sa.Column("seniority", sa.String(length=50), nullable=True))
    op.add_column("jobs", sa.Column("salary_min", sa.Integer(), nullable=True))
    op.add_column("jobs", sa.Column("salary_max", sa.Integer(), nullable=True))
    op.add_column(
        "jobs",
        sa.Column("salary_currency", sa.String(length=3), server_default=sa.text("'USD'"), nullable=False),
    )

    # Helpful indexes
    op.create_index("ix_jobs_posted_at", "jobs", ["posted_at"])
    op.create_index("ix_jobs_location", "jobs", ["location"])
    op.create_index("ix_jobs_employment_type", "jobs", ["employment_type"])
    op.create_index("ix_jobs_seniority", "jobs", ["seniority"])
    op.create_index("ix_jobs_salary_max_desc", "jobs", ["salary_max"])


def downgrade() -> None:
    # Drop indexes first (reverse order is fine)
    op.drop_index("ix_jobs_salary_max_desc", table_name="jobs")
    op.drop_index("ix_jobs_seniority", table_name="jobs")
    op.drop_index("ix_jobs_employment_type", table_name="jobs")
    op.drop_index("ix_jobs_location", table_name="jobs")
    op.drop_index("ix_jobs_posted_at", table_name="jobs")

    # Drop columns
    op.drop_column("jobs", "salary_currency")
    op.drop_column("jobs", "salary_max")
    op.drop_column("jobs", "salary_min")
    op.drop_column("jobs", "seniority")
    op.drop_column("jobs", "employment_type")
    op.drop_column("jobs", "posted_at")
