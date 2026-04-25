# PROJECT PROPOSAL

## An Online Quiz System with Artificial Intelligence Grading

---

**Submitted by:** [Your Full Name]
**Matriculation Number:** [Your Matric Number]
**Department:** Computer Science / Information Technology
**Institution:** [Your University Name]
**Level:** Final Year (400 Level)
**Supervisor:** [Supervisor's Name]
**Date:** April 2025

---

## TABLE OF CONTENTS

1. Introduction
2. Background of the Study
3. Statement of the Problem
4. Aim and Objectives
5. Significance of the Study
6. Scope and Limitation
7. Methodology
8. Expected Outcomes
9. Project Timeline (Gantt Chart)
10. Preliminary Bibliography

---

## 1. INTRODUCTION

The rapid growth of digital technology has fundamentally transformed the education sector. Traditional paper-based examinations and assessments, once considered the gold standard of academic evaluation, are increasingly being replaced or supplemented by computer-based and online alternatives. Among the most critical aspects of modern education is the fair, accurate, and timely assessment of student performance — a task that, historically, demands considerable time and resources from educators.

Artificial Intelligence (AI), particularly in the domain of Natural Language Processing (NLP), has emerged as a powerful force capable of automating tasks once considered exclusively human. AI systems can now read, understand, and evaluate textual responses with remarkable accuracy. This convergence of AI and education technology opens a compelling opportunity: an online quiz system in which the grading of both objective and subjective questions is performed automatically by an AI engine — instantly, consistently, and with personalised feedback for each student.

This proposal presents the plan for developing **QuizAI: An Online Quiz System with Artificial Intelligence Grading**, a full-stack web application that enables educators to create and publish quizzes and allows students to take those quizzes and receive immediate AI-generated grades and individualised feedback. The AI grading engine leverages Google's Gemini large language model (LLM) to evaluate open-ended answers and essay responses.

---

## 2. BACKGROUND OF THE STUDY

The evolution of educational technology (EdTech) can be traced from early computer-assisted instruction in the 1960s to today's sophisticated AI-driven learning management systems (LMS). The emergence of the internet enabled the first wave of online learning platforms — such as Blackboard (1997) and Moodle (2002) — which primarily functioned as digital repositories for course materials and basic automated testing of multiple-choice questions.

The second wave brought massive open online courses (MOOCs) such as Coursera, edX, and Khan Academy. These platforms democratised access to quality education but retained the fundamental limitation that grading open-ended responses — essays, short answers, or structured problem solutions — still required human graders. Human grading, while qualitatively superior in certain contexts, is inherently slow, expensive, and subject to inter-rater variability (variation between different graders).

The emergence of transformer-based language models (e.g., GPT, BERT, Gemini) has given AI the capability to comprehend and evaluate free-form text with nuance. Automated Essay Scoring (AES) systems have existed since the 1960s (Project Essay Grade, by Ellis Page), but modern LLMs have achieved a qualitative leap in their ability to understand context, argumentation, and factual accuracy. Research by Ke and Ng (2019), Ramesh and Sanampudi (2022), and Bonthu et al. (2021) consistently shows that AI grading of short answers achieves correlations of 0.70–0.90 with expert human scores.

This context creates the rationale for developing a practical, accessible, and affordable AI-grading quiz system tailored to the needs of higher education institutions, which often lack resources for real-time human grading at scale.

---

## 3. STATEMENT OF THE PROBLEM

Despite the widespread adoption of online learning tools in Nigerian and African universities, several persistent challenges undermine the effectiveness of online assessments:

**3.1 Delayed Feedback**
Traditional assessment workflows — where a lecturer collects papers, grades them over days or weeks, and returns them — deprive students of the timely feedback essential for learning reinforcement. Research in educational psychology (Hattie & Timperley, 2007) demonstrates that feedback effectiveness is maximised when delivered immediately after a learning event.

**3.2 Grading Inconsistency**
Human grading of subjective answers suffers from cognitive biases (halo effect, leniency effect), fatigue, and inter-rater inconsistency. Two examiners evaluating the same essay may assign substantially different scores, undermining fairness.

**3.3 High Grading Workload**
As class sizes increase in under-resourced institutions, the grading burden on academic staff becomes unsustainable. Lecturers spend an inordinate amount of time on grading rather than on teaching, curriculum development, or research.

**3.4 Limited Question Diversity in Online Tools**
Most freely available online quiz tools (e.g., Google Forms, Kahoot) support only multiple-choice questions. They cannot grade short answers or essays, limiting their pedagogical utility for testing higher-order thinking skills (Bloom's Taxonomy levels 3–6: Application, Analysis, Evaluation, Creation).

**3.5 Lack of Personalised Feedback at Scale**
Current systems provide only a binary correct/incorrect response for MCQs. Students receive no explanation of why they failed, what their strengths are, or how to improve — limiting learning value.

This project directly addresses all five problems through an integrated AI-powered online quiz platform.

---

## 4. AIM AND OBJECTIVES

### 4.1 Aim

To design and develop a web-based online quiz system that uses Artificial Intelligence (specifically a Large Language Model) to automatically grade multiple question types and provide personalised student feedback in real time.

### 4.2 Objectives

The specific objectives of this project are to:

1. **Design** a relational database schema to effectively store quiz metadata, questions, student attempts, and grading results.
2. **Develop** a secure, role-based user authentication system distinguishing Educators (Admins) and Students.
3. **Implement** a multi-format question builder supporting Multiple Choice (MCQ), True/False, Short Answer, and Essay question types.
4. **Integrate** Google Gemini AI for automated short-answer and essay grading, returning a numerical score, letter grade, overall feedback, identified strengths, and suggested improvements.
5. **Implement** automatic (rule-based) grading for MCQ and True/False questions.
6. **Build** a real-time countdown timer for timed assessments with auto-submission on timeout.
7. **Develop** analytics dashboards for educators (class average, pass rate, individual scores) and students (personal score history, grade distribution).
8. **Test** the system for functionality, usability, and AI grading accuracy.

---

## 5. SIGNIFICANCE OF THE STUDY

**5.1 For Students**
- Receive immediate, detailed feedback on every answer
- Understand specific strengths and areas for improvement
- Reduce anxiety associated with prolonged waiting for results
- Access a modern, engaging assessment interface

**5.2 For Educators**
- Eliminate the time burden of manual grading of short answers and essays
- Achieve consistent, bias-free grading standards
- Access detailed class analytics to identify learning gaps
- Focus more time on teaching and curriculum improvement

**5.3 For Institutions**
- Reduce assessment costs
- Support scalable online education programmes
- Demonstrate technological leadership in EdTech adoption
- Build a data record of student performance for accreditation purposes

**5.4 For Society and Research**
- Contribute to the growing body of evidence on AI in education (AIEd)
- Provide an open-source codebase for future research and extension
- Support national development goals (SDG 4: Quality Education)

---

## 6. SCOPE AND LIMITATION

### 6.1 Scope

The project will:
- Support web-based access (desktop-first, mobile-responsive)
- Support four question types: MCQ, True/False, Short Answer, Essay
- Use Google Gemini 1.5 Flash as the AI grading model
- Use Supabase (PostgreSQL) for data storage
- Support two user roles: Educator and Student
- Provide grading results immediately upon submission
- Include basic analytics dashboards

### 6.2 Limitations

- The AI grading accuracy depends on the quality of the model answer provided by the educator
- The system does not support rich media questions (audio, video) in the current version
- Plagiarism detection is beyond the scope of this version
- The system is limited to English-language content in the current iteration
- Advanced learning analytics (predictive models, knowledge graphs) are out of scope

---

## 7. METHODOLOGY

The project will be developed using an **Agile Software Development** methodology, specifically the **Scrum** framework, organised into two-week sprints. The development phases are:

**Phase 1 — Requirements Analysis** (Weeks 1–2)
- Stakeholder interviews with students and lecturers
- Functional and non-functional requirements specification
- Use case diagrams, context diagrams

**Phase 2 — System Design** (Weeks 3–4)
- Entity-Relationship Diagram (ERD)
- Data Flow Diagram (DFD)
- System architecture design
- UI wireframes and mockups

**Phase 3 — Implementation** (Weeks 5–10)
- Database setup (Supabase)
- Authentication system
- Quiz builder (admin)
- Quiz-taking interface (student)
- AI grading integration (Gemini)
- Results and analytics dashboards

**Phase 4 — Testing** (Weeks 11–13)
- Unit testing of individual modules
- Integration testing of AI grading pipeline
- User Acceptance Testing (UAT) with 10 student volunteers

**Phase 5 — Documentation and Submission** (Weeks 14–16)
- Final project writeup
- User manual
- Source code documentation

---

## 8. EXPECTED OUTCOMES

Upon completion, this project will deliver:

1. A **fully functional web application** accessible at localhost (with hosting-ready configuration)
2. An **AI grading engine** achieving ≥ 0.75 correlation with human judgement on short answer questions
3. A **user manual** for both educators and students
4. A **database schema** documented and version-controlled
5. **Academic chapters 1–5** constituting the final project report

---

## 9. PROJECT TIMELINE (GANTT CHART)

| Activity | Wk 1-2 | Wk 3-4 | Wk 5-6 | Wk 7-8 | Wk 9-10 | Wk 11-12 | Wk 13-14 | Wk 15-16 |
|----------|--------|--------|--------|--------|---------|---------|---------|---------|
| Requirements Analysis | ████ | | | | | | | |
| System Design | | ████ | | | | | | |
| Database Setup | | ████ | ████ | | | | | |
| Auth & User Management | | | ████ | ████ | | | | |
| Quiz Builder | | | | ████ | ████ | | | |
| AI Grading Integration | | | | | ████ | ████ | | |
| Dashboards & Analytics | | | | | | ████ | | |
| Testing (Unit + UAT) | | | | | | ████ | ████ | |
| Documentation | | | | | | | ████ | ████ |
| Submission | | | | | | | | ████ |

---

## 10. PRELIMINARY BIBLIOGRAPHY

1. Bonthu, S., Rama Sree, S., & Sitamahalakshmi, T. (2021). *Automated short answer grading using deep learning: A survey*. Proceedings of the 2021 12th International Conference on Computing Communication and Networking Technologies.

2. Brown, T., et al. (2020). *Language models are few-shot learners*. Advances in Neural Information Processing Systems, 33, 1877–1901.

3. Hattie, J., & Timperley, H. (2007). *The power of feedback*. Review of Educational Research, 77(1), 81–112.

4. Ke, Z., & Ng, V. (2019). *Automated essay scoring: A survey of the state of the art*. Proceedings of the 28th International Joint Conference on Artificial Intelligence (IJCAI-19).

5. Peng, M., et al. (2020). *Short answer grading with regard to student diversity*. arXiv preprint arXiv:2004.09163.

6. Ramesh, D., & Sanampudi, S. K. (2022). *An automated essay scoring systems: A systematic literature review*. Artificial Intelligence Review, 55, 2495–2527.

7. Supabase Documentation. (2024). *Supabase Docs — Open source Firebase alternative*. https://supabase.com/docs

8. Google. (2024). *Gemini API Documentation*. https://ai.google.dev/docs

9. Vercel. (2024). *Next.js Documentation*. https://nextjs.org/docs

10. Corbett, A. T., & Anderson, J. R. (1995). *Knowledge tracing: Modeling the acquisition of procedural knowledge*. User Modeling and User-Adapted Interaction, 4(4), 253–278.
