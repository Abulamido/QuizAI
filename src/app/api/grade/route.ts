import { NextRequest, NextResponse } from 'next/server'
import { gradeOpenEndedAnswer, gradeEssay } from '@/lib/gemini'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth check
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { attemptId, quizId } = body

    if (!attemptId || !quizId) {
      return NextResponse.json({ error: 'Missing attemptId or quizId' }, { status: 400 })
    }

    // Fetch the attempt with answers
    const { data: attempt, error: attemptError } = await supabase
      .from('quiz_attempts')
      .select(`
        *,
        attempt_answers (
          *,
          questions (*)
        )
      `)
      .eq('id', attemptId)
      .single()

    if (attemptError || !attempt) {
      return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })
    }

    // Fetch quiz for subject context
    const { data: quiz } = await supabase
      .from('quizzes')
      .select('title, subject')
      .eq('id', quizId)
      .single()

    let totalScore = 0
    let totalPossible = 0
    const gradingResults: Record<string, unknown>[] = []

    // Grade each answer
    for (const answer of attempt.attempt_answers) {
      const question = answer.questions
      totalPossible += question.max_score

      if (answer.student_answer === null || answer.student_answer === '') {
        // No answer provided
        await supabase
          .from('attempt_answers')
          .update({
            score: 0,
            feedback: 'No answer provided.',
            strengths: [],
            improvements: ['Please attempt all questions.'],
            graded_by: 'ai',
          })
          .eq('id', answer.id)
        continue
      }

      if (question.question_type === 'mcq' || question.question_type === 'true_false') {
        // Auto-grade MCQ
        const correct = answer.student_answer === question.correct_answer
        const score = correct ? question.max_score : 0
        totalScore += score
        await supabase
          .from('attempt_answers')
          .update({
            score,
            is_correct: correct,
            feedback: correct ? 'Correct answer!' : `Incorrect. The correct answer is: ${question.correct_answer}`,
            graded_by: 'auto',
          })
          .eq('id', answer.id)

        gradingResults.push({ questionId: question.id, type: 'auto', score, maxScore: question.max_score })
      } else if (question.question_type === 'essay') {
        // AI grade essay
        const result = await gradeEssay(
          question.question_text,
          answer.student_answer,
          question.max_score,
          `${quiz?.subject || ''}: ${quiz?.title || ''}`
        )
        totalScore += result.score

        await supabase
          .from('attempt_answers')
          .update({
            score: result.score,
            feedback: result.feedback,
            strengths: result.strengths,
            improvements: result.improvements,
            graded_by: 'ai',
          })
          .eq('id', answer.id)

        gradingResults.push({ questionId: question.id, type: 'ai_essay', ...result })
      } else {
        // AI grade short answer
        const result = await gradeOpenEndedAnswer(
          question.question_text,
          answer.student_answer,
          question.model_answer || question.correct_answer || '',
          question.max_score,
          question.rubric
        )
        totalScore += result.score

        await supabase
          .from('attempt_answers')
          .update({
            score: result.score,
            feedback: result.feedback,
            strengths: result.strengths,
            improvements: result.improvements,
            graded_by: 'ai',
          })
          .eq('id', answer.id)

        gradingResults.push({ questionId: question.id, type: 'ai_short', ...result })
      }
    }

    // Calculate percentage and grade
    const percentage = totalPossible > 0 ? Math.round((totalScore / totalPossible) * 100) : 0
    let grade = 'F'
    if (percentage >= 90) grade = 'A'
    else if (percentage >= 80) grade = 'B'
    else if (percentage >= 70) grade = 'C'
    else if (percentage >= 60) grade = 'D'

    // Update attempt with final results
    const { error: updateError } = await supabase
      .from('quiz_attempts')
      .update({
        total_score: totalScore,
        total_possible: totalPossible,
        percentage,
        grade,
        status: 'graded',
        submitted_at: new Date().toISOString(),
      })
      .eq('id', attemptId)

    if (updateError) {
      return NextResponse.json({ error: 'Failed to save results' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      totalScore,
      totalPossible,
      percentage,
      grade,
      gradingResults,
    })
  } catch (error) {
    console.error('Grade submission error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
