from fastapi import APIRouter, HTTPException
from app.services.supabase_service import supabase
from app.services.session_service import _mock_db

router = APIRouter()

@router.get("/{report_id}")
async def get_report(report_id: str):
    try:
        res = supabase.table("reports").select("*").eq("id", report_id).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Report not found")
        return res.data[0]
    except Exception:
        # Fallback to mock DB
        if report_id in _mock_db["reports"]:
            return _mock_db["reports"][report_id]
        raise HTTPException(status_code=404, detail="Report not found")
