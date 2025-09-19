from pydantic import BaseModel, EmailStr
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
class RoleOut(BaseModel):
    id: int
    name: str
    model_config = {"from_attributes": True}

class UserOut(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    created_at: datetime | None = None
    roles: list[RoleOut] = []
    model_config = {"from_attributes": True}

class RegisterIn(BaseModel):
    email: EmailStr
    password: str

class LoginIn(BaseModel):
    email: EmailStr
    password: str

class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"