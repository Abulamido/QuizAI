'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Answer {
  id: string
  question_id: string
  student_answer: string
  score: number
  max_score: number
  feedback: string
  strengths: string[]
  improvements: string[]
  is_correct: boolean
  graded_by: 'ai' | 'auto' | 'manual'
  questions: {
    question_text: string
    question_type: string
  }
}

interface AttemptResult {
  id: string
  total_score: number
  total_possible: number
  percentage: number
  grade: string
  submitted_at: string
  attempt_answers: Answer[]
  quizzes: {
    title: string
    subject: string
    pass_mark: number
  }
}

export default function ResultsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const searchParams = useSearchParams()
  const attemptId = searchParams?.get('attemptId')
  const [supabase] = useState(() => createClient())

  const [result, setResult] = useState<AttemptResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadResults() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      let query = supabase
        .from('quiz_attempts')
        .select(`
          *,
          quizzes(title, subject, pass_mark),
          attempt_answers(
            *,
            questions(question_text, question_type)
          )
        `)
        .eq('quiz_id', id)
        .eq('student_id', user.id)
        .eq('status', 'graded')

      if (attemptId) {
        query = query.eq('id', attemptId)
      }

      const { data, error: fetchError } = await query
        .order('submitted_at', { ascending: false })
        .limit(1)
        .single()

      if (fetchError || !data) {
        setError('Result not found. The quiz may still be grading.')
      } else {
        setResult(data)
      }
      setLoading(false)
    }
    loadResults()
  }, [id, attemptId, supabase])

  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh', flexDirection: 'column', gap: 20 }}>
        <div className="spinner" style={{ width: 56, height: 56 }} />
        <h3>AI is grading your answers...</h3>
        <p style={{ color: 'var(--text-muted)' }}>This usually takes 10–30 seconds. Please wait.</p>
      </div>
    )
  }

  if (error || !result) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
        <span style={{ fontSize: '3rem' }}>⚠️</span>
        <h3 style={{ color: 'var(--error)' }}>{error}</h3>
        <Link href="/student/dashboard" className="btn btn-primary">← Back to Dashboard</Link>
      </div>
    )
  }

  const passed = result.percentage >= result.quizzes.pass_mark
  const gradeClass = result.grade === 'A' ? 'grade-a' : result.grade === 'B' ? 'grade-b' : result.grade === 'C' ? 'grade-c' : 'grade-f'
  const gradeColor = result.grade === 'A' ? 'var(--success)' : result.grade === 'B' ? 'var(--accent-teal)' : result.grade === 'C' ? 'var(--warning)' : 'var(--error)'

  const sortedAnswers = [...result.attempt_answers].sort((a, b) => {
    const ai = a.questions ? 0 : 1
    const bi = b.questions ? 0 : 1
    return ai - bi
  })

  return (
    <div style={{ background: 'var(--bg-base)', minHeight: '100vh' }}>
      {/* NAV */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-brand">
            <div className="navbar-logo">Q</div>
            <span className="navbar-title">QuizAI</span>
          </Link>
          <Link href="/student/dashboard" className="btn btn-secondary btn-sm">← Dashboard</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 24px 80px' }}>
        {/* RESULT HERO */}
        <div className="result-hero">
          <div className={`score-circle ${gradeClass}`}>
            <div className="score-number" style={{ color: gradeColor }}>{result.percentage}%</div>
            <div className="score-grade" style={{ color: gradeColor }}>Grade {result.grade}</div>
          </div>

          <h1 style={{ marginBottom: 12 }}>{result.quizzes.title}</h1>
          <p style={{ marginBottom: 8 }}>{result.quizzes.subject}</p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            <span className={`badge ${passed ? 'badge-success' : 'badge-error'}`} style={{ padding: '8px 20px', fontSize: '0.9rem' }}>
              {passed ? '🎉 PASSED' : '❌ FAILED'}
            </span>
            <span className="badge badge-muted" style={{ padding: '8px 20px' }}>
              {result.total_score}/{result.total_possible} marks
            </span>
            <span className="badge badge-muted" style={{ padding: '8px 20px' }}>
              {result.submitted_at ? new Date(result.submitted_at).toLocaleDateString() : ''}
            </span>
          </div>

          {/* Progress ring substitute */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, maxWidth: 480, margin: '0 auto' }}>
            {[
              { label: 'Score', value: `${result.total_score}/${result.total_possible}`, color: gradeColor },
              { label: 'Percentage', value: `${result.percentage}%`, color: gradeColor },
              { label: 'Pass Mark', value: `${result.quizzes.pass_mark}%`, color: 'var(--text-muted)' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color, fontFamily: 'Outfit' }}>{s.value}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* DETAILED ANSWER REVIEW */}
        <h3 style={{ marginBottom: 24, marginTop: 48 }}>Answer Review</h3>

        {sortedAnswers.map((answer, i) => {
          const isCorrect = answer.is_correct || (answer.score && answer.score === answer.max_score)
          const scorePercent = answer.max_score > 0 ? Math.round((answer.score / answer.max_score) * 100) : 0
          const hasAIFeedback = answer.graded_by === 'ai' && answer.feedback

          return (
            <div key={answer.id} style={{
              background: 'var(--bg-card)',
              border: `1px solid ${isCorrect ? 'rgba(16,185,129,0.3)' : 'var(--border)'}`,
              borderRadius: 'var(--radius-lg)',
              padding: 28,
              marginBottom: 20,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                <span className="badge badge-muted">Q{i + 1} · {answer.questions?.question_type}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span className={`badge ${scorePercent >= 100 ? 'badge-success' : scorePercent >= 50 ? 'badge-warning' : 'badge-error'}`}>
                    {answer.score}/{answer.max_score} marks
                  </span>
                  <span className="badge badge-muted" style={{ fontSize: '0.7rem' }}>
                    {answer.graded_by === 'ai' ? '🤖 AI' : answer.graded_by === 'auto' ? '⚡ Auto' : '👨‍🏫 Manual'}
                  </span>
                </div>
              </div>

              <p style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: 12, lineHeight: 1.5 }}>
                {answer.questions?.question_text}
              </p>

              <div style={{
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                padding: '12px 16px',
                marginBottom: hasAIFeedback ? 16 : 0,
              }}>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>Your Answer:</p>
                <p style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                  {answer.student_answer || <em style={{ color: 'var(--text-muted)' }}>No answer provided</em>}
                </p>
              </div>

              {/* AI Feedback */}
              {hasAIFeedback && (
                <div className="ai-feedback-card">
                  <div className="ai-badge">🤖 AI Feedback</div>
                  <p className="feedback-text">{answer.feedback}</p>

                  {answer.strengths && answer.strengths.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--success)', marginBottom: 8 }}>✓ Strengths</p>
                      <ul className="feedback-list strengths">
                        {answer.strengths.map((s, si) => <li key={si}>{s}</li>)}
                      </ul>
                    </div>
                  )}

                  {answer.improvements && answer.improvements.length > 0 && (
                    <div>
                      <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--warning)', marginBottom: 8 }}>→ Areas for Improvement</p>
                      <ul className="feedback-list improvements">
                        {answer.improvements.map((imp, ii) => <li key={ii}>{imp}</li>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* Auto grading feedback */}
              {answer.graded_by === 'auto' && answer.feedback && (
                <div style={{
                  background: isCorrect ? 'var(--success-bg)' : 'var(--error-bg)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  marginTop: 12,
                  fontSize: '0.9rem',
                  color: isCorrect ? 'var(--success)' : 'var(--error)',
                }}>
                  {isCorrect ? '✓' : '✗'} {answer.feedback}
                </div>
              )}
            </div>
          )
        })}

        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 40 }}>
          <Link href="/student/dashboard" className="btn btn-primary btn-lg">
            Back to Dashboard
          </Link>
          <Link href={`/quiz/${id}`} className="btn btn-secondary btn-lg" id="retake-btn">
            Retake Quiz
          </Link>
        </div>
      </div>
    </div>
  )
}
