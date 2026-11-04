import React, { useState, useEffect } from 'react';
import {
  CalendarCheck2,
  Bookmark,
  Code2,
  ChevronDown,
  ChevronUp,
  Search,
  Copy,
  Check,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { DailyQuestion } from '../types';

export const DailyQuestionsView: React.FC = () => {
  const {
    profile,
    bookmarkedQuestionIds,
    toggleBookmarkQuestion,
    completedQuestionIds,
    toggleCompleteQuestion,
  } = useApp();

  const [questions, setQuestions] = useState<DailyQuestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('All');
  const [selectedDifficultyFilter, setSelectedDifficultyFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedSnippetId, setCopiedSnippetId] = useState<string | null>(null);
  const [onlyBookmarks, setOnlyBookmarks] = useState<boolean>(false);

  const todayDateString = new Date().toISOString().slice(0, 10);

  const fetchDailyQuestions = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/interview/daily-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          track: profile.selectedTrack,
          date: todayDateString,
        }),
      });
      const data = await resp.json();
      if (data.questions && Array.isArray(data.questions)) {
        setQuestions(data.questions);
        if (data.questions.length > 0 && !expandedId) {
          setExpandedId(data.questions[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to load daily questions:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDailyQuestions();
  }, [profile.selectedTrack]);

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  // Filtering
  const filteredQuestions = questions.filter((q) => {
    if (onlyBookmarks && !bookmarkedQuestionIds.includes(q.id)) return false;
    if (selectedCategoryFilter !== 'All' && q.category !== selectedCategoryFilter) return false;
    if (selectedDifficultyFilter !== 'All' && q.difficulty !== selectedDifficultyFilter) return false;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      return (
        q.question.toLowerCase().includes(query) ||
        q.topic.toLowerCase().includes(query) ||
        q.explanation.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const categories = [
    'All',
    'Programming Fundamentals',
    'Role-Specific Technical',
    'DSA & Problem Solving',
    'Project & Scenario',
    'NLP & AI',
    'HR & Behavioural',
  ];

  const completedCount = questions.filter((q) => completedQuestionIds.includes(q.id)).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[var(--primary)] via-[var(--accent)] to-[#0B0F19] text-white p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[var(--highlight)] border border-white/15">
            <CalendarCheck2 className="w-3.5 h-3.5 text-[var(--highlight)]" />
            <span>Today's Placement Drill: {todayDateString}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Daily Interview Questions (Exactly 25 High-Yield)
          </h1>
          <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed">
            Curated daily set tailored for <span className="font-semibold text-white">{profile.selectedTrack}</span>.
            Includes 5 Programming, 5 Role-Specific, 5 DSA, 5 Project/Scenario, 3 NLP/AI, and 2 HR questions.
          </p>
        </div>
      </div>

      {/* Progress & Filters Bar */}
      <div className="bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-card)] shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--tint-soft)] text-[var(--primary)] flex items-center justify-center font-bold text-sm">
              {completedCount}/25
            </div>
            <div>
              <div className="text-xs font-bold text-[var(--text-primary)]">
                Daily Completion
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                {Math.round((completedCount / 25) * 100)}% completed today
              </div>
            </div>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[var(--text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search question, keyword, or topic..."
              className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--accent)]"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyBookmarks(!onlyBookmarks)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                onlyBookmarks
                  ? 'bg-[var(--highlight)] text-slate-900 border-transparent font-bold'
                  : 'bg-[var(--bg-page)] border-[var(--border-card)] text-[var(--text-secondary)]'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarks ({bookmarkedQuestionIds.length})</span>
            </button>

            <button
              onClick={fetchDailyQuestions}
              title="Refresh Questions"
              className="p-2 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-secondary)] hover:text-[var(--primary)] cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategoryFilter(cat)}
              className={`px-3 py-1 rounded-xl text-[11px] font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategoryFilter === cat
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'bg-[var(--bg-page)] text-[var(--text-secondary)] hover:bg-[var(--tint-soft)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Questions List */}
      {loading ? (
        <div className="p-12 text-center text-[var(--text-muted)] space-y-3">
          <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[var(--primary)]" />
          <p className="text-xs">Generating today's 25 questions with Gemini...</p>
        </div>
      ) : filteredQuestions.length === 0 ? (
        <div className="p-12 text-center text-[var(--text-muted)] bg-[var(--bg-card)] rounded-2xl border border-[var(--border-card)]">
          <p className="text-xs">No questions matched your filter or search criteria.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredQuestions.map((q) => {
            const isExpanded = expandedId === q.id;
            const isCompleted = completedQuestionIds.includes(q.id);
            const isBookmarked = bookmarkedQuestionIds.includes(q.id);

            return (
              <div
                key={q.id}
                className={`rounded-2xl transition-all border ${
                  isExpanded
                    ? 'bg-[var(--bg-card)] border-[var(--primary)] shadow-sm'
                    : 'bg-[var(--bg-card)] border-[var(--border-card)] hover:border-[var(--primary)]/40'
                }`}
              >
                {/* Header Row */}
                <div className="p-4 flex items-start justify-between gap-3">
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : q.id)}
                    className="flex-1 flex items-start gap-3 cursor-pointer"
                  >
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompleteQuestion(q.id);
                      }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                        isCompleted
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[var(--bg-page)] text-[var(--text-muted)] hover:bg-emerald-100 dark:hover:bg-emerald-950/60'
                      }`}
                      title={isCompleted ? 'Mark Incomplete' : 'Mark Completed'}
                    >
                      {isCompleted ? <Check className="w-3.5 h-3.5" /> : q.number}
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--tint-soft)] text-[var(--primary)]">
                          {q.category}
                        </span>
                        <span className="text-[10px] text-[var(--text-muted)]">Topic: {q.topic}</span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            q.difficulty === 'Beginner'
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
                              : q.difficulty === 'Intermediate'
                              ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300'
                              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                      <h3
                        className={`text-xs sm:text-sm font-bold ${
                          isCompleted
                            ? 'line-through text-[var(--text-muted)]'
                            : 'text-[var(--text-primary)]'
                        }`}
                      >
                        {q.question}
                      </h3>
                    </div>
                  </div>

                  {/* Actions: Bookmark & Expand */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => toggleBookmarkQuestion(q.id)}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'text-[var(--highlight)] bg-[var(--highlight)]/15'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                      }`}
                      title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Question'}
                    >
                      <Bookmark className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : q.id)}
                      className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-4 pb-5 pt-1 border-t border-[var(--border-card)] space-y-4 text-xs sm:text-sm">
                    {/* Explanation */}
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] block mb-1">
                        Conceptual Explanation
                      </span>
                      <p className="text-[var(--text-secondary)] leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>

                    {/* Interview-Ready Answer */}
                    <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-1.5">
                      <span className="font-bold text-xs uppercase tracking-wider text-emerald-800 dark:text-emerald-400 block">
                        Interview-Ready Model Answer:
                      </span>
                      <p className="text-[var(--text-primary)] leading-relaxed">
                        {q.interviewReadyAnswer}
                      </p>
                    </div>

                    {/* Code Snippet if applicable */}
                    {q.codeSnippet && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-1.5">
                            <Code2 className="w-3.5 h-3.5" />
                            Code Reference
                          </span>
                          <button
                            onClick={() => handleCopyCode(q.id, q.codeSnippet!)}
                            className="flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                          >
                            {copiedSnippetId === q.id ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        <pre className="p-3.5 rounded-xl bg-[#0B0F19] text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                          {q.codeSnippet}
                        </pre>
                      </div>
                    )}

                    {/* Follow-up question & Key Concepts */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)]">
                        <span className="font-bold text-xs text-[var(--primary)] block mb-1">
                          Likely Follow-Up Question:
                        </span>
                        <p className="text-xs text-[var(--text-secondary)]">
                          {q.followUpQuestion}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)]">
                        <span className="font-bold text-xs text-[var(--primary)] block mb-1">
                          Key Takeaway Concepts:
                        </span>
                        <ul className="text-xs text-[var(--text-secondary)] space-y-0.5">
                          {q.keyConcepts.map((kc, i) => (
                            <li key={i}>• {kc}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
