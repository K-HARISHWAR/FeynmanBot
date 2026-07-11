from pydantic import BaseModel
from typing import Optional

class SessionStartRequest(BaseModel):
    user_id: str = "demo-user"
    subject: str
    topic: str
    ai_mode: Optional[str] = None
    confidence_before: Optional[int] = None

class SessionStartResponse(BaseModel):
    session_id: str
    message: str

class ExplainRequest(BaseModel):
    session_id: str
    subject: str
    topic: str
    student_explanation: str
    ai_mode: Optional[str] = None

class ExplainResponse(BaseModel):
    question: str
    question_number: int

class AnswerRequest(BaseModel):
    session_id: str
    question: str
    student_answer: str
    question_number: int
    ai_mode: Optional[str] = None

class AnswerResponse(BaseModel):
    next_question: Optional[str]
    question_number: int
    is_final_question: bool
    message: Optional[str] = None

class EvaluateRequest(BaseModel):
    session_id: str
    ai_mode: Optional[str] = None
    confidence_before: Optional[int] = None
