import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Start a quiz attempt
export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { quizId } = body

    // Check if there's already an in_progress attempt
    const { data: existing } = await supabase
      .from('quiz_attempts')
      .select('id')
      .eq('quiz_id', quizId)
      .eq('student_id', user.id)
      .eq('status', 'in_progress')
      .single()

    if (existing) {
      return NextResponse.json({ attemptId: existing.id, resumed: true })
    }

    // Create new attempt
    const { data: attempt, error } = await supabase
      .from('quiz_attempts')
      .insert({
        quiz_id: quizId,
        student_id: user.id,
        status: 'in_progress',
        started_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ attemptId: attempt.id, resumed: false })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

// Save individual answers
export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { attemptId, questionId, studentAnswer, maxScore } = body

    // Upsert answer
    const { error } = await supabase
      .from('attempt_answers')
      .upsert({
        attempt_id: attemptId,
        question_id: questionId,
        student_answer: studentAnswer,
        max_score: maxScore,
      }, { onConflict: 'attempt_id,question_id' })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
