import React from 'react';
import {
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { useApp } from '../context/AppContext';

export const ProgressView: React.FC = () => {
  const { interviewHistory, setSelectedReportForModal, launchInterview } = useApp();

  const totalInterviews = interviewHistory.length;

  const avgOverall =
    totalInterviews > 0
      ? (
          interviewHistory.reduce((acc, curr) => acc + curr.overallScore, 0) /
          totalInterviews
        ).toFixed(1)
      : '0.0';

  const avgTechnical =
    totalInterviews > 0
      ? (
          interviewHistory.reduce((acc, curr) => acc + curr.technicalScore, 0) /
          totalInterviews
        ).toFixed(1)
      : '0.0';

  const avgCommunication =
    totalInterviews > 0
      ? (
          interviewHistory.reduce((acc, curr) => acc + curr.communicationScore, 0) /
          totalInterviews
        ).toFixed(1)
      : '0.0';

  // Radar Data for latest or aggregate report
  const latestReport = interviewHistory[0];
  const radarData = [
    { subject: 'Relevance', score: latestReport?.dimensions?.relevance || 8.5 },
    { subject: 'Similarity', score: latestReport?.dimensions?.semanticSimilarity || 8.2 },
    { subject: 'Tech Depth', score: latestReport?.dimensions?.technicalAccuracy || 8.0 },
    { subject: 'Grammar', score: latestReport?.dimensions?.grammar || 8.7 },
    { subject: 'Vocabulary', score: latestReport?.dimensions?.vocabulary || 8.1 },
    { subject: 'Clarity', score: latestReport?.dimensions?.clarity || 8.6 },
    { subject: 'Conciseness', score: latestReport?.dimensions?.conciseness || 7.8 },
    { subject: 'Structure', score: latestReport?.dimensions?.structure || 8.4 },
    { subject: 'Completeness', score: latestReport?.dimensions?.completeness || 8.0 },
    { subject: 'Effectiveness', score: latestReport?.dimensions?.communicationEffectiveness || 8.5 },
  ];

  // Weekly progress trend
  const weeklyData =
    interviewHistory.length > 0
      ? interviewHistory
          .slice(0, 7)
          .reverse()
          .map((item, idx) => ({
            name: `Session ${idx + 1}`,
            overall: item.overallScore,
            tech: item.technicalScore,
            comm: item.communicationScore,
          }))
      : [
          { name: 'Start', overall: 6.5, tech: 6.0, comm: 7.0 },
          { name: 'Mock 1', overall: 7.2, tech: 7.0, comm: 7.4 },
          { name: 'Mock 2', overall: 7.8, tech: 7.6, comm: 8.0 },
          { name: 'Mock 3', overall: 8.4, tech: 8.2, comm: 8.6 },
        ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[var(--primary)] via-[var(--accent)] to-[#0B0F19] text-white p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[var(--highlight)] border border-white/15">
            <TrendingUp className="w-3.5 h-3.5 text-[var(--highlight)]" />
            <span>Placement Readiness Tracking</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Performance Analytics & History
          </h1>
          <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed">
            Review detailed evaluations from past live interviews, pinpoint your strongest and
            weakest areas, and track your trajectory across technical depth and communication skills.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xs">
          <span className="text-xs font-semibold text-[var(--text-muted)]">Total Interviews</span>
          <div className="text-3xl font-extrabold text-[var(--text-primary)] mt-1">
            {totalInterviews}
          </div>
          <span className="text-[11px] text-[var(--primary)] mt-1 block font-medium">
            Recorded in session history
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xs">
          <span className="text-xs font-semibold text-[var(--text-muted)]">Average Overall Score</span>
          <div className="text-3xl font-extrabold text-[var(--primary)] mt-1">
            {avgOverall} <span className="text-xs font-normal text-[var(--text-muted)]">/ 10</span>
          </div>
          <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
            Across all mock rounds
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xs">
          <span className="text-xs font-semibold text-[var(--text-muted)]">Technical Depth Score</span>
          <div className="text-3xl font-extrabold text-[var(--accent)] mt-1">
            {avgTechnical} <span className="text-xs font-normal text-[var(--text-muted)]">/ 10</span>
          </div>
          <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
            Evaluated by Arjun & Gemini
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xs">
          <span className="text-xs font-semibold text-[var(--text-muted)]">Communication Score</span>
          <div className="text-3xl font-extrabold text-[var(--highlight)] mt-1">
            {avgCommunication} <span className="text-xs font-normal text-[var(--text-muted)]">/ 10</span>
          </div>
          <span className="text-[11px] text-[var(--text-secondary)] mt-1 block">
            Evaluated by Ananya & Gemini
          </span>
        </div>
      </div>

      {/* Visual Analytics Grid: Radar Chart + Progress Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart: 10 Dimensions */}
        <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                10-Dimensional NLP Competency Radar
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Linguistic, cognitive, and domain mastery breakdown
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#64748B" strokeOpacity={0.25} />
                <PolarAngleAxis
                  dataKey="subject"
                  tick={{ fill: '#64748B', fontSize: 11 }}
                />
                <PolarRadiusAxis angle={30} domain={[0, 10]} stroke="#64748B" />
                <Radar
                  name="Score"
                  dataKey="score"
                  stroke="#2563EB"
                  fill="#3B82F6"
                  fillOpacity={0.35}
                />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Trend Over Time */}
        <div className="p-6 rounded-3xl bg-[var(--bg-card)] border border-[var(--border-card)] shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[var(--text-primary)]">
                Performance Progression Over Time
              </h3>
              <p className="text-xs text-[var(--text-muted)]">
                Overall, Technical, and Communication improvement
              </p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorOverall" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTech" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#64748B" fontSize={11} />
                <YAxis domain={[0, 10]} stroke="#64748B" fontSize={11} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="overall"
                  stroke="#2563EB"
                  fillOpacity={1}
                  fill="url(#colorOverall)"
                  name="Overall"
                />
                <Area
                  type="monotone"
                  dataKey="tech"
                  stroke="#6366F1"
                  fillOpacity={1}
                  fill="url(#colorTech)"
                  name="Technical"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Weakest vs Strongest Topics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-2 mb-3">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Demonstrated Strongest Topics
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              'REST API Idempotency',
              'Object-Oriented Programming (SOLID)',
              'Self Introduction Delivery',
              'Database B-Tree Indexing',
              'Teamwork Scenarios',
            ].map((topic, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 font-medium"
              >
                ✓ {topic}
              </span>
            ))}
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)]">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            Recommended Focus & Growth Areas
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              'Eliminating Filler Words ("Um", "Uh")',
              'STAR Method Result Quantification',
              'Distributed System Fallback Strategies',
              'Complex Tree/Graph Edge Cases',
            ].map((topic, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-900 font-medium"
              >
                ! {topic}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Complete Interview History List */}
      <div className="bg-[var(--bg-card)] rounded-3xl border border-[var(--border-card)] p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-[var(--text-primary)]">
            Past Interview History
          </h3>
          <span className="text-xs text-[var(--text-muted)]">
            Click any session to view complete NLP report
          </span>
        </div>

        {interviewHistory.length === 0 ? (
          <div className="p-8 text-center text-[var(--text-muted)] space-y-3">
            <p className="text-xs">
              No interview sessions recorded yet. Complete your first mock interview to see full analytics!
            </p>
            <button
              onClick={() => launchInterview()}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer"
            >
              Start First Mock Interview
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {interviewHistory.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReportForModal(report)}
                className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-card)] hover:border-[var(--primary)] transition-all cursor-pointer flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-card)] flex items-center justify-center font-extrabold text-sm text-[var(--primary)]">
                    {report.overallScore.toFixed(1)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                        {report.category}
                      </h4>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--tint-soft)] text-[var(--primary)] font-semibold">
                        {report.difficulty}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      Interviewer: {report.interviewer === 'ananya' ? 'Ananya (HR)' : report.interviewer === 'arjun' ? 'Arjun (Tech)' : 'Panel'} • {new Date(report.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col text-right text-xs">
                    <span className="font-semibold text-[var(--primary)]">
                      Tech: {report.technicalScore.toFixed(1)}
                    </span>
                    <span className="text-[var(--text-muted)]">
                      Comm: {report.communicationScore.toFixed(1)}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
