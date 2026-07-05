-- database/schema.sql

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  full_name text,
  created_at timestamp DEFAULT now()
);

-- Teach Sessions table
CREATE TABLE IF NOT EXISTS teach_sessions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  subject text NOT NULL,
  topic text NOT NULL,
  student_explanation text,
  status text DEFAULT 'started',
  created_at timestamp DEFAULT now(),
  updated_at timestamp DEFAULT now()
);

-- Session Questions table
CREATE TABLE IF NOT EXISTS session_questions (
  id uuid PRIMARY KEY,
  session_id uuid REFERENCES teach_sessions(id),
  question_number int NOT NULL,
  ai_question text NOT NULL,
  student_answer text,
  created_at timestamp DEFAULT now()
);

-- Reports table
CREATE TABLE IF NOT EXISTS reports (
  id uuid PRIMARY KEY,
  session_id uuid REFERENCES teach_sessions(id),
  user_id uuid REFERENCES profiles(id),
  overall_score int,
  accuracy_score int,
  clarity_score int,
  completeness_score int,
  strengths jsonb,
  weaknesses jsonb,
  misconceptions jsonb,
  missing_concepts jsonb,
  improved_explanation text,
  practice_question text,
  created_at timestamp DEFAULT now()
);
