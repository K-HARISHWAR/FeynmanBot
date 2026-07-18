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

-- RLS Policies

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teach_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can select own profile" ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- Teach Sessions
CREATE POLICY "Users can select own sessions" ON public.teach_sessions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own sessions" ON public.teach_sessions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can update own sessions" ON public.teach_sessions FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- Reports
CREATE POLICY "Users can select own reports" ON public.reports FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert own reports" ON public.reports FOR INSERT WITH CHECK (user_id = auth.uid());

-- Session Questions
CREATE POLICY "Users can select own session questions" ON public.session_questions FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.teach_sessions
    WHERE teach_sessions.id = session_questions.session_id
    AND teach_sessions.user_id = auth.uid()
  )
);
CREATE POLICY "Users can insert own session questions" ON public.session_questions FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teach_sessions
    WHERE teach_sessions.id = session_questions.session_id
    AND teach_sessions.user_id = auth.uid()
  )
);
CREATE POLICY "Users can update own session questions" ON public.session_questions FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.teach_sessions
    WHERE teach_sessions.id = session_questions.session_id
    AND teach_sessions.user_id = auth.uid()
  )
) WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.teach_sessions
    WHERE teach_sessions.id = session_questions.session_id
    AND teach_sessions.user_id = auth.uid()
  )
);

-- Sync Trigger for New Users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, created_at)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), public.profiles.full_name);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
