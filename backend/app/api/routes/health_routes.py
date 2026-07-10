from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
async def health_check():
    return {
        "status": "ok",
        "message": "FeynmanBot backend is running"
    }

@router.get("/health/supabase")
async def supabase_health_check():
    from app.services.supabase_service import supabase
    from app.core.config import settings
    
    if settings.use_mock_db:
        return {"status": "ok", "message": "Using Mock DB"}
        
    try:
        # Simple test query to ensure connection is alive
        res = supabase.table("teach_sessions").select("id").limit(1).execute()
        return {
            "status": "ok", 
            "message": "Successfully connected to Supabase",
            "data": res.data
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}
