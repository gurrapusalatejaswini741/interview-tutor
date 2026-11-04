import React, { useState } from 'react';
import {
  GraduationCap,
  FileText,
  Users,
  Code2,
  Mic,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Award,
  BookOpen,
} from 'lucide-react';
import { COACH_MODULES } from '../data/coachCurriculum';
import { useApp } from '../context/AppContext';

export const CoachView: React.FC = () => {
  const { completedCoachLessonIds, markCoachLessonCompleted, profile } = useApp();
  const [selectedModuleId, setSelectedModuleId] = useState<string>('resume');
  const [selectedLessonId, setSelectedLessonId] = useState<string>('ats-mastery');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  // Ask Coach custom interaction
  const [coachQuestion, setCoachQuestion] = useState<string>('');
  const [coachAnswer, setCoachAnswer] = useState<string>('');
  const [askingCoach, setAskingCoach] = useState<boolean>(false);

  const activeModule = COACH_MODULES.find((m) => m.id === selectedModuleId) || COACH_MODULES[0];
  const activeLesson =
    activeModule.lessons.find((l) => l.id === selectedLessonId) || activeModule.lessons[0];

  const handleAskCoach = async () => {
    if (!coachQuestion.trim()) return;
    setAskingCoach(true);
    setCoachAnswer('');
    try {
      const resp = await fetch('/api/coach/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          module: activeModule.title,
          question: coachQuestion,
          userContext: `Target role: ${profile.targetRole}, Track: ${profile.selectedTrack}, Experience: ${profile.experienceLevel}`,
        }),
      });
      const data = await resp.json();
      setCoachAnswer(data.answer);
    } catch (err) {
      console.error('Ask Coach error:', err);
    } finally {
      setAskingCoach(false);
    }
  };

  const handleSelectQuiz = (quizId: string, optIdx: number, lessonId: string) => {
    setQuizAnswers((prev) => ({ ...prev, [quizId]: optIdx }));
    markCoachLessonCompleted(lessonId);
  };

  const getModuleIcon = (id: string) => {
    switch (id) {
      case 'resume':
        return FileText;
      case 'hr':
        return Users;
      case 'technical':
        return Code2;
      case 'communication':
        return Mic;
      default:
        return BookOpen;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[var(--primary)] via-[var(--accent)] to-[#0B0F19] text-white p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[var(--highlight)] border border-white/15">
            <GraduationCap className="w-3.5 h-3.5 text-[var(--highlight)]" />
            <span>Structured Interview Masterclass</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Interview Preparation Coach
          </h1>
          <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed">
            Master the 4 core pillars of placement success: ATS Resumes, HR & Behavioural rounds,
            Technical problem solving, and vocal communication mastery.
          </p>
        </div>
      </div>

      {/* Module Navigation Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {COACH_MODULES.map((mod) => {
          const Icon = getModuleIcon(mod.id);
          const isSelected = selectedModuleId === mod.id;
          return (
            <button
              key={mod.id}
              onClick={() => {
                setSelectedModuleId(mod.id);
                setSelectedLessonId(mod.lessons[0].id);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? 'bg-[var(--bg-card)] border-[var(--primary)] shadow-sm ring-2 ring-[var(--shadow-tint)]'
                  : 'bg-[var(--bg-card)]/60 border-[var(--border-card)] hover:bg-[var(--bg-card)]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                    isSelected
                      ? 'bg-[var(--primary)] text-white'
                      : 'bg-[var(--tint-soft)] text-[var(--primary)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-semibold text-[var(--text-muted)]">
                  {mod.lessons.length} lessons
                </span>
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                  {mod.title}
                </h3>
                <p className="text-[11px] text-[var(--text-muted)] line-clamp-1 mt-0.5">{mod.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Module Content Layout: Lessons List (Left) & Active Lesson (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Lessons Sidebar (4 Cols) */}
        <div className="lg:col-span-4 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-card)] p-4 shadow-2xs space-y-2">
          <div className="px-2 py-1 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
            Lessons in {activeModule.title}
          </div>
          {activeModule.lessons.map((lesson, idx) => {
            const isSelected = selectedLessonId === lesson.id;
            const isCompleted = completedCoachLessonIds.includes(lesson.id);
            return (
              <div
                key={lesson.id}
                onClick={() => setSelectedLessonId(lesson.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[var(--tint-soft)] border-[var(--primary)] text-[var(--primary)] font-bold shadow-2xs'
                    : 'bg-transparent border-transparent text-[var(--text-secondary)] hover:border-[var(--border-card)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>
                    {idx + 1}. {lesson.title}
                  </span>
                  {isCompleted && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />}
                </div>
              </div>
            );
          })}

          {/* Ask AI Coach Section */}
          <div className="pt-4 mt-4 border-t border-[var(--border-card)] space-y-2">
            <span className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[var(--highlight)]" />
              Ask AI Coach Anything
            </span>
            <textarea
              value={coachQuestion}
              onChange={(e) => setCoachQuestion(e.target.value)}
              rows={2}
              placeholder="e.g. How do I explain a 6-month career gap?"
              className="w-full px-3 py-2 rounded-xl text-xs bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--accent)] resize-none"
            />
            <button
              onClick={handleAskCoach}
              disabled={askingCoach || !coachQuestion.trim()}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-all cursor-pointer shadow-xs"
            >
              {askingCoach ? 'Generating Coaching Advice...' : 'Get Personalized Advice'}
            </button>
            {coachAnswer && (
              <div className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)] text-xs text-[var(--text-primary)] max-h-48 overflow-y-auto leading-relaxed">
                {coachAnswer}
              </div>
            )}
          </div>
        </div>

        {/* Right: Active Lesson Body (8 Cols) */}
        <div className="lg:col-span-8 bg-[var(--bg-card)] rounded-3xl border border-[var(--border-card)] p-6 shadow-2xs space-y-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold bg-[var(--tint-soft)] text-[var(--primary)] mb-2">
              <span>{activeModule.title}</span>
            </div>
            <h2 className="text-xl font-bold text-[var(--text-primary)]">
              {activeLesson.title}
            </h2>
          </div>

          {/* Lesson Content Body */}
          <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-card)] text-xs sm:text-sm text-[var(--text-primary)] whitespace-pre-line leading-relaxed">
            {activeLesson.content}
          </div>

          {/* Key Tips */}
          {activeLesson.tips && activeLesson.tips.length > 0 && (
            <div className="p-4 rounded-2xl bg-[var(--tint-soft)]/50 border border-[var(--primary)]/20 space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                Mentor Pro Tips
              </h4>
              <ul className="space-y-1.5 text-xs text-[var(--text-primary)]">
                {activeLesson.tips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-[var(--accent)] font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Before & After Sample Answer Transformation */}
          {activeLesson.sampleAnswer && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[var(--primary)]" />
                Before & After Answer Transformation
              </h4>
              <div className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)] text-xs font-semibold text-[var(--text-primary)]">
                Question: "{activeLesson.sampleAnswer.question}"
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Poor Answer */}
                <div className="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-rose-700 dark:text-rose-400 font-bold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Average / Flawed Answer:</span>
                  </div>
                  <p className="text-rose-900/80 dark:text-rose-200/80 italic">
                    "{activeLesson.sampleAnswer.poorAnswer}"
                  </p>
                  <p className="text-[11px] text-rose-800 dark:text-rose-300 font-medium pt-1 border-t border-rose-200/60 dark:border-rose-900/40">
                    Why it falls short: {activeLesson.sampleAnswer.poorExplanation}
                  </p>
                </div>

                {/* Winning Answer */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Winning Exemplar Answer:</span>
                  </div>
                  <p className="text-emerald-950 dark:text-emerald-100">
                    "{activeLesson.sampleAnswer.winningAnswer}"
                  </p>
                  <p className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium pt-1 border-t border-emerald-200/60 dark:border-emerald-900/40">
                    Why it succeeds: {activeLesson.sampleAnswer.winningExplanation}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Knowledge Check Quiz */}
          {activeModule.quiz && activeModule.quiz.length > 0 && (
            <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-card)] space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-[var(--highlight)]" />
                Module Checkpoint Quiz
              </h4>
              {activeModule.quiz.map((q) => {
                const selectedAns = quizAnswers[q.id];
                const hasAnswered = selectedAns !== undefined;
                const isCorrect = selectedAns === q.correctAnswerIndex;

                return (
                  <div key={q.id} className="space-y-2">
                    <p className="font-semibold text-xs text-[var(--text-primary)]">
                      {q.question}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt, optIdx) => {
                        let btnStyle =
                          'bg-[var(--bg-card)] border-[var(--border-card)] text-[var(--text-primary)]';
                        if (hasAnswered) {
                          if (optIdx === q.correctAnswerIndex) {
                            btnStyle =
                              'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-400 text-emerald-800 dark:text-emerald-300 font-bold';
                          } else if (selectedAns === optIdx) {
                            btnStyle =
                              'bg-rose-100 dark:bg-rose-950/80 border-rose-400 text-rose-800 dark:text-rose-300';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectQuiz(q.id, optIdx, activeLesson.id)}
                            className={`p-2.5 rounded-xl border text-left text-xs transition-all cursor-pointer ${btnStyle}`}
                          >
                            <span className="font-bold mr-1.5">
                              {String.fromCharCode(65 + optIdx)}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {hasAnswered && (
                      <div
                        className={`p-2.5 rounded-xl text-xs ${
                          isCorrect
                            ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        <span className="font-bold">
                          {isCorrect ? 'Correct! ' : 'Incorrect. '}
                        </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
