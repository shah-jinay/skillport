# api/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from .visits import router as visits_router
from .routers import companies, jobs, auth, stats

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

app.include_router(visits_router, prefix="")
app.include_router(companies.router)
app.include_router(jobs.router)
app.include_router(auth.router)
app.include_router(stats.router)            # keep this one
app.include_router(stats.router_admin)      # and the admin subrouter
