import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export interface GradingResult {
  score: number
  maxScore: number
  percentage: number
  feedback: string
  strengths: string[]
  improvements: string[]
  grade: string
}

function getLetterGrade(percentage: number): string {
  if (percentage >= 90) return 'A'
  if (percentage >= 80) return 'B'
  if (percentage >= 70) return 'C'
  if (percentage >= 60) return 'D'
  return 'F'
}

export async function gradeOpenEndedAnswer(
  question: string,
  studentAnswer: string,
  modelAnswer: string,
  maxScore: number,
  rubric?: string
): Promise<GradingResult> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_NONE,
      },
    ],
  })

  const prompt = `You are an expert academic grader. Grade the following student answer objectively and fairly.

**Question:** ${question}

**Model/Expected Answer:** ${modelAnswer}

${rubric ? `**Grading Rubric:** ${rubric}` : ''}

**Student's Answer:** ${studentAnswer}

**Maximum Score:** ${maxScore} marks

Please evaluate the student's answer and respond ONLY with a valid JSON object in this exact format:
{
  "score": <number between 0 and ${maxScore}>,
  "feedback": "<2-3 sentence overall feedback>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}

Grading criteria:
- Accuracy and correctness of information
- Completeness of the answer
- Clarity and coherence of expression
- Use of relevant examples or evidence
- Understanding of key concepts

Be fair, constructive, and specific in your feedback.`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found in response')

    const parsed = JSON.parse(jsonMatch[0])
    const score = Math.min(Math.max(Number(parsed.score) || 0, 0), maxScore)
    const percentage = Math.round((score / maxScore) * 100)

    return {
      score,
      maxScore,
      percentage,
      feedback: parsed.feedback || 'No feedback provided.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      grade: getLetterGrade(percentage),
    }
  } catch (error) {
    console.error('Gemini grading error:', error)
    return {
      score: 0,
      maxScore,
      percentage: 0,
      feedback: 'AI grading failed. Please request manual grading.',
      strengths: [],
      improvements: [],
      grade: 'N/A',
    }
  }
}

export async function gradeEssay(
  question: string,
  studentAnswer: string,
  maxScore: number,
  subjectContext?: string
): Promise<GradingResult> {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

  const prompt = `You are an expert academic essay grader with decades of experience. 
${subjectContext ? `Subject Context: ${subjectContext}` : ''}

**Essay Question:** ${question}
**Student Essay:** ${studentAnswer}
**Maximum Score:** ${maxScore} marks

Grade this essay based on:
1. Content & Knowledge (40%): Relevant and accurate information
2. Structure & Organization (20%): Clear introduction, body, conclusion
3. Critical Analysis (20%): Depth of analysis and argument
4. Language & Expression (20%): Clarity, grammar, vocabulary

Respond ONLY with valid JSON:
{
  "score": <number between 0 and ${maxScore}>,
  "feedback": "<comprehensive 3-4 sentence feedback>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"]
}`

  try {
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('No JSON found')

    const parsed = JSON.parse(jsonMatch[0])
    const score = Math.min(Math.max(Number(parsed.score) || 0, 0), maxScore)
    const percentage = Math.round((score / maxScore) * 100)

    return {
      score,
      maxScore,
      percentage,
      feedback: parsed.feedback || 'No feedback provided.',
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      grade: getLetterGrade(percentage),
    }
  } catch (error) {
    console.error('Essay grading error:', error)
    return {
      score: 0,
      maxScore,
      percentage: 0,
      feedback: 'AI grading failed. Please contact your instructor.',
      strengths: [],
      improvements: [],
      grade: 'N/A',
    }
  }
}
