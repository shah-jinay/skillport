# api/app/routers/stats.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from ..db import get_db
from ..models import Job, Company, VisaFiling
from ..schemas import VisaFilingCreate
from ..deps import requires_roles
# Public stats
router = APIRouter(prefix="/stats", tags=["stats"])

@router.get("/jobs/by-location")
async def jobs_by_location(db: AsyncSession = Depends(get_db)):
    q = (
        select(Job.location, func.count().label("count"))
        .group_by(Job.location)
        .order_by(func.count().desc())
        .limit(20)
    )
    rows = (await db.execute(q)).all()
    return [{"location": loc or "Unknown", "count": cnt} for (loc, cnt) in rows]

@router.get("/visa/by-company")
async def visa_by_company(db: AsyncSession = Depends(get_db)):
    q = (
        select(
            Company.name,
            func.sum(VisaFiling.approved_count).label("approved"),
            func.sum(VisaFiling.denied_count).label("denied"),
            (func.sum(VisaFiling.approved_count) + func.sum(VisaFiling.denied_count)).label("total"),
        )
        .select_from(VisaFiling)
        .join(Company, Company.id == VisaFiling.company_id)
        .group_by(Company.name)
        .order_by(func.sum(VisaFiling.approved_count + VisaFiling.denied_count).desc())
        .limit(20)
    )
    rows = (await db.execute(q)).all()
    return [
        {"company": name, "approved": int(approved or 0), "denied": int(denied or 0), "total": int(total or 0)}
        for (name, approved, denied, total) in rows
    ]

# Admin endpoints
router_admin = APIRouter(prefix="/admin/visa", tags=["admin-visa"])

@router_admin.post("/filings")
async def create_filing(
    body: VisaFilingCreate,
    db: AsyncSession = Depends(get_db),
    user = Depends(requires_roles("admin")),
):
    v = VisaFiling(**body.dict())
    db.add(v)
    await db.commit()
    await db.refresh(v)
    return v
