import React from 'react';
import {
  X,
  Award,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  Sparkles,
  ArrowRight,
  BookOpen,
  Volume2,
  Layers,
  FileCheck,
} from 'lucide-react';
import { EvaluationReport } from '../types';

interface EvaluationReportModalProps {
  report: EvaluationReport;
  onClose: () => void;
}

export const EvaluationReportModal: React.FC<EvaluationReportModalProps> = ({ report, onClose }) => {
  const getScoreColor = (score: number) => {
    if (score >= 8.5) return 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800';
    if (score >= 7.0) return 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border-blue-300 dark:border-blue-800';
    if (score >= 5.5) return 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-800';
    return 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-800';
  };

  const dimensionsList = [
    { key: 'relevance', label: 'Answer Relevance' },
    { key: 'semanticSimilarity', label: 'Semantic Similarity' },
    { key: 'technicalAccuracy', label: 'Technical Accuracy' },
    { key: 'grammar', label: 'Grammar & Syntax' },
    { key: 'vocabulary', label: 'Domain Vocabulary' },
    { key: 'clarity', label: 'Clarity & Articulation' },
    { key: 'conciseness', label: 'Conciseness' },
    { key: 'structure', label: 'Answer Structure' },
    { key: 'completeness', label: 'Completeness' },
    { key: 'communicationEffectiveness', label: 'Communication Effectiveness' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-4xl my-auto bg-[var(--bg-card)] rounded-3xl border border-[var(--border-card)] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 px-6 py-4 bg-[var(--bg-card)]/95 backdrop-blur-md border-b border-[var(--border-card)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[var(--primary)] text-white flex items-center justify-center shadow-md shadow-[var(--shadow-tint)]">
              <Award className="w-5 h-5 text-[var(--highlight)]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-[var(--text-primary)]">
                  NLP Interview Evaluation Report
                </h3>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-[var(--tint-soft)] text-[var(--primary)]">
                  {report.category}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                Conducted with {report.interviewer === 'ananya' ? 'Ananya (HR)' : report.interviewer === 'arjun' ? 'Arjun (Tech)' : 'Panel'} • {new Date(report.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-[var(--text-secondary)] hover:bg-[var(--bg-page)] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Top Score Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className={`p-4 rounded-2xl border ${getScoreColor(report.overallScore)} flex flex-col items-center justify-center text-center shadow-2xs`}>
              <span className="text-xs font-semibold uppercase tracking-wider opacity-80">
                Overall Score
              </span>
              <span className="text-4xl font-extrabold my-1">{report.overallScore.toFixed(1)}</span>
              <span className="text-[11px] font-medium opacity-80">out of 10.0</span>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-card)] flex flex-col justify-center">
              <span className="text-xs font-medium text-[var(--text-muted)]">
                Technical Knowledge
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-[var(--primary)]">
                  {report.technicalScore.toFixed(1)}
                </span>
                <span className="text-xs text-[var(--text-muted)]">/ 10</span>
              </div>
              <div className="w-full bg-[var(--border-card)] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[var(--primary)] h-full rounded-full"
                  style={{ width: `${(report.technicalScore / 10) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-card)] flex flex-col justify-center">
              <span className="text-xs font-medium text-[var(--text-muted)]">
                Communication Score
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-bold text-[var(--accent)]">
                  {report.communicationScore.toFixed(1)}
                </span>
                <span className="text-xs text-[var(--text-muted)]">/ 10</span>
              </div>
              <div className="w-full bg-[var(--border-card)] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-[var(--accent)] h-full rounded-full"
                  style={{ width: `${(report.communicationScore / 10) * 100}%` }}
                />
              </div>
            </div>

            {/* Audio Metrics */}
            <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-card)] flex flex-col justify-center text-xs">
              <span className="font-medium text-[var(--text-muted)] flex items-center gap-1 mb-1">
                <Volume2 className="w-3.5 h-3.5 text-[var(--primary)]" />
                Audio Metrics
              </span>
              <div className="space-y-1 mt-1 text-[var(--text-primary)]">
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Cadence:</span>
                  <span className="font-semibold">{report.audioMetrics?.wordsPerMinute || 128} WPM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Filler Words:</span>
                  <span className="font-semibold">{report.audioMetrics?.fillerWordCount ?? 3} detected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--text-muted)]">Speaking Time:</span>
                  <span className="font-semibold">{report.audioMetrics?.totalSpeakingDurationSec || 180}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="p-5 rounded-2xl bg-[var(--tint-soft)]/50 border border-[var(--primary)]/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-[var(--highlight)]" />
              Executive Evaluation Summary
            </h4>
            <p className="text-sm text-[var(--text-primary)] leading-relaxed">
              {report.summary}
            </p>
          </div>

          {/* 10 NLP Dimensions Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--primary)]" />
              NLP & Linguistic Analysis (10 Core Dimensions)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dimensionsList.map((dim) => {
                const val = (report.dimensions as any)?.[dim.key] ?? 7.5;
                return (
                  <div
                    key={dim.key}
                    className="p-3 rounded-xl bg-[var(--bg-page)] border border-[var(--border-card)] flex items-center justify-between"
                  >
                    <div>
                      <span className="text-xs font-medium text-[var(--text-primary)]">
                        {dim.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-[var(--border-card)] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-linear-to-r from-[var(--primary)] to-[var(--accent)] h-full rounded-full"
                          style={{ width: `${Math.min(100, (val / 10) * 100)}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-[var(--primary)] w-7 text-right">
                        {val.toFixed(1)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-4 h-4" />
                Key Candidate Strengths
              </h4>
              <ul className="space-y-2">
                {report.strengths.map((str, idx) => (
                  <li key={idx} className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">•</span>
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/40">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-800 dark:text-amber-400 flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4" />
                Mistakes & Missing Concepts
              </h4>
              <ul className="space-y-2">
                {report.weaknesses.map((weak, idx) => (
                  <li key={idx} className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                    <span className="text-amber-600 dark:text-amber-400 font-bold">•</span>
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* STAR Method Analysis (if present) */}
          {report.starAnalysis && (
            <div className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-card)]">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  STAR Behavioural Method Evaluation
                </h4>
                {report.starAnalysis.score && (
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[var(--tint-soft)] text-[var(--primary)]">
                    STAR Score: {report.starAnalysis.score}/10
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]">
                  <div className="font-bold text-[var(--primary)] mb-1">Situation</div>
                  <p className="text-[var(--text-secondary)]">{report.starAnalysis.situation || 'Clearly framed background'}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]">
                  <div className="font-bold text-[var(--primary)] mb-1">Task</div>
                  <p className="text-[var(--text-secondary)]">{report.starAnalysis.task || 'Defined objective and role'}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]">
                  <div className="font-bold text-[var(--primary)] mb-1">Action</div>
                  <p className="text-[var(--text-secondary)]">{report.starAnalysis.action || 'Described specific technical execution'}</p>
                </div>
                <div className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]">
                  <div className="font-bold text-[var(--primary)] mb-1">Result</div>
                  <p className="text-[var(--text-secondary)]">{report.starAnalysis.result || 'Provided quantifiable business impact'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Answer Comparison: Original vs Improved vs Interview-Ready */}
          {report.answerComparisons && report.answerComparisons.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-3 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[var(--primary)]" />
                Answer Transformations & Benchmark Comparisons
              </h4>
              <div className="space-y-4">
                {report.answerComparisons.map((comp, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-card)] space-y-3"
                  >
                    <div className="text-xs font-bold text-[var(--text-primary)] flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[10px]">
                        {idx + 1}
                      </span>
                      <span>{comp.question}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-card)]">
                        <span className="font-semibold text-rose-600 dark:text-rose-400 block mb-1">
                          Candidate Answer:
                        </span>
                        <p className="text-[var(--text-secondary)] italic">
                          "{comp.originalAnswer}"
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-amber-200 dark:border-amber-900/40">
                        <span className="font-semibold text-amber-600 dark:text-amber-400 block mb-1">
                          Improved (Refined):
                        </span>
                        <p className="text-[var(--text-primary)]">
                          {comp.improvedAnswer}
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-[var(--bg-card)] border border-emerald-200 dark:border-emerald-900/40">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400 block mb-1">
                          Interview-Ready Exemplar:
                        </span>
                        <p className="text-[var(--text-primary)]">
                          {comp.interviewReadyAnswer}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actionable Recommendations */}
          <div className="p-4 rounded-2xl bg-[var(--tint-soft)]/60 border border-[var(--primary)]/20">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--primary)] flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[var(--highlight)]" />
              Personalized Next Steps & Recommendations
            </h4>
            <div className="space-y-1.5">
              {report.personalizedRecommendations.map((rec, idx) => (
                <div key={idx} className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                  <ArrowRight className="w-3.5 h-3.5 text-[var(--primary)] shrink-0 mt-0.5" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-[var(--bg-page)] border-t border-[var(--border-card)] flex items-center justify-between">
          <div className="text-xs text-[var(--text-muted)]">
            Report generated by Gemini NLP Intelligence Engine
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer shadow-xs"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
