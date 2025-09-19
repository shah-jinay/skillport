from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import DateTime, Text, Integer, func
from .db import Base

class Visit(Base):
    __tablename__ = "visits"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    path: Mapped[str] = mapped_column(Text, nullable=False)
    ts: Mapped["DateTime"] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
