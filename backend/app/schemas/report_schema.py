from pydantic import BaseModel
from typing import List, Optional, Any

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
    example_quality_score: Optional[int] = None
    revision_cards: Optional[List[Any]] = None
    concept_map: Optional[Any] = None
    student_explanation: Optional[str] = None
    subject: Optional[str] = None
    topic: Optional[str] = None
    confidence_before: Optional[int] = None
    ai_mode: Optional[str] = None
