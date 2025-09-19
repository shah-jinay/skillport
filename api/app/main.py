from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
import os
from .visits import router as visits_router
from .routers import companies as companies_router
from .routers import jobs as jobs_router
app = FastAPI(title="SkillPort API", version="0.1.0")

origins = [os.getenv("CORS_ORIGIN", "http://localhost:5173")]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, allow_credentials=True,
    allow_methods=["*"], allow_headers=["*"],
)

@app.get("/health")
def health():
    return {"ok": True}

# ---- Add this block ----
class VisitIn(BaseModel):
    path: str

VISITS = []  # in-memory for Phase 0

@app.post("/events/visit")
def log_visit(payload: VisitIn):
    VISITS.append({"path": payload.path, "ts": datetime.utcnow().isoformat()})
    return {"ok": True, "count": len(VISITS)}
# ------------------------


# Visit logging route
app.include_router(visits_router, prefix="")
# register endpoints
app.include_router(companies_router.router)
app.include_router(jobs_router.router)