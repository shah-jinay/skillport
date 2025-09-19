from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from ..db import get_db
from ..models import Company
from ..schemas import CompanyOut

router = APIRouter()

@router.get("/companies", response_model=list[CompanyOut])
async def list_companies(db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Company).order_by(Company.name.asc()))
    return res.scalars().all()
