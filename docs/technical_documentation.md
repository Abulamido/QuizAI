# TECHNICAL DOCUMENTATION
## QuizAI — Online Quiz with AI Grading System

---

## 1. System Architecture Overview

QuizAI is a full-stack web application built on a three-tier architecture:
- **Frontend**: Next.js 14 (App Router) with React and TypeScript
- **Backend**: Next.js API Routes (server-side Node.js runtime)
- **Database**: Supabase (managed PostgreSQL with RLS)
- **AI Service**: Google Gemini 1.5 Flash via REST API

---

## 2. Directory Structure

```
quiz-ai-grading/
├── src/
│   ├── app/
│   │   ├── globals.css                 Design system + all CSS
│   │   ├── layout.tsx                  Root layout + metadata
│   │   ├── page.tsx                    Landing page
│   │   │
│   │   ├── login/page.tsx              Email/password login
│   │   ├── register/page.tsx           Registration (role selection)
│   │   │
│   │   ├── admin/
│   │   │   ├── dashboard/page.tsx      Educator dashboard
│   │   │   └── quiz/
│   │   │       ├── create/page.tsx     2-step quiz builder
│   │   │       └── [id]/results/
│   │   │           └── page.tsx        Class results for a quiz
│   │   │
│   │   ├── student/
│   │   │   └── dashboard/page.tsx      Student dashboard
│   │   │
│   │   ├── quiz/
│   │   │   └── [id]/
│   │   │       ├── page.tsx            Quiz-taking interface
│   │   │       └── results/page.tsx    Student results + AI feedback
│   │   │
│   │   └── api/
│   │       ├── grade/route.ts          POST: Trigger AI grading
│   │       ├── quizzes/
│   │       │   ├── route.ts            GET/POST: Quiz CRUD
│   │       │   └── [id]/route.ts       PATCH/DELETE: Quiz update
│   │       └── attempts/route.ts       POST/PATCH: Attempt management
│   │
│   └── lib/
│       ├── gemini.ts                   Gemini AI grading functions
│       ├── types.ts                    Shared TypeScript types
│       └── supabase/
│           ├── client.ts               Browser Supabase client
│           └── server.ts               Server Supabase client
│
├── supabase/
│   └── schema.sql                      Full DB schema + RLS policies
│
├── .env.local                          Environment variables (not committed)
├── README.md                           Setup guide
└── package.json
```

---

## 3. API Reference

### 3.1 POST /api/grade

Triggers AI grading for a completed quiz attempt.

**Auth Required:** Yes (JWT in cookies)

**Request Body:**
```json
{
  "attemptId": "uuid",
  "quizId": "uuid"
}
```

**Process:**
1. Validates auth
2. Fetches attempt + answers + questions from Supabase
3. Routes each answer:
   - MCQ/T-F → deterministic comparison
   - Short answer → `gradeOpenEndedAnswer()` via Gemini
   - Essay → `gradeEssay()` via Gemini
4. Saves per-question scores + feedback
5. Calculates total score, percentage, grade
6. Updates attempt to `status: 'graded'`

**Response:**
```json
{
  "success": true,
  "totalScore": 18,
  "totalPossible": 25,
  "percentage": 72,
  "grade": "C",
  "gradingResults": [...]
}
```

---

### 3.2 GET /api/quizzes

Returns all quizzes created by the authenticated educator.

**Auth Required:** Yes (must have role = 'admin')

**Response:**
```json
{
  "quizzes": [
    {
      "id": "uuid",
      "title": "Introduction to Algorithms",
      "subject": "Computer Science",
      "is_published": true,
      "total_marks": 50,
      "duration_minutes": 45,
      "created_at": "2025-04-20T10:00:00Z"
    }
  ]
}
```

---

### 3.3 POST /api/quizzes

Creates a new quiz with questions.

**Auth Required:** Yes (admin only)

**Request Body:**
```json
{
  "title": "Data Structures Quiz",
  "description": "Tests understanding of arrays, linked lists, and trees",
  "subject": "Computer Science",
  "duration_minutes": 30,
  "pass_mark": 60,
  "questions": [
    {
      "question_text": "What is the time complexity of binary search?",
      "question_type": "mcq",
      "options": [
        {"id": "a1", "text": "O(n)", "isCorrect": false},
        {"id": "a2", "text": "O(log n)", "isCorrect": true},
        {"id": "a3", "text": "O(n²)", "isCorrect": false},
        {"id": "a4", "text": "O(1)", "isCorrect": false}
      ],
      "correct_answer": "O(log n)",
      "max_score": 2
    },
    {
      "question_text": "Explain the concept of recursion with an example.",
      "question_type": "short_answer",
      "model_answer": "Recursion is a programming technique where a function calls itself...",
      "rubric": "Award 3 marks for correct definition, 2 marks for valid example",
      "max_score": 5
    }
  ]
}
```

**Response:**
```json
{
  "quiz": {
    "id": "newly-created-uuid",
    "title": "Data Structures Quiz",
    ...
  }
}
```

---

### 3.4 PATCH /api/quizzes/:id

Publishes or unpublishes a quiz.

**Body:** `{ "is_published": true | false }`

---

### 3.5 DELETE /api/quizzes/:id

Deletes a quiz and all associated questions and attempts.

---

### 3.6 POST /api/attempts

Starts a new quiz attempt or resumes an existing in-progress one.

**Body:** `{ "quizId": "uuid" }`

**Response:** `{ "attemptId": "uuid", "resumed": false }`

---

### 3.7 PATCH /api/attempts

Saves a single answer (called as student navigates questions).

**Body:**
```json
{
  "attemptId": "uuid",
  "questionId": "uuid",
  "studentAnswer": "The answer text or selected option",
  "maxScore": 5
}
```

---

## 4. AI Grading Functions

### 4.1 `gradeOpenEndedAnswer(question, studentAnswer, modelAnswer, maxScore, rubric?)`

Located in `src/lib/gemini.ts`.

Grades short-answer responses using Gemini with reference to a model answer and optional rubric.

**Returns:** `GradingResult`
```typescript
interface GradingResult {
  score: number          // Awarded score (0 to maxScore)
  maxScore: number
  percentage: number     // 0-100
  feedback: string       // 2-3 sentence overall feedback
  strengths: string[]    // List of positive aspects
  improvements: string[] // List of areas to work on
  grade: string          // 'A' | 'B' | 'C' | 'D' | 'F'
}
```

### 4.2 `gradeEssay(question, studentAnswer, maxScore, subjectContext?)`

Grades essay responses using a four-criterion rubric (Content 40%, Structure 20%, Analysis 20%, Language 20%).

---

## 5. Database Schema Summary

See `supabase/schema.sql` for complete SQL.

### Tables

| Table | Purpose |
|-------|---------|
| `profiles` | User accounts extending Supabase auth |
| `quizzes` | Quiz configurations |
| `questions` | Per-quiz questions |
| `quiz_attempts` | Student attempt records |
| `attempt_answers` | Per-question answers + AI scores |

### Key Constraints

- `quiz_attempts`: `status` ∈ ('in_progress', 'submitted', 'graded')
- `questions`: `question_type` ∈ ('mcq', 'short_answer', 'essay', 'true_false')
- `attempt_answers`: UNIQUE(attempt_id, question_id) — one answer per question per attempt
- `profiles`: `role` ∈ ('student', 'admin')

---

## 6. Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `GEMINI_API_KEY` | Yes | Google AI Studio API key |

---

## 7. Grading Letter Grade Scale

| Percentage | Grade |
|-----------|-------|
| 90–100% | A |
| 80–89% | B |
| 70–79% | C |
| 60–69% | D |
| 0–59% | F |

---

## 8. Running the System Locally

```bash
# 1. Install dependencies
npm install

# 2. Configure .env.local (see Section 6)

# 3. Run Supabase schema (via Supabase SQL Editor)
# Open supabase/schema.sql and execute in Supabase dashboard

# 4. Start development server
npm run dev

# 5. Open in browser
# http://localhost:3000
```

---

## 9. User Manual Summary

### For Educators

1. **Register** at `/register` → select "Educator"
2. **Login** at `/login`
3. **Create Quiz**: Dashboard → "+ New Quiz" → fill details → add questions → Save
4. **Publish**: Click "Publish" on any saved quiz
5. **View Results**: Click "Results" on a published quiz
6. **Analytics**: Dashboard sidebar → "Grade Reports"

### For Students

1. **Register** at `/register` → select "Student"
2. **Login** at `/login`
3. **Take a Quiz**: Dashboard → click any quiz → "Take Quiz →"
4. **Answer Questions**: Select options or type responses
5. **Submit**: Click "Submit Quiz" or let timer auto-submit
6. **View Results**: After submission → results page with AI feedback
7. **History**: Dashboard → "My Results"
