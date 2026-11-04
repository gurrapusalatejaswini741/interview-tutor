import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  EvaluationReport,
  InterviewCategory,
  InterviewerId,
  DifficultyLevel,
  UserProfile,
  ReminderSettings,
  IncomingCallState,
  SentEmailRecord,
} from '../types';
import { ringtonePlayer } from '../services/ringtone';

export type NavView =
  | 'dashboard'
  | 'live-interview'
  | 'coach'
  | 'nlp-hub'
  | 'daily'
  | 'mock-tracks'
  | 'progress'
  | 'settings'
  | 'reminders';

export interface LiveSessionConfig {
  interviewer: InterviewerId;
  category: InterviewCategory | string;
  difficulty: DifficultyLevel;
  durationMinutes: number;
  targetRole: string;
  experienceLevel: string;
  targetCompany?: string;
  isPhoneCallMode?: boolean;
}

interface AppContextType {
  activeView: NavView;
  setActiveView: (view: NavView) => void;
  profile: UserProfile;
  updateProfile: (profile: Partial<UserProfile>) => void;
  sessionConfig: LiveSessionConfig;
  setSessionConfig: (config: LiveSessionConfig) => void;
  launchInterview: (config?: Partial<LiveSessionConfig>) => void;
  interviewHistory: EvaluationReport[];
  saveEvaluationReport: (report: EvaluationReport) => void;
  selectedReportForModal: EvaluationReport | null;
  setSelectedReportForModal: (report: EvaluationReport | null) => void;
  bookmarkedQuestionIds: string[];
  toggleBookmarkQuestion: (id: string) => void;
  completedQuestionIds: string[];
  toggleCompleteQuestion: (id: string) => void;
  completedNlpTopicIds: number[];
  markNlpTopicCompleted: (id: number) => void;
  completedCoachLessonIds: string[];
  markCoachLessonCompleted: (id: string) => void;
  // Reminders & Phone Call state
  reminderSettings: ReminderSettings;
  updateReminderSettings: (settings: Partial<ReminderSettings>) => void;
  incomingCall: IncomingCallState;
  triggerIncomingCall: (caller?: 'ananya' | 'arjun', category?: string, company?: string) => void;
  answerIncomingCall: () => void;
  declineIncomingCall: () => void;
  sentEmailRecords: SentEmailRecord[];
  addSentEmailRecord: (record: Omit<SentEmailRecord, 'id' | 'timestamp'>) => void;
  clearAllData: () => void;
}

const defaultProfile: UserProfile = {
  name: 'Tejaswini Gurrapusala',
  email: 'gurrapusalatejaswini572@gmail.com',
  targetRole: 'Full Stack Engineer',
  targetCompany: 'Google / Top Tech',
  selectedTrack: 'Full Stack Developer',
  experienceLevel: 'Entry-Level',
  bio: 'Computer Science student passionate about scalable backend systems, distributed architectures, and AI-driven applications.',
  dailyGoal: 10,
};

const defaultSessionConfig: LiveSessionConfig = {
  interviewer: 'ananya',
  category: 'Full Stack Developer',
  difficulty: 'Intermediate',
  durationMinutes: 15,
  targetRole: 'Full Stack Engineer',
  experienceLevel: 'Entry-Level',
  targetCompany: 'Tech Enterprise',
};

const defaultReminderSettings: ReminderSettings = {
  enabled: true,
  recipientEmail: 'gurrapusalatejaswini572@gmail.com',
  reminderTime: '09:00',
  includeDailyQuestions: true,
  includeCoachTip: true,
  includeTrackProgress: true,
  autoSendEnabled: true,
  phoneCallSimulatorEnabled: true,
  phoneCallTime: '17:00',
  surpriseCallProbability: true,
};

const initialIncomingCallState: IncomingCallState = {
  isRinging: false,
  caller: 'ananya',
  callerName: 'Ananya Sharma',
  callerRole: 'Lead Technical Recruiter & HR Bar-Raiser',
  category: 'Full Stack Developer',
  targetCompany: 'Tech Enterprise',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeView, setActiveView] = useState<NavView>('dashboard');

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('mentor_profile');
      return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
    } catch {
      return defaultProfile;
    }
  });

  const [sessionConfig, setSessionConfig] = useState<LiveSessionConfig>(() => {
    try {
      const saved = localStorage.getItem('mentor_session_config');
      return saved ? { ...defaultSessionConfig, ...JSON.parse(saved) } : defaultSessionConfig;
    } catch {
      return defaultSessionConfig;
    }
  });

  const [reminderSettings, setReminderSettings] = useState<ReminderSettings>(() => {
    try {
      const saved = localStorage.getItem('mentor_reminder_settings');
      return saved ? { ...defaultReminderSettings, ...JSON.parse(saved) } : defaultReminderSettings;
    } catch {
      return defaultReminderSettings;
    }
  });

  const [sentEmailRecords, setSentEmailRecords] = useState<SentEmailRecord[]>(() => {
    try {
      const saved = localStorage.getItem('mentor_sent_emails');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [incomingCall, setIncomingCall] = useState<IncomingCallState>(initialIncomingCallState);

  const [interviewHistory, setInterviewHistory] = useState<EvaluationReport[]>(() => {
    try {
      const saved = localStorage.getItem('mentor_history');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  const [selectedReportForModal, setSelectedReportForModal] = useState<EvaluationReport | null>(null);

  const [bookmarkedQuestionIds, setBookmarkedQuestionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mentor_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedQuestionIds, setCompletedQuestionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mentor_completed_questions');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [completedNlpTopicIds, setCompletedNlpTopicIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('mentor_nlp_topics');
      return saved ? JSON.parse(saved) : [1, 2];
    } catch {
      return [1, 2];
    }
  });

  const [completedCoachLessonIds, setCompletedCoachLessonIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mentor_coach_lessons');
      return saved ? JSON.parse(saved) : ['ats-mastery', 'tell-me-about-yourself'];
    } catch {
      return ['ats-mastery', 'tell-me-about-yourself'];
    }
  });

  // Sound effect for ringtone
  useEffect(() => {
    if (incomingCall.isRinging) {
      ringtonePlayer.play();
    } else {
      ringtonePlayer.stop();
    }
    return () => {
      ringtonePlayer.stop();
    };
  }, [incomingCall.isRinging]);

  // Persist states
  useEffect(() => {
    localStorage.setItem('mentor_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('mentor_session_config', JSON.stringify(sessionConfig));
  }, [sessionConfig]);

  useEffect(() => {
    localStorage.setItem('mentor_reminder_settings', JSON.stringify(reminderSettings));
  }, [reminderSettings]);

  useEffect(() => {
    localStorage.setItem('mentor_sent_emails', JSON.stringify(sentEmailRecords));
  }, [sentEmailRecords]);

  useEffect(() => {
    localStorage.setItem('mentor_history', JSON.stringify(interviewHistory));
  }, [interviewHistory]);

  useEffect(() => {
    localStorage.setItem('mentor_bookmarks', JSON.stringify(bookmarkedQuestionIds));
  }, [bookmarkedQuestionIds]);

  useEffect(() => {
    localStorage.setItem('mentor_completed_questions', JSON.stringify(completedQuestionIds));
  }, [completedQuestionIds]);

  useEffect(() => {
    localStorage.setItem('mentor_nlp_topics', JSON.stringify(completedNlpTopicIds));
  }, [completedNlpTopicIds]);

  useEffect(() => {
    localStorage.setItem('mentor_coach_lessons', JSON.stringify(completedCoachLessonIds));
  }, [completedCoachLessonIds]);

  const updateProfile = (partial: Partial<UserProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...partial };
      // keep email in sync if changed
      if (partial.email) {
        setReminderSettings((r) => ({ ...r, recipientEmail: partial.email! }));
      }
      return next;
    });
  };

  const updateReminderSettings = (settings: Partial<ReminderSettings>) => {
    setReminderSettings((prev) => ({ ...prev, ...settings }));
  };

  const addSentEmailRecord = (record: Omit<SentEmailRecord, 'id' | 'timestamp'>) => {
    const newRecord: SentEmailRecord = {
      ...record,
      id: 'email_' + Date.now(),
      timestamp: new Date().toISOString(),
    };
    setSentEmailRecords((prev) => [newRecord, ...prev]);
  };

  const triggerIncomingCall = (
    caller: 'ananya' | 'arjun' = 'ananya',
    category?: string,
    company?: string
  ) => {
    setIncomingCall({
      isRinging: true,
      caller,
      callerName: caller === 'ananya' ? 'Ananya Sharma' : 'Arjun Mehta',
      callerRole:
        caller === 'ananya'
          ? 'Lead HR & Behavioral Recruiter'
          : 'Staff Technical Interviewer & Architect',
      category: category || profile.selectedTrack,
      targetCompany: company || profile.targetCompany || 'Target Firm',
    });
  };

  const answerIncomingCall = () => {
    ringtonePlayer.stop();
    const caller = incomingCall.caller;
    const cat = incomingCall.category;
    const comp = incomingCall.targetCompany;

    setIncomingCall((prev) => ({ ...prev, isRinging: false }));
    setSessionConfig({
      interviewer: caller,
      category: cat,
      difficulty: 'Intermediate',
      durationMinutes: 10,
      targetRole: profile.targetRole,
      experienceLevel: profile.experienceLevel,
      targetCompany: comp,
      isPhoneCallMode: true,
    });
    setActiveView('live-interview');
  };

  const declineIncomingCall = () => {
    ringtonePlayer.stop();
    setIncomingCall((prev) => ({ ...prev, isRinging: false }));
  };

  const launchInterview = (overrides?: Partial<LiveSessionConfig>) => {
    if (overrides) {
      setSessionConfig((prev) => ({ ...prev, ...overrides }));
    }
    setActiveView('live-interview');
  };

  const saveEvaluationReport = (report: EvaluationReport) => {
    setInterviewHistory((prev) => [report, ...prev]);
  };

  const toggleBookmarkQuestion = (id: string) => {
    setBookmarkedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleCompleteQuestion = (id: string) => {
    setCompletedQuestionIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const markNlpTopicCompleted = (id: number) => {
    setCompletedNlpTopicIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const markCoachLessonCompleted = (id: string) => {
    setCompletedCoachLessonIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const clearAllData = () => {
    setInterviewHistory([]);
    setBookmarkedQuestionIds([]);
    setCompletedQuestionIds([]);
    setCompletedNlpTopicIds([]);
    setCompletedCoachLessonIds([]);
    setSentEmailRecords([]);
    localStorage.clear();
  };

  return (
    <AppContext.Provider
      value={{
        activeView,
        setActiveView,
        profile,
        updateProfile,
        sessionConfig,
        setSessionConfig,
        launchInterview,
        interviewHistory,
        saveEvaluationReport,
        selectedReportForModal,
        setSelectedReportForModal,
        bookmarkedQuestionIds,
        toggleBookmarkQuestion,
        completedQuestionIds,
        toggleCompleteQuestion,
        completedNlpTopicIds,
        markNlpTopicCompleted,
        completedCoachLessonIds,
        markCoachLessonCompleted,
        reminderSettings,
        updateReminderSettings,
        incomingCall,
        triggerIncomingCall,
        answerIncomingCall,
        declineIncomingCall,
        sentEmailRecords,
        addSentEmailRecord,
        clearAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
