'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Question {
  id: string
  question_text: string
  question_type: 'mcq' | 'short_answer' | 'essay' | 'true_false'
  options?: Array<{ id: string; text: string; isCorrect: boolean }>
  max_score: number
  order_index: number
}

interface Quiz {
  id: string
  title: string
  subject: string
  duration_minutes: number
  total_marks: number
  pass_mark: number
  questions: Question[]
}

export default function TakeQuizPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [supabase] = useState(() => createClient())

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [attemptId, setAttemptId] = useState<string | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQ, setCurrentQ] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSubmit = useCallback(async () => {
    if (!attemptId || !quiz) return
    setSubmitting(true)

    // Save any unsaved current answer first
    const res = await fetch('/api/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attemptId, quizId: quiz.id }),
    })

    if (res.ok) {
      router.push(`/quiz/${quiz.id}/results?attemptId=${attemptId}`)
    } else {
      setSubmitting(false)
      setError('Submission failed. Please try again.')
    }
  }, [attemptId, quiz, router])

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/login'); return }

      // Load quiz with questions
      const { data: quizData, error: qError } = await supabase
        .from('quizzes')
        .select(`*, questions(*)`)
        .eq('id', id)
        .eq('is_published', true)
        .single()

      if (qError || !quizData) { setError('Quiz not found or not available.'); setLoading(false); return }

      const sortedQuestions = (quizData.questions || []).sort(
        (a: Question, b: Question) => a.order_index - b.order_index
      )
      setQuiz({ ...quizData, questions: sortedQuestions })

      // Start or resume attempt
      const attemptRes = await fetch('/api/attempts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId: id }),
      })
      const attemptData = await attemptRes.json()
      setAttemptId(attemptData.attemptId)

      // If resuming, load saved answers
      if (attemptData.resumed) {
        const { data: savedAnswers } = await supabase
          .from('attempt_answers')
          .select('question_id, student_answer')
          .eq('attempt_id', attemptData.attemptId)

        const answerMap: Record<string, string> = {}
        savedAnswers?.forEach(a => { answerMap[a.question_id] = a.student_answer })
        setAnswers(answerMap)
      }

      setTimeLeft(quizData.duration_minutes * 60)
      setLoading(false)
    }
    init()
  }, [id, router, supabase])

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0 || !quiz || submitting) return
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [timeLeft, quiz, submitting, handleSubmit])

  async function saveAnswer(questionId: string, answer: string, maxScore: number) {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    setSaving(true)
    await fetch('/api/attempts', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attemptId, questionId, studentAnswer: answer, maxScore }),
    })
    setSaving(false)
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)', marginTop: 16 }}>Loading quiz...</p>
      </div>
    )
  }

  if (error || !quiz) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
        <span style={{ fontSize: '3rem' }}>⚠️</span>
        <h3 style={{ color: 'var(--error)' }}>{error || 'Quiz not found'}</h3>
        <button onClick={() => router.push('/student/dashboard')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    )
  }

  const question = quiz.questions[currentQ]
  const totalQuestions = quiz.questions.length
  const progress = ((currentQ + 1) / totalQuestions) * 100
  const answeredCount = Object.keys(answers).filter(k => answers[k]).length
  const isLowTime = timeLeft < 300
  const isDangerTime = timeLeft < 60
  const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      {/* QUIZ HEADER */}
      <div className="quiz-header" style={{ margin: 0, borderRadius: 0, borderLeft: 'none', borderRight: 'none', borderTop: 'none', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ flex: 1 }}>
          <h4 style={{ color: 'var(--text-primary)', marginBottom: 2 }}>{quiz.title}</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {answeredCount}/{totalQuestions} answered · {saving ? '⏳ Saving...' : '✓ Auto-saved'}
          </p>
        </div>

        {/* TIMER */}
        <div className={`quiz-timer ${isDangerTime ? 'danger' : isLowTime ? 'warning' : ''}`}>
          <span>{isDangerTime ? '🚨' : isLowTime ? '⚠️' : '⏱️'}</span>
          {formatTime(timeLeft)}
        </div>

        <button
          onClick={() => {
            if (confirm('Submit quiz now? This cannot be undone.')) handleSubmit()
          }}
          className="btn btn-primary"
          disabled={submitting}
          id="submit-quiz-btn"
        >
          {submitting ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Submitting...</> : 'Submit Quiz'}
        </button>
      </div>

      {/* PROGRESS BAR */}
      <div className="progress-bar" style={{ borderRadius: 0, margin: 0 }}>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      <div className="quiz-container">
        {/* QUESTION NAVIGATOR */}
        <div style={{
          display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 28,
          background: 'var(--bg-card)', padding: 16, borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border)'
        }}>
          {quiz.questions.map((q, i) => (
            <button
              key={q.id}
              onClick={() => setCurrentQ(i)}
              style={{
                width: 36, height: 36, borderRadius: 'var(--radius-sm)',
                border: `1.5px solid ${i === currentQ ? 'var(--primary)' : answers[q.id] ? 'var(--success)' : 'var(--border)'}`,
                background: i === currentQ ? 'rgba(108,99,255,0.2)' : answers[q.id] ? 'rgba(16,185,129,0.1)' : 'var(--bg-input)',
                color: i === currentQ ? 'var(--primary-light)' : answers[q.id] ? 'var(--success)' : 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.82rem',
                fontWeight: 700,
                transition: 'all 0.15s',
              }}
              id={`nav-q-${i}`}
            >
              {i + 1}
            </button>
          ))}
        </div>

        {/* CURRENT QUESTION */}
        <div className="question-card">
          <p className="question-number">Question {currentQ + 1} of {totalQuestions} · {question.max_score} mark{question.max_score !== 1 ? 's' : ''}</p>
          <p className="question-text">{question.question_text}</p>

          {/* MCQ */}
          {question.question_type === 'mcq' && question.options && (
            <div className="options-grid">
              {question.options.map((opt, oi) => (
                <button
                  key={opt.id}
                  onClick={() => saveAnswer(question.id, opt.text, question.max_score)}
                  className={`option-btn ${answers[question.id] === opt.text ? 'selected' : ''}`}
                  id={`option-${opt.id}`}
                >
                  <span className="option-letter">{OPTION_LETTERS[oi]}</span>
                  {opt.text}
                </button>
              ))}
            </div>
          )}

          {/* TRUE/FALSE */}
          {question.question_type === 'true_false' && (
            <div style={{ display: 'flex', gap: 16 }}>
              {['True', 'False'].map(val => (
                <button
                  key={val}
                  onClick={() => saveAnswer(question.id, val, question.max_score)}
                  className={`option-btn ${answers[question.id] === val ? 'selected' : ''}`}
                  style={{ flex: 1, justifyContent: 'center', fontSize: '1.1rem' }}
                  id={`tf-${val.toLowerCase()}`}
                >
                  {val === 'True' ? '✓ True' : '✗ False'}
                </button>
              ))}
            </div>
          )}

          {/* SHORT ANSWER */}
          {question.question_type === 'short_answer' && (
            <div>
              <textarea
                className="form-input"
                rows={4}
                placeholder="Type your answer here..."
                value={answers[question.id] || ''}
                onChange={e => saveAnswer(question.id, e.target.value, question.max_score)}
                id={`short-answer-${question.id}`}
              />
              <p className="form-helper" style={{ marginTop: 8 }}>
                💡 This answer will be graded by AI with detailed feedback
              </p>
            </div>
          )}

          {/* ESSAY */}
          {question.question_type === 'essay' && (
            <div>
              <textarea
                className="form-input"
                rows={12}
                placeholder="Write your essay here. Include an introduction, body paragraphs, and conclusion..."
                value={answers[question.id] || ''}
                onChange={e => saveAnswer(question.id, e.target.value, question.max_score)}
                id={`essay-${question.id}`}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <p className="form-helper">🤖 This essay will be graded by Gemini AI</p>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {(answers[question.id] || '').split(/\s+/).filter(Boolean).length} words
                </span>
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION BUTTONS */}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
          <button
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="btn btn-secondary"
            id="prev-question"
          >
            ← Previous
          </button>

          {currentQ < totalQuestions - 1 ? (
            <button
              onClick={() => setCurrentQ(currentQ + 1)}
              className="btn btn-primary"
              id="next-question"
            >
              Next →
            </button>
          ) : (
            <button
              onClick={() => {
                if (confirm(`Submit quiz? You've answered ${answeredCount}/${totalQuestions} questions.`)) {
                  handleSubmit()
                }
              }}
              className="btn btn-success"
              disabled={submitting}
              id="final-submit"
            >
              {submitting ? 'Submitting...' : '✓ Submit Quiz'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
