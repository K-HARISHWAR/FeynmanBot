from pydantic import BaseModel
from typing import Optional

class SessionStartRequest(BaseModel):
    user_id: Optional[str] = None
    subject: str
    topic: str

class SessionStartResponse(BaseModel):
    session_id: str
    message: str

class ExplainRequest(BaseModel):
    session_id: str
    subject: str
    topic: str
    student_explanation: str

class ExplainResponse(BaseModel):
    question: str
    question_number: int

class AnswerRequest(BaseModel):
    session_id: str
    question: str
    student_answer: str
    question_number: int

class AnswerResponse(BaseModel):
    next_question: Optional[str]
    question_number: int
    is_final_question: bool
    message: Optional[str] = None

class EvaluateRequest(BaseModel):
    session_id: str
