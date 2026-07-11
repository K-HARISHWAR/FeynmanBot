from fastapi import APIRouter, HTTPException
from app.schemas.session_schema import SessionStartRequest, SessionStartResponse, ExplainRequest, ExplainResponse, AnswerRequest, AnswerResponse, EvaluateRequest
from app.services.session_service import session_service

router = APIRouter()

@router.post("/start", response_model=SessionStartResponse)
async def start_session(request: SessionStartRequest):
    session_id = await session_service.start_session(request.user_id, request.subject, request.topic)
    return SessionStartResponse(session_id=session_id, message="Session started successfully")

@router.post("/explain", response_model=ExplainResponse)
async def explain_topic(request: ExplainRequest):
    question = await session_service.explain(
        request.session_id, request.subject, request.topic, request.student_explanation, request.ai_mode
    )
    return ExplainResponse(question=question, question_number=1)

@router.post("/answer", response_model=AnswerResponse)
async def answer_question(request: AnswerRequest):
    next_question, is_final = await session_service.answer(
        request.session_id, request.question, request.student_answer, request.question_number, request.ai_mode
    )
    
    if is_final:
        return AnswerResponse(
            next_question=None,
            question_number=request.question_number,
            is_final_question=True,
            message="Ready for evaluation"
        )
        
    return AnswerResponse(
        next_question=next_question,
        question_number=request.question_number + 1,
        is_final_question=False
    )

@router.post("/evaluate")
async def evaluate_session(request: EvaluateRequest):
    result = await session_service.evaluate(request.session_id, request.ai_mode, request.confidence_before)
    # the frontend schema matches the dict result, so we return it directly, FastAPI handles Pydantic conversion
    return result
