import google.generativeai as genai
from app.core.config import settings
import json
import logging

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.provider = settings.ai_provider
        
        if self.provider == "gemini":
            if not settings.gemini_api_key:
                # We will handle the exception at call time or we can just skip init.
                pass
            else:
                genai.configure(api_key=settings.gemini_api_key)
            self.model_name = settings.gemini_model
        elif self.provider == "openai":
            from openai import OpenAI
            self.openai_client = OpenAI(api_key=settings.openai_api_key)
        elif self.provider == "mock":
            pass # No setup needed
        else:
            raise ValueError(f"Unsupported AI provider: {self.provider}")

    async def generate_question(self, prompt: str) -> str:
        if self.provider == "mock":
            import random
            if "Newton" in prompt or "law" in prompt.lower() or "force" in prompt.lower():
                questions = [
                    "If action and reaction forces are equal, why do they not cancel each other out?",
                    "Can you explain which two objects the forces act on while walking?",
                    "How does Newton's Third Law help explain rocket motion?"
                ]
            else:
                questions = [
                    "Can you explain that in even simpler words?",
                    "What is one real-life example of this idea?",
                    "What is one common mistake people make about this topic?"
                ]
            return random.choice(questions)
            
        if self.provider == "gemini":
            if not settings.gemini_api_key:
                from fastapi import HTTPException
                raise HTTPException(status_code=400, detail="Gemini API key is missing. Set GEMINI_API_KEY or use AI_PROVIDER=mock.")
            try:
                model = genai.GenerativeModel(self.model_name)
                response = model.generate_content(prompt)
                return response.text.strip()
            except Exception as e:
                from fastapi import HTTPException
                error_str = str(e)
                if "NotFound" in error_str or "not found" in error_str.lower():
                    raise HTTPException(status_code=400, detail=f"Gemini model '{self.model_name}' was not found or is not supported. Try GEMINI_MODEL=gemini-2.5-flash.")
                raise HTTPException(status_code=502, detail=f"Gemini API error: {error_str}")
                
        elif self.provider == "openai":
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.7
            )
            return response.choices[0].message.content.strip()

    async def evaluate_session(self, prompt: str) -> dict:
        if self.provider == "mock":
            import uuid
            return {
              "report_id": str(uuid.uuid4()),
              "session_id": str(uuid.uuid4()),
              "overall_score": 84,
              "accuracy_score": 86,
              "clarity_score": 82,
              "completeness_score": 80,
              "strengths": [
                "You explained the core idea clearly.",
                "You used a relevant real-life example."
              ],
              "weaknesses": [
                "You need to explain why equal and opposite forces do not cancel."
              ],
              "misconceptions": [
                "Action and reaction forces act on different objects, not the same object."
              ],
              "missing_concepts": [
                "Force pairs",
                "Different objects",
                "Interaction forces"
              ],
              "improved_explanation": "Newton's Third Law means that when one object applies a force on another object, the second object applies an equal and opposite force back on the first object. These forces do not cancel because they act on different objects.",
              "practice_question": "Explain how a rocket moves upward using Newton's Third Law.",
              "example_quality_score": 85,
              "revision_cards": [
                {
                  "question": "Why do action and reaction forces not cancel?",
                  "answer": "Because they act on different objects.",
                  "category": "Misconception"
                },
                {
                  "question": "What is Newton's Third Law?",
                  "answer": "Every action has an equal and opposite reaction on different objects.",
                  "category": "Core Concept"
                }
              ]
            }

        if self.provider == "gemini":
            prompt = prompt + "\n\nCRITICAL: Return ONLY valid JSON. Do not include markdown formatting like ```json. Your entire response must be parseable by json.loads."
            if not settings.gemini_api_key:
                from fastapi import HTTPException
                raise HTTPException(status_code=400, detail="Gemini API key is missing. Set GEMINI_API_KEY or use AI_PROVIDER=mock.")
            try:
                model = genai.GenerativeModel(self.model_name)
                response = model.generate_content(prompt)
                text = response.text
            except Exception as e:
                from fastapi import HTTPException
                error_str = str(e)
                if "NotFound" in error_str or "not found" in error_str.lower():
                    raise HTTPException(status_code=400, detail=f"Gemini model '{self.model_name}' was not found or is not supported. Try GEMINI_MODEL=gemini-2.5-flash.")
                raise HTTPException(status_code=502, detail=f"Gemini API error: {error_str}")
        elif self.provider == "openai":
            response = self.openai_client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                temperature=0.2,
                response_format={ "type": "json_object" }
            )
            text = response.choices[0].message.content

        # Parse JSON
        try:
            # Sometime models wrap with ```json ... ```
            if text.startswith("```json"):
                text = text.replace("```json", "", 1).rstrip("`").strip()
            elif text.startswith("```"):
                text = text.replace("```", "", 1).rstrip("`").strip()
            return json.loads(text)
        except Exception as e:
            logger.error(f"Failed to parse AI response as JSON: {text}")
            import uuid
            return {
              "report_id": str(uuid.uuid4()),
              "session_id": str(uuid.uuid4()),
              "overall_score": 0,
              "accuracy_score": 0,
              "clarity_score": 0,
              "completeness_score": 0,
              "strengths": ["Failed to parse AI response."],
              "weaknesses": ["Failed to parse AI response."],
              "misconceptions": [],
              "missing_concepts": [],
              "improved_explanation": "Gemini did not return valid JSON. The evaluation failed to parse.",
              "practice_question": "Try again?"
            }

ai_service = AIService()
