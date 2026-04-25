'use client'
export const dynamic = 'force-dynamic'
import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface AttemptRecord {
  id: string
  percentage: number
  grade: string
  total_score: number
  total_possible: number
  submitted_at: string
  profiles: { full_name: string; email: string }
}

export default function QuizResultsAdmin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [supabase] = useState(() => createClient())
  const [quiz, setQuiz] = useState<{ title: string; pass_mark: number } | null>(null)
  const [attempts, setAttempts] = useState<AttemptRecord[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: quizData }, { data: attemptsData }] = await Promise.all([
        supabase.from('quizzes').select('title, pass_mark').eq('id', id).single(),
        supabase.from('quiz_attempts')
          .select('*, profiles(full_name, email)')
          .eq('quiz_id', id)
          .eq('status', 'graded')
          .order('submitted_at', { ascending: false })
      ])

      setQuiz(quizData)
      setAttempts(attemptsData || [])
      setLoading(false)
    }
    load()
  }, [id, supabase])

  if (loading) return <div className="loading-overlay" style={{ minHeight: '100vh' }}><div className="spinner" /></div>

  const avg = attempts.length > 0 ? Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length) : 0
  const passed = attempts.filter(a => a.percentage >= (quiz?.pass_mark || 50)).length
  const highest = attempts.reduce((m, a) => Math.max(m, a.percentage), 0)

  return (
    <div style={{ padding: '40px', maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <Link href="/admin/dashboard" className="btn btn-ghost btn-sm">← Back</Link>
      </div>
      <h1 style={{ marginBottom: 4 }}>{quiz?.title} — Results</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>{attempts.length} submission{attempts.length !== 1 ? 's' : ''}</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 40 }}>
        {[
          { label: 'Submissions', value: attempts.length, icon: '📊' },
          { label: 'Pass Rate', value: `${attempts.length ? Math.round((passed / attempts.length) * 100) : 0}%`, icon: '✅' },
          { label: 'Class Average', value: `${avg}%`, icon: '📈' },
          { label: 'Highest Score', value: `${highest}%`, icon: '🏆' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <span style={{ fontSize: '1.5rem' }}>{s.icon}</span>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Student</th>
              <th>Score</th>
              <th>Percentage</th>
              <th>Grade</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {attempts.map((a, i) => {
              const p = a.percentage >= (quiz?.pass_mark || 50)
              return (
                <tr key={a.id}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.profiles?.full_name}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{a.profiles?.email}</div>
                  </td>
                  <td>{a.total_score}/{a.total_possible}</td>
                  <td><span style={{ fontWeight: 700, color: p ? 'var(--success)' : 'var(--error)' }}>{a.percentage}%</span></td>
                  <td><span className={`badge ${a.grade === 'A' || a.grade === 'B' ? 'badge-success' : a.grade === 'C' ? 'badge-warning' : 'badge-error'}`}>{a.grade}</span></td>
                  <td><span className={`badge ${p ? 'badge-success' : 'badge-error'}`}>{p ? 'PASSED' : 'FAILED'}</span></td>
                  <td>{a.submitted_at ? new Date(a.submitted_at).toLocaleDateString() : 'N/A'}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
