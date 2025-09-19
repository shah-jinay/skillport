from fastapi import APIRouter
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

# in memory during Phase 0, later we use Postgres
VISITS = []

class VisitIn(BaseModel):
  path: str

@router.post("/events/visit")
def log_visit(payload: VisitIn):
  VISITS.append({"path": payload.path, "ts": datetime.utcnow().isoformat()})
  return {"ok": True, "count": len(VISITS)}
