from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..db import get_db
from ..models import Job, Company
from ..schemas import JobOut
from ..deps import requires_roles

router = APIRouter()

@router.get("/jobs", response_model=list[JobOut])
async def list_jobs(
    db: AsyncSession = Depends(get_db),
    search: str | None = Query(None),
    sponsorship: bool | None = Query(None),
):
    stmt = select(Job).order_by(Job.created_at.desc())
    if search:
        stmt = stmt.filter(Job.title.ilike(f"%{search}%"))
    if sponsorship is not None:
        stmt = stmt.filter(Job.visa_sponsorship == sponsorship)

    res = await db.execute(stmt)
    jobs = res.scalars().unique().all()

    # naive company attach (fine for Phase 1)
    for j in jobs:
        if j.company_id:
            c = (await db.execute(select(Company).where(Company.id == j.company_id))).scalar_one()
            j.company = c
    return jobs
@router.post("/jobs", response_model=JobOut)
async def create_job(payload: dict,
                     db: AsyncSession = Depends(get_db),
                     user = Depends(requires_roles("recruiter","admin"))):
    # payload expects: title, company_id, location, description, remote, visa_sponsorship
    job = Job(**payload)
    db.add(job)
    await db.commit()
    await db.refresh(job)
    # attach company for response
    if job.company_id:
        job.company = (await db.execute(select(Company).where(Company.id==job.company_id))).scalar_one()
    return job