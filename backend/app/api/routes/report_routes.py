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
            report = res.data[0]
            try:
                session_res = supabase.table("teach_sessions").select("subject, topic, student_explanation").eq("id", report["session_id"]).execute()
                if session_res.data:
                    session = session_res.data[0]
                    report["subject"] = session.get("subject")
                    report["topic"] = session.get("topic")
                    report["student_explanation"] = session.get("student_explanation")
            except Exception as e:
                logger.error(f"Error fetching session for report: {e}")
            return report
        except HTTPException:
            raise
        except Exception as e:
            logger.error(f"Supabase error fetching report: {e}")
            raise HTTPException(status_code=500, detail=f"Database error: {e}")
