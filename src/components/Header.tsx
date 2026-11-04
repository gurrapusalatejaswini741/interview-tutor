import React, { useState } from 'react';
import { Menu, Sun, Moon, Mic, Award, Palette, Check } from 'lucide-react';
import { useTheme, ColorTheme } from '../context/ThemeContext';
import { useApp } from '../context/AppContext';

interface HeaderProps {
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onToggleMobileNav }) => {
  const { theme, toggleTheme, colorTheme, setColorTheme, colorThemeOptions } = useTheme();
  const { activeView, setActiveView, profile, launchInterview } = useApp();
  const [showPaletteMenu, setShowPaletteMenu] = useState(false);

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Placement Interview Command Center';
      case 'live-interview':
        return 'Live Voice Interview Room';
      case 'coach':
        return 'AI Interview Preparation Coach';
      case 'nlp-hub':
        return 'Master Natural Language Processing';
      case 'daily':
        return 'Daily Practice Questions (25 High-Yield)';
      case 'mock-tracks':
        return 'Specialized Mock Interview Tracks';
      case 'progress':
        return 'Performance Analytics & Reports';
      case 'settings':
        return 'Profile & Preference Settings';
      default:
        return 'AI Interview Mentor';
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#131B2E]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileNav}
          className="p-2 rounded-xl text-slate-800 dark:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden border border-slate-200 dark:border-slate-800 cursor-pointer"
          aria-label="Toggle navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-50 leading-snug">
            {getPageTitle()}
          </h2>
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>Target Role:</span>
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              {profile.targetRole || profile.selectedTrack}
            </span>
            <span>•</span>
            <span className="text-slate-400 dark:text-slate-500">{profile.experienceLevel}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Track Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/40">
          <Award className="w-3.5 h-3.5" />
          <span>{profile.selectedTrack}</span>
        </div>

        {/* Start Interview CTA button */}
        {activeView !== 'live-interview' && (
          <button
            onClick={() => launchInterview()}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 shadow-sm shadow-blue-500/25 transition-all hover:scale-102 cursor-pointer active:scale-98"
          >
            <Mic className="w-4 h-4 text-amber-300" />
            <span className="hidden sm:inline">Start Live Interview</span>
            <span className="sm:hidden">Live</span>
          </button>
        )}

        {/* Palette Color Switcher */}
        <div className="relative">
          <button
            onClick={() => setShowPaletteMenu(!showPaletteMenu)}
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer flex items-center gap-1.5"
            title="Change UI Color Theme"
          >
            <Palette className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="hidden xl:inline text-xs font-medium">Theme Color</span>
          </button>

          {showPaletteMenu && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowPaletteMenu(false)}
              />
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl p-2 z-50 space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Select UI Color Palette
                </div>
                {colorThemeOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setColorTheme(opt.id);
                      setShowPaletteMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                      colorTheme === opt.id
                        ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs shrink-0"
                        style={{ backgroundColor: opt.primaryColor }}
                      />
                      <span>{opt.name}</span>
                    </div>
                    {colorTheme === opt.id && <Check className="w-4 h-4 text-blue-600" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Theme Dark/Light Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-blue-600" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* User Avatar Circle */}
        <button
          onClick={() => setActiveView('settings')}
          className="w-9 h-9 rounded-xl bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs cursor-pointer hover:ring-2 hover:ring-blue-400 transition-all"
          title="Profile & Settings"
        >
          {profile.name.charAt(0)}
        </button>
      </div>
    </header>
  );
};
