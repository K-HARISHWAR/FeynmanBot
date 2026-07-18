from fastapi import APIRouter, Depends, HTTPException
from app.services.session_service import session_service
from app.api.deps import get_current_user, CurrentUser

router = APIRouter()

@router.get("/dashboard/me")
async def get_dashboard_me(current_user: CurrentUser = Depends(get_current_user)):
    return await session_service.get_dashboard_stats(current_user.id)

@router.get("/history/me")
async def get_history_me(current_user: CurrentUser = Depends(get_current_user)):
    return await session_service.get_history(current_user.id)

@router.get("/dashboard/{user_id}")
async def get_dashboard(user_id: str, current_user: CurrentUser = Depends(get_current_user)):
    if user_id != current_user.id and user_id != "demo-user":
        raise HTTPException(status_code=403, detail="You do not have access to this resource.")
    return await session_service.get_dashboard_stats(current_user.id)

@router.get("/history/{user_id}")
async def get_history(user_id: str, current_user: CurrentUser = Depends(get_current_user)):
    if user_id != current_user.id and user_id != "demo-user":
        raise HTTPException(status_code=403, detail="You do not have access to this resource.")
    return await session_service.get_history(current_user.id)
