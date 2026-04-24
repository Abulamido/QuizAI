'use client'
import Link from 'next/link'
import { useEffect, useRef } from 'react'

export default function LandingPage() {
  const glow1 = useRef<HTMLDivElement>(null)
  const glow2 = useRef<HTMLDivElement>(null)

  return (
    <main>
      {/* NAV */}
      <nav className="navbar">
        <div className="navbar-inner">
          <Link href="/" className="navbar-brand">
            <div className="navbar-logo">Q</div>
            <span className="navbar-title">QuizAI</span>
          </Link>
          <div className="navbar-nav">
            <Link href="#features" className="nav-link">Features</Link>
            <Link href="#how" className="nav-link">How it Works</Link>
            <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div
          ref={glow1}
          className="hero-bg-glow"
          style={{ width: 600, height: 600, background: '#6c63ff', top: -200, left: -200 }}
        />
        <div
          ref={glow2}
          className="hero-bg-glow"
          style={{ width: 500, height: 500, background: '#9b59b6', bottom: -200, right: -100, animationDelay: '-4s' }}
        />

        <div className="hero-content">
          <div className="hero-badge">
            <span>✨</span> Powered by Google Gemini AI
          </div>
          <h1 className="hero-title">
            Smarter Quizzes,<br />Instant AI Grading
          </h1>
          <p className="hero-subtitle">
            Create, take, and grade quizzes with the power of artificial intelligence.
            Get personalized feedback on every answer — not just your score.
          </p>
          <div className="hero-buttons">
            <Link href="/register" className="btn btn-primary btn-lg">
              Start for Free →
            </Link>
            <Link href="/login" className="btn btn-secondary btn-lg">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span className="badge badge-primary">Features</span>
          </div>
          <h2 style={{ textAlign: 'center', marginBottom: 8 }}>
            Everything You Need for Smart Assessment
          </h2>
          <p style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
            From multiple choice to essay questions — our AI grades everything and gives students the feedback they deserve.
          </p>

          <div className="features-grid">
            {features.map((f, i) => (
              <div className="feature-card" key={i} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon" style={{ background: f.bg }}>
                  <span style={{ fontSize: '1.8rem' }}>{f.icon}</span>
                </div>
                <h4 className="feature-title">{f.title}</h4>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 24px', background: 'var(--bg-surface)' }} id="how">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <span className="badge badge-primary">Process</span>
          </div>
          <h2 style={{ textAlign: 'center', marginBottom: 60 }}>
            How QuizAI Works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {steps.map((s, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  background: 'var(--gradient-primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 20px',
                  boxShadow: 'var(--shadow-primary)',
                  fontSize: '1.2rem', fontWeight: 800, color: 'white',
                  fontFamily: 'Outfit, sans-serif'
                }}>
                  {i + 1}
                </div>
                <h4 style={{ marginBottom: 8, color: 'var(--text-primary)' }}>{s.title}</h4>
                <p style={{ fontSize: '0.9rem' }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center' }}>
        <div className="container">
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '80px 40px',
            maxWidth: 700,
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(circle at center, rgba(108,99,255,0.08) 0%, transparent 70%)'
            }} />
            <h2 style={{ marginBottom: 16, position: 'relative' }}>
              Ready to Transform Your Assessments?
            </h2>
            <p style={{ maxWidth: 480, margin: '0 auto 40px', position: 'relative' }}>
              Join thousands of educators and students already using QuizAI for smarter, fairer grading.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', position: 'relative' }}>
              <Link href="/register?role=admin" className="btn btn-primary btn-lg">
                I'm an Educator
              </Link>
              <Link href="/register?role=student" className="btn btn-secondary btn-lg">
                I'm a Student
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '40px 24px',
        borderTop: '1px solid var(--border)',
        textAlign: 'center',
        color: 'var(--text-muted)',
        fontSize: '0.875rem'
      }}>
        <div className="container">
          <p>© 2025 QuizAI. Built for the Future of Education. Powered by Google Gemini.</p>
        </div>
      </footer>
    </main>
  )
}

const features = [
  {
    icon: '🤖',
    bg: 'rgba(108,99,255,0.15)',
    title: 'AI-Powered Grading',
    desc: 'Google Gemini grades open-ended answers with human-level accuracy and provides detailed constructive feedback.'
  },
  {
    icon: '⚡',
    bg: 'rgba(0,212,170,0.15)',
    title: 'Instant Results',
    desc: 'Students receive scores and personalized feedback immediately after submission. No waiting for manual grading.'
  },
  {
    icon: '📊',
    bg: 'rgba(245,158,11,0.15)',
    title: 'Analytics Dashboard',
    desc: 'Track class performance, identify learning gaps, and monitor student progress with rich visual analytics.'
  },
  {
    icon: '🎯',
    bg: 'rgba(239,68,68,0.15)',
    title: 'Multi-Format Questions',
    desc: 'Create MCQ, true/false, short answer, and essay questions. All graded automatically by AI.'
  },
  {
    icon: '⏱️',
    bg: 'rgba(59,130,246,0.15)',
    title: 'Timed Assessments',
    desc: 'Set countdown timers for exams. Auto-submit when time expires to maintain academic integrity.'
  },
  {
    icon: '🔒',
    bg: 'rgba(16,185,129,0.15)',
    title: 'Secure & Fair',
    desc: 'Role-based access control ensures students can only see their own results and admins manage everything.'
  },
]

const steps = [
  { title: 'Create a Quiz', desc: 'Educators create quizzes with mixed question types, set time limits and marks.' },
  { title: 'Students Attempt', desc: 'Students log in and take the quiz within the allotted time window.' },
  { title: 'AI Grades Instantly', desc: 'Gemini AI evaluates every answer and assigns scores with detailed feedback.' },
  { title: 'Review Results', desc: 'Both students and educators view comprehensive reports and analytics.' },
]
