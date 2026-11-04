import React from 'react';
import { Phone, PhoneOff, Volume2, Sparkles, Building2, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const IncomingCallModal: React.FC = () => {
  const { incomingCall, answerIncomingCall, declineIncomingCall } = useApp();

  if (!incomingCall.isRinging) return null;

  const isAnanya = incomingCall.caller === 'ananya';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-linear-to-b from-slate-900 via-slate-950 to-black text-white rounded-3xl p-8 border border-white/10 shadow-2xl overflow-hidden flex flex-col items-center text-center">
        {/* Glow ambient background */}
        <div
          className={`absolute -top-24 w-64 h-64 rounded-full blur-3xl opacity-30 ${
            isAnanya ? 'bg-amber-500' : 'bg-blue-600'
          }`}
        />

        {/* Incoming Call Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-white/10 border border-white/15 text-emerald-400 mb-6 animate-pulse">
          <Volume2 className="w-3.5 h-3.5" />
          <span>INCOMING INTERVIEW SCREENING CALL...</span>
        </div>

        {/* Caller Avatar with Pulse Ring */}
        <div className="relative mb-5">
          <div className="absolute inset-0 rounded-full bg-emerald-500/20 animate-ping duration-1000" />
          <div
            className={`w-28 h-28 rounded-full border-4 flex items-center justify-center overflow-hidden shadow-xl ${
              isAnanya ? 'border-amber-400/80 bg-amber-950' : 'border-blue-500/80 bg-blue-950'
            }`}
          >
            <img
              src={
                isAnanya
                  ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80'
                  : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
              }
              alt={incomingCall.callerName}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Caller Info */}
        <h2 className="text-2xl font-extrabold tracking-tight text-white mb-1">
          {incomingCall.callerName}
        </h2>
        <p className="text-xs font-semibold text-emerald-400 mb-2">
          {incomingCall.callerRole}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-8 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
          <Building2 className="w-3.5 h-3.5 text-amber-300" />
          <span>{incomingCall.targetCompany} • {incomingCall.category}</span>
        </div>

        <p className="text-[11px] text-slate-400 mb-8 max-w-xs leading-relaxed">
          Spontaneous screening round simulation. Answer now to test your quick-thinking and communication under real recruiter call conditions.
        </p>

        {/* Answer / Decline Action Buttons */}
        <div className="flex items-center justify-around w-full max-w-xs px-2">
          {/* Decline Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={declineIncomingCall}
              className="w-16 h-16 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-rose-600/40 transition-all cursor-pointer"
              title="Decline Call"
            >
              <PhoneOff className="w-7 h-7" />
            </button>
            <span className="text-xs font-medium text-slate-400">Decline</span>
          </div>

          {/* Answer Button */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={answerIncomingCall}
              className="w-16 h-16 rounded-full bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-white flex items-center justify-center shadow-lg shadow-emerald-500/50 animate-bounce transition-all cursor-pointer"
              title="Answer Call"
            >
              <Phone className="w-7 h-7" />
            </button>
            <span className="text-xs font-bold text-emerald-400">Answer</span>
          </div>
        </div>
      </div>
    </div>
  );
};
