'use client'
import { useState, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

function RegisterForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const defaultRole = searchParams?.get('role') || 'student'

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: defaultRole as 'student' | 'admin',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [supabase] = useState(() => createClient())

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          role: formData.role,
        }
      }
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Profile is auto-created by DB trigger
      router.push('/login?message=Account created! Please sign in.')
    }
  }

  return (
    <div className="auth-page">
      {/* LEFT PANEL */}
      <div className="auth-panel-left">
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(circle at 70% 30%, rgba(155,89,182,0.2) 0%, transparent 60%)'
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <Link href="/" className="navbar-brand" style={{ marginBottom: 48, display: 'inline-flex' }}>
            <div className="navbar-logo" style={{ width: 48, height: 48, fontSize: '1.3rem' }}>Q</div>
            <span className="navbar-title" style={{ fontSize: '1.4rem' }}>QuizAI</span>
          </Link>
          <h2 style={{ fontSize: '2.5rem', marginBottom: 16, color: 'var(--text-primary)' }}>
            Join the Future<br />of Learning
          </h2>
          <p style={{ maxWidth: 360, lineHeight: 1.8 }}>
            Whether you&apos;re an educator creating assessments or a student ready to learn — QuizAI is built for you.
          </p>

          <div style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 48
          }}>
            {[
              { label: '10,000+', sub: 'Quizzes Created' },
              { label: '50,000+', sub: 'Students Served' },
              { label: '99.9%', sub: 'Uptime' },
              { label: '4.9★', sub: 'User Rating' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                padding: '20px',
                textAlign: 'center'
              }}>
                <div style={{ fontFamily: 'Outfit', fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-light)' }}>
                  {s.label}
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="auth-panel-right">
        <div className="auth-form-container">
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Start your AI grading journey today</p>

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

          <form onSubmit={handleRegister} className="auth-form" id="register-form">
            {/* Role Toggle */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {(['student', 'admin'] as const).map(role => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setFormData(p => ({ ...p, role }))}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    border: `1.5px solid ${formData.role === role ? 'var(--primary)' : 'var(--border)'}`,
                    background: formData.role === role ? 'rgba(108,99,255,0.12)' : 'var(--bg-input)',
                    color: formData.role === role ? 'var(--primary-light)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '0.9rem',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8
                  }}
                  id={`role-${role}`}
                >
                  {role === 'student' ? '🎓' : '👨‍🏫'} {role === 'student' ? 'Student' : 'Educator'}
                </button>
              ))}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="fullName">Full Name</label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={formData.fullName}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <input
                id="reg-email"
                name="email"
                type="email"
                className="form-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password</label>
              <input
                id="reg-password"
                name="password"
                type="password"
                className="form-input"
                placeholder="Minimum 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-full"
              id="register-submit"
              disabled={loading}
            >
              {loading ? (
                <><div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Creating Account...</>
              ) : 'Create Account'}
            </button>
          </form>

          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 24 }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: 'var(--primary-light)', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="loading-overlay"><div className="spinner" /></div>}>
      <RegisterForm />
    </Suspense>
  )
}
