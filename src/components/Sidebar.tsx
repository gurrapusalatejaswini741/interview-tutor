import React from 'react';
import {
  LayoutDashboard,
  Mic,
  GraduationCap,
  Cpu,
  CalendarCheck2,
  FolderKanban,
  TrendingUp,
  Settings,
  Sparkles,
  ChevronRight,
  BellRing,
} from 'lucide-react';
import { useApp, NavView } from '../context/AppContext';

interface SidebarProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { activeView, setActiveView } = useApp();

  const navItems: { id: NavView; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'live-interview', label: 'Live Interview', icon: Mic, badge: 'Live API' },
    { id: 'reminders', label: 'Email & Phone Calls', icon: BellRing, badge: 'Gmail' },
    { id: 'coach', label: 'AI Interview Coach', icon: GraduationCap },
    { id: 'nlp-hub', label: 'NLP Learning Hub', icon: Cpu, badge: '20 Topics' },
    { id: 'daily', label: 'Daily Questions', icon: CalendarCheck2, badge: '25/day' },
    { id: 'mock-tracks', label: 'Mock Interview', icon: FolderKanban },
    { id: 'progress', label: 'My Progress', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: NavView) => {
    setActiveView(id);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden backdrop-blur-xs"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-68 bg-white dark:bg-[#0F1626] border-r border-slate-200 dark:border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo / Brand Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h1 className="font-bold text-sm leading-tight text-slate-900 dark:text-slate-100 tracking-tight">
                AI Interview Mentor
              </h1>
              <p className="text-[11px] font-medium text-blue-600 dark:text-blue-400">
                Live Gemini Simulator
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-semibold tracking-wider uppercase text-slate-400 dark:text-slate-500">
            Navigation
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all group cursor-pointer ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/25 dark:bg-blue-600'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-amber-300' : 'text-blue-600 dark:text-blue-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Interviewer Quick Card in Sidebar */}
        <div className="p-3 m-3 rounded-2xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
              Interviewers
            </span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600" />
            </span>
          </div>
          <div className="space-y-2">
            <div
              onClick={() => handleNavClick('live-interview')}
              className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 cursor-pointer hover:border-blue-500 border border-transparent transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-xs font-bold text-blue-700 dark:text-blue-300">
                  A
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">Ananya</div>
                  <div className="text-[10px] text-slate-400">HR & Behavioural</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div
              onClick={() => handleNavClick('live-interview')}
              className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 cursor-pointer hover:border-blue-500 border border-transparent transition-all shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-xs font-bold text-indigo-700 dark:text-indigo-300">
                  Ar
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">Arjun</div>
                  <div className="text-[10px] text-slate-400">Tech & Systems</div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
