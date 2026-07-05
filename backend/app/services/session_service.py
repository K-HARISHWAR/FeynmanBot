import uuid
from app.services.supabase_service import supabase
from app.services.ai_service import ai_service
from app.prompts.ai_student_prompt import get_ai_student_prompt, get_evaluation_prompt
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

# Fallback in-memory store for hackathon purposes if Supabase is unconfigured
_mock_db = {
    "sessions": {},
    "questions": [],
    "reports": {}
}

class SessionService:
    async def start_session(self, user_id: str, subject: str, topic: str):
        session_id = str(uuid.uuid4())
        
        try:
            supabase.table("teach_sessions").insert({
                "id": session_id,
                "user_id": user_id if user_id else None,
                "subject": subject,
                "topic": topic,
                "status": "started"
            }).execute()
        except Exception as e:
            logger.warning(f"Supabase error, using mock DB: {e}")
            _mock_db["sessions"][session_id] = {
                "id": session_id, "user_id": user_id, "subject": subject, "topic": topic, "student_explanation": None
            }
            
        return session_id
        
    async def explain(self, session_id: str, subject: str, topic: str, student_explanation: str):
        # Save explanation
        try:
            supabase.table("teach_sessions").update({
                "student_explanation": student_explanation
            }).eq("id", session_id).execute()
        except Exception:
            if session_id in _mock_db["sessions"]:
                _mock_db["sessions"][session_id]["student_explanation"] = student_explanation
        
        prompt = get_ai_student_prompt(subject, topic, student_explanation, "None yet")
        question = await ai_service.generate_question(prompt)
        
        # Save question
        try:
            supabase.table("session_questions").insert({
                "id": str(uuid.uuid4()),
                "session_id": session_id,
                "question_number": 1,
                "ai_question": question
            }).execute()
        except Exception:
            _mock_db["questions"].append({
                "session_id": session_id, "question_number": 1, "ai_question": question, "student_answer": None
            })
            
        return question

    async def answer(self, session_id: str, current_question: str, student_answer: str, question_number: int):
        # Save answer
        try:
            supabase.table("session_questions").update({
                "student_answer": student_answer
            }).eq("session_id", session_id).eq("question_number", question_number).execute()
        except Exception:
            for q in _mock_db["questions"]:
                if q["session_id"] == session_id and q["question_number"] == question_number:
                    q["student_answer"] = student_answer
                    
        is_final = question_number >= 3
        
        if is_final:
            return None, True
            
        # Get history
        history = ""
        try:
            res = supabase.table("session_questions").select("*").eq("session_id", session_id).order("question_number").execute()
            for q in res.data:
                history += f"Q{q['question_number']}: {q['ai_question']}\nA: {q['student_answer'] or 'None'}\n"
            
            session_res = supabase.table("teach_sessions").select("*").eq("id", session_id).execute()
            session = session_res.data[0]
            subject = session["subject"]
            topic = session["topic"]
            student_exp = session["student_explanation"]
        except Exception:
            subject = _mock_db["sessions"].get(session_id, {}).get("subject", "Unknown")
            topic = _mock_db["sessions"].get(session_id, {}).get("topic", "Unknown")
            student_exp = _mock_db["sessions"].get(session_id, {}).get("student_explanation", "")
            for q in _mock_db["questions"]:
                if q["session_id"] == session_id:
                    history += f"Q{q['question_number']}: {q['ai_question']}\nA: {q['student_answer'] or 'None'}\n"

        prompt = get_ai_student_prompt(subject, topic, student_exp, history)
        next_question = await ai_service.generate_question(prompt)
        
        try:
            supabase.table("session_questions").insert({
                "id": str(uuid.uuid4()),
                "session_id": session_id,
                "question_number": question_number + 1,
                "ai_question": next_question
            }).execute()
        except Exception:
            _mock_db["questions"].append({
                "session_id": session_id, "question_number": question_number + 1, "ai_question": next_question, "student_answer": None
            })
            
        return next_question, False

    async def evaluate(self, session_id: str):
        history = ""
        try:
            res = supabase.table("session_questions").select("*").eq("session_id", session_id).order("question_number").execute()
            for q in res.data:
                history += f"Q{q['question_number']}: {q['ai_question']}\nA: {q['student_answer'] or 'None'}\n"
            
            session_res = supabase.table("teach_sessions").select("*").eq("id", session_id).execute()
            session = session_res.data[0]
            subject = session["subject"]
            topic = session["topic"]
            student_exp = session["student_explanation"]
            user_id = session.get("user_id")
        except Exception:
            subject = _mock_db["sessions"].get(session_id, {}).get("subject", "Unknown")
            topic = _mock_db["sessions"].get(session_id, {}).get("topic", "Unknown")
            student_exp = _mock_db["sessions"].get(session_id, {}).get("student_explanation", "")
            user_id = _mock_db["sessions"].get(session_id, {}).get("user_id")
            for q in _mock_db["questions"]:
                if q["session_id"] == session_id:
                    history += f"Q{q['question_number']}: {q['ai_question']}\nA: {q['student_answer'] or 'None'}\n"
                    
        prompt = get_evaluation_prompt(subject, topic, student_exp, history)
        evaluation_result = await ai_service.evaluate_session(prompt)
        
        report_id = str(uuid.uuid4())
        evaluation_result["id"] = report_id
        evaluation_result["session_id"] = session_id
        evaluation_result["user_id"] = user_id
        
        try:
            supabase.table("reports").insert(evaluation_result).execute()
        except Exception:
            _mock_db["reports"][report_id] = evaluation_result
            
        return evaluation_result

session_service = SessionService()
