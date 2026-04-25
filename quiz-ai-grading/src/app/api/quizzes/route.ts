import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('*, questions(count)')
      .eq('created_by', user.id)
      .order('created_at', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })

    return NextResponse.json({ quizzes })
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden. Only educators can create quizzes.' }, { status: 403 })
    }

    const body = await req.json()
    const { title, description, subject, duration_minutes, pass_mark, questions } = body

    if (!title || !questions || questions.length === 0) {
      return NextResponse.json({ error: 'Title and at least one question are required' }, { status: 400 })
    }

    // Calculate total marks
    const total_marks = questions.reduce((sum: number, q: { max_score: number }) => sum + (q.max_score || 1), 0)

    // Create quiz
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .insert({
        title,
        description,
        subject,
        created_by: user.id,
        duration_minutes: duration_minutes || 30,
        total_marks,
        pass_mark: pass_mark || 50,
        is_published: false,
      })
      .select()
      .single()

    if (quizError) return NextResponse.json({ error: quizError.message }, { status: 500 })

    // Insert questions
    const questionsToInsert = questions.map((q: Record<string, unknown>, index: number) => ({
      quiz_id: quiz.id,
      question_text: q.question_text,
      question_type: q.question_type,
      options: q.options || null,
      correct_answer: q.correct_answer || null,
      model_answer: q.model_answer || null,
      rubric: q.rubric || null,
      max_score: q.max_score || 1,
      order_index: index,
    }))

    const { error: qError } = await supabase
      .from('questions')
      .insert(questionsToInsert)

    if (qError) return NextResponse.json({ error: qError.message }, { status: 500 })

    return NextResponse.json({ quiz }, { status: 201 })
  } catch (error) {
    console.error('Create quiz error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
