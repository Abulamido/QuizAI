'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface DashboardStats {
  totalQuizzes: number
  publishedQuizzes: number
  totalStudents: number
  totalAttempts: number
  avgScore: number
}

interface QuizItem {
  id: string
  title: string
  subject: string
  is_published: boolean
  total_marks: number
  duration_minutes: number
  created_at: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [supabase] = useState(() => createClient())
  const [user, setUser] = useState<{ full_name: string; email: string } | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalQuizzes: 0, publishedQuizzes: 0, totalStudents: 0, totalAttempts: 0, avgScore: 0
  })
  const [quizzes, setQuizzes] = useState<QuizItem[]>([])
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

    if (profile?.role !== 'admin') { router.push('/student/dashboard'); return }

    setUser({ full_name: profile.full_name, email: profile.email })

    // Load quizzes
    const { data: quizData } = await supabase
      .from('quizzes')
      .select('*')
      .eq('created_by', authUser.id)
      .order('created_at', { ascending: false })

    setQuizzes(quizData || [])

    // Load stats
    const { count: studentCount } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'student')

    const { data: attempts } = await supabase
      .from('quiz_attempts')
      .select('percentage')
      .eq('status', 'graded')

    const avg = attempts && attempts.length > 0
      ? Math.round(attempts.reduce((s, a) => s + (a.percentage || 0), 0) / attempts.length)
      : 0

    setStats({
      totalQuizzes: quizData?.length || 0,
      publishedQuizzes: quizData?.filter(q => q.is_published).length || 0,
      totalStudents: studentCount || 0,
      totalAttempts: attempts?.length || 0,
      avgScore: avg,
    })

    setLoading(false)
  }

  async function togglePublish(quizId: string, currentState: boolean) {
    await fetch(`/api/quizzes/${quizId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_published: !currentState }),
    })
    setQuizzes(prev => prev.map(q => q.id === quizId ? { ...q, is_published: !currentState } : q))
  }

  async function deleteQuiz(quizId: string) {
    if (!confirm('Are you sure? This will delete all student attempts too.')) return
    await fetch(`/api/quizzes/${quizId}`, { method: 'DELETE' })
    setQuizzes(prev => prev.filter(q => q.id !== quizId))
    setStats(prev => ({ ...prev, totalQuizzes: prev.totalQuizzes - 1 }))
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="loading-overlay" style={{ minHeight: '100vh' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--text-muted)' }}>Loading dashboard...</p>
      </div>
    )
  }

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
            <span className="badge badge-primary">Educator</span>
            <button onClick={handleLogout} className="btn btn-ghost btn-sm" id="logout-btn">
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-layout">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="sidebar-section">Main</div>
          {[
            { id: 'dashboard', icon: '📊', label: 'Dashboard' },
            { id: 'quizzes', icon: '📝', label: 'My Quizzes' },
            { id: 'students', icon: '🎓', label: 'Students' },
            { id: 'grades', icon: '🏆', label: 'Grade Reports' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`sidebar-item ${activeNav === item.id ? 'active' : ''}`}
              id={`nav-${item.id}`}
            >
              <span>{item.icon}</span> {item.label}
            </button>
          ))}

          <div className="sidebar-section" style={{ marginTop: 16 }}>Actions</div>
          <Link href="/admin/quiz/create" className="btn btn-primary btn-sm" style={{ margin: '4px 8px' }} id="create-quiz-btn">
            + Create Quiz
          </Link>

          <div style={{ marginTop: 'auto', padding: '16px 8px', borderTop: '1px solid var(--border)' }}>
            <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user?.full_name}</p>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{user?.email}</p>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          {activeNav === 'dashboard' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">Welcome back, {user?.full_name?.split(' ')[0]}! 👋</h1>
                  <p className="page-subtitle">Here&apos;s an overview of your teaching activity</p>
                </div>
                <Link href="/admin/quiz/create" className="btn btn-primary" id="create-quiz-header-btn">
                  + New Quiz
                </Link>
              </div>

              {/* STATS */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 40 }}>
                {[
                  { label: 'Total Quizzes', value: stats.totalQuizzes, icon: '📝', color: '#6c63ff' },
                  { label: 'Published', value: stats.publishedQuizzes, icon: '✅', color: '#10b981' },
                  { label: 'Students', value: stats.totalStudents, icon: '🎓', color: '#f59e0b' },
                  { label: 'Attempts', value: stats.totalAttempts, icon: '📊', color: '#3b82f6' },
                  { label: 'Avg Score', value: `${stats.avgScore}%`, icon: '🏆', color: '#ec4899' },
                ].map((s, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-icon" style={{ background: `${s.color}20` }}>
                      <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
                    </div>
                    <div>
                      <div className="stat-value">{s.value}</div>
                      <div className="stat-label">{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* RECENT QUIZZES */}
              <div>
                <h3 style={{ marginBottom: 20 }}>Recent Quizzes</h3>
                {quizzes.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">📝</div>
                    <h4>No quizzes yet</h4>
                    <p>Create your first quiz to get started</p>
                    <Link href="/admin/quiz/create" className="btn btn-primary" style={{ marginTop: 20 }}>
                      Create Quiz
                    </Link>
                  </div>
                ) : (
                  <div className="quiz-grid">
                    {quizzes.slice(0, 6).map(quiz => (
                      <QuizCard
                        key={quiz.id}
                        quiz={quiz}
                        onTogglePublish={togglePublish}
                        onDelete={deleteQuiz}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeNav === 'quizzes' && (
            <>
              <div className="page-header">
                <div>
                  <h1 className="page-title">My Quizzes</h1>
                  <p className="page-subtitle">{quizzes.length} quizzes created</p>
                </div>
                <Link href="/admin/quiz/create" className="btn btn-primary">+ New Quiz</Link>
              </div>
              {quizzes.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h4>No quizzes yet</h4>
                  <Link href="/admin/quiz/create" className="btn btn-primary" style={{ marginTop: 20 }}>Create Your First Quiz</Link>
                </div>
              ) : (
                <div className="quiz-grid">
                  {quizzes.map(quiz => (
                    <QuizCard
                      key={quiz.id}
                      quiz={quiz}
                      onTogglePublish={togglePublish}
                      onDelete={deleteQuiz}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {activeNav === 'grades' && (
            <div>
              <h1 className="page-title" style={{ marginBottom: 32 }}>Grade Reports</h1>
              <GradeReports supabase={supabase} />
            </div>
          )}

          {activeNav === 'students' && (
            <div>
              <h1 className="page-title" style={{ marginBottom: 32 }}>Students</h1>
              <StudentsList supabase={supabase} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

function QuizCard({ quiz, onTogglePublish, onDelete }: {
  quiz: QuizItem
  onTogglePublish: (id: string, state: boolean) => void
  onDelete: (id: string) => void
}) {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <span className="badge badge-muted">{quiz.subject || 'General'}</span>
        <span className={`badge ${quiz.is_published ? 'badge-success' : 'badge-warning'}`}>
          {quiz.is_published ? '✓ Published' : '⏸ Draft'}
        </span>
      </div>
      <div>
        <h4 style={{ color: 'var(--text-primary)', marginBottom: 8 }}>{quiz.title}</h4>
        <div style={{ display: 'flex', gap: 16, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          <span>⏱️ {quiz.duration_minutes} min</span>
          <span>🏆 {quiz.total_marks} marks</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, paddingTop: 12, borderTop: '1px solid var(--border)' }}>
        <button
          onClick={() => onTogglePublish(quiz.id, quiz.is_published)}
          className={`btn btn-sm ${quiz.is_published ? 'btn-secondary' : 'btn-success'}`}
          style={{ flex: 1 }}
          id={`toggle-${quiz.id}`}
        >
          {quiz.is_published ? 'Unpublish' : 'Publish'}
        </button>
        <Link href={`/admin/quiz/${quiz.id}/results`} className="btn btn-sm btn-ghost">
          Results
        </Link>
        <button
          onClick={() => onDelete(quiz.id)}
          className="btn btn-sm btn-danger btn-icon"
          title="Delete quiz"
          id={`delete-${quiz.id}`}
        >
          🗑️
        </button>
      </div>
    </div>
  )
}

function GradeReports({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const [attempts, setAttempts] = useState<Array<{
    id: string
    percentage: number
    grade: string
    total_score: number
    total_possible: number
    submitted_at: string
    profiles: { full_name: string }
    quizzes: { title: string }
  }>>([])

  useEffect(() => {
    supabase.from('quiz_attempts')
      .select('*, profiles(full_name), quizzes(title)')
      .eq('status', 'graded')
      .order('submitted_at', { ascending: false })
      .limit(50)
      .then(({ data }) => setAttempts(data || []))
  }, [supabase])

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Quiz</th>
            <th>Score</th>
            <th>Percentage</th>
            <th>Grade</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map(a => (
            <tr key={a.id}>
              <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{a.profiles?.full_name || 'Unknown'}</td>
              <td>{a.quizzes?.title || 'Unknown Quiz'}</td>
              <td>{a.total_score}/{a.total_possible}</td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ flex: 1, height: 6, background: 'var(--bg-elevated)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${a.percentage}%`, height: '100%', background: 'var(--gradient-primary)', borderRadius: 3 }} />
                  </div>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{a.percentage}%</span>
                </div>
              </td>
              <td>
                <span className={`badge ${a.grade === 'A' || a.grade === 'B' ? 'badge-success' : a.grade === 'C' ? 'badge-warning' : 'badge-error'}`}>
                  {a.grade}
                </span>
              </td>
              <td>{a.submitted_at ? new Date(a.submitted_at).toLocaleDateString() : 'N/A'}</td>
            </tr>
          ))}
          {attempts.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No graded attempts yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function StudentsList({ supabase }: { supabase: ReturnType<typeof createClient> }) {
  const [students, setStudents] = useState<Array<{
    id: string
    full_name: string
    email: string
    created_at: string
  }>>([])

  useEffect(() => {
    supabase.from('profiles')
      .select('*')
      .eq('role', 'student')
      .order('created_at', { ascending: false })
      .then(({ data }) => setStudents(data || []))
  }, [supabase])

  return (
    <div className="table-container">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Joined</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s, i) => (
            <tr key={s.id}>
              <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
              <td style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{s.full_name}</td>
              <td>{s.email}</td>
              <td>{new Date(s.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr><td colSpan={4} style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>No students registered yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
