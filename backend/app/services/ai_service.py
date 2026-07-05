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
            questions = [
                "If action and reaction are equal, why do they not cancel each other out?",
                "Can you explain which two objects the forces act on?",
                "How does this idea apply when a rocket launches?"
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
            return {
                "overall_score": 85,
                "misconceptions": ["Assumed forces act on the same object instead of different objects."],
                "missing_concepts": ["Didn't mention how mass affects acceleration despite equal forces."],
                "improved_explanation": "Newton's Third Law states that for every action force, there is an equal and opposite reaction force. Importantly, these forces act on two different objects. For example, when you push a wall, the wall pushes back on you with the exact same amount of force. They don't cancel out because they are acting on different bodies."
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
