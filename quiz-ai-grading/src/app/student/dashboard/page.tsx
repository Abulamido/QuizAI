'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Quiz {
  id: string
  title: string
  subject: string
  duration_minutes: number
  total_marks: number
  pass_mark: number
  is_published: boolean
  description: string
}

interface AttemptSummary {
  quiz_id: string
  status: string
  percentage: number
  grade: string
}

export default function StudentDashboard() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null)
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [attempts, setAttempts] = useState<AttemptSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [activeNav, setActiveNav] = useState('dashboard')

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) { router.push('/login'); return }

    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name, email, role')
      .eq('id', authUser.id)
      .single()

    if (profile?.role === 'admin') { router.push('/admin/dashboard'); return }

    setUser({ full_name: profile?.full_name || '', email: profile?.email || '' })

    // Fetch available quizzes
    const { data: quizData } = await supabase
      .from('quizzes')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    setQuizzes(quizData || [])

    // Fetch student attempts
    const { data: attemptData } = await supabase
      .from('quiz_attempts')
      .select('quiz_id, status, percentage, grade')
      .eq('student_id', authUser.id)

    setAttempts(attemptData || [])
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  function getAttemptForQuiz(quizId: string) {
    return attempts.find(a => a.quiz_id === quizId)
  }

  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
      </div>
    )
  }

  const completedAttempts = attempts.filter(a => a.status === 'graded')
  const avgScore = completedAttempts.length > 0
    ? Math.round(completedAttempts.reduce((s, a) => s + (a.percentage || 0), 0) / completedAttempts.length)
    : 0

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-brand">
            <div className="navbar-logo">Q</div>
            <span className="navbar-title">QuizAI</span>
          </Link>
          <div className="navbar-nav">
            <span className="badge badge-primary">Student</span>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm" id="student-logout">Sign Out</button>
          </div>
        </div>
      </nav>

      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-section">Menu</div>
          {[
            { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
            { id: 'quizzes', icon: '📝', label: 'Available Quizzes' },
            { id: 'results', icon: '📊', label: 'My Results' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`sidebar-item ${activeNav === item.id ? 'active' : ''}`}
              id={`student-nav-${item.id}`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}

          <div style={{ marginTop: 'auto', padding: '16px 8px', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.full_name}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main-content">
          {activeNav === 'dashboard' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Hello, {user?.full_name?.split(' ')[0]}! 🎓</h1>
                  <p className="page-subtitle">Ready to learn and be assessed today?</p>
                </div>
              </div>

              {/* Stats */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 20, marginBottom: 40 }}>
                {[
                  { label: 'Available Quizzes', value: quizzes.length, icon: '📝', color: '#6c63ff' },
                  { label: 'Completed', value: completedAttempts.length, icon: '✅', color: '#10b981' },
                  { label: 'In Progress', value: attempts.filter(a => a.status === 'in_progress').length, icon: '⏳', color: '#f59e0b' },
                  { label: 'Avg Score', value: `${avgScore}%`, icon: '🏆', color: '#ec4899' },
                ].map((s, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-icon" style={{ background: `${s.color}20` }}>
                      <span style={{ fontSize: '1.4rem' }}>{s.icon}</span>
                    </div>
                    <div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Available quizzes preview */}
              <h3 style={{ marginBottom: 20 }}>Available Quizzes</h3>
              {quizzes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h4>No quizzes available</h4>
                  <p>Your educator hasn&apos;t published any quizzes yet.</p>
                </div>
              ) : (
                <div className="quiz-grid">
                  {quizzes.slice(0, 6).map(quiz => {
                    const attempt = getAttemptForQuiz(quiz.id)
                    return (
                      <StudentQuizCard key={quiz.id} quiz={quiz} attempt={attempt} />
                    )
                  })}
                </div>
              )}
            </>
          )}

          {activeNav === 'quizzes' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Available Quizzes</h1>
                  <p className="page-subtitle">{quizzes.length} quiz{quizzes.length !== 1 ? 'zes' : ''} available</p>
                </div>
              </div>
              {quizzes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <h4>No quizzes available yet</h4>
                </div>
              ) : (
                <div className="quiz-grid">
                  {quizzes.map(quiz => {
                    const attempt = getAttemptForQuiz(quiz.id)
                    return <StudentQuizCard key={quiz.id} quiz={quiz} attempt={attempt} />
                  })}
                </div>
              )}
            </>
          )}

          {activeNav === 'results' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">My Results</h1>
                  <p className="page-subtitle">{completedAttempts.length} completed assessment{completedAttempts.length !== 1 ? 's' : ''}</p>
                </div>
              </div>
              <MyResults supabase={supabase} />
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function StudentQuizCard({ quiz, attempt }: { quiz: Quiz; attempt?: AttemptSummary }) {
  const isCompleted = attempt?.status === 'graded'
  const isInProgress = attempt?.status === 'in_progress'

  return (
    <div className="quiz-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="badge badge-muted">{quiz.subject || 'General'}</span>
        {isCompleted && <span className={`badge ${(attempt?.percentage || 0) >= quiz.pass_mark ? 'badge-success' : 'badge-error'}`}>
          {attempt?.grade} · {attempt?.percentage}%
        </span>}
        {isInProgress && <span className="badge badge-warning">⏳ In Progress</span>}
      </div>
      <div>
        <h4 className="quiz-card-title">{quiz.title}</h4>
        {quiz.description && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>{quiz.description}</p>}
      </div>
      <div className="quiz-card-meta">
        <span>⏱️ {quiz.duration_minutes} min</span>
        <span>🏆 {quiz.total_marks} marks</span>
        <span>📊 Pass: {quiz.pass_mark}%</span>
      </div>
      <div className="quiz-card-footer">
        {isCompleted ? (
          <Link href={`/quiz/${quiz.id}/results`} className="btn btn-secondary btn-sm" style={{ flex: 1 }}
            id={`view-results-${quiz.id}`}>
            View Results →
          </Link>
        ) : (
          <Link href={`/quiz/${quiz.id}`} className="btn btn-primary btn-sm" style={{ flex: 1 }}
            id={`take-quiz-${quiz.id}`}>
            {isInProgress ? 'Continue Quiz →' : 'Take Quiz →'}
          </Link>
        )}
      </div>
    </div>
  )
}

function MyResults({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const [results, setResults] = useState<Array<{
    id: string
    percentage: number
    grade: string
    total_score: number
    total_possible: number
    submitted_at: string
    quizzes: { title: string; pass_mark: number }
  }>>([])

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('quiz_attempts')
        .select('*, quizzes(title, pass_mark)')
        .eq('student_id', user.id)
        .eq('status', 'graded')
        .order('submitted_at', { ascending: false })
      setResults(data || [])
    }
    load()
  }, [supabase])

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Quiz</th>
            <th>Score</th>
            <th>Percentage</th>
            <th>Grade</th>
            <th>Status</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {results.map(r => {
            const passed = (r.percentage || 0) >= (r.quizzes?.pass_mark || 50)
            return (
              <tr key={r.id}>
                <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{r.quizzes?.title}</td>
                <td>{r.total_score}/{r.total_possible}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden', minWidth: 60 }}>
                      <div style={{ width: `${r.percentage}%`, height: '100%', background: passed ? 'var(--gradient-success)' : 'var(--gradient-danger)', borderRadius: 3 }} />
                    </div>
                    <span style={{ fontWeight: 600 }}>{r.percentage}%</span>
                  </div>
                </td>
                <td><span className={`badge ${r.grade === 'A' || r.grade === 'B' ? 'badge-success' : r.grade === 'C' ? 'badge-warning' : 'badge-error'}`}>{r.grade}</span></td>
                <td><span className={`badge ${passed ? 'badge-success' : 'badge-error'}`}>{passed ? 'PASSED' : 'FAILED'}</span></td>
                <td>{r.submitted_at ? new Date(r.submitted_at).toLocaleDateString() : 'N/A'}</td>
                <td>
                  <Link href={`/quiz/${r.quizzes ? '' : ''}results`} className="btn btn-ghost btn-sm">View →</Link>
                </td>
              </tr>
            )
          })}
          {results.length === 0 && (
            <tr>
              <td colSpan={7} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
                You haven&apos;t completed any quizzes yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
