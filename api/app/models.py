from sqlalchemy import (
    Column, Integer, String, Text, ForeignKey, Boolean, DateTime, func, Table, UniqueConstraint
)
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

# =============================
# Company and Job Models
# =============================
class Company(Base):
    __tablename__ = "companies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    website = Column(String(255))
    logo_url = Column(String(255))
    location = Column(String(255))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    jobs = relationship("Job", back_populates="company")

class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    location = Column(String(255))
    visa_sponsorship = Column(Boolean, default=False)
    remote = Column(Boolean, default=False)
    company_id = Column(Integer, ForeignKey("companies.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # === Phase 3 fields ===
    posted_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    employment_type = Column(String(50))   # fulltime | parttime | contract | intern
    seniority = Column(String(50))         # junior | mid | senior | lead
    salary_min = Column(Integer)
    salary_max = Column(Integer)
    salary_currency = Column(String(3), server_default="USD", nullable=False)

    company = relationship("Company", back_populates="jobs")

class VisaFiling(Base):
    __tablename__ = "visa_filings"
    id = Column(Integer, primary_key=True, index=True)
    company_id = Column(Integer, ForeignKey("companies.id"))
    year = Column(Integer)
    approved_count = Column(Integer, default=0)
    denied_count = Column(Integer, default=0)

# =============================
# Authentication Models
# =============================

user_roles = Table(
    "user_roles",
    Base.metadata,
    Column("user_id", Integer, ForeignKey("users.id", ondelete="CASCADE"), primary_key=True),
    Column("role_id", Integer, ForeignKey("roles.id", ondelete="CASCADE"), primary_key=True),
    UniqueConstraint("user_id", "role_id", name="uq_user_role")
)

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), nullable=False, unique=True, index=True)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    roles = relationship("Role", secondary=user_roles, back_populates="users")

class Role(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True, index=True)  # admin, recruiter, seeker
    users = relationship("User", secondary=user_roles, back_populates="roles")
