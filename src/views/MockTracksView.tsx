import React, { useState } from 'react';
import {
  FolderKanban,
  Mic,
  Building2,
  Search,
} from 'lucide-react';
import { MOCK_TRACKS, TrackDetail } from '../data/mockTracks';
import { useApp } from '../context/AppContext';

export const MockTracksView: React.FC = () => {
  const { launchInterview, updateProfile, profile } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [customCompany, setCustomCompany] = useState(profile.targetCompany || 'Google');

  const filteredTracks = MOCK_TRACKS.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleLaunchTrack = (track: TrackDetail) => {
    updateProfile({ selectedTrack: track.id });
    launchInterview({
      category: track.id,
      interviewer: track.recommendedInterviewer,
      targetRole: track.title,
      targetCompany: customCompany,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-[var(--primary)] via-[var(--accent)] to-[#0B0F19] text-white p-6 sm:p-8 shadow-xl">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-[var(--highlight)] border border-white/15">
            <FolderKanban className="w-3.5 h-3.5 text-[var(--highlight)]" />
            <span>11 Targeted Technical & Placement Tracks</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Specialized Mock Interview Tracks
          </h1>
          <p className="text-xs sm:text-sm text-slate-100/90 leading-relaxed">
            Select your target career track to experience realistic, domain-specific interview simulations
            with customized algorithmic, architectural, and behavioral challenges.
          </p>
        </div>
      </div>

      {/* Company-Specific Customizer Bar */}
      <div className="bg-[var(--bg-card)] p-5 rounded-3xl border border-[var(--border-card)] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[var(--tint-soft)] text-[var(--primary)] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              Target Company Customizer
            </h3>
            <p className="text-xs text-[var(--text-muted)]">
              Gemini tailors question style, bar-raiser expectations, and culture questions to your target firm
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="text"
            value={customCompany}
            onChange={(e) => {
              setCustomCompany(e.target.value);
              updateProfile({ targetCompany: e.target.value });
            }}
            placeholder="e.g. Google, Amazon, Microsoft, TCS"
            className="px-3.5 py-2 rounded-xl text-xs sm:text-sm bg-[var(--bg-page)] border border-[var(--border-card)] text-[var(--text-primary)] focus:ring-1 focus:ring-[var(--accent)] w-full md:w-64"
          />
          <span className="text-xs font-semibold px-3 py-2 rounded-xl bg-[var(--tint-soft)] text-[var(--primary)] shrink-0">
            Active Target
          </span>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-3 text-[var(--text-muted)]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter tracks by technology, framework, or skill..."
          className="w-full pl-9 pr-4 py-2.5 rounded-2xl text-xs sm:text-sm bg-[var(--bg-card)] border border-[var(--border-card)] text-[var(--text-primary)] focus:ring-2 focus:ring-[var(--primary)]"
        />
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTracks.map((track) => {
          const isSelected = profile.selectedTrack === track.id;
          return (
            <div
              key={track.id}
              className={`rounded-3xl p-6 transition-all border flex flex-col justify-between group ${
                isSelected
                  ? 'bg-[var(--bg-card)] border-[var(--primary)] shadow-sm ring-2 ring-[var(--shadow-tint)]'
                  : 'bg-[var(--bg-card)] border-[var(--border-card)] hover:border-[var(--primary)]/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--tint-soft)] text-[var(--primary)]">
                    {track.badge}
                  </span>
                  <span className="text-xs text-[var(--text-muted)] capitalize font-medium">
                    Interviewer: {track.recommendedInterviewer}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors">
                  {track.title}
                </h3>

                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  {track.description}
                </p>

                {/* Skills Tags */}
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {track.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[var(--bg-page)] text-[var(--text-primary)] font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Sample Question Preview */}
                <div className="mt-4 pt-3 border-t border-[var(--border-card)]">
                  <span className="text-[10px] uppercase font-bold text-[var(--text-muted)] block mb-1">
                    Sample Question:
                  </span>
                  <p className="text-xs text-[var(--text-secondary)] italic line-clamp-2">
                    "{track.sampleQuestions[0]}"
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[var(--border-card)] flex items-center gap-2">
                <button
                  onClick={() => handleLaunchTrack(track)}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold bg-[var(--primary)] text-white hover:bg-[var(--primary-hover)] transition-all cursor-pointer shadow-xs"
                >
                  <Mic className="w-3.5 h-3.5 text-[var(--highlight)]" />
                  <span>Launch Live Mock</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
