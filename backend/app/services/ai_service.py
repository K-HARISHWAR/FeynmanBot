import google.generativeai as genai
from app.core.config import settings
import json
import logging

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        self.provider = settings.ai_provider
        
        if self.provider == "gemini":
            genai.configure(api_key=settings.gemini_api_key)
            self.model = genai.GenerativeModel('gemini-1.5-flash')
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
            response = self.model.generate_content(prompt)
            return response.text.strip()
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
              "practice_question": "Explain how a rocket moves upward using Newton's Third Law."
            }

        if self.provider == "gemini":
            response = self.model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    response_mime_type="application/json",
                )
            )
            text = response.text
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
            return json.loads(text)
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {text}")
            raise ValueError("AI produced invalid JSON") from e

ai_service = AIService()
