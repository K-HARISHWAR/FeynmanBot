from fastapi import APIRouter, HTTPException
from app.services.supabase_service import supabase
from app.services.session_service import _mock_db

from app.core.config import settings
import logging

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/{report_id}")
async def get_report(report_id: str):
    if settings.use_mock_db:
        if report_id in _mock_db["reports"]:
            return _mock_db["reports"][report_id]
        raise HTTPException(status_code=404, detail="Report not found")
    else:
        try:
            res = supabase.table("reports").select("*").eq("id", report_id).execute()
            if not res.data:
                raise HTTPException(status_code=404, detail="Report not found")
            return res.data[0]
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Supabase error fetching report: {e}")
            raise HTTPException(status_code=500, detail=f"Database error: {e}")
