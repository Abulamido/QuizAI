'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [supabase] = useState(() => createClient())

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError(authError.message)
      setLoading(false)
      return
    }

    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', data.user.id)
      .single()

    if (profile?.role === 'admin') {
      router.push('/admin/dashboard')
    } else {
      router.push('/student/dashboard')
    }
  }

  return (
    <div className="auth-page">
      {/* LEFT PANEL */}
      <div className="auth-panel-left">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 30% 50%, rgba(108,99,255,0.2) 0%, transparent 60%)'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" className="navbar-brand" style={{ marginBottom: 48, display: 'inline-flex' }}>
            <div className="navbar-logo" style={{ width: 48, height: 48, fontSize: '1.3rem' }}>Q</div>
            <span className="navbar-title" style={{ fontSize: '1.4rem' }}>QuizAI</span>
          </Link>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 16, color: 'var(--text-primary)' }}>
            AI-Powered<br />Assessment Platform
          </h2>
          <p style={{ marginBottom: 48, maxWidth: 360, lineHeight: 1.8 }}>
            The smarter way to create and grade assessments. Powered by Google Gemini for instant, fair, and detailed feedback.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {['🤖 Instant AI grading for all question types',
              '📊 Rich analytics and performance insights',
              '⏱️ Timed quizzes with auto-submission',
              '💬 Personalized feedback for every student'].map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-secondary)' }}>
                <span style={{ fontSize: '1.1rem' }}>{item.split(' ')[0]}</span>
                <span style={{ fontSize: '0.95rem' }}>{item.split(' ').slice(1).join(' ')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-panel-right">
        <div className="auth-form-container">
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account to continue</p>

          {searchParams?.get('message') && (
            <div className="badge badge-success" style={{ marginBottom: 20, padding: '10px 16px' }}>
              {searchParams.get('message')}
            </div>
          )}

          {error && (
            <div style={{
              background: 'var(--error-bg)',
              border: '1px solid rgba(239,68,68,0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '12px 16px',
              color: 'var(--error)',
              fontSize: '0.9rem',
              marginBottom: 20
            }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="auth-form" id="login-form">
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              id="login-submit"
              disabled={loading}
              style={{ marginTop: 8 }}
            >
              {loading ? (
                <>
                  <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
                  Signing in...
                </>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="auth-divider" style={{ margin: '24px 0' }}>or</div>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="loading-overlay"><div className="spinner" /></div>}>
      <LoginForm />
    </Suspense>
  )
}
