# api/app/routers/jobs.py
from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload

from ..db import get_db
from ..models import Job, Company
from ..schemas import JobOut, JobCreate
from ..deps import requires_roles

router = APIRouter(prefix="/jobs", tags=["jobs"])

# ---- helpers ---------------------------------------------------------
def apply_job_filters(
    stmt,
    *,
    q: str | None,
    location: str | None,
    remote: bool | None,
    visa: bool | None,
    employment_type: str | None,
    seniority: str | None,
    salary_min: int | None,
    salary_max: int | None,
    company_id: int | None,
):
    if q:
        ilike = f"%{q}%"
        stmt = stmt.where(or_(Job.title.ilike(ilike), Job.description.ilike(ilike)))
    if location:
        stmt = stmt.where(Job.location.ilike(f"%{location}%"))
    if remote is not None:
        stmt = stmt.where(Job.remote == remote)
    if visa is not None:
        stmt = stmt.where(Job.visa_sponsorship == visa)
    if employment_type:
        stmt = stmt.where(Job.employment_type == employment_type)
    if seniority:
        stmt = stmt.where(Job.seniority == seniority)
    if salary_min is not None:
        stmt = stmt.where(Job.salary_max >= salary_min)
    if salary_max is not None:
        stmt = stmt.where(Job.salary_min <= salary_max)
    if company_id is not None:
        stmt = stmt.where(Job.company_id == company_id)
    return stmt

def parse_sort(sort: str):
    try:
        col, direction = sort.split(":")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid sort format. Use field:asc|desc")
    col_map = {
        "posted_at": Job.posted_at,
        "salary_max": Job.salary_max,
        "created_at": Job.created_at,
    }
    if col not in col_map or direction not in {"asc", "desc"}:
        raise HTTPException(status_code=400, detail="Invalid sort value")
    return col_map[col], direction

# ---- endpoints --------------------------------------------------------
@router.get("", response_model=list[JobOut])
async def list_jobs(
    db: AsyncSession = Depends(get_db),
    q: str | None = Query(None, description="search in title/description"),
    location: str | None = Query(None),
    remote: bool | None = Query(None),
    visa: bool | None = Query(None),
    employment_type: str | None = Query(None),
    seniority: str | None = Query(None),
    salary_min: int | None = Query(None),
    salary_max: int | None = Query(None),
    company_id: int | None = Query(None),
    sort: str = Query("posted_at:desc"),
    page: int = Query(1, ge=1),
    page_size: int = Query(12, ge=1, le=100),
):
    stmt = select(Job, Company).join(Company, Company.id == Job.company_id, isouter=True)
    stmt = apply_job_filters(
        stmt,
        q=q, location=location, remote=remote, visa=visa,
        employment_type=employment_type, seniority=seniority,
        salary_min=salary_min, salary_max=salary_max, company_id=company_id,
    )

    order_col, direction = parse_sort(sort)
    stmt = stmt.order_by(order_col.asc() if direction == "asc" else order_col.desc())

    offset = (page - 1) * page_size
    stmt = stmt.offset(offset).limit(page_size)

    rows = (await db.execute(stmt)).all()

    jobs: list[Job] = []
    for j, c in rows:
        j.company = c
        jobs.append(j)

    return jobs

@router.get("/count")
async def jobs_count(
    db: AsyncSession = Depends(get_db),
    q: str | None = Query(None, description="search in title/description"),
    location: str | None = Query(None),
    remote: bool | None = Query(None),
    visa: bool | None = Query(None),
    employment_type: str | None = Query(None),
    seniority: str | None = Query(None),
    salary_min: int | None = Query(None),
    salary_max: int | None = Query(None),
    company_id: int | None = Query(None),
):
    stmt = select(func.count()).select_from(Job)
    stmt = apply_job_filters(
        stmt,
        q=q, location=location, remote=remote, visa=visa,
        employment_type=employment_type, seniority=seniority,
        salary_min=salary_min, salary_max=salary_max, company_id=company_id,
    )
    total = (await db.execute(stmt)).scalar_one()
    return {"total": total}

@router.post("", response_model=JobOut)
async def create_job(
    body: JobCreate,
    db: AsyncSession = Depends(get_db),
    user = Depends(requires_roles("recruiter", "admin")),
):
    job = Job(**body.dict())
    db.add(job)
    await db.commit()
    await db.refresh(job)

    if job.company_id:
        job.company = (
            await db.execute(select(Company).where(Company.id == job.company_id))
        ).scalar_one()

    return job

@router.get("/{job_id}", response_model=JobOut)
async def get_job(job_id: int, db: AsyncSession = Depends(get_db)):
    q = select(Job).where(Job.id == job_id).options(selectinload(Job.company))
    result = await db.execute(q)
    job = result.scalar_one_or_none()
    if not job:
        raise HTTPException(status_code=404, detail="Not found")
    return job
