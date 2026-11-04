export type InterviewerId = 'ananya' | 'arjun' | 'panel';

export type InterviewCategory =
  | '.NET Developer'
  | 'Java Developer'
  | 'Python Developer'
  | 'Full Stack Developer'
  | 'Frontend Developer'
  | 'Backend Developer'
  | 'AI/ML Engineer'
  | 'NLP Engineer'
  | 'Data Analyst'
  | 'SQL Developer'
  | 'General HR Interview';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface InterviewerProfile {
  id: InterviewerId;
  name: string;
  role: string;
  gender: 'female' | 'male' | 'duo';
  tagline: string;
  personality: string[];
  topics: string[];
  avatarColor: string;
  voiceName: string;
}

export interface DialogueTurn {
  id: string;
  speaker: 'candidate' | 'interviewer' | 'Ananya' | 'Arjun';
  text: string;
  timestamp: string;
  audioMetrics?: {
    durationSec?: number;
    wpm?: number;
    fillerCount?: number;
    pauses?: number;
  };
}

export interface AnswerComparison {
  question: string;
  originalAnswer: string;
  improvedAnswer: string;
  interviewReadyAnswer: string;
  keyDifferences?: string;
}

export interface StarAnalysis {
  situation: string;
  task: string;
  action: string;
  result: string;
  score: number;
}

export interface EvaluationDimensions {
  relevance: number;
  semanticSimilarity: number;
  technicalAccuracy: number;
  grammar: number;
  vocabulary: number;
  clarity: number;
  conciseness: number;
  structure: number;
  completeness: number;
  communicationEffectiveness: number;
}

export interface EvaluationReport {
  id: string;
  date: string;
  interviewer: InterviewerId;
  category: InterviewCategory | string;
  difficulty: DifficultyLevel;
  targetRole: string;
  durationMinutes: number;
  overallScore: number;
  technicalScore: number;
  communicationScore: number;
  nlpScore?: number;
  dimensions: EvaluationDimensions;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  starAnalysis?: StarAnalysis;
  answerComparisons: AnswerComparison[];
  personalizedRecommendations: string[];
  weakestTopics?: string[];
  strongestTopics?: string[];
  audioMetrics?: {
    totalSpeakingDurationSec: number;
    wordsPerMinute: number;
    fillerWordCount: number;
    pauseCount: number;
  };
  transcript: DialogueTurn[];
}

export interface DailyQuestion {
  id: string;
  number: number;
  question: string;
  category: string;
  topic: string;
  difficulty: DifficultyLevel;
  explanation: string;
  interviewReadyAnswer: string;
  codeSnippet?: string | null;
  followUpQuestion: string;
  keyConcepts: string[];
  completed?: boolean;
  bookmarked?: boolean;
  userNotes?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  targetRole: string;
  targetCompany?: string;
  selectedTrack: InterviewCategory;
  experienceLevel: 'Student' | 'Entry-Level' | 'Mid-Level' | 'Senior';
  bio: string;
  dailyGoal: number;
}

export interface ReminderSettings {
  enabled: boolean;
  recipientEmail: string;
  reminderTime: string; // e.g. "09:00"
  includeDailyQuestions: boolean;
  includeCoachTip: boolean;
  includeTrackProgress: boolean;
  autoSendEnabled: boolean;
  phoneCallSimulatorEnabled: boolean;
  phoneCallTime: string; // e.g. "17:00"
  surpriseCallProbability: boolean;
  lastSentDate?: string;
}

export interface IncomingCallState {
  isRinging: boolean;
  caller: 'ananya' | 'arjun';
  callerName: string;
  callerRole: string;
  category: InterviewCategory | string;
  targetCompany: string;
}

export interface SentEmailRecord {
  id: string;
  recipient: string;
  subject: string;
  timestamp: string;
  status: 'sent' | 'failed';
  trackTitle: string;
  questionCount: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface NlpTopic {
  id: number;
  title: string;
  category: 'Foundations' | 'Linguistics & Syntax' | 'Vector Representations' | 'Deep Learning & LLMs' | 'Applications';
  description: string;
  realWorldUse: string;
  pythonCode: string;
  interviewQuestions: {
    q: string;
    a: string;
  }[];
  exercise: string;
  quiz: QuizQuestion[];
}

export interface CoachModule {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  lessons: {
    id: string;
    title: string;
    content: string;
    tips: string[];
    sampleAnswer?: {
      question: string;
      poorAnswer: string;
      poorExplanation: string;
      winningAnswer: string;
      winningExplanation: string;
    };
  }[];
  quiz: QuizQuestion[];
}
