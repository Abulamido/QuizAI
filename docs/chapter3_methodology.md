# CHAPTER THREE: METHODOLOGY

## Online Quiz System with Artificial Intelligence Grading

---

## 3.1 Introduction

This chapter describes the research methodology, system development approach, analytical frameworks, and technical design decisions that guided the creation of the QuizAI system. It presents the system development life cycle model adopted, the system analysis (including requirement specification and use-case modelling), the system design (including architecture, database schema, data flow diagrams, and entity-relationship diagram), and an account of the tools and technologies employed.

---

## 3.2 Research Methodology

### 3.2.1 Nature of the Research

This project is classified as **applied computing research** — its primary aim is to design and construct an artefact (the QuizAI system) that solves a real-world problem (the limitations of existing online assessment systems with respect to AI grading). The research employs a **Design Science Research** (Hevner et al., 2004) paradigm, which holds that the creation and evaluation of an IT artefact constitutes valid, rigorous research when the artefact addresses a significant problem, is properly evaluated, and its design process is communicated clearly.

### 3.2.2 System Development Methodology: Agile (Scrum)

The system was developed using an **Agile Software Development** methodology, particularly the **Scrum** framework (Schwaber & Sutherland, 2020). Agile was chosen over traditional sequential models (Waterfall) for the following reasons:

**Iterative Development:** Rather than attempting to define all requirements upfront, Agile allows requirements to evolve as the system is built and tested. This was essential given the exploratory nature of integrating an LLM grading engine, whose behaviour needed to be iteratively refined.

**Incremental Delivery:** Working software was produced at the end of each sprint, allowing early testing and feedback integration.

**Flexibility:** Emerging insights — for example, the optimal prompt structure for Gemini grading, or the most effective way to present AI feedback to students — could be incorporated without disrupting the overall project plan.

**Suitability for Solo Development:** Scrum's lightweight ceremonies (daily standup adapted to a self-check, sprint review with supervisor) are manageable for a single developer.

The project was organised into 6 two-week sprints:

| Sprint | Duration | Focus |
|--------|----------|-------|
| 1 | Weeks 1–2 | Requirements analysis, technology research, Supabase setup |
| 2 | Weeks 3–4 | Database schema design, authentication system |
| 3 | Weeks 5–6 | Quiz builder (admin), quiz listing |
| 4 | Weeks 7–8 | Quiz-taking interface, timer, auto-save |
| 5 | Weeks 9–10 | AI grading engine integration, results page |
| 6 | Weeks 11–12 | Analytics dashboards, testing, documentation |

---

## 3.3 System Analysis

### 3.3.1 Requirements Gathering

Requirements were gathered through:

1. **Literature review**: As documented in Chapter 2, existing systems' limitations informed functional requirements.
2. **Informal stakeholder consultation**: Discussions with fellow students (prospective users) and academic staff members identified usability priorities and desired features.
3. **Competitive analysis**: Hands-on evaluation of Google Forms, Kahoot, and Moodle informed requirements.

### 3.3.2 Functional Requirements

| FR# | Requirement | Priority |
|-----|-------------|---------|
| FR-01 | System shall support registration and login via email/password | High |
| FR-02 | System shall support two user roles: Educator and Student | High |
| FR-03 | Educators shall be able to create quizzes with title, subject, duration, pass mark | High |
| FR-04 | Educators shall be able to add MCQ, True/False, Short Answer, and Essay questions | High |
| FR-05 | Educators shall be able to publish or unpublish quizzes | High |
| FR-06 | Students shall see only published quizzes | High |
| FR-07 | Students shall be able to start a quiz and record their answers | High |
| FR-08 | System shall display a real-time countdown timer during quiz | High |
| FR-09 | System shall auto-submit the quiz when timer expires | High |
| FR-10 | System shall auto-save student answers as they progress | Medium |
| FR-11 | MCQ and T/F answers shall be graded instantly on submission | High |
| FR-12 | Short answer and essay responses shall be graded by Gemini AI | High |
| FR-13 | AI grading shall return: score, feedback, strengths, improvements | High |
| FR-14 | Results shall be immediately accessible to the student after grading | High |
| FR-15 | Educators shall see all students' results for their quizzes | High |
| FR-16 | Educator dashboard shall display class-level statistics | Medium |
| FR-17 | Student dashboard shall display personal score history | Medium |
| FR-18 | Educators shall be able to delete quizzes | Low |

### 3.3.3 Non-Functional Requirements

| NFR# | Requirement | Category |
|------|-------------|---------|
| NFR-01 | System shall load each page in under 3 seconds on standard broadband | Performance |
| NFR-02 | AI grading shall complete within 60 seconds of quiz submission | Performance |
| NFR-03 | Student data shall be accessible only to the student and their educators | Security |
| NFR-04 | All API endpoints shall require authentication before processing requests | Security |
| NFR-05 | Database access shall be governed by Row Level Security policies | Security |
| NFR-06 | The interface shall be usable by non-technical students without training | Usability |
| NFR-07 | The system shall be responsive across desktop and mobile viewports | Usability |
| NFR-08 | The system shall be built on scalable, cloud-hosted infrastructure | Scalability |
| NFR-09 | Source code shall be modular, documented, and version-controlled | Maintainability |
| NFR-10 | The system shall function correctly on Chrome, Firefox, and Edge | Compatibility |

---

## 3.4 Use Case Modelling

### 3.4.1 Actors

- **Educator (Admin):** A registered user with instructor-level privileges; creates and manages quizzes; views class results.
- **Student:** A registered user with learner-level privileges; takes quizzes; views personal results.
- **Gemini AI:** External AI service that receives question-answer pairs and returns grading results.
- **Supabase:** Backend-as-a-service providing database, authentication, and storage.

### 3.4.2 Use Cases

**Educator Use Cases:**

| UC# | Use Case | Description |
|-----|----------|-------------|
| UC-01 | Register as Educator | Submit full name, email, password, select Educator role |
| UC-02 | Login | Authenticate with email and password |
| UC-03 | Create Quiz | Enter quiz metadata and add questions |
| UC-04 | Publish Quiz | Toggle a quiz to published (visible to students) |
| UC-05 | Unpublish Quiz | Remove quiz from student view |
| UC-06 | Delete Quiz | Permanently remove a quiz and all attempts |
| UC-07 | View Quiz Results | See all student submissions and scores for a quiz |
| UC-08 | View Grade Report | See all graded attempts across all quizzes |
| UC-09 | View Student Roster | See list of registered students |
| UC-10 | Logout | Terminate authenticated session |

**Student Use Cases:**

| UC# | Use Case | Description |
|-----|----------|-------------|
| UC-11 | Register as Student | Submit full name, email, password, select Student role |
| UC-12 | Login | Authenticate with email and password |
| UC-13 | View Available Quizzes | See list of published quizzes |
| UC-14 | Start Quiz | Begin a quiz attempt; timer starts |
| UC-15 | Answer Question | Select option (MCQ/T-F) or type response (short/essay) |
| UC-16 | Navigate Questions | Move between questions using navigator |
| UC-17 | Submit Quiz | Manually submit quiz or auto-submit on timer expiry |
| UC-18 | View Results | View score, grade, and per-question AI feedback |
| UC-19 | Logout | Terminate authenticated session |

---

## 3.5 System Architecture

### 3.5.1 Overall Architecture

The QuizAI system employs a **three-tier client-server architecture** deployed on cloud services:

```
┌──────────────────────────────────────────────────────┐
│                   CLIENT TIER                         │
│  Browser (HTML/CSS/JavaScript via Next.js React)     │
│  - Landing Page       - Auth Pages                   │
│  - Admin Dashboard    - Student Dashboard            │
│  - Quiz Builder       - Quiz-Taking Interface        │
│  - Results Page       - Analytics Views              │
└───────────────────┬──────────────────────────────────┘
                    │ HTTPS Requests
┌───────────────────▼──────────────────────────────────┐
│                APPLICATION TIER                       │
│      Next.js 14 App Router (Server Components &      │
│              API Routes — Node.js Runtime)            │
│                                                      │
│  /api/quizzes    /api/attempts    /api/grade          │
│  [Quiz CRUD]     [Attempt mgmt]   [AI Grading]       │
└───┬───────────────────────────────────┬──────────────┘
    │ SQL (Supabase PostgREST)          │ HTTPS (Gemini API)
┌───▼──────────────────┐    ┌──────────▼───────────────┐
│    DATA TIER         │    │    AI SERVICE TIER        │
│  Supabase            │    │  Google Generative AI     │
│  (PostgreSQL + RLS)  │    │  (Gemini 1.5 Flash)      │
│                      │    │                          │
│  - profiles          │    │  - Grade short answers   │
│  - quizzes           │    │  - Grade essays          │
│  - questions         │    │  - Generate feedback     │
│  - quiz_attempts     │    │                          │
│  - attempt_answers   │    │                          │
└──────────────────────┘    └──────────────────────────┘
```

### 3.5.2 Client-Server Communication

The client (browser) communicates with the Next.js application tier via:
- **Server-Rendered Pages** (Next.js App Router): Initial page HTML rendered on server, reducing time-to-first-render
- **API Routes** (`/api/*`): RESTful JSON endpoints consumed by client-side React components for dynamic operations (CRUD, grading trigger)
- **Supabase Client SDK**: Direct browser-to-Supabase connection (via the `@supabase/ssr` package) for real-time data subscriptions and database queries, governed by Row Level Security

---

## 3.6 Database Design

### 3.6.1 Entity-Relationship Diagram (ERD)

The database comprises five primary entities. Their attributes and relationships are described below:

**PROFILES**
- `id (PK, FK → auth.users.id)`: UUID
- `email`: TEXT
- `full_name`: TEXT
- `role`: TEXT ENUM ('student', 'admin')
- `created_at`: TIMESTAMPTZ

**QUIZZES**
- `id (PK)`: UUID
- `title`: TEXT
- `description`: TEXT (nullable)
- `subject`: TEXT (nullable)
- `created_by (FK → profiles.id)`: UUID
- `duration_minutes`: INTEGER
- `total_marks`: INTEGER
- `pass_mark`: INTEGER (1–100)
- `is_published`: BOOLEAN
- `created_at`: TIMESTAMPTZ

**QUESTIONS**
- `id (PK)`: UUID
- `quiz_id (FK → quizzes.id)`: UUID
- `question_text`: TEXT
- `question_type`: TEXT ENUM ('mcq', 'short_answer', 'essay', 'true_false')
- `options`: JSONB (nullable, for MCQ: [{id, text, isCorrect}])
- `correct_answer`: TEXT (nullable)
- `model_answer`: TEXT (nullable)
- `rubric`: TEXT (nullable)
- `max_score`: INTEGER
- `order_index`: INTEGER

**QUIZ_ATTEMPTS**
- `id (PK)`: UUID
- `quiz_id (FK → quizzes.id)`: UUID
- `student_id (FK → profiles.id)`: UUID
- `started_at`: TIMESTAMPTZ
- `submitted_at`: TIMESTAMPTZ (nullable)
- `total_score`: NUMERIC
- `total_possible`: NUMERIC
- `percentage`: NUMERIC
- `grade`: TEXT ENUM ('A', 'B', 'C', 'D', 'F')
- `status`: TEXT ENUM ('in_progress', 'submitted', 'graded')

**ATTEMPT_ANSWERS**
- `id (PK)`: UUID
- `attempt_id (FK → quiz_attempts.id)`: UUID
- `question_id (FK → questions.id)`: UUID
- `student_answer`: TEXT
- `score`: NUMERIC
- `max_score`: NUMERIC
- `feedback`: TEXT (nullable)
- `strengths`: JSONB (nullable)
- `improvements`: JSONB (nullable)
- `is_correct`: BOOLEAN (nullable)
- `graded_by`: TEXT ENUM ('ai', 'manual', 'auto', 'pending')

**Entity Relationships:**
- One PROFILE → Many QUIZZES (educator creates quizzes)
- One QUIZ → Many QUESTIONS
- One QUIZ → Many QUIZ_ATTEMPTS
- One PROFILE → Many QUIZ_ATTEMPTS (student attempts quizzes)
- One QUIZ_ATTEMPT → Many ATTEMPT_ANSWERS
- One QUESTION → Many ATTEMPT_ANSWERS (across attempts)

### 3.6.2 Database Security: Row Level Security (RLS)

Supabase's Row Level Security feature enforces data isolation at the database layer, independent of the application layer. This provides a defence-in-depth security posture. Key policies include:

- **Quizzes**: Students can only SELECT quizzes where `is_published = true` OR where `created_by = auth.uid()` (educators see their own drafts)
- **Quiz Attempts**: Students can only SELECT/INSERT/UPDATE their own attempts (`student_id = auth.uid()`)
- **Attempt Answers**: Students can only access answers belonging to their own attempts
- **Profiles**: All authenticated users can read profiles (for name display); only the profile owner can update

---

## 3.7 Data Flow Diagrams

### 3.7.1 Level 0 DFD (Context Diagram)

```
                    ┌──────────────────────────────┐
    [EDUCATOR]      │                              │     [STUDENT]
     Quiz Data  →   │      QUIZAI SYSTEM           │  ← Quiz Attempt
     Publish Cmd    │                              │   → Results + Feedback
                    │                              │
                    └──────────────────────────────┘
                               ↕ AI Requests/Responses
                         [GOOGLE GEMINI AI SERVICE]
```

### 3.7.2 Level 1 DFD

**Process 1.0 — User Authentication**
- Input: Email, password, role
- Process: Validate credentials via Supabase Auth; create/fetch profile
- Output: Auth session token; redirect to role-appropriate dashboard

**Process 2.0 — Quiz Management (Educator)**
- Input: Quiz metadata; question data
- Process: Validate, store in quizzes + questions tables
- Output: Quiz ID; confirmation; quiz listing updated

**Process 3.0 — Quiz Attempt (Student)**
- Input: Student selection (quiz) and answers
- Process: Create attempt record; save answers; enforce timer
- Output: Attempt ID; auto-saved answers; timer display

**Process 4.0 — AI Grading Engine**
- Input: Attempt ID → answers + questions from DB
- Process: MCQ/T-F → rule-based comparison; Short/Essay → Gemini API call
- Output: Per-question scores + feedback → stored in attempt_answers; aggregate score → stored in quiz_attempts

**Process 5.0 — Results Presentation**
- Input: Attempt ID → graded attempt_answers
- Process: Fetch all answers, format score display and feedback
- Output: Results page with score, grade, per-question feedback

**Process 6.0 — Analytics**
- Input: quiz_id (educator); student_id (student)
- Process: Aggregate statistics from quiz_attempts
- Output: Dashboard stats (avg, pass rate, distribution)

---

## 3.8 AI Grading Design

### 3.8.1 Short Answer Grading Pipeline

The short answer grading flow is as follows:

1. **Trigger**: Student submits quiz → `/api/grade` receives `{attemptId, quizId}`
2. **Fetch**: API fetches all answers for the attempt, joined with their questions
3. **Route**: For each answer, branch on `question_type`:
   - `mcq` / `true_false` → Rule-based grader
   - `short_answer` → Gemini short-answer grader
   - `essay` → Gemini essay grader
4. **Prompt Construction** (short answer):

```
You are an expert academic grader. Grade the following student answer.

Question: {question_text}
Model Answer: {model_answer}
Rubric (if provided): {rubric}
Student Answer: {student_answer}
Maximum Score: {max_score}

Respond ONLY with JSON:
{
  "score": <number 0 to {max_score}>,
  "feedback": "<2-3 sentence feedback>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "improvements": ["<improvement 1>", "<improvement 2>"]
}
```

5. **Parse Response**: Extract JSON from Gemini text response; validate score bounds
6. **Store**: Write `{score, feedback, strengths, improvements, graded_by: 'ai'}` to `attempt_answers`
7. **Aggregate**: Sum scores; compute percentage and letter grade; update `quiz_attempts`

### 3.8.2 Essay Grading Rubric

Essays are graded using a four-criterion rubric embedded in the Gemini prompt:

| Criterion | Weight | Aspects Evaluated |
|-----------|--------|------------------|
| Content & Knowledge | 40% | Accuracy, relevance, completeness |
| Structure & Organisation | 20% | Introduction, body, conclusion; paragraph transitions |
| Critical Analysis | 20% | Depth of argument, evidence, counterpoint consideration |
| Language & Expression | 20% | Clarity, grammar, vocabulary, coherence |

### 3.8.3 Rationale for Gemini 1.5 Flash

Gemini 1.5 Flash was selected as the AI grading model for the following reasons:
- **Accuracy**: Achieves near-human performance on academic reasoning benchmarks
- **Speed**: "Flash" variant optimised for low latency (average grading response: 3–8 seconds per answer)
- **Cost**: Google AI Studio provides a free usage tier sufficient for educational-scale deployments
- **Reliability**: Google's production infrastructure provides robust API availability
- **Context window**: 1 million token context window supports grading long essays
- **Safety**: Built-in content moderation prevents inappropriate content in feedback

---

## 3.9 Technology Stack Justification

| Component | Technology | Justification |
|-----------|-----------|---------------|
| Web Framework | Next.js 14 | Server-side rendering, API routes in one framework; industry standard; strong TypeScript support |
| Styling | Vanilla CSS | Maximum flexibility and control; no external CSS framework dependency; custom design system |
| Database | Supabase (PostgreSQL) | Managed PostgreSQL with built-in auth, RLS, and real-time capabilities; generous free tier |
| Authentication | Supabase Auth | Tightly integrated with database RLS; supports email/password and OAuth |
| AI Grading | Google Gemini 1.5 Flash | State-of-the-art LLM with API access; free tier; optimised for educational reasoning tasks |
| Language | TypeScript | Type safety reduces runtime errors; better IDE tooling; self-documenting code |
| Deployment | Local dev (npm run dev) | Simplifies academic demo; Next.js supports one-command deployment to Vercel for production |

---

## 3.10 Security Design

The system employs defence-in-depth security:

**Layer 1 — Network**: HTTPS for all client-server and API communications

**Layer 2 — Authentication**: Supabase Auth issues JWTs (JSON Web Tokens) that expire and rotate; all API routes verify the JWT before processing requests

**Layer 3 — Application**: API route handlers check user roles before performing privileged operations (e.g., only users with `role = 'admin'` can create quizzes)

**Layer 4 — Database**: Supabase Row Level Security policies enforce data isolation at the database level; even if application code had a bug, the database would refuse to return unauthorised data

**Layer 5 — Environment**: API keys (Gemini, Supabase service key) stored in `.env.local` files, never committed to version control or exposed to the client

---

## 3.11 Testing Strategy

The following testing approach was applied:

**Unit Testing:**
- The Gemini grading functions were unit-tested by supplying known question-answer pairs and verifying that returned scores were within expected ranges
- Database trigger for automatic profile creation was tested with new user registrations

**Integration Testing:**
- The full grading pipeline was tested end-to-end: quiz creation → student attempt → submission → AI grading → results retrieval
- Authentication flows were tested for correct role detection and routing

**User Acceptance Testing (UAT):**
- 5 student volunteers were recruited to use the system
- Task completion rate and satisfaction were recorded
- AI grading scores were compared against researcher-generated expected scores for 20 short-answer and 10 essay cases
- Mean correlation between AI scores and expected scores was calculated

**Security Testing:**
- Attempted unauthorised access (student accessing admin endpoints) verified to be rejected with 403 errors
- RLS policies verified by attempting direct SQL queries to return another user's data

---

## 3.12 Summary

This chapter documented the complete methodology guiding the development of the QuizAI system. The key design decisions were:

1. **Agile (Scrum)** was selected as the development methodology for its iterative, flexible nature.
2. The system follows a **three-tier architecture** with a clear separation between client, application, and data tiers.
3. The **database design** uses five related tables with carefully designed RLS policies for security.
4. The **AI grading design** uses structured prompts to Gemini 1.5 Flash, routing MCQ questions to a rule-based grader and short/essay questions to the LLM.
5. **Security is implemented at four distinct layers** for robustness.
6. **Testing** combines unit, integration, and user acceptance methods.

Chapter Four will present the implementation details and results.

---

## References

Hevner, A. R., et al. (2004). Design science in information systems research. *MIS Quarterly*, 28(1), 75–105.

Schwaber, K., & Sutherland, J. (2020). *The Scrum Guide*. https://scrumguides.org/

Google. (2024). *Gemini API - Google AI Studio*. https://ai.google.dev
