import asyncio
import os
from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

from app.services.ai_service import ai_service
from app.prompts.ai_student_prompt import get_evaluation_prompt

async def main():
    prompt = get_evaluation_prompt("Physics", "Newton's Laws", "Forces are cool.", "Q1: What is force? A: Push or pull.")
    try:
        res = await ai_service.evaluate_session(prompt)
        print("Success:", res)
    except HTTPException as e:
        print("HTTPException detail:", e.detail)
    except Exception as e:
        print("Error type:", type(e))
        print("Error message:", e)

if __name__ == "__main__":
    asyncio.run(main())
