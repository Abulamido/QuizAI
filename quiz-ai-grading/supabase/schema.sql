-- ============================================================
-- QUIZAI DATABASE SCHEMA
-- Online Quiz with AI Grading System
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- Extends Supabase auth.users
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'student')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================================
-- QUIZZES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quizzes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  subject TEXT,
  created_by UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  duration_minutes INTEGER NOT NULL DEFAULT 30,
  total_marks INTEGER NOT NULL DEFAULT 0,
  pass_mark INTEGER NOT NULL DEFAULT 50 CHECK (pass_mark BETWEEN 1 AND 100),
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- QUESTIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL CHECK (question_type IN ('mcq', 'short_answer', 'essay', 'true_false')),
  options JSONB,            -- For MCQ: [{id, text, isCorrect}]
  correct_answer TEXT,      -- For MCQ/T-F: the correct option text
  model_answer TEXT,        -- For AI grading: ideal answer
  rubric TEXT,              -- Grading rubric for AI
  max_score INTEGER NOT NULL DEFAULT 1,
  order_index INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- QUIZ ATTEMPTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  quiz_id UUID REFERENCES public.quizzes(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  submitted_at TIMESTAMPTZ,
  total_score NUMERIC(10, 2),
  total_possible NUMERIC(10, 2),
  percentage NUMERIC(5, 2),
  grade TEXT CHECK (grade IN ('A', 'B', 'C', 'D', 'F', 'N/A')),
  status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Unique: one attempt per student per quiz at a time (in progress)
-- (We allow re-attempts but only one active at a time)

-- ============================================================
-- ATTEMPT ANSWERS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS public.attempt_answers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  attempt_id UUID REFERENCES public.quiz_attempts(id) ON DELETE CASCADE NOT NULL,
  question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE NOT NULL,
  student_answer TEXT,
  score NUMERIC(10, 2) DEFAULT 0,
  max_score NUMERIC(10, 2) NOT NULL DEFAULT 1,
  feedback TEXT,
  strengths JSONB DEFAULT '[]',
  improvements JSONB DEFAULT '[]',
  is_correct BOOLEAN,
  graded_by TEXT DEFAULT 'pending' CHECK (graded_by IN ('ai', 'manual', 'auto', 'pending')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(attempt_id, question_id)
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_quizzes_created_by ON public.quizzes(created_by);
CREATE INDEX IF NOT EXISTS idx_quizzes_published ON public.quizzes(is_published);
CREATE INDEX IF NOT EXISTS idx_questions_quiz_id ON public.questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_student_id ON public.quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_attempts_quiz_id ON public.quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON public.quiz_attempts(status);
CREATE INDEX IF NOT EXISTS idx_answers_attempt_id ON public.attempt_answers(attempt_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attempt_answers ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- QUIZZES POLICIES
CREATE POLICY "Published quizzes visible to all authenticated users"
  ON public.quizzes FOR SELECT
  USING (is_published = true OR created_by = auth.uid());

CREATE POLICY "Admins can create quizzes"
  ON public.quizzes FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Admins can update own quizzes"
  ON public.quizzes FOR UPDATE
  USING (created_by = auth.uid());

CREATE POLICY "Admins can delete own quizzes"
  ON public.quizzes FOR DELETE
  USING (created_by = auth.uid());

-- QUESTIONS POLICIES
CREATE POLICY "Questions visible to authenticated users"
  ON public.questions FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      WHERE q.id = quiz_id AND (q.is_published = true OR q.created_by = auth.uid())
    )
  );

CREATE POLICY "Quiz owners can manage questions"
  ON public.questions FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      WHERE q.id = quiz_id AND q.created_by = auth.uid()
    )
  );

-- QUIZ ATTEMPTS POLICIES
CREATE POLICY "Students can view own attempts"
  ON public.quiz_attempts FOR SELECT
  USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.quizzes q WHERE q.id = quiz_id AND q.created_by = auth.uid()
  ));

CREATE POLICY "Students can create own attempts"
  ON public.quiz_attempts FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Students and system can update attempts"
  ON public.quiz_attempts FOR UPDATE
  USING (student_id = auth.uid() OR EXISTS (
    SELECT 1 FROM public.quizzes q WHERE q.id = quiz_id AND q.created_by = auth.uid()
  ));

-- ATTEMPT ANSWERS POLICIES
CREATE POLICY "Students can view own answers"
  ON public.attempt_answers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts a
      WHERE a.id = attempt_id AND (
        a.student_id = auth.uid() OR
        EXISTS (SELECT 1 FROM public.quizzes q WHERE q.id = a.quiz_id AND q.created_by = auth.uid())
      )
    )
  );

CREATE POLICY "Students can insert own answers"
  ON public.attempt_answers FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts a
      WHERE a.id = attempt_id AND a.student_id = auth.uid()
    )
  );

CREATE POLICY "Students and system can update answers"
  ON public.attempt_answers FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.quiz_attempts a
      WHERE a.id = attempt_id AND a.student_id = auth.uid()
    )
  );

-- ============================================================
-- GRANT PERMISSIONS
-- ============================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
