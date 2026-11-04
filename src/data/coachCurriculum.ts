import { CoachModule } from '../types';

export const COACH_MODULES: CoachModule[] = [
  {
    id: 'resume',
    title: 'Resume Preparation',
    subtitle: 'ATS-friendly design, high-impact bullet points, and project narratives',
    icon: 'FileText',
    lessons: [
      {
        id: 'ats-mastery',
        title: 'Crafting an ATS-Compliant Tech Resume',
        content: `Applicant Tracking Systems (ATS) scan resumes for keywords and parse layout structures.
Key Principles:
1. Use single-column, clean layout without tables, columns, floating graphics, or icons in critical text.
2. Standard Section Headers: "Experience", "Projects", "Technical Skills", "Education".
3. Quantify Everything: Use Google's XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".
4. File Format: Standard PDF or DOCX without multi-column parsing traps.`,
        tips: [
          'Match technical keywords with the exact job description (e.g., if JD says "RESTful APIs", use that phrase).',
          'Avoid skill rating bars (e.g., "Python: 4/5 stars") which ATS cannot parse and recruiters find subjective.',
          'Keep to exactly 1 page for students and candidates with < 5 years experience.',
        ],
        sampleAnswer: {
          question: 'How should you describe a major college or personal full-stack project?',
          poorAnswer: 'Made an e-commerce website using React and Node.js. It had login, cart, and payment gateway.',
          poorExplanation: 'Passive, vague, lacks scale, tech details, and business outcome metrics.',
          winningAnswer: 'Architected a responsive full-stack e-commerce platform using React, TypeScript, and Node.js microservices with PostgreSQL, decreasing checkout latency by 35% through Redis query caching and handling 500+ simulated concurrent orders with Stripe webhooks.',
          winningExplanation: 'Uses strong action verbs, specifies technical depth, provides measurable speedups, and details architecture.',
        },
      },
      {
        id: 'explaining-projects',
        title: 'Explaining Projects with Technical Depth',
        content: `When interviewers say "Tell me about your most proud project":
1. The Problem Statement (Why did this need to exist?)
2. Your Role & Technical Architecture (What choices did you make and why?)
3. The Hardest Technical Hurdle (What broke, and how did you debug it?)
4. Measurable Outcomes & Trade-offs (What would you do differently today?)`,
        tips: [
          'Never just list features—explain the architectural trade-offs (e.g., why PostgreSQL over MongoDB).',
          'Be prepared for deep-dives into edge cases and authentication flows.',
        ],
      },
      {
        id: 'internship-impact',
        title: 'Describing Internships & Practical Experience',
        content: `Even a 2-month summer internship should highlight production software practices:
- Code reviews and CI/CD pipelines
- Working with legacy codebases or third-party SDKs
- Communicating with cross-functional team members (designers, product managers, QA)`,
        tips: [
          'Highlight git workflows, unit testing coverage, and production issue resolution.',
        ],
      },
    ],
    quiz: [
      {
        id: 'rq-1',
        question: 'Which of the following bullet points follows Google’s XYZ formula best?',
        options: [
          'Responsible for backend development using Java and Spring Boot.',
          'Optimized database queries by 42% by adding composite B-tree indexes, reducing API latency from 280ms to 160ms.',
          'Worked hard on team tasks and delivered features on time.',
          'Assisted senior engineers with bug fixes and daily standup meetings.',
        ],
        correctAnswerIndex: 1,
        explanation: 'It specifies the accomplishment, exact quantitative metric, and technical action method.',
      },
    ],
  },
  {
    id: 'hr',
    title: 'HR & Behavioural Round',
    subtitle: 'Master the STAR framework, salary strategy, and leadership stories',
    icon: 'Users',
    lessons: [
      {
        id: 'tell-me-about-yourself',
        title: 'The "Tell Me About Yourself" Pitch',
        content: `The first 90 seconds set the psychological anchor for the entire interview.
Use the Present-Past-Future framework:
1. Present (30s): Current role, degree, and current core technical expertise.
2. Past (30s): Key achievements, internships, and foundational project highlights that shaped your passion.
3. Future (30s): Why this specific role at this specific company matches your immediate career trajectory.`,
        tips: [
          'Do NOT recite your resume line by line; they already read it.',
          'Keep your answer between 75 and 110 seconds.',
          'End on a clear hook: "...and that’s why I was thrilled to speak with your engineering team today."',
        ],
        sampleAnswer: {
          question: 'Tell me about yourself.',
          poorAnswer: 'My name is Rahul. I was born in Delhi. I did my schooling at DPS with 88%. Then I joined B.Tech in Computer Science. My hobbies are playing cricket and reading books. I know C++, Java, and HTML.',
          poorExplanation: 'Personal autobiography rather than a professional value proposition. Lacks focus.',
          winningAnswer: 'I am a final-year Computer Science student specializing in scalable backend systems and distributed services. Over the last two years, I have built production-ready services using Java, Spring Boot, and PostgreSQL, including an internship where I optimized high-throughput database queries. I am fascinated by distributed consistency and microservice resiliency, which is why I was excited to interview for your backend infrastructure team.',
          winningExplanation: 'Succinct, confident, highlights core strengths, connects directly to the target role.',
        },
      },
      {
        id: 'strengths-weaknesses',
        title: 'Strengths & Genuine Weaknesses',
        content: `How to tackle "What is your greatest weakness?":
1. Pick a genuine, non-fatal professional weakness (avoid cliche humble-brags like "I am a perfectionist" or "I work too hard").
2. Explain the self-awareness moment when you realized it.
3. Detail the concrete proactive system or habit you adopted to manage and improve it.`,
        tips: [
          'Example good weakness: Difficulty delegating tasks early on, or prioritizing competing backlog tickets.',
          'Show continuous self-improvement and humility.',
        ],
      },
      {
        id: 'star-method',
        title: 'The STAR Behavioural Technique',
        content: `Every behavioral question ("Tell me about a conflict...", "Describe a time you failed...") must follow STAR:
- Situation (20%): Context and background.
- Task (10%): What was your specific responsibility?
- Action (50%): The concrete technical and interpersonal steps YOU took.
- Result (20%): Quantifiable outcome, business impact, and key learning.`,
        tips: [
          'Use "I" instead of "We" when explaining actions so the interviewer knows YOUR contribution.',
        ],
      },
    ],
    quiz: [
      {
        id: 'hrq-1',
        question: 'When asked "What is your greatest weakness?", which approach is most effective?',
        options: [
          'Say "I have no real weaknesses that affect my programming."',
          'Give a fake weakness like "I work too hard and care too much."',
          'Share a genuine professional area for growth, accompanied by concrete steps you are actively taking to improve it.',
          'Mention a critical job requirement like "I struggle with basic algorithms."',
        ],
        correctAnswerIndex: 2,
        explanation: 'Interviewers look for self-awareness, honesty, and an active growth mindset.',
      },
    ],
  },
  {
    id: 'technical',
    title: 'Technical Interview Mastery',
    subtitle: 'OOP, DSA, System Design, Concurrency, and Problem Solving',
    icon: 'Code2',
    lessons: [
      {
        id: 'oop-deep-dive',
        title: 'Core OOP & SOLID Principles in Practice',
        content: `Interviewers do not just want definitions of Encapsulation, Abstraction, Inheritance, and Polymorphism.
They want to see:
- Single Responsibility: Each class has one reason to change.
- Open/Closed: Open for extension, closed for modification (via interfaces/strategy pattern).
- Liskov Substitution: Derived types must be substitutable for base types without breaking invariants.
- Interface Segregation: Lean, role-specific interfaces over fat ones.
- Dependency Inversion: High-level modules depend on abstractions, not concretions.`,
        tips: [
          'Give real-world software examples rather than "Dog extends Animal" or "Car has wheels".',
          'Contrast Composition vs Inheritance and explain why composition is generally favored.',
        ],
      },
      {
        id: 'dsa-thinking-aloud',
        title: 'Communicating During Live Coding & DSA',
        content: `Silence is your biggest enemy during technical problem solving!
The 5-Step Live Coding Framework:
1. Clarify constraints (input size, memory limits, edge cases like null/empty).
2. Propose a Brute-force solution first and state its Time & Space complexity.
3. Brainstorm optimization (Hash maps, Two Pointers, Binary Search, DP).
4. Write clean, modular code with descriptive variable names.
5. Dry-run manually with an edge-case test trace before claiming it is done!`,
        tips: [
          'State your Big-O complexity immediately after proposing a solution.',
          'Think aloud so the interviewer can steer you if you head in the wrong direction.',
        ],
      },
      {
        id: 'database-internals',
        title: 'Databases, Indexing & Transactions',
        content: `Key areas tested in backend rounds:
- ACID properties and isolation levels (Read Committed, Repeatable Read, Serializable).
- B-Tree vs Hash Indexing (why B-Trees excel at range queries).
- N+1 query problem in ORMs and how JOIN FETCH / eager loading resolves it.
- Sharding vs Read Replicas vs Vertical Scaling.`,
        tips: [
          'Be ready to explain how an index speeds up SELECT but adds overhead to INSERT/UPDATE/DELETE.',
        ],
      },
    ],
    quiz: [
      {
        id: 'tq-1',
        question: 'Why are B+ Trees favored over standard Binary Search Trees for relational database indexing?',
        options: [
          'B+ Trees are simpler to implement in code',
          'B+ Trees have high fan-out, minimizing expensive disk I/O operations and providing efficient sequential disk block scans',
          'Binary search trees consume less memory',
          'B+ Trees guarantee O(1) worst-case lookup',
        ],
        correctAnswerIndex: 1,
        explanation: 'B+ Trees store multiple keys per page node (high fan-out), drastically reducing disk seek depth, while leaf nodes form linked lists for fast range scans.',
      },
    ],
  },
  {
    id: 'communication',
    title: 'Communication & Delivery',
    subtitle: 'Vocal cadence, eliminating fillers, concise phrasing, and composure',
    icon: 'Mic',
    lessons: [
      {
        id: 'eliminating-fillers',
        title: 'Eliminating Fillers ("Um", "Uh", "Actually")',
        content: `Why do we use filler words?
Our brains search for the next thought while our mouths fear silence.
Techniques to Master:
1. Embrace the Power Pause: Silence for 2 seconds sounds thoughtful and senior to an interviewer.
2. Breathe before answering: Take a slow breath when the question finishes instead of instantly blurting "um".
3. Chunking: Speak in structured 2-sentence paragraphs.`,
        tips: [
          'Use our Live Interview Simulator to monitor your real-time filler word count!',
          'Target less than 2 filler words per minute.',
        ],
      },
      {
        id: 'explaining-simply',
        title: 'The Feynman Technique for Technical Explanations',
        content: `Can you explain a complex concept (e.g., API idempotency, JWT tokens, or Docker containers) to a 10-year-old?
Steps:
1. State the core analogy (e.g., "A Docker container is like a shipping container that packs your app, dependencies, and OS settings into a sealed box").
2. Introduce the technical mechanism.
3. Highlight the failure scenario it prevents.`,
        tips: [
          'Great senior engineers simplify complex things; inexperienced engineers overcomplicate simple things.',
        ],
      },
      {
        id: 'handling-stumpers',
        title: 'What To Do When You Do NOT Know the Answer',
        content: `Never guess or fake knowledge—senior interviewers spot guesswork immediately.
The 3-Step Honest Recovery:
1. Acknowledge with composure: "I haven't used that specific API in production yet..."
2. Bridge with relevant foundational knowledge: "...however, based on how similar message queues or protocols handle this, I would approach it by..."
3. Propose a logical first-principles hypothesis.`,
        tips: [
          'Interviewers respect honesty combined with structured analytical reasoning.',
        ],
      },
    ],
    quiz: [
      {
        id: 'cq-1',
        question: 'What is the best alternative to using filler words like "um" and "uh" when gathering your thoughts?',
        options: [
          'Talk faster so the interviewer doesn’t notice',
          'Embrace a calm 1-2 second pause to structure your response',
          'Repeat the interviewer’s question 3 times',
          'Acknowledge that your brain is lagging',
        ],
        correctAnswerIndex: 1,
        explanation: 'A brief pause projects poise, confidence, and deliberate thinking.',
      },
    ],
  },
];
