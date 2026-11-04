import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Sparkles,
  BookOpen,
  Code2,
  CheckCircle2,
  HelpCircle,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Award,
} from 'lucide-react';
import { NLP_TOPICS } from '../data/nlpCurriculum';
import { useApp } from '../context/AppContext';
import { NlpPlaygroundModal } from './NlpPlaygroundModal';

export const NlpHubView: React.FC = () => {
  const { completedNlpTopicIds, markNlpTopicCompleted } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedTopicId, setExpandedTopicId] = useState<number | null>(1);
  const [copiedCodeId, setCopiedCodeId] = useState<number | null>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showPlayground, setShowPlayground] = useState<boolean>(false);

  const categories = [
    'All',
    'Foundations',
    'Linguistics & Syntax',
    'Vector Representations',
    'Deep Learning & LLMs',
    'Applications',
  ];

  const filteredTopics = NLP_TOPICS.filter((t) =>
    selectedCategory === 'All' ? true : t.category === selectedCategory
  );

  const handleCopyCode = (id: number, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const handleSelectQuizOption = (quizId: string, optionIndex: number, topicId: number) => {
    setQuizAnswers((prev) => ({ ...prev, [quizId]: optionIndex }));
    markNlpTopicCompleted(topicId);
  };

  return (
    <div className="space-y-6 pb-12">
      {showPlayground && (
        <NlpPlaygroundModal onClose={() => setShowPlayground(false)} />
      )}

      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[var(--primary)] via-[var(--accent)] to-[#0B0F19] text-white p-6 sm:p-8 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[var(--highlight)] border border-white/15">
            <Cpu className="w-3.5 h-3.5 text-[var(--highlight)]" />
            <span>Featured Curriculum: 20 Production-Grade Topics</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Master Natural Language Processing (NLP)
          </h1>

          <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed">
            Gain deep conceptual mastery and practical code experience from classical preprocessing
            and TF-IDF up through Transformers, Attention, BERT, LLMs, and RAG architectures.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowPlayground(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-white text-[var(--primary)] hover:bg-slate-100 shadow-md transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[var(--primary)]" />
              <span>Launch Interactive NLP Playground</span>
            </button>
          </div>
        </div>
      </div>

      {/* Progress & Category Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[var(--bg-card)] p-4 rounded-2xl border border-[var(--border-card)] shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--tint-soft)] text-[var(--primary)] flex items-center justify-center font-bold text-sm">
            {completedNlpTopicIds.length}/20
          </div>
          <div>
            <div className="text-xs font-bold text-[var(--text-primary)]">
              Curriculum Mastery
            </div>
            <div className="text-[11px] text-[var(--text-muted)]">
              {Math.round((completedNlpTopicIds.length / 20) * 100)}% of topics completed
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[var(--primary)] text-white shadow-xs'
                  : 'bg-[var(--bg-page)] text-[var(--text-secondary)] hover:bg-[var(--tint-soft)]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Topics Accordion List */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => {
          const isExpanded = expandedTopicId === topic.id;
          const isCompleted = completedNlpTopicIds.includes(topic.id);

          return (
            <div
              key={topic.id}
              className={`rounded-2xl transition-all border ${
                isExpanded
                  ? 'bg-[var(--bg-card)] border-[var(--primary)] shadow-sm'
                  : 'bg-[var(--bg-card)] border-[var(--border-card)] hover:border-[var(--primary)]/40'
              }`}
            >
              {/* Accordion Header */}
              <div
                onClick={() => setExpandedTopicId(isExpanded ? null : topic.id)}
                className="p-5 flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold ${
                      isCompleted
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400'
                        : 'bg-[var(--bg-page)] text-[var(--text-secondary)]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : topic.id}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-[var(--text-primary)]">
                        {topic.title}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold bg-[var(--tint-soft)] text-[var(--primary)]">
                        {topic.category}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1 mt-0.5">
                      {topic.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </div>

              {/* Accordion Details */}
              {isExpanded && (
                <div className="px-5 pb-6 pt-2 border-t border-[var(--border-card)] space-y-5 text-xs sm:text-sm">
                  {/* Detailed Description */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-1.5">
                      Conceptual Breakdown
                    </h4>
                    <p className="text-[var(--text-primary)] leading-relaxed">
                      {topic.description}
                    </p>
                  </div>

                  {/* Real World Applications */}
                  <div className="p-3.5 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)]">
                    <span className="font-bold text-[var(--primary)] block mb-1">
                      Production & Industry Applications:
                    </span>
                    <p className="text-[var(--text-secondary)]">
                      {topic.realWorldUse}
                    </p>
                  </div>

                  {/* Python Code Example */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-1.5">
                        <Code2 className="w-3.5 h-3.5" />
                        Executable Python Demonstration
                      </h4>
                      <button
                        onClick={() => handleCopyCode(topic.id, topic.pythonCode)}
                        className="flex items-center gap-1 text-[11px] font-semibold text-[var(--primary)] hover:underline cursor-pointer"
                      >
                        {copiedCodeId === topic.id ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Code</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 rounded-xl bg-[#0B0F19] text-slate-100 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                      {topic.pythonCode}
                    </pre>
                  </div>

                  {/* Interview Q&A */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] mb-2 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5" />
                      Placement Interview High-Yield Question
                    </h4>
                    {topic.interviewQuestions.map((iq, i) => (
                      <div
                        key={i}
                        className="p-3.5 rounded-xl bg-[var(--tint-soft)]/40 border border-[var(--primary)]/20 space-y-1.5"
                      >
                        <div className="font-bold text-[var(--text-primary)]">
                          Q: {iq.q}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                          <span className="font-bold text-[var(--primary)]">A: </span>
                          {iq.a}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mini Quiz */}
                  {topic.quiz && topic.quiz.length > 0 && (
                    <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-card)] space-y-3">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5 text-[var(--highlight)]" />
                        Knowledge Verification Quiz
                      </h4>
                      {topic.quiz.map((q) => {
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
                                    onClick={() => handleSelectQuizOption(q.id, optIdx, topic.id)}
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
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
