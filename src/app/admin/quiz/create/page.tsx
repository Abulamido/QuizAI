'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type QuestionType = 'mcq' | 'short_answer' | 'essay' | 'true_false'

interface Option {
  id: string
  text: string
  isCorrect: boolean
}

interface QuestionDraft {
  id: string
  question_text: string
  question_type: QuestionType
  options: Option[]
  correct_answer: string
  model_answer: string
  rubric: string
  max_score: number
}

function genId() {
  return Math.random().toString(36).substring(2, 10)
}

function defaultQuestion(): QuestionDraft {
  return {
    id: genId(),
    question_text: '',
    question_type: 'mcq',
    options: [
      { id: genId(), text: '', isCorrect: false },
      { id: genId(), text: '', isCorrect: false },
      { id: genId(), text: '', isCorrect: false },
      { id: genId(), text: '', isCorrect: false },
    ],
    correct_answer: '',
    model_answer: '',
    rubric: '',
    max_score: 1,
  }
}

export default function CreateQuizPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2>(1)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [quizInfo, setQuizInfo] = useState({
    title: '',
    description: '',
    subject: '',
    duration_minutes: 30,
    pass_mark: 50,
  })

  const [questions, setQuestions] = useState<QuestionDraft[]>([defaultQuestion()])

  function updateQuizInfo(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setQuizInfo(p => ({ ...p, [e.target.name]: e.target.value }))
  }

  function addQuestion() {
    setQuestions(p => [...p, defaultQuestion()])
  }

  function removeQuestion(id: string) {
    setQuestions(p => p.filter(q => q.id !== id))
  }

  function updateQuestion(id: string, field: string, value: unknown) {
    setQuestions(p => p.map(q => q.id === id ? { ...q, [field]: value } : q))
  }

  function updateOption(qId: string, optId: string, text: string) {
    setQuestions(p => p.map(q => {
      if (q.id !== qId) return q
      return { ...q, options: q.options.map(o => o.id === optId ? { ...o, text } : o) }
    }))
  }

  function setCorrectOption(qId: string, optId: string) {
    setQuestions(p => p.map(q => {
      if (q.id !== qId) return q
      const correct = q.options.find(o => o.id === optId)?.text || ''
      return {
        ...q,
        correct_answer: correct,
        options: q.options.map(o => ({ ...o, isCorrect: o.id === optId }))
      }
    }))
  }

  function addOption(qId: string) {
    setQuestions(p => p.map(q => {
      if (q.id !== qId) return q
      return { ...q, options: [...q.options, { id: genId(), text: '', isCorrect: false }] }
    }))
  }

  function removeOption(qId: string, optId: string) {
    setQuestions(p => p.map(q => {
      if (q.id !== qId) return q
      return { ...q, options: q.options.filter(o => o.id !== optId) }
    }))
  }

  async function handleSubmit() {
    setError('')

    // Validate
    if (!quizInfo.title.trim()) { setError('Quiz title is required'); return }
    for (const q of questions) {
      if (!q.question_text.trim()) { setError('All questions must have text'); return }
      if (q.question_type === 'mcq' && !q.correct_answer) { setError('MCQ questions need a correct answer selected'); return }
    }

    setSaving(true)

    const payload = {
      ...quizInfo,
      duration_minutes: Number(quizInfo.duration_minutes),
      pass_mark: Number(quizInfo.pass_mark),
      questions: questions.map(q => ({
        question_text: q.question_text,
        question_type: q.question_type,
        options: q.question_type === 'mcq' ? q.options : null,
        correct_answer: q.correct_answer || null,
        model_answer: q.model_answer || null,
        rubric: q.rubric || null,
        max_score: Number(q.max_score) || 1,
      })),
    }

    const res = await fetch('/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await res.json()
    setSaving(false)

    if (!res.ok) { setError(data.error || 'Failed to create quiz'); return }

    router.push('/admin/dashboard')
  }

  const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F']

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-inner">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Link href="/admin/dashboard" className="btn btn-ghost btn-sm">← Back</Link>
            <div className="navbar-brand">
              <div className="navbar-logo">Q</div>
              <span className="navbar-title">Create Quiz</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Step {step} of 2
            </span>
            {step === 2 && (
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
                disabled={saving}
                id="save-quiz-btn"
              >
                {saving ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : '💾 Save Quiz'}
              </button>
            )}
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 760, margin: '100px auto 60px', padding: '0 24px' }}>
        {/* STEPS INDICATOR */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 40, alignItems: 'center' }}>
          {[{ n: 1, label: 'Quiz Info' }, { n: 2, label: 'Questions' }].map((s, i) => (
            <div key={s.n} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: step >= s.n ? 'var(--gradient-primary)' : 'var(--bg-card)',
                border: step >= s.n ? 'none' : '1.5px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 700,
                color: step >= s.n ? 'white' : 'var(--text-muted)',
              }}>
                {s.n}
              </div>
              <span style={{ fontSize: '0.9rem', color: step === s.n ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: step === s.n ? 600 : 400 }}>
                {s.label}
              </span>
              {i < 1 && <div style={{ width: 40, height: 1, background: 'var(--border)', margin: '0 8px' }} />}
            </div>
          ))}
        </div>

        {error && (
          <div style={{
            background: 'var(--error-bg)', border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 'var(--radius-md)', padding: '12px 16px',
            color: 'var(--error)', marginBottom: 24, fontSize: '0.9rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* STEP 1: QUIZ INFO */}
        {step === 1 && (
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            <h2 style={{ marginBottom: 0 }}>Quiz Details</h2>

            <div className="form-group">
              <label className="form-label" htmlFor="quiz-title">Quiz Title *</label>
              <input id="quiz-title" name="title" className="form-input" placeholder="e.g. Introduction to Programming - Chapter 5"
                value={quizInfo.title} onChange={updateQuizInfo} required />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="quiz-subject">Subject</label>
              <input id="quiz-subject" name="subject" className="form-input" placeholder="e.g. Computer Science"
                value={quizInfo.subject} onChange={updateQuizInfo} />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="quiz-description">Description</label>
              <textarea id="quiz-description" name="description" className="form-input"
                placeholder="Brief description of what this quiz covers..."
                rows={3} value={quizInfo.description} onChange={updateQuizInfo} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="quiz-duration">Duration (minutes)</label>
                <input id="quiz-duration" name="duration_minutes" type="number" min={5} max={300}
                  className="form-input" value={quizInfo.duration_minutes} onChange={updateQuizInfo} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="quiz-pass">Pass Mark (%)</label>
                <input id="quiz-pass" name="pass_mark" type="number" min={1} max={100}
                  className="form-input" value={quizInfo.pass_mark} onChange={updateQuizInfo} />
              </div>
            </div>

            <button onClick={() => setStep(2)} className="btn btn-primary" id="next-step-btn">
              Next: Add Questions →
            </button>
          </div>
        )}

        {/* STEP 2: QUESTIONS */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <h2 style={{ marginBottom: 4 }}>Questions</h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                  {questions.length} question{questions.length !== 1 ? 's' : ''} · {questions.reduce((s, q) => s + Number(q.max_score), 0)} total marks
                </p>
              </div>
              <button onClick={() => setStep(1)} className="btn btn-ghost btn-sm">← Edit Info</button>
            </div>

            {questions.map((q, qi) => (
              <div key={q.id} className="glass-card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                  <span className="badge badge-primary">Question {qi + 1}</span>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <label className="form-label" style={{ whiteSpace: 'nowrap', marginBottom: 0 }}>Marks:</label>
                      <input type="number" min={1} max={100} className="form-input"
                        style={{ width: 70, padding: '6px 10px' }}
                        value={q.max_score}
                        onChange={e => updateQuestion(q.id, 'max_score', e.target.value)}
                        id={`marks-${q.id}`}
                      />
                    </div>
                    {questions.length > 1 && (
                      <button onClick={() => removeQuestion(q.id)} className="btn btn-danger btn-sm btn-icon" title="Remove question">🗑️</button>
                    )}
                  </div>
                </div>

                {/* Question Text */}
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label">Question Text *</label>
                  <textarea className="form-input" rows={3}
                    placeholder="Enter your question here..."
                    value={q.question_text}
                    onChange={e => updateQuestion(q.id, 'question_text', e.target.value)}
                    id={`question-text-${q.id}`}
                  />
                </div>

                {/* Question Type */}
                <div className="form-group" style={{ marginBottom: 20 }}>
                  <label className="form-label">Question Type</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {[
                      { type: 'mcq', label: '🔘 MCQ', desc: 'Multiple Choice' },
                      { type: 'true_false', label: '✓/✗ T/F', desc: 'True/False' },
                      { type: 'short_answer', label: '✏️ Short', desc: 'Short Answer' },
                      { type: 'essay', label: '📄 Essay', desc: 'Essay' },
                    ].map(t => (
                      <button
                        key={t.type}
                        type="button"
                        onClick={() => updateQuestion(q.id, 'question_type', t.type)}
                        style={{
                          padding: '10px 8px',
                          borderRadius: 'var(--radius-md)',
                          border: `1.5px solid ${q.question_type === t.type ? 'var(--primary)' : 'var(--border)'}`,
                          background: q.question_type === t.type ? 'rgba(108,99,255,0.12)' : 'var(--bg-input)',
                          color: q.question_type === t.type ? 'var(--primary-light)' : 'var(--text-muted)',
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          transition: 'all 0.2s',
                          textAlign: 'center',
                        }}
                        id={`type-${t.type}-${q.id}`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* MCQ Options */}
                {q.question_type === 'mcq' && (
                  <div>
                    <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Options (click radio to mark correct)</label>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {q.options.map((opt, oi) => (
                        <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <button
                            type="button"
                            onClick={() => setCorrectOption(q.id, opt.id)}
                            style={{
                              width: 32, height: 32, borderRadius: '50%',
                              border: `2px solid ${opt.isCorrect ? 'var(--success)' : 'var(--border)'}`,
                              background: opt.isCorrect ? 'var(--success)' : 'transparent',
                              cursor: 'pointer',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '0.75rem', fontWeight: 700,
                              color: opt.isCorrect ? 'white' : 'var(--text-muted)',
                              flexShrink: 0,
                            }}
                            id={`correct-${opt.id}`}
                          >
                            {OPTION_LETTERS[oi]}
                          </button>
                          <input
                            className="form-input"
                            placeholder={`Option ${OPTION_LETTERS[oi]}`}
                            value={opt.text}
                            onChange={e => updateOption(q.id, opt.id, e.target.value)}
                            id={`option-text-${opt.id}`}
                          />
                          {q.options.length > 2 && (
                            <button
                              type="button"
                              onClick={() => removeOption(q.id, opt.id)}
                              className="btn btn-ghost btn-sm btn-icon"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    {q.options.length < 6 && (
                      <button onClick={() => addOption(q.id)} className="btn btn-ghost btn-sm" style={{ marginTop: 12 }}>
                        + Add Option
                      </button>
                    )}
                  </div>
                )}

                {/* True/False */}
                {q.question_type === 'true_false' && (
                  <div className="form-group">
                    <label className="form-label">Correct Answer</label>
                    <div style={{ display: 'flex', gap: 12 }}>
                      {['True', 'False'].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => updateQuestion(q.id, 'correct_answer', val)}
                          className={`btn ${q.correct_answer === val ? (val === 'True' ? 'btn-success' : 'btn-danger') : 'btn-secondary'}`}
                          style={{ flex: 1 }}
                          id={`tf-${val.toLowerCase()}-${q.id}`}
                        >
                          {val === 'True' ? '✓ True' : '✗ False'}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Short Answer / Essay */}
                {(q.question_type === 'short_answer' || q.question_type === 'essay') && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    <div className="form-group">
                      <label className="form-label">Model Answer (for AI grading reference)</label>
                      <textarea className="form-input" rows={q.question_type === 'essay' ? 5 : 3}
                        placeholder="Enter the expected/model answer here. The AI will use this as a reference..."
                        value={q.model_answer}
                        onChange={e => updateQuestion(q.id, 'model_answer', e.target.value)}
                        id={`model-answer-${q.id}`}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Grading Rubric (optional)</label>
                      <textarea className="form-input" rows={2}
                        placeholder="e.g. Award 2 marks for mentioning X, 1 mark for Y..."
                        value={q.rubric}
                        onChange={e => updateQuestion(q.id, 'rubric', e.target.value)}
                        id={`rubric-${q.id}`}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button onClick={addQuestion} className="btn btn-secondary" style={{ flex: 1 }} id="add-question-btn">
                + Add Question
              </button>
              <button
                onClick={handleSubmit}
                className="btn btn-primary"
                style={{ flex: 1 }}
                disabled={saving}
                id="create-quiz-submit"
              >
                {saving ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving...</> : '💾 Save Quiz'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
