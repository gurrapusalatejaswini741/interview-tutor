import React, { useState, useEffect } from 'react';
import {
  Mic,
  Award,
  Sparkles,
  ArrowRight,
  Cpu,
  GraduationCap,
  CalendarCheck2,
  TrendingUp,
  FolderKanban,
  Play,
  CheckCircle2,
  Clock,
  Flame,
  Mail,
  Phone,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AvatarCharacter } from '../components/AvatarCharacter';
import { MOCK_TRACKS } from '../data/mockTracks';
import { checkSmtpStatus, SmtpStatus } from '../services/gmail';

export const DashboardView: React.FC = () => {
  const {
    profile,
    launchInterview,
    setActiveView,
    interviewHistory,
    completedNlpTopicIds,
    completedQuestionIds,
  } = useApp();

  const [smtpStatus, setSmtpStatus] = useState<SmtpStatus | null>(null);

  useEffect(() => {
    checkSmtpStatus()
      .then((status) => setSmtpStatus(status))
      .catch((e) => console.error('Dashboard failed to check SMTP status:', e));
  }, []);

  const totalInterviews = interviewHistory.length;
  const avgScore =
    totalInterviews > 0
      ? (
          interviewHistory.reduce((acc, curr) => acc + curr.overallScore, 0) /
          totalInterviews
        ).toFixed(1)
      : '8.4';

  const avgTechScore =
    totalInterviews > 0
      ? (
          interviewHistory.reduce((acc, curr) => acc + curr.technicalScore, 0) /
          totalInterviews
        ).toFixed(1)
      : '8.2';

  const avgCommScore =
    totalInterviews > 0
      ? (
          interviewHistory.reduce((acc, curr) => acc + curr.communicationScore, 0) /
          totalInterviews
        ).toFixed(1)
      : '8.7';

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-700 via-indigo-700 to-slate-900 text-white p-6 sm:p-8 shadow-xl shadow-blue-900/20">
        <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-blue-400/20 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 backdrop-blur-md text-amber-300 border border-white/15 mb-3">
            <Flame className="w-3.5 h-3.5 text-amber-300" />
            <span>Placement Interview Preparation Season</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight">
            Welcome, {profile.name.split(' ')[0]}! Ready for your next mock interview?
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-blue-100 leading-relaxed">
            Practice live voice interviews with AI interviewers Ananya and Arjun powered by Google Gemini.
            Get real-time speech transcription, NLP answer evaluations, and personalized feedback.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={() => launchInterview({ interviewer: 'ananya' })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-white text-blue-700 hover:bg-blue-50 shadow-sm transition-transform hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Mic className="w-4 h-4 text-blue-700" />
              <span>Interview with Ananya (HR)</span>
            </button>

            <button
              onClick={() => launchInterview({ interviewer: 'arjun' })}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-blue-600 text-white hover:bg-blue-500 shadow-sm transition-transform hover:scale-102 active:scale-98 cursor-pointer"
            >
              <Play className="w-4 h-4 text-amber-300" />
              <span>Interview with Arjun (Tech)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Prominent Interviewer Cards: Ananya & Arjun */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Select Your AI Interviewer
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Choose individual 1-on-1 interviewers or assemble an executive two-interviewer panel
            </p>
          </div>
          <button
            onClick={() => launchInterview({ interviewer: 'panel' })}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/60 cursor-pointer transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Launch Panel Interview (Both)</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Card 1: Ananya */}
          <div className="relative rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <AvatarCharacter interviewer="ananya" state="idle" size="md" showBadge={false} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Ananya
                      </h3>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                        HR & Behavioural
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Senior Talent Partner & HR Specialist
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                      <span>Warm • Empathetic • STAR Method Expert</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Key Evaluation Topics
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    'Tell Me About Yourself',
                    'Strengths & Weaknesses',
                    'Why Should We Hire You?',
                    'Teamwork & Conflict',
                    'Career Trajectory',
                    'Salary Expectations',
                  ].map((topic, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => launchInterview({ interviewer: 'ananya' })}
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4 text-amber-300" />
              <span>Start Live HR Interview with Ananya</span>
            </button>
          </div>

          {/* Card 2: Arjun */}
          <div className="relative rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all group flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <AvatarCharacter interviewer="arjun" state="idle" size="md" showBadge={false} />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                        Arjun
                      </h3>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300">
                        Technical Lead
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Principal Engineer & Systems Architect
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-[11px] text-slate-400">
                      <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                      <span>Analytical • Sharp • Deep Technical Inquiries</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80">
                <h4 className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                  Key Evaluation Topics
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    '.NET & C#',
                    'Java & Spring Boot',
                    'Python Internals',
                    'OOP & Clean Architecture',
                    'Data Structures & Algorithms',
                    'SQL & Index Optimization',
                    'REST APIs & Microservices',
                  ].map((topic, i) => (
                    <span
                      key={i}
                      className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 font-medium"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => launchInterview({ interviewer: 'arjun' })}
              className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
            >
              <Mic className="w-4 h-4 text-amber-300" />
              <span>Start Live Technical Interview with Arjun</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Spotlight: Master Natural Language Processing (NLP) */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-7 border border-indigo-900/40 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
              <Cpu className="w-3.5 h-3.5" />
              <span>Featured Learning Hub</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Master Natural Language Processing (NLP)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore 20 in-depth curriculum topics covering Tokenization, POS Tagging, NER, TF-IDF,
              Word Embeddings, Transformers, Self-Attention, BERT, LLMs, and RAG. Includes live interactive code
              examples, interview Q&As, and an Interactive NLP Playground.
            </p>
            <div className="flex items-center gap-4 pt-1 text-xs text-slate-400">
              <span>{completedNlpTopicIds.length} of 20 Topics Mastered</span>
              <span>•</span>
              <span className="text-blue-300">Interactive Playground Available</span>
            </div>
          </div>

          <button
            onClick={() => setActiveView('nlp-hub')}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/25 transition-all cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Explore NLP Learning Hub</span>
            <ArrowRight className="w-4 h-4 text-amber-300" />
          </button>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Interviews Completed</span>
            <Award className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {totalInterviews > 0 ? totalInterviews : '3'}
          </div>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle2 className="w-3 h-3" />
            +1 this week
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Average Interview Score</span>
            <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 dark:text-blue-400 mt-2">
            {avgScore} <span className="text-xs font-normal text-slate-400">/ 10</span>
          </div>
          <span className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 block">
            Technical: {avgTechScore} • Comm: {avgCommScore}
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">Daily Questions Solved</span>
            <CalendarCheck2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {completedQuestionIds.length > 0 ? completedQuestionIds.length : '8'}{' '}
            <span className="text-xs font-normal text-slate-400">/ 25 today</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
              style={{
                width: `${Math.min(
                  100,
                  ((completedQuestionIds.length || 8) / 25) * 100
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 shadow-2xs">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">NLP Curriculum Progress</span>
            <Cpu className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 mt-2">
            {completedNlpTopicIds.length}{' '}
            <span className="text-xs font-normal text-slate-400">/ 20</span>
          </div>
          <span className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold mt-1 block">
            {Math.round((completedNlpTopicIds.length / 20) * 100)}% Completed
          </span>
        </div>
      </div>

      {/* Email Automation & AI Phone Screening Quick Access */}
      <div className="rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center shrink-0 shadow-md shadow-[var(--shadow-tint)]">
            <Mail className="w-6 h-6 text-[var(--highlight)]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                Daily Email Automation & Phone Screening
              </h3>
              <span
                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  smtpStatus?.configured
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                }`}
              >
                {smtpStatus?.configured ? 'Gmail SMTP Active' : 'Gmail SMTP Setup Required'}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] mt-0.5">
              {smtpStatus?.configured
                ? `Automated daily placement drills active for ${profile.email} via smtp.gmail.com:587`
                : `Automated drills require GMAIL_ADDRESS and GMAIL_APP_PASSWORD secrets to be set`} • Practice surprise recruiter phone screening calls
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={() => setActiveView('reminders')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] shadow-xs transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4" />
            <span>Manage Daily Reminders</span>
          </button>
          <button
            onClick={() => setActiveView('reminders')}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs transition-all cursor-pointer"
          >
            <Phone className="w-4 h-4" />
            <span>Simulate Recruiter Call</span>
          </button>
        </div>
      </div>

      {/* Two Column Layout: Recommended Tracks & AI Coach */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recommended Tracks (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FolderKanban className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              Targeted Interview Tracks
            </h3>
            <button
              onClick={() => setActiveView('mock-tracks')}
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
            >
              View all 11 tracks →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {MOCK_TRACKS.slice(0, 4).map((track) => (
              <div
                key={track.id}
                onClick={() => launchInterview({ category: track.id, interviewer: track.recommendedInterviewer })}
                className="p-4 rounded-2xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 hover:border-blue-500 dark:hover:border-blue-400 shadow-2xs hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                      {track.badge}
                    </span>
                    <span className="text-[10px] text-slate-400 capitalize">
                      {track.recommendedInterviewer}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {track.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
                    {track.description}
                  </p>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/80">
                  <span className="text-[11px] text-slate-400">3 Difficulty Tiers</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    Practice <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Interview Coach Fast Access (1 Col) */}
        <div className="rounded-3xl bg-white dark:bg-[#131B2E] border border-slate-200 dark:border-slate-800 p-5 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-3">
              <GraduationCap className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
              AI Interview Preparation Coach
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
              Master the 4 critical preparation pillars before stepping into high-stakes interviews:
            </p>

            <div className="mt-4 space-y-2.5">
              {[
                { title: 'Resume Preparation', desc: 'ATS compliance & project metrics' },
                { title: 'HR & Behavioural', desc: 'STAR technique & self introduction' },
                { title: 'Technical Mastery', desc: 'OOP, DSA, and system architecture' },
                { title: 'Communication Skills', desc: 'Eliminating filler words & pauses' },
              ].map((mod, i) => (
                <div
                  key={i}
                  onClick={() => setActiveView('coach')}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 hover:bg-blue-50 dark:hover:bg-blue-950/50 transition-colors cursor-pointer"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-slate-100">
                    {mod.title}
                  </div>
                  <div className="text-[11px] text-slate-400">{mod.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => setActiveView('coach')}
            className="mt-5 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 cursor-pointer transition-all shadow-sm shadow-blue-500/20"
          >
            <span>Open Coach Modules</span>
            <ArrowRight className="w-3.5 h-3.5 text-amber-300" />
          </button>
        </div>
      </div>
    </div>
  );
};
