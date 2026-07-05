from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import health_routes, session_routes, report_routes

app = FastAPI(title=settings.app_name)

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
app.include_router(health_routes.router, prefix="/api", tags=["health"])
app.include_router(session_routes.router, prefix="/api/sessions", tags=["sessions"])
app.include_router(report_routes.router, prefix="/api/reports", tags=["reports"])
