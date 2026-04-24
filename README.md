# QuizAI — Online Quiz with AI Grading

> A full-stack intelligent assessment platform built with Next.js, Supabase, and Google Gemini AI.
> Developed as a Final Year Project in Computer Science.

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🤖 AI Grading | Google Gemini grades open-ended answers with scores + feedback |
| ⚡ Auto MCQ Grading | Instant scoring for multiple choice and true/false |
| ⏱️ Timed Quizzes | Countdown timer with auto-submit |
| 📊 Analytics | Class performance dashboards |
| 🔒 Role-Based Auth | Student and Educator roles via Supabase Auth |
| 💬 Detailed Feedback | Strengths + improvements per question |

---

## 🏗️ Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Vanilla CSS
- **Backend**: Next.js API Routes
- **Database**: Supabase (PostgreSQL) with Row Level Security
- **AI Engine**: Google Gemini 1.5 Flash
- **Auth**: Supabase Auth

---

## ⚙️ Setup Guide

### Prerequisites
- Node.js 18+
- Supabase account (free tier works)
- Google AI Studio API key (free)

### Step 1: Clone & Install

```bash
cd "c:/Users/DELL/Online Grading System/quiz-ai-grading"
npm install
```

### Step 2: Set Up Supabase

1. Go to [https://supabase.com](https://supabase.com) and create a free project
2. In the Supabase dashboard → **SQL Editor**, paste and run the contents of `supabase/schema.sql`
3. Copy your **Project URL** and **Anon Key** from Settings → API

### Step 3: Get Gemini API Key

1. Go to [https://aistudio.google.com](https://aistudio.google.com)
2. Click **Get API Key** → Create API Key
3. Copy the key

### Step 4: Configure Environment

Edit `.env.local` with your credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

### Step 5: Run the Application

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📂 Project Structure

```
quiz-ai-grading/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing page
│   │   ├── login/                      # Auth pages
│   │   ├── register/
│   │   ├── admin/
│   │   │   ├── dashboard/              # Educator dashboard
│   │   │   └── quiz/
│   │   │       ├── create/             # Quiz builder
│   │   │       └── [id]/results/       # Class results
│   │   ├── student/
│   │   │   └── dashboard/              # Student dashboard
│   │   ├── quiz/
│   │   │   └── [id]/
│   │   │       ├── page.tsx            # Take quiz
│   │   │       └── results/            # View results + AI feedback
│   │   └── api/
│   │       ├── grade/                  # POST: AI grading endpoint
│   │       ├── quizzes/                # CRUD quiz management
│   │       └── attempts/               # Attempt lifecycle
│   └── lib/
│       ├── gemini.ts                   # AI grading engine
│       ├── types.ts                    # TypeScript types
│       └── supabase/
│           ├── client.ts               # Browser Supabase client
│           └── server.ts               # Server Supabase client
├── supabase/
│   └── schema.sql                      # Full DB schema + RLS policies
└── .env.local                          # Environment variables
```

---

## 🗄️ Database Schema

```
profiles          → User accounts (extends auth.users)
quizzes           → Quiz metadata
questions         → Per-quiz questions (MCQ, short, essay, T/F)
quiz_attempts     → Student attempt records
attempt_answers   → Per-question student answers + AI scores
```

---

## 🔐 User Roles

| Role | Capabilities |
|------|-------------|
| **Educator (Admin)** | Create/edit/publish quizzes, view all results, manage students |
| **Student** | Take published quizzes, view own results + AI feedback |

---

## 🤖 AI Grading Flow

1. Student submits quiz
2. API `/api/grade` is called with `attemptId`
3. For each answer:
   - **MCQ/T-F**: Compared to `correct_answer` → auto-graded
   - **Short Answer**: Sent to Gemini with `model_answer` + `rubric` → scored + feedback
   - **Essay**: Sent to Gemini with 4-criteria rubric → scored + feedback
4. Results saved to `attempt_answers`
5. Student redirected to results page

---

## 📝 Creating Your First Quiz (Educator)

1. Register as **Educator**
2. Go to Dashboard → **Create Quiz**
3. Fill quiz details (title, subject, duration, pass mark)
4. Add questions:
   - Select type: MCQ / True-False / Short Answer / Essay
   - For MCQ: add options, click correct one
   - For Short/Essay: add model answer and rubric
5. Save → Publish the quiz
6. Students can now see and attempt it

---

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/quizzes` | List educator's quizzes |
| POST | `/api/quizzes` | Create new quiz |
| PATCH | `/api/quizzes/:id` | Publish/unpublish quiz |
| DELETE | `/api/quizzes/:id` | Delete quiz |
| POST | `/api/attempts` | Start quiz attempt |
| PATCH | `/api/attempts` | Save answer |
| POST | `/api/grade` | Grade all answers (triggers AI) |

---

## 🎓 Academic Context

This project was developed as a Final Year Project (FYP) for the Bachelor of Science in Computer Science degree programme. It demonstrates the practical application of:

- Artificial Intelligence (Natural Language Processing)
- Web Development (Full-Stack)
- Database Design and Management
- Software Engineering Principles (Agile SDLC)
- Human-Computer Interaction

---

## 📜 License

MIT — Free to use for educational purposes.
