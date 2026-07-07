# Run Instructions

## Prerequisites
- Node.js
- Python 3.9+
- Supabase Account
- Gemini or OpenAI API Key

## 1. Database Setup
1. Create a new Supabase project.
2. Run the SQL script from `database/schema.sql` in the Supabase SQL Editor.
3. Note your Supabase URL, Anon Key, and Service Role Key.

## 2. Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # On Windows
pip install -r requirements.txt
```
1. Copy `.env.example` to `.env`.
2. Fill in the keys for `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `GEMINI_API_KEY`.
3. Start the server:
```bash
uvicorn app.main:app --reload
```

## 3. Frontend Setup
```bash
cd frontend
npm install
```
1. Copy `.env.example` to `.env.local`.
2. Fill in the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
3. Start the Vite server:
```bash
npm run dev
```

Visit `http://localhost:5173` to test FeynmanBot!

## Running in Mock Mode
Gemini and Supabase keys are not required in mock mode. You can test the full TeachBack flow purely locally.

1. In `backend/.env`, set:
   ```
   AI_PROVIDER=mock
   USE_MOCK_DB=true
   ```
2. You can leave the API key and Supabase URL values empty.
3. Start the backend (`uvicorn app.main:app --reload`).
4. Start the frontend (`npm run dev`).
5. Test the TeachBack flow. It will use predefined AI mock questions and evaluation.
