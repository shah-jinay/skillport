from pydantic import BaseModel
from datetime import datetime

class CompanyOut(BaseModel):
    id: int
    name: str
    website: str | None = None
    location: str | None = None
    logo_url: str | None = None
    created_at: datetime | None = None
    class Config: orm_mode = True

class JobOut(BaseModel):
    id: int
    title: str
    description: str | None = None
    location: str | None = None
    remote: bool
    visa_sponsorship: bool
    created_at: datetime | None = None
    company: CompanyOut | None = None
    class Config: orm_mode = True
