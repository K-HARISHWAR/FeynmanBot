# FeynmanBot

**Teach the AI. Discover what you truly understand.**

## Problem Statement
Passive learning creates an illusion of competence. Students read notes and think they understand, but fail to explain concepts clearly.

## Solution
FeynmanBot uses the Feynman Technique. You teach a concept to an AI acting as a curious beginner. The AI asks 3 follow-up questions to test your depth, then provides a comprehensive feedback report identifying misconceptions, missing concepts, and a TeachBack score.

## Features
- **AI Beginner Student**: An AI that questions your logic.
- **Dynamic Questioning**: Questions adapt to your specific explanation.
- **TeachBack Score**: Quantifiable metric for your understanding.
- **Misconception Detection**: Instantly highlights logical flaws.

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS, TypeScript
- **Backend**: FastAPI, Python
- **Database**: Supabase PostgreSQL
- **AI Provider**: Gemini / OpenAI

## Setup Instructions
See `run-instructions.md` for local setup.

## Folder Structure
```
feynmanbot/
├── backend/    # FastAPI server, AI logic
├── database/   # Supabase SQL schemas
├── docs/       # Hackathon documentation
└── frontend/   # React Vite app
```
