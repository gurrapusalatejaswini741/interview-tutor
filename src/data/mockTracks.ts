import { InterviewCategory } from '../types';

export interface TrackDetail {
  id: InterviewCategory;
  title: string;
  badge: string;
  description: string;
  skills: string[];
  recommendedInterviewer: 'ananya' | 'arjun' | 'panel';
  difficultyLevels: ('Beginner' | 'Intermediate' | 'Advanced')[];
  sampleQuestions: string[];
}

export const MOCK_TRACKS: TrackDetail[] = [
  {
    id: '.NET Developer',
    title: '.NET & C# Engineer',
    badge: 'Backend & Cloud',
    description: 'Master C#, CLR internals, ASP.NET Core, LINQ, Entity Framework Core, async/await, dependency injection, and microservices architecture.',
    skills: ['C#', 'ASP.NET Core', 'EF Core', 'LINQ', 'CLR / GC', 'SQL Server', 'REST APIs', 'Docker'],
    recommendedInterviewer: 'arjun',
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
    sampleQuestions: [
      'Explain how the Garbage Collector works in .NET and the difference between Gen 0, 1, and 2.',
      'What is the difference between Task.Run and async/await in ASP.NET Core request pipelines?',
      'How does Entity Framework Core handle change tracking and lazy vs eager loading?',
    ],
  },
  {
    id: 'Java Developer',
    title: 'Java Backend Specialist',
    badge: 'Enterprise Architecture',
    description: 'Prepare for top tech and enterprise roles covering Core Java, JVM memory model, Spring Boot, Hibernate, Multithreading, and Microservices.',
    skills: ['Core Java', 'JVM Internals', 'Spring Boot', 'Spring Security', 'Kafka', 'Hibernate', 'Design Patterns'],
    recommendedInterviewer: 'arjun',
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
    sampleQuestions: [
      'How does the JVM Memory Model allocate objects across Heap, Stack, and Metaspace?',
      'Explain the internal working of ConcurrentHashMap in Java 8+.',
      'How do you design a distributed transaction in a Spring Boot microservice architecture?',
    ],
  },
  {
    id: 'Python Developer',
    title: 'Python Backend & Data',
    badge: 'Versatile Engineering',
    description: 'Deep dive into Python language internals, GIL, generators, decorators, FastAPI, Django, Celery, and memory management.',
    skills: ['Python 3', 'FastAPI / Django', 'GIL & Concurrency', 'Asyncio', 'Decorators', 'PyTest', 'PostgreSQL'],
    recommendedInterviewer: 'arjun',
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
    sampleQuestions: [
      'What is the Python Global Interpreter Lock (GIL) and how does asyncio circumvent IO-bound limitations?',
      'Explain the difference between deepcopy, shallow copy, and pass-by-object-reference in Python.',
      'How do Python generators save memory compared to list comprehensions?',
    ],
  },
  {
    id: 'Full Stack Developer',
    title: 'Full Stack Engineer (React + Node / Spring)',
    badge: 'Most Popular',
    description: 'Comprehensive end-to-end evaluation covering frontend state management, browser rendering, REST/GraphQL, database indexing, and DevOps.',
    skills: ['React / TypeScript', 'Node.js / Express', 'Tailwind CSS', 'SQL & NoSQL', 'System Design', 'CI/CD'],
    recommendedInterviewer: 'panel',
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
    sampleQuestions: [
      'Walk me through what happens under the hood when a user visits a URL until the page paints.',
      'How would you design an optimistic UI update pattern in React with real-time server synchronization?',
      'Explain ACID properties vs BASE properties and when you would choose MongoDB over PostgreSQL.',
    ],
  },
  {
    id: 'Frontend Developer',
    title: 'Modern Frontend Architect',
    badge: 'UI/UX & Web Performance',
    description: 'Focus on React lifecycle, rendering pipelines, Virtual DOM, Core Web Vitals, CSS architecture, accessibility (a11y), and state machines.',
    skills: ['React 19', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Core Web Vitals', 'DOM / Event Loop', 'State Stores'],
    recommendedInterviewer: 'arjun',
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
    sampleQuestions: [
      'How does React Reconciliation (Fiber architecture) schedule priority rendering over large component trees?',
      'How would you diagnose and eliminate Largest Contentful Paint (LCP) and Cumulative Layout Shift (CLS) issues?',
      'Explain closure traps inside React useEffect and how custom hooks can prevent them.',
    ],
  },
  {
    id: 'Backend Developer',
    title: 'Distributed Systems & Backend',
    badge: 'High Scale & Reliability',
    description: 'Cover API design, caching strategies (Redis), message queues (Kafka/RabbitMQ), database sharding, connection pooling, and fault tolerance.',
    skills: ['API Gateways', 'Redis Caching', 'Kafka', 'Database Sharding', 'gRPC', 'Rate Limiting', 'Docker & K8s'],
    recommendedInterviewer: 'arjun',
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
    sampleQuestions: [
      'How do you prevent cache stampede / dog-piling when a high-traffic Redis key expires?',
      'Explain how consistent hashing is used in distributed databases to achieve uniform load distribution.',
      'What are idempotent API endpoints and how do you implement idempotency keys across distributed services?',
    ],
  },
  {
    id: 'AI/ML Engineer',
    title: 'AI & Machine Learning Engineer',
    badge: 'Model Training & Production',
    description: 'Tackle supervised/unsupervised learning, deep neural networks, loss functions, PyTorch/TensorFlow, model deployment, and MLOps pipelines.',
    skills: ['PyTorch', 'Model Optimization', 'CNNs & RNNs', 'Vector Search', 'MLOps', 'Feature Engineering'],
    recommendedInterviewer: 'arjun',
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
    sampleQuestions: [
      'How do you mitigate vanishing and exploding gradients in deep networks?',
      'Explain the mathematical formulation behind cross-entropy loss versus mean squared error.',
      'How do quantization (INT8) and pruning reduce inference latency without significantly hurting accuracy?',
    ],
  },
  {
    id: 'NLP Engineer',
    title: 'Natural Language Processing Engineer',
    badge: 'LLMs & Text Processing',
    description: 'Specialized track in tokenization, embeddings, Transformer self-attention, BERT, RAG pipelines, fine-tuning, and semantic evaluation.',
    skills: ['Transformers', 'BERT / LLMs', 'RAG Pipelines', 'Vector Databases', 'Tokenizers (BPE)', 'NER & Sentiment'],
    recommendedInterviewer: 'arjun',
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
    sampleQuestions: [
      'Derive the Scaled Dot-Product Attention equation and explain why the scaling factor sqrt(d_k) is necessary.',
      'How does Byte-Pair Encoding (BPE) differ from WordPiece and subword tokenization algorithms?',
      'Explain how you would architect a production Retrieval-Augmented Generation (RAG) system with re-ranking.',
    ],
  },
  {
    id: 'Data Analyst',
    title: 'Data Analyst & BI Specialist',
    badge: 'Metrics & Insights',
    description: 'Focus on complex SQL window functions, statistical hypothesis testing, data cleaning, cohort analysis, and executive storytelling.',
    skills: ['Advanced SQL', 'Window Functions', 'A/B Testing', 'Python Pandas', 'Tableau / PowerBI', 'Statistical Inference'],
    recommendedInterviewer: 'panel',
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
    sampleQuestions: [
      'Write a query using ROW_NUMBER() and DENSE_RANK() to find the top 3 highest spending customers per region.',
      'How do you design and interpret a statistically significant A/B test with appropriate sample sizing and p-values?',
      'How do you handle severe class imbalance and missing data in observational datasets?',
    ],
  },
  {
    id: 'SQL Developer',
    title: 'Database & SQL Specialist',
    badge: 'Query Optimization',
    description: 'Deep dive into query execution plans, B-Tree vs Hash indexes, partitioning, normalization vs denormalization, and transactions.',
    skills: ['PostgreSQL', 'Index Strategies', 'EXPLAIN ANALYZE', 'CTE & Recursion', 'Stored Procedures', 'Locking'],
    recommendedInterviewer: 'arjun',
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
    sampleQuestions: [
      'Explain the difference between a Clustered Index and Non-Clustered Index, and how index seek compares to index scan.',
      'How do you troubleshoot a slow query using EXPLAIN ANALYZE to identify sequential scans and nested loop bottlenecks?',
      'Explain Deadlocks in relational databases, the 4 conditions that cause them, and how to prevent them in code.',
    ],
  },
  {
    id: 'General HR Interview',
    title: 'HR, Behavioural & Placement Round',
    badge: 'Cultural Fit & Leadership',
    description: 'Master the crucial behavioural round with Ananya: self-introduction, STAR method stories, conflict management, ethics, and career alignment.',
    skills: ['STAR Method', 'Self Introduction', 'Conflict Resolution', 'Leadership', 'Salary Negotiation', 'Growth Mindset'],
    recommendedInterviewer: 'ananya',
    difficultyLevels: ['Beginner', 'Intermediate', 'Advanced'],
    sampleQuestions: [
      'Tell me about a time you had a major disagreement with a teammate or lead. How did you resolve it?',
      'What is your greatest weakness, and what concrete steps have you taken to turn it around?',
      'Where do you see yourself in three years, and how does our company accelerate that vision?',
    ],
  },
];
