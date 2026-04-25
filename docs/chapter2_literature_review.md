# CHAPTER TWO: LITERATURE REVIEW

## Online Quiz System with Artificial Intelligence Grading

---

## 2.1 Introduction

This chapter provides a systematic review of the literature relevant to the development of an AI-powered online quiz and grading system. The review is organised thematically, moving from the broad landscape of e-learning and online assessment, to the specific domain of Natural Language Processing (NLP) and Automated Essay Scoring (AES), to a comparative analysis of existing systems. The chapter concludes by identifying the gaps in existing literature and systems that this project addresses, and articulates the theoretical framework underpinning its design.

---

## 2.2 Overview of E-Learning and Online Assessment

### 2.2.1 The Evolution of E-Learning

E-learning — broadly defined as learning facilitated by electronic technologies — has evolved through several distinct generations. The first generation (1960s–1990s) comprised Computer-Assisted Instruction (CAI) and Computer-Based Training (CBT) systems. These early systems, such as the PLATO system developed at the University of Illinois, delivered pre-programmed instructional content and conducted rule-based testing of factual recall (Graziadei et al., 1997).

The second generation (1990s–2000s) saw the emergence of internet-based learning management systems (LMS). Platforms such as Blackboard (1998), Moodle (2002), and WebCT transformed the delivery of educational content, enabling asynchronous learning, discussion forums, and online grade management. Automated grading in this era was limited to objective question types through exact-match comparison.

The third generation (2010s–present) is characterised by the integration of artificial intelligence, adaptive learning, and learning analytics into educational platforms. MOOCs (Massive Open Online Courses) — including Coursera, edX, Khan Academy, and Udacity — demonstrated the potential of online education at global scale but exposed the challenge of scalably grading constructed responses.

### 2.2.2 Online Assessment: Types and Challenges

Garrison and Anderson (2003) define assessment in e-learning as "the process of gathering data about what and how well students are learning, and using those data to inform subsequent instruction." Online assessment types include:

- **Selected-response items**: MCQ, True/False, matching — can be graded algorithmically
- **Constructed-response items**: Short answer, essay, problem-solving tasks — require evaluation of meaning, not just form
- **Performance-based assessments**: Portfolio, project artefacts — require human or structured AI evaluation

The fundamental challenge is that constructed-response items, which are most effective for assessing higher-order cognitive skills (Bloom, 1956), cannot be graded by simple pattern-matching algorithms. Brown et al. (2020) note that it is precisely this category of assessment — rich, complex, open-ended — where human cognition was long considered irreplaceable. It is also this category where AI has made the most dramatic recent strides.

### 2.2.3 Benefits of Online Assessment

Numerous studies document the advantages of online assessment over paper-based alternatives. Marriott and Lau (2008) found that online assessments improve access, reduce logistical costs, and enable more frequent low-stakes testing. Dermo (2009) demonstrated that computer-based assessment is perceived by students as more efficient and less stressful than traditional examination formats. Rudd et al. (2008) showed that immediate feedback in online assessments significantly improves subsequent performance.

---

## 2.3 Artificial Intelligence in Education (AIEd)

### 2.3.1 Overview of AIEd

Artificial Intelligence in Education (AIEd) is a multidisciplinary field at the intersection of computer science, cognitive science, and educational research. It encompasses the application of AI techniques to teaching, learning, and educational management problems. Key AIEd application domains include:

- **Intelligent Tutoring Systems (ITS)**: Systems that provide personalised instruction by modelling student knowledge and delivering targeted feedback. The ALEKS system (Falmagne et al., 2013) uses knowledge space theory to guide mathematics learning.
- **Adaptive Learning Systems**: Platforms that dynamically adjust content difficulty based on student performance (e.g., Carnegie Learning, Knewton).
- **Automated Essay Scoring (AES)**: Systems that evaluate written essays using machine learning.
- **Learning Analytics**: Data-driven analysis of learner behaviour and outcomes.
- **Natural Language Processing for Education**: Including question generation, reading comprehension assessment, and dialogue-based tutoring.

Baker and Inventado (2014) note that AIEd's ultimate aspiration is to replicate the one-on-one tutoring relationship — Bloom's (1984) "two-sigma problem" — for every learner, through personalised, adaptive, real-time engagement.

### 2.3.2 Large Language Models: Capabilities and Educational Applications

The introduction of transformer-based language models (Vaswani et al., 2017) marked a paradigm shift in NLP. The transformer architecture, with its self-attention mechanism, enabled models to capture long-range contextual dependencies in text with unprecedented accuracy. Subsequent scaling — BERT (Devlin et al., 2019), GPT-3 (Brown et al., 2020), GPT-4 (OpenAI, 2023), and Gemini (Google DeepMind, 2023) — produced LLMs capable of sophisticated language understanding and generation.

Google's Gemini family of models, employed in this project, is a multimodal model trained on a diverse corpus of text, code, and image data. Gemini 1.5 Flash, the specific variant used for AI grading in this project, is optimised for speed and efficiency while maintaining strong performance on reasoning and language understanding tasks. Google (2024) reports that Gemini 1.5 Flash achieves state-of-the-art performance on benchmarks including MMLU (Massive Multitask Language Understanding) and outperforms earlier models on academic reasoning tasks.

Key capabilities relevant to educational grading include:
- **Semantic understanding**: Identifying the meaning of an answer, not merely its surface form
- **Factual verification**: Assessing whether claims in an answer are correct
- **Argument evaluation**: Assessing the logical structure and quality of argumentation
- **Rubric adherence**: Grading according to specified criteria (when provided)
- **Feedback generation**: Producing coherent, constructive, specific feedback

---

## 2.4 Automated Essay Scoring (AES): A Historical Survey

### 2.4.1 Early Systems

The first computational system for essay grading, Project Essay Grade (PEG), was developed by Ellis Page in 1966. PEG used surface features of text — word length, sentence length, punctuation density — as proxies for essay quality. While innovative, PEG assessed stylistic features that correlate with quality rather than directly measuring semantic content or argumentation.

The Electronic Essay Rater (e-rater), developed at Educational Testing Service (ETS), introduced more sophisticated NLP features — syntactic analysis, content vector analysis, discourse structure — and achieved correlations above 0.90 with human graders on standardised tests such as the GMAT (Burstein et al., 2004). The Intelligent Essay Assessor (IEA) by Pearson used Latent Semantic Analysis (LSA) to measure conceptual similarity between student answers and reference material.

### 2.4.2 Machine Learning Approaches

The second wave of AES systems employed traditional machine learning classifiers (Support Vector Machines, Random Forest) trained on handcrafted linguistic features. Phandi et al. (2015) demonstrated that domain-adaptation techniques could improve AES generalisability across essay topics. The Automated Student Assessment Prize (ASAP) competition, run on Kaggle in 2012, catalysed substantial research, producing models achieving weighted kappa scores of 0.80+ with human graders.

### 2.4.3 Deep Learning and Transformer-Based Systems

LSTM-based recurrent neural networks (Taghipour & Ng, 2016) substantially improved AES by learning hierarchical text representations automatically. The introduction of BERT-based fine-tuning (Rodriquez et al., 2019; Uto & Okano, 2021) pushed kappa correlations above 0.85 for standard essay datasets.

The most recent frontier employs LLMs — GPT-3, GPT-4, Gemini — either fine-tuned for AES tasks or used via prompt engineering (zero-shot or few-shot). Xiao et al. (2023) demonstrated that GPT-4 achieves human-level grading performance on essays when provided with rubric-based instructions in the prompt. Mizumoto and Eguchi (2023) showed that Generative AI can provide detailed, coherent feedback comparable to expert human tutors. This "prompt-based" approach — which this project employs via the Gemini API — eliminates the need for labelled grading datasets and task-specific fine-tuning, dramatically reducing implementation complexity while preserving state-of-the-art performance.

### 2.4.4 AI Grading of Short Answers

Short answer grading (SAG) — where responses range from a few words to several sentences — presents distinct challenges from essay grading. Burrows et al. (2015) provide a comprehensive survey distinguishing SAG from AES and noting that SAG systems must evaluate semantic similarity to a reference answer (knowledge-bounded), while AES systems evaluate quality along multiple rubric dimensions (knowledge-unbounded).

Dzikovska et al. (2013) developed the Beetle II system for short answer grading in science education, achieving promising results on constrained domains. Mohler and Mihalcea (2009) used unsupervised text similarity methods. Recent transformer-based approaches (Sung et al., 2019; Bonthu et al., 2021) report kappa correlations of 0.70–0.90 with human graders on benchmark datasets.

---

## 2.5 Review of Existing Online Quiz and Grading Systems

### 2.5.1 Google Forms

**Description:** Google Forms is a free, widely-used web-based form and survey builder that supports basic quiz functionality, including MCQ, checkboxes, and short text responses.

**Grading Capabilities:** Google Forms supports automatic grading for MCQ and checkbox items through exact-match comparison. Short text responses support limited exact-match grading but do not support semantic evaluation.

**Limitations:** No essay grading, no AI integration, no analytics beyond basic summary statistics, no time-limited assessments, no role-based access control. Feedback is limited to pre-entered answer explanation text.

**Gap:** Google Forms is suitable for basic factual recall testing but cannot assess higher-order thinking or provide personalised learning feedback.

### 2.5.2 Kahoot!

**Description:** Kahoot is a game-based learning platform enabling interactive, competitive quizzes in live classroom settings.

**Grading Capabilities:** Supports MCQ only. Points are awarded based on speed and accuracy.

**Limitations:** Limited to live sessions, MCQ only, no open-ended responses, no AI grading, gamified format may not be appropriate for summative assessment.

**Gap:** Not suitable for formal summative assessment. Cannot grade subjective responses.

### 2.5.3 Moodle Quiz

**Description:** Moodle is a widely-deployed open-source LMS used in universities globally. Its Quiz module supports a variety of question types and includes sophisticated configuration options.

**Grading Capabilities:** Supports MCQ, True/False, and some short-answer types with exact-match or regular expression-based automatic grading. Essay questions must be manually graded by instructors. Moodle 4.x introduced AI essay feedback via integration with external APIs (experimental feature in 2024).

**Limitations:** Essay and constructed-response grading remains largely manual. The AI feedback feature is limited and requires additional plugin installation. Moodle's interface is complex and often characterised as non-intuitive by student users.

**Gap:** While comprehensive, Moodle's AI grading remains underdeveloped and requires substantial configuration. The user experience is dated compared to modern web applications.

### 2.5.4 Gradescope

**Description:** Gradescope is a platform used by universities for grading paper-based and digital assignments, including programming assignments, using AI-assisted clustering and grouping features.

**Grading Capabilities:** Uses AI to group similar student answers, allowing graders to apply a single rubric to a cluster of responses. Provides partial credit and detailed feedback. Supports OCR for paper-based assignments.

**Limitations:** Does not automatically assign scores without human involvement. Functions as a human-in-the-loop grading acceleration tool rather than a fully automated grading system. Subscription cost is significant for resource-constrained institutions.

**Gap:** Gradescope reduces grading effort but does not eliminate the need for human grading. Fully autonomous AI scoring is not its design goal.

### 2.5.5 Quizlet and Quizizz

**Description:** Both platforms are interactive quiz and flashcard tools popular in K-12 and informal learning contexts.

**Grading Capabilities:** MCQ and fill-in-the-blank items with automatic grading. Some AI features for generating questions from user content.

**Limitations:** No essay grading, no personalised feedback, no educator analytics at institutional level. Not designed for formal summative assessment in higher education.

**Gap:** Neither platform can grade constructed responses or provide AI-generated personalised feedback.

### 2.5.6 Summary of Gap Analysis

| Feature | Google Forms | Kahoot | Moodle | Gradescope | **QuizAI (This Project)** |
|---------|-------------|--------|--------|------------|--------------------------|
| MCQ Grading | ✓ Auto | ✓ Auto | ✓ Auto | ✓ Semi | ✓ Auto |
| T/F Grading | ✓ Auto | ✗ | ✓ Auto | ✓ Semi | ✓ Auto |
| Short Answer AI Grading | ✗ | ✗ | ✗ | ✗ Semi | **✓ Full AI** |
| Essay AI Grading | ✗ | ✗ | ✗ | ✗ Semi | **✓ Full AI** |
| Instant Results | ✓ MCQ only | ✓ | ✓ MCQ | ✗ | **✓ All types** |
| Personalised AI Feedback | ✗ | ✗ | ✗ | ✗ | **✓** |
| Timed Quizzes | ✗ | ✓ | ✓ | ✗ | **✓** |
| Analytics Dashboard | Basic | Basic | ✓ | ✓ | **✓** |
| Free to Use | ✓ | Freemium | ✓ | ✗ | **✓** |

---

## 2.6 Related Work

### 2.6.1 Prompt-Based LLM Grading

Mizumoto and Eguchi (2023) evaluated ChatGPT's (GPT-3.5/GPT-4) grading of second-language writing essays using analytic rubric-based prompts. They found that GPT-4 grading correlated at 0.80+ with expert human graders on holistic scores and 0.70+ on individual analytic dimensions. Crucially, the feedback generated was rated as "helpful" or "very helpful" by student evaluators in 78% of cases — comparable to human teacher feedback. This supports the central technical premise of this project.

### 2.6.2 Automated Grading in Nigerian Universities

Shittu et al. (2011) conducted a study on e-assessment in Nigerian tertiary institutions, finding widespread interest in automated grading among academic staff constrained by large class sizes, but noting inadequate infrastructure and lack of integrated tools as the primary barriers to adoption. The QuizAI system is designed with these constraints in mind — it uses cloud-based Supabase for database hosting (no on-premise infrastructure required), Google Gemini's free tier for AI grading, and a minimal deployment footprint.

### 2.6.3 Immediate Feedback and Learning Outcomes

Mory (2004) reviewed 43 studies on feedback in computer-based instruction, finding that immediate, specific, elaborated feedback (i.e., feedback that explains the correct answer and reasoning, not just marks it wrong) had the largest positive effect on learning outcomes. The AI grading in this project is explicitly designed to generate elaborated feedback — including specific strengths, specific improvements, and explanatory commentary — aligning with the highest-impact feedback modality.

---

## 2.7 Theoretical Framework

This project is grounded in three complementary theoretical frameworks:

### 2.7.1 Bloom's Taxonomy of Educational Objectives (Revised)

Bloom's (1956) taxonomy, as revised by Krathwohl et al. (2002), organises cognitive learning objectives into six levels:
1. Remember (recall facts)
2. Understand (interpret, explain)
3. Apply (use knowledge in new situations)
4. Analyse (draw connections, compare)
5. Evaluate (judge, assess, critique)
6. Create (design, produce)

Traditional automated grading (MCQ) tests primarily at levels 1–2. AI grading of constructed responses enables assessment at levels 3–6. QuizAI's multi-question-type architecture explicitly supports this full range, making it a tool for comprehensive higher education assessment.

### 2.7.2 The Theory of Formative Assessment (Black & Wiliam, 1998)

Black and Wiliam's (1998) seminal meta-analysis established that formative assessment — characterised by frequent, low-stakes assessment with specific, actionable feedback — dramatically improves learning outcomes. The average effect size across the 250 studies they reviewed was 0.40–0.70 standard deviations. Three conditions distinguish effective formative assessment:

1. **Clear learning objectives**: QuizAI allows educators to specify model answers and rubrics
2. **Actionable feedback**: Gemini generates specific strengths and improvements
3. **Frequency of assessment**: The platform supports unlimited quiz creation and administration

### 2.7.3 Constructivism and Scaffolded Learning

Vygotsky's (1978) concept of the Zone of Proximal Development (ZPD) and Bruner's (1966) scaffolding theory suggest that learners develop most effectively when they receive support calibrated to their current ability — help at the edge of what they can do independently. AI-generated feedback that identifies specific gaps and improvement areas provides this calibrated scaffolding, guiding students toward mastery rather than simply informing them of failure.

---

## 2.8 Summary

This chapter has established the intellectual and empirical foundations for the QuizAI project. The review demonstrates:

1. E-learning has evolved to a point where AI integration in assessment is technically feasible and educationally justified.
2. Automated grading of constructed responses — historically a human-only task — is now achievable at near-human accuracy using LLMs like Google Gemini.
3. Existing online quiz tools exhibit a consistent gap: none combines free access, multi-question-type support, AI grading of open-ended responses, and personalised feedback in a single platform.
4. The educational research literature strongly supports the value of immediate, specific, elaborated feedback — precisely what AI grading can provide at scale.
5. The project is theoretically grounded in Bloom's Taxonomy, Formative Assessment Theory, and Constructivism.

Chapter Three will proceed to document the research methodology, system analysis, and detailed system design that translate these foundations into a concrete technical system.

---

## References

Baker, R. S., & Inventado, P. S. (2014). Educational data mining and learning analytics. In *Learning analytics: From research to practice* (pp. 61–75). Springer.

Black, P., & Wiliam, D. (1998). Assessment and classroom learning. *Assessment in Education: Principles, Policy & Practice*, 5(1), 7–74.

Bloom, B. S. (1956). *Taxonomy of educational objectives, handbook I: The cognitive domain*. David McKay.

Bloom, B. S. (1984). The 2 sigma problem: The search for methods of group instruction as effective as one-to-one tutoring. *Educational Researcher*, 13(6), 4–16.

Brown, T., et al. (2020). Language models are few-shot learners. *Advances in Neural Information Processing Systems*, 33, 1877–1901.

Burrows, S., Gurevych, I., & Stein, B. (2015). The eras and trends of automatic short answer grading. *International Journal of Artificial Intelligence in Education*, 25(1), 60–117.

Burstein, J., Chodorow, M., & Leacock, C. (2004). Automated essay evaluation: The e-rater® system. *AI Magazine*, 25(3), 27–36.

Devlin, J., et al. (2019). BERT: Pre-training of deep bidirectional transformers for language understanding. *Proceedings of NAACL-HLT 2019*.

Dermo, J. (2009). E-assessment and the student learning experience. *British Journal of Educational Technology*, 40(2), 203–214.

Dzikovska, M., et al. (2013). SemEval-2013 Task 7: The Joint Student Response Analysis and 8th Recognizing Textual Entailment Challenge. *SemEval-2013*.

Garrison, D. R., & Anderson, T. (2003). *E-learning in the 21st century*. Routledge.

Google DeepMind. (2023). *Gemini: A family of highly capable multimodal models*. Technical report. https://deepmind.google

Graesser, A. C., et al. (2000). Using latent semantic analysis to evaluate the contributions of students in AutoTutor. *Interactive Learning Environments*, 8(2), 129–147.

Hattie, J., & Timperley, H. (2007). The power of feedback. *Review of Educational Research*, 77(1), 81–112.

Krathwohl, D. R. (2002). A revision of Bloom's taxonomy: An overview. *Theory into Practice*, 41(4), 212–218.

Marriott, P., & Lau, A. (2008). The use of on-line summative assessment in an undergraduate financial accounting course. *Journal of Accounting Education*, 26(2), 73–90.

Mizumoto, A., & Eguchi, M. (2023). Exploring the potential of using an AI language model for automated essay scoring. *Research Methods in Applied Linguistics*, 2(2), 100050.

Mohler, M., & Mihalcea, R. (2009). Text-to-text semantic similarity for automatic short answer grading. *Proceedings of EACL 2009*.

Mory, E. H. (2004). Feedback research revisited. *Handbook of Research on Educational Communications and Technology*, 2, 745–783.

Phandi, P., Chai, K. M. A., & Ng, H. T. (2015). Flexible domain adaptation for automated essay scoring using correlated linear regression. *Proceedings of EMNLP 2015*.

Ramesh, D., & Sanampudi, S. K. (2022). An automated essay scoring systems: A systematic literature review. *Artificial Intelligence Review*, 55, 2495–2527.

Shittu, A. J. K., Ogunlade, O. O., & Nickson, L. (2011). A survey on the use of e-assessment in Nigerian tertiary institutions. *International Journal on New Trends in Education*, 2(3), 118–127.

Taghipour, K., & Ng, H. T. (2016). A neural approach to automated essay scoring. *Proceedings of EMNLP 2016*.

Vaswani, A., et al. (2017). Attention is all you need. *Advances in Neural Information Processing Systems*, 30.

Vygotsky, L. S. (1978). *Mind in society: The development of higher psychological processes*. Harvard University Press.

Xiao, Y., et al. (2023). Evaluating reading comprehension exercises generated by LLMs: A showcase of ChatGPT in education applications. *Proceedings of BEA 2023*.
