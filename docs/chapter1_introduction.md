# CHAPTER ONE: INTRODUCTION

## Online Quiz System with Artificial Intelligence Grading

---

## 1.1 Background of the Study

The 21st century has witnessed an unprecedented convergence of computation and human cognition, fundamentally altering how knowledge is taught, assessed, and validated. Education, as one of the most consequential human endeavours, stands at the epicentre of this transformation. The proliferation of internet-connected devices, cloud computing infrastructure, and machine learning has created fertile ground for a new generation of educational technology (EdTech) tools that extend far beyond the digitisation of traditional classroom activities.

Assessment — the systematic process of gathering evidence about student learning for the purpose of improving that learning — is a cornerstone of education (Black & Wiliam, 1998). Formative assessments provide ongoing feedback that guides the learning process; summative assessments measure cumulative achievement at the end of a unit, course, or academic year. The integrity, accuracy, fairness, and timeliness of assessments directly affect student learning outcomes, instructor workload, institutional reputation, and the validity of academic credentials.

Traditional assessment systems, despite their familiarity and long-established protocols, exhibit several structural limitations. Paper-based examinations are slow to grade, susceptible to loss or damage, difficult to analyse at scale, and present logistical challenges around scheduling, venue management, and accessibility. The manual grading of subjective responses (short answers, essays) is particularly resource-intensive — a single lecturer responsible for a class of 200 students may spend hundreds of hours on grading activities per semester, leaving little time for teaching, research, or student engagement.

The advent of computer-based testing (CBT) partially addressed these limitations. Objective question formats (multiple choice, true/false) can be graded instantly and automatically by rule-based systems. However, the pedagogical value of objective-only assessments is limited: they primarily measure recall and recognition (lower-order cognitive skills), while higher-order skills — application, analysis, synthesis, and evaluation (Bloom, 1956; Krathwohl, 2002) — are better assessed through constructed-response formats (short answers, essays). The challenge of automatically grading these constructed responses has been a persistent barrier to fully automated, scalable online assessment.

Artificial Intelligence, and specifically Natural Language Processing (NLP), has transformed this landscape. The emergence of transformer-based Large Language Models (LLMs) — from BERT (Devlin et al., 2019) to GPT-4 (OpenAI, 2023) and Google's Gemini (Google DeepMind, 2023) — has created AI systems of unprecedented capability in reading, understanding, and evaluating human-generated text. These models are trained on vast corpora of text and develop sophisticated internal representations of language semantics, context, and argumentation. As applied to educational assessment, they can perform nuanced evaluation of student answers — identifying correct concepts, assessing depth of understanding, recognising partial credit, and generating contextually apt feedback — tasks that previously required human expertise.

This project, **QuizAI**, is born from this technological context. It represents a practical synthesis of state-of-the-art AI capabilities with a functional, user-centred web platform designed to revolutionise how quizzes and assessments are conducted in higher education settings.

---

## 1.2 Statement of the Problem

Despite decades of investment in EdTech, a significant gap persists between the potential and the practice of technology-enhanced assessment. In many higher education institutions — particularly in developing countries, where resource constraints are more acute — the following problems are prevalent:

**Problem 1: Delayed and Insufficient Feedback**
Research in educational psychology consistently identifies feedback timing as a critical determinant of its effectiveness. Hattie and Timperley (2007) identified feedback as having an effect size of 0.79 on student achievement — one of the highest of any educational intervention — but only when timely and specific. In practice, students often wait one to three weeks for graded work to be returned, by which time the associative connection between their effort and the evaluative feedback has faded. This delay substantially reduces the learning value of assessment.

**Problem 2: Inconsistency and Bias in Human Grading**
Human grading of subjective responses is vulnerable to cognitive biases. The "halo effect" causes a grader who forms a positive impression of a student from early answers to rate subsequent answers more generously. "Leniency bias" leads graders who have been lenient with preceding papers to maintain that leniency. "Assimilation bias" causes similarity in phrasing to preceding answers to influence scores. Moreover, graders become fatigued over long marking sessions, with research showing measurable score drift over time (Graesser et al., 2000). The result is that two students with objectively equivalent answers may receive different scores, undermining the fundamental fairness of assessment.

**Problem 3: Lecturers' Grading Burden**
Academic staff in under-resourced institutions are frequently required to teach large classes (often 100–300+ students) with minimal support staff. The grading burden is enormous: estimating conservatively that grading a single essay requires 10 minutes, a module with 200 students writing three essays per semester requires 100 person-hours of grading per semester from a single lecturer — equivalent to more than two full working weeks devoted exclusively to grading. This is time diverted from teaching preparation, research, curriculum development, and student support.

**Problem 4: Absence of Comprehensive Feedback in Existing Online Tools**
Widely-used free quiz tools such as Google Forms, Typeform, and Kahoot are limited to objective question formats (MCQ, checkbox). They award points but provide no explanation, feedback, or guidance. Even commercially mature platforms such as Moodle, while supporting some automated feedback, cannot grade constructed responses (short answers, essays) with the sophistication and nuance of an expert human — or an AI system trained on vast educational data.

**Problem 5: Limited Assessment of Higher-Order Cognitive Skills**
Because existing automated tools can only grade objective items, online assessments are biased toward lower-order cognitive skills (knowledge recall, comprehension). Assessing higher-order skills — analysis, synthesis, critical evaluation — requires constructed responses that currently demand human grading. This forces educators who want to test higher-order thinking to accept the manual grading burden, creating a disincentive to use better assessment methods.

The system developed in this project directly and measurably addresses each of these five problems.

---

## 1.3 Aim of the Study

The aim of this project is to **design, develop, and evaluate a web-based online quiz system that integrates Artificial Intelligence — specifically Google's Gemini Large Language Model — to provide automated, fair, and personalised grading for multiple question types, including open-ended short answers and essays.**

---

## 1.4 Objectives of the Study

To achieve the stated aim, the following specific objectives were pursued:

1. To **analyse** existing online assessment systems and identify their limitations with respect to AI grading capability.
2. To **design** a scalable relational database schema capable of storing user profiles, quiz configurations, question sets, student attempts, and granular AI grading results.
3. To **develop** a secure, role-based authentication system that differentiates between Educator (Administrator) and Student user roles, enforcing access control at both application and database levels.
4. To **implement** a multi-format question builder enabling educators to create Multiple Choice (MCQ), True/False, Short Answer, and Essay questions within a unified, intuitive interface.
5. To **integrate** the Google Gemini 1.5 Flash API to automatically grade short answer and essay responses, producing a numerical score, letter grade, comprehensive textual feedback, identified answer strengths, and actionable improvement suggestions.
6. To **implement** automatic (deterministic) grading for MCQ and True/False questions through exact-match comparison with stored correct answers.
7. To **build** a real-time countdown timer mechanism for timed assessments, with automatic quiz submission upon timer expiration.
8. To **develop** analytics dashboards — for educators (class average, pass rate, grade distribution, student listing) and students (personal score history, per-question feedback) — to support data-informed teaching and learning.
9. To **test** the system using functional, integration, and user acceptance testing methods with real student participants.

---

## 1.5 Significance of the Study

This project makes meaningful contributions at multiple levels:

**Academic Contribution:** This study contributes empirical evidence regarding the viability of LLM-based automated grading in a real-world educational application. The system architecture and AI integration strategy provide a model for subsequent research and development in educational AI.

**Practical Contribution for Educators:** The system directly reduces grading workload by automating the evaluation of open-ended answers. An educator who previously spent 40 hours grading a set of short-answer papers can redirect that time to richer instructional activities.

**Practical Contribution for Students:** Immediate, detailed feedback replaces the frustrating wait associated with manual grading. Students receive actionable guidance — specific strengths to build on and specific areas to improve — which accelerates learning. This is consistent with the formative assessment paradigm championed by Black and Wiliam (1998).

**Institutional Contribution:** The adoption of AI-powered assessment tools positions educational institutions to scale their online programme offerings without proportional increases in administrative costs. The system's open architecture allows institutional customisation and integration with existing LMS platforms.

**Societal Contribution:** By improving the quality and efficiency of educational assessment, the system supports the United Nations Sustainable Development Goal 4 (SDG 4): "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all."

---

## 1.6 Scope of the Study

This project encompasses the following within its scope:

- **Platform:** Web-based application, desktop-first with mobile-responsive design
- **Users:** Educator (Admin) and Student roles
- **Question Types:** Multiple Choice, True/False, Short Answer, Essay
- **AI Integration:** Google Gemini 1.5 Flash (via REST API)
- **Database:** Supabase (managed PostgreSQL) with Row Level Security
- **Authentication:** Email/password via Supabase Auth
- **Grading:** Automated for MCQ/T-F; AI-powered for short answer/essay
- **Analytics:** Basic class and individual performance dashboards
- **Language:** English (interface and graded content)

The following are explicitly outside the scope of this project:

- Mobile native application (iOS/Android)
- Plagiarism or academic integrity detection
- Integration with existing LMS (Moodle, Blackboard)
- Multi-language support beyond English
- Video or audio question formats
- Predictive analytics or knowledge tracing models

---

## 1.7 Definition of Terms

**Artificial Intelligence (AI):** The simulation of human intelligence processes by computer systems, including learning, reasoning, and self-correction.

**Large Language Model (LLM):** A class of AI model trained on vast text datasets capable of generating, understanding, and evaluating natural language text. Examples include GPT-4, Gemini, and Claude.

**Natural Language Processing (NLP):** A subfield of AI concerned with enabling computers to understand, interpret, and generate human language in a meaningful way.

**Automated Essay Scoring (AES):** The use of computer programs to grade written essays or extended constructed responses.

**Formative Assessment:** An ongoing assessment process used to monitor student learning and provide feedback to improve both teaching and learning.

**Summative Assessment:** Assessment conducted at the end of an instructional unit to measure learning outcomes against a defined standard.

**Row Level Security (RLS):** A database security feature that restricts which rows a user can access in a table, based on the user's identity or role.

**API (Application Programming Interface):** A set of protocols and tools that allow different software applications to communicate with each other.

**Next.js:** An open-source React-based web development framework enabling server-side rendering and static website generation.

**Supabase:** An open-source backend-as-a-service platform built on PostgreSQL, providing database, authentication, storage, and real-time capabilities.

**MCQ (Multiple Choice Question):** A question format with a stem and multiple options, exactly one of which is correct.

---

## 1.8 Organisation of the Report

This report is organised into five chapters:

- **Chapter One** — Introduces the study, providing background, problem statement, aim, objectives, significance, scope, and definitions.
- **Chapter Two** — Reviews existing literature on online assessments, AI in education, automated grading systems, and related works.
- **Chapter Three** — Documents the research methodology, system analysis, design decisions, and architectural specifications.
- **Chapter Four** — Presents the implementation details, the developed system's features, and testing results.
- **Chapter Five** — Summarises the work, draws conclusions, and recommends directions for future development.
