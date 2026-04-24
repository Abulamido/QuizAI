export type QuestionType = 'mcq' | 'short_answer' | 'essay' | 'true_false'

export interface Option {
  id: string
  text: string
  isCorrect: boolean
}

export interface Question {
  id: string
  quiz_id: string
  question_text: string
  question_type: QuestionType
  options?: Option[]
  correct_answer?: string
  model_answer?: string
  rubric?: string
  max_score: number
  order_index: number
  image_url?: string
}

export interface Quiz {
  id: string
  title: string
  description: string
  subject: string
  created_by: string
  duration_minutes: number
  total_marks: number
  pass_mark: number
  is_published: boolean
  start_time?: string
  end_time?: string
  created_at: string
  questions?: Question[]
  attempt_count?: number
}

export interface QuizAttempt {
  id: string
  quiz_id: string
  student_id: string
  started_at: string
  submitted_at?: string
  total_score?: number
  total_possible?: number
  percentage?: number
  grade?: string
  status: 'in_progress' | 'submitted' | 'graded'
  answers?: AttemptAnswer[]
}

export interface AttemptAnswer {
  id: string
  attempt_id: string
  question_id: string
  student_answer: string
  score?: number
  max_score: number
  feedback?: string
  strengths?: string[]
  improvements?: string[]
  is_correct?: boolean
  graded_by: 'ai' | 'manual' | 'auto'
}

export interface UserProfile {
  id: string
  email: string
  full_name: string
  role: 'student' | 'admin'
  avatar_url?: string
  created_at: string
}
