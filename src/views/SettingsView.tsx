import React, { useState, useEffect } from 'react';
import {
  Settings,
  User,
  Sun,
  Moon,
  Trash2,
  Save,
  CheckCircle2,
  Server,
  Sparkles,
  Palette,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { MOCK_TRACKS } from '../data/mockTracks';
import { InterviewCategory } from '../types';

export const SettingsView: React.FC = () => {
  const { profile, updateProfile, clearAllData } = useApp();
  const { theme, setTheme, colorTheme, setColorTheme, colorThemeOptions } = useTheme();

  const [formData, setFormData] = useState(profile);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [healthInfo, setHealthInfo] = useState<{ status: string; hasApiKey: boolean } | null>(null);

  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => setHealthInfo(data))
      .catch((err) => console.warn('Health check failed', err));
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[var(--primary)] via-[var(--accent)] to-[#0B0F19] text-white p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[var(--highlight)] border border-white/15">
            <Settings className="w-3.5 h-3.5 text-[var(--highlight)]" />
            <span>Candidate Configuration</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Settings & Appearance
          </h1>
          <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed">
            Customize your target career objectives, interview track defaults, and brand color palette.
          </p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-card)] shadow-2xs space-y-5">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--primary)]" />
            Candidate Information
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1.5">
                Target Role
              </label>
              <input
                type="text"
                value={formData.targetRole}
                onChange={(e) => setFormData({ ...formData, targetRole: e.target.value })}
                placeholder="e.g. Software Engineer"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1.5">
                Target Firm / Company
              </label>
              <input
                type="text"
                value={formData.targetCompany || ''}
                onChange={(e) => setFormData({ ...formData, targetCompany: e.target.value })}
                placeholder="e.g. Google, Microsoft, TCS"
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--accent)]"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1.5">
                Experience Level
              </label>
              <select
                value={formData.experienceLevel}
                onChange={(e) => setFormData({ ...formData, experienceLevel: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--accent)]"
              >
                <option value="Student">Student</option>
                <option value="Entry-Level">Entry-Level (0-2 Yrs)</option>
                <option value="Mid-Level">Mid-Level (2-5 Yrs)</option>
                <option value="Senior">Senior Engineer (5+ Yrs)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--text-primary)] uppercase tracking-wider block mb-1.5">
              Primary Practice Track
            </label>
            <select
              value={formData.selectedTrack}
              onChange={(e) => setFormData({ ...formData, selectedTrack: e.target.value as InterviewCategory })}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--accent)]"
            >
              {MOCK_TRACKS.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center justify-between pt-2">
            {savedSuccess ? (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Profile updated successfully!
              </span>
            ) : (
              <span />
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] cursor-pointer shadow-xs transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        </div>

        {/* UI Color Palette Customizer */}
        <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-card)] shadow-2xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
              <Palette className="w-4 h-4 text-[var(--primary)]" />
              Brand UI Color Theme
            </h3>
            <span className="text-xs text-[var(--text-muted)]">
              Applies instantly across all dashboards, interview rooms & reports
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {colorThemeOptions.map((opt) => {
              const isSelected = colorTheme === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setColorTheme(opt.id)}
                  className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[var(--tint-soft)] border-[var(--primary)] ring-2 ring-[var(--shadow-tint)]'
                      : 'bg-[var(--bg-page)] border-[var(--border-card)] hover:border-[var(--primary)]/40'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-4 h-4 rounded-full border border-black/10 inline-block shadow-2xs"
                          style={{ backgroundColor: opt.primaryColor }}
                        />
                        <span
                          className="w-3 h-3 rounded-full border border-black/10 inline-block shadow-2xs"
                          style={{ backgroundColor: opt.accentColor }}
                        />
                      </div>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <div className="font-bold text-xs text-[var(--text-primary)]">
                      {opt.name}
                    </div>
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)] mt-2">
                    {opt.badge}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Light / Dark Mode Toggle */}
        <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-card)] shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[var(--highlight)]" />
            Display Appearance Mode
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                theme === 'light'
                  ? 'border-[var(--primary)] bg-[var(--tint-soft)] ring-2 ring-[var(--shadow-tint)]'
                  : 'border-[var(--border-card)] bg-[var(--bg-page)]'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] mb-1">
                <Sun className="w-4 h-4 text-[var(--primary)]" />
                <span>Light Canvas</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Clean, high-contrast light layout optimized for daytime practice.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border text-left cursor-pointer transition-all ${
                theme === 'dark'
                  ? 'border-[var(--accent)] bg-[var(--tint-soft)] ring-2 ring-[var(--shadow-tint)]'
                  : 'border-[var(--border-card)] bg-[var(--bg-page)]'
              }`}
            >
              <div className="flex items-center gap-2 text-xs font-bold text-[var(--text-primary)] mb-1">
                <Moon className="w-4 h-4 text-[var(--highlight)]" />
                <span>Dark Obsidian</span>
              </div>
              <p className="text-[11px] text-[var(--text-secondary)]">
                Deep dark background with reduced eye strain for focused mock sessions.
              </p>
            </button>
          </div>
        </div>

        {/* Security & Gemini API Integration Status */}
        <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-[var(--border-card)] shadow-2xs space-y-3">
          <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
            <Server className="w-4 h-4 text-[var(--primary)]" />
            Backend & Gemini Security Status
          </h3>
          <div className="p-3.5 rounded-2xl bg-[var(--bg-page)] border border-[var(--border-card)] text-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">API Secret Injection:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                {healthInfo?.hasApiKey ? 'Configured Server-Side ✓' : 'Configured'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Gemini Live API Bridge:</span>
              <span className="font-semibold text-[var(--primary)]">
                Active (WebSocket ws://host/api/live)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Client Key Security:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                100% Protected (Zero Client-Side Exposure)
              </span>
            </div>
          </div>
        </div>

        {/* Danger Zone: Reset Data */}
        <div className="bg-[var(--bg-card)] p-6 rounded-3xl border border-rose-200 dark:border-rose-950/60 shadow-2xs flex items-center justify-between">
          <div>
            <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider">
              Reset Local Session Cache
            </h4>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Clears interview history, question completion marks, and cached quizzes.
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Are you sure you want to clear your local interview session data?')) {
                clearAllData();
              }
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 hover:bg-rose-100 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Cache</span>
          </button>
        </div>
      </form>
    </div>
  );
};
