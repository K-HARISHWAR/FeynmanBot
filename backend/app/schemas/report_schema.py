from pydantic import BaseModel
from typing import List

class ReportResponse(BaseModel):
    report_id: str
    session_id: str
    overall_score: int
    accuracy_score: int
    clarity_score: int
    completeness_score: int
    strengths: List[str]
    weaknesses: List[str]
    misconceptions: List[str]
    missing_concepts: List[str]
    improved_explanation: str
    practice_question: str
