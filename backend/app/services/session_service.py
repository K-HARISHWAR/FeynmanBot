import uuid
from app.services.supabase_service import supabase
from app.services.ai_service import ai_service
from app.prompts.ai_student_prompt import get_ai_student_prompt, get_evaluation_prompt
from app.core.config import settings
from fastapi import HTTPException
import logging
import datetime

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
        user_id = user_id or "demo-user"
        
        if settings.use_mock_db:
            _mock_db["sessions"][session_id] = {
                "id": session_id, "user_id": user_id, "subject": subject, "topic": topic, "student_explanation": None
            }
            return session_id

        try:
            res = supabase.table("teach_sessions").insert({
                "id": session_id,
                "user_id": user_id,
                "subject": subject,
                "topic": topic,
                "status": "started"
            }).execute()
            if not res.data:
                raise Exception("Failed to insert teach_sessions")
        except Exception as e:
            logger.error(f"Supabase error in start_session: {e}")
            raise HTTPException(status_code=500, detail=f"Database error: {e}")
            
        return session_id
        
    async def explain(self, session_id: str, subject: str, topic: str, student_explanation: str):
        if settings.use_mock_db:
            if session_id in _mock_db["sessions"]:
                _mock_db["sessions"][session_id]["student_explanation"] = student_explanation
        else:
            try:
                res = supabase.table("teach_sessions").update({
                    "student_explanation": student_explanation
                }).eq("id", session_id).execute()
                if not res.data:
                    raise Exception("Failed to update teach_sessions")
            except Exception as e:
                logger.error(f"Supabase error in explain: {e}")
                raise HTTPException(status_code=500, detail=f"Database error: {e}")
        
        prompt = get_ai_student_prompt(subject, topic, student_explanation, "None yet")
        question = await ai_service.generate_question(prompt)
        
        if settings.use_mock_db:
            _mock_db["questions"].append({
                "session_id": session_id, "question_number": 1, "ai_question": question, "student_answer": None
            })
        else:
            try:
                res = supabase.table("session_questions").insert({
                    "id": str(uuid.uuid4()),
                    "session_id": session_id,
                    "question_number": 1,
                    "ai_question": question
                }).execute()
                if not res.data:
                    raise Exception("Failed to insert session_questions")
            except Exception as e:
                logger.error(f"Supabase error in explain question insert: {e}")
                raise HTTPException(status_code=500, detail=f"Database error: {e}")
            
        return question

    async def answer(self, session_id: str, current_question: str, student_answer: str, question_number: int):
        if settings.use_mock_db:
            for q in _mock_db["questions"]:
                if q["session_id"] == session_id and q["question_number"] == question_number:
                    q["student_answer"] = student_answer
        else:
            try:
                res = supabase.table("session_questions").update({
                    "student_answer": student_answer
                }).eq("session_id", session_id).eq("question_number", question_number).execute()
                if not res.data:
                    raise Exception("Failed to update session_questions")
            except Exception as e:
                logger.error(f"Supabase error in answer: {e}")
                raise HTTPException(status_code=500, detail=f"Database error: {e}")
                    
        is_final = question_number >= 3
        
        if is_final:
            return None, True
            
        # Get history
        history = ""
        if settings.use_mock_db:
            subject = _mock_db["sessions"].get(session_id, {}).get("subject", "Unknown")
            topic = _mock_db["sessions"].get(session_id, {}).get("topic", "Unknown")
            student_exp = _mock_db["sessions"].get(session_id, {}).get("student_explanation", "")
            for q in _mock_db["questions"]:
                if q["session_id"] == session_id:
                    history += f"Q{q['question_number']}: {q['ai_question']}\nA: {q['student_answer'] or 'None'}\n"
        else:
            try:
                res = supabase.table("session_questions").select("*").eq("session_id", session_id).order("question_number").execute()
                for q in res.data:
                    history += f"Q{q['question_number']}: {q['ai_question']}\nA: {q['student_answer'] or 'None'}\n"
                
                session_res = supabase.table("teach_sessions").select("*").eq("id", session_id).execute()
                if not session_res.data:
                    raise Exception("Session not found")
                session = session_res.data[0]
                subject = session["subject"]
                topic = session["topic"]
                student_exp = session["student_explanation"]
            except Exception as e:
                logger.error(f"Supabase error fetching history in answer: {e}")
                raise HTTPException(status_code=500, detail=f"Database error: {e}")

        prompt = get_ai_student_prompt(subject, topic, student_exp, history)
        next_question = await ai_service.generate_question(prompt)
        
        if settings.use_mock_db:
            _mock_db["questions"].append({
                "session_id": session_id, "question_number": question_number + 1, "ai_question": next_question, "student_answer": None
            })
        else:
            try:
                res = supabase.table("session_questions").insert({
                    "id": str(uuid.uuid4()),
                    "session_id": session_id,
                    "question_number": question_number + 1,
                    "ai_question": next_question
                }).execute()
                if not res.data:
                    raise Exception("Failed to insert next session_question")
            except Exception as e:
                logger.error(f"Supabase error inserting next question: {e}")
                raise HTTPException(status_code=500, detail=f"Database error: {e}")
            
        return next_question, False

    async def evaluate(self, session_id: str):
        history = ""
        if settings.use_mock_db:
            subject = _mock_db["sessions"].get(session_id, {}).get("subject", "Unknown")
            topic = _mock_db["sessions"].get(session_id, {}).get("topic", "Unknown")
            student_exp = _mock_db["sessions"].get(session_id, {}).get("student_explanation", "")
            user_id = _mock_db["sessions"].get(session_id, {}).get("user_id")
            for q in _mock_db["questions"]:
                if q["session_id"] == session_id:
                    history += f"Q{q['question_number']}: {q['ai_question']}\nA: {q['student_answer'] or 'None'}\n"
        else:
            try:
                res = supabase.table("session_questions").select("*").eq("session_id", session_id).order("question_number").execute()
                for q in res.data:
                    history += f"Q{q['question_number']}: {q['ai_question']}\nA: {q['student_answer'] or 'None'}\n"
                
                session_res = supabase.table("teach_sessions").select("*").eq("id", session_id).execute()
                if not session_res.data:
                    raise Exception("Session not found")
                session = session_res.data[0]
                subject = session["subject"]
                topic = session["topic"]
                student_exp = session["student_explanation"]
                user_id = session.get("user_id")
            except Exception as e:
                logger.error(f"Supabase error fetching history in evaluate: {e}")
                raise HTTPException(status_code=500, detail=f"Database error: {e}")
                    
        prompt = get_evaluation_prompt(subject, topic, student_exp, history)
        evaluation_result = await ai_service.evaluate_session(prompt)
        
        report_id = str(uuid.uuid4())
        evaluation_result["id"] = report_id
        evaluation_result["session_id"] = session_id
        evaluation_result["user_id"] = user_id or "demo-user"
        
        if settings.use_mock_db:
            _mock_db["reports"][report_id] = evaluation_result
        else:
            try:
                res = supabase.table("reports").insert(evaluation_result).execute()
                if not res.data:
                    raise Exception("Failed to insert report")
                
                # Update teach_sessions status
                supabase.table("teach_sessions").update({
                    "status": "completed"
                }).eq("id", session_id).execute()
            except Exception as e:
                logger.error(f"Supabase error inserting report: {e}")
                raise HTTPException(status_code=500, detail=f"Database error: {e}")
            
        return evaluation_result

    async def get_dashboard_stats(self, user_id: str):
        if settings.use_mock_db:
            sessions = [s for s in _mock_db["sessions"].values() if s.get("user_id") == user_id]
            reports = [r for r in _mock_db["reports"].values() if r.get("user_id") == user_id]
            
            if not sessions:
                return {
                    "total_sessions": 0, "average_score": 0, "best_subject": "No sessions yet", "weakest_subject": "No sessions yet", "recent_sessions": []
                }
            
            total_sessions = len(sessions)
            if not reports:
                return {
                    "total_sessions": total_sessions, "average_score": 0, "best_subject": "No sessions yet", "weakest_subject": "No sessions yet", "recent_sessions": []
                }
                
            scores = [r["overall_score"] for r in reports]
            avg_score = sum(scores) // len(scores)
            
            subject_scores = {}
            for r in reports:
                s_id = r.get("session_id")
                s = _mock_db["sessions"].get(s_id)
                if s:
                    sub = s["subject"]
                    if sub not in subject_scores:
                        subject_scores[sub] = []
                    subject_scores[sub].append(r["overall_score"])
                    
            best_subject = "No sessions yet"
            weakest_subject = "No sessions yet"
            if subject_scores:
                avg_sub_scores = {sub: sum(sc)/len(sc) for sub, sc in subject_scores.items()}
                best_subject = max(avg_sub_scores, key=avg_sub_scores.get)
                weakest_subject = min(avg_sub_scores, key=avg_sub_scores.get)
                
            recent_sessions = []
            for r in reports[-5:]:
                s_id = r.get("session_id")
                s = _mock_db["sessions"].get(s_id)
                if s:
                    recent_sessions.append({
                        "session_id": s_id,
                        "subject": s["subject"],
                        "topic": s["topic"],
                        "score": r["overall_score"],
                        "created_at": "2026-07-07T20:30:00"
                    })
                    
            recent_sessions.reverse()
            return {
                "total_sessions": total_sessions,
                "average_score": avg_score,
                "best_subject": best_subject,
                "weakest_subject": weakest_subject,
                "recent_sessions": recent_sessions
            }
        else:
            try:
                sessions_res = supabase.table("teach_sessions").select("*").eq("user_id", user_id).execute()
                sessions = sessions_res.data
                
                if not sessions:
                    return {
                        "total_sessions": 0, "average_score": 0, "best_subject": "No sessions yet", "weakest_subject": "No sessions yet", "recent_sessions": []
                    }
                    
                total_sessions = len(sessions)
                
                reports_res = supabase.table("reports").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
                reports = reports_res.data
                
                if not reports:
                    return {
                        "total_sessions": total_sessions, "average_score": 0, "best_subject": "No sessions yet", "weakest_subject": "No sessions yet", "recent_sessions": []
                    }
                    
                scores = [r["overall_score"] for r in reports]
                avg_score = sum(scores) // len(scores)
                
                # Match reports to session subjects
                session_dict = {s["id"]: s for s in sessions}
                
                subject_scores = {}
                for r in reports:
                    s_id = r.get("session_id")
                    s = session_dict.get(s_id)
                    if s:
                        sub = s["subject"]
                        if sub not in subject_scores:
                            subject_scores[sub] = []
                        subject_scores[sub].append(r["overall_score"])
                        
                best_subject = "No sessions yet"
                weakest_subject = "No sessions yet"
                if subject_scores:
                    avg_sub_scores = {sub: sum(sc)/len(sc) for sub, sc in subject_scores.items()}
                    best_subject = max(avg_sub_scores, key=avg_sub_scores.get)
                    weakest_subject = min(avg_sub_scores, key=avg_sub_scores.get)
                    
                recent_sessions = []
                # reports is already ordered desc
                for r in reports[:5]:
                    s_id = r.get("session_id")
                    s = session_dict.get(s_id)
                    if s:
                        recent_sessions.append({
                            "session_id": s_id,
                            "subject": s["subject"],
                            "topic": s["topic"],
                            "score": r["overall_score"],
                            "created_at": r.get("created_at", "2026-07-07T20:30:00")
                        })
                        
                return {
                    "total_sessions": total_sessions,
                    "average_score": avg_score,
                    "best_subject": best_subject,
                    "weakest_subject": weakest_subject,
                    "recent_sessions": recent_sessions
                }
            except Exception as e:
                logger.error(f"Supabase error in get_dashboard_stats: {e}")
                raise HTTPException(status_code=500, detail=f"Database error: {e}")

    async def get_history(self, user_id: str):
        if settings.use_mock_db:
            sessions_list = []
            reports = [r for r in _mock_db["reports"].values() if r.get("user_id") == user_id]
            
            for r in reports:
                s_id = r.get("session_id")
                s = _mock_db["sessions"].get(s_id)
                if s:
                    sessions_list.append({
                        "session_id": s_id,
                        "report_id": r["id"],
                        "subject": s["subject"],
                        "topic": s["topic"],
                        "score": r["overall_score"],
                        "created_at": "2026-07-07T20:30:00"
                    })
                    
            sessions_list.reverse()
            return {"sessions": sessions_list}
        else:
            try:
                reports_res = supabase.table("reports").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
                reports = reports_res.data
                
                if not reports:
                    return {"sessions": []}
                    
                session_ids = [r["session_id"] for r in reports]
                sessions_res = supabase.table("teach_sessions").select("*").in_("id", session_ids).execute()
                session_dict = {s["id"]: s for s in sessions_res.data}
                
                sessions_list = []
                for r in reports:
                    s_id = r.get("session_id")
                    s = session_dict.get(s_id)
                    if s:
                        sessions_list.append({
                            "session_id": s_id,
                            "report_id": r["id"],
                            "subject": s["subject"],
                            "topic": s["topic"],
                            "score": r["overall_score"],
                            "created_at": r.get("created_at")
                        })
                        
                return {"sessions": sessions_list}
            except Exception as e:
                logger.error(f"Supabase error in get_history: {e}")
                raise HTTPException(status_code=500, detail=f"Database error: {e}")

session_service = SessionService()
