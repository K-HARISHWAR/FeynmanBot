from fastapi import APIRouter
from app.services.session_service import session_service

router = APIRouter()

@router.get("/dashboard/{user_id}")
async def get_dashboard(user_id: str):
    return await session_service.get_dashboard_stats(user_id)

@router.get("/history/{user_id}")
async def get_history(user_id: str):
    return await session_service.get_history(user_id)
