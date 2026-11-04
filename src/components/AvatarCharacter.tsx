import React from 'react';
import { InterviewerId } from '../types';

interface AvatarCharacterProps {
  interviewer: InterviewerId;
  state: 'idle' | 'listening' | 'speaking';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
}

export const AvatarCharacter: React.FC<AvatarCharacterProps> = ({
  interviewer,
  state,
  size = 'lg',
  showBadge = true,
}) => {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-44 h-44 sm:w-56 sm:h-56',
    xl: 'w-64 h-64 sm:w-80 sm:h-80',
  }[size];

  if (interviewer === 'panel') {
    return (
      <div className="flex flex-col items-center">
        <div className="flex items-center justify-center -space-x-8 sm:-space-x-12">
          <AvatarSingle character="ananya" state={state === 'speaking' ? 'speaking' : 'idle'} size={size === 'xl' ? 'lg' : 'md'} />
          <AvatarSingle character="arjun" state={state === 'speaking' ? 'speaking' : 'idle'} size={size === 'xl' ? 'lg' : 'md'} />
        </div>
        {showBadge && (
          <div className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-wide bg-[#176B50]/10 dark:bg-[#27966F]/20 text-[#176B50] dark:text-[#45B58B] border border-[#176B50]/20">
            <span className="w-2 h-2 rounded-full bg-[#27966F] animate-pulse" />
            Executive Panel: Ananya (HR) & Arjun (Tech Lead)
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <AvatarSingle character={interviewer} state={state} size={size} />
      {showBadge && (
        <div className="mt-3 sm:mt-4 flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-white/80 dark:bg-[#1B3028]/80 backdrop-blur shadow-xs border border-[#176B50]/20 dark:border-[#27966F]/30 text-[#25352D] dark:text-[#F4F5EF]">
          <span
            className={`w-2 h-2 rounded-full ${
              state === 'speaking'
                ? 'bg-amber-500 animate-ping'
                : state === 'listening'
                ? 'bg-[#27966F] animate-pulse'
                : 'bg-emerald-600/40'
            }`}
          />
          <span className="capitalize font-semibold text-[#176B50] dark:text-[#45B58B]">
            {interviewer === 'ananya' ? 'Ananya' : 'Arjun'}
          </span>
          <span className="text-[#82988E]">•</span>
          <span className="text-xs text-[#5A7065] dark:text-[#B4C3BA]">
            {state === 'speaking'
              ? 'Speaking...'
              : state === 'listening'
              ? 'Listening intently...'
              : 'Active'}
          </span>
        </div>
      )}
    </div>
  );
};

const AvatarSingle: React.FC<{
  character: 'ananya' | 'arjun';
  state: 'idle' | 'listening' | 'speaking';
  size: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ character, state, size }) => {
  const isAnanya = character === 'ananya';

  const containerSizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-44 h-44 sm:w-56 sm:h-56',
    xl: 'w-60 h-60 sm:w-72 sm:h-72',
  }[size];

  return (
    <div className={`relative flex items-center justify-center ${containerSizes}`}>
      {/* Outer Glow & Status Aura */}
      {state === 'speaking' && (
        <div className="absolute inset-0 rounded-full bg-linear-to-tr from-amber-400/25 via-emerald-500/20 to-teal-400/25 animate-ping opacity-75 blur-xs" />
      )}
      {state === 'listening' && (
        <div className="absolute inset-0 rounded-full bg-[#27966F]/20 animate-ring-pulse blur-xs" />
      )}

      {/* Main Avatar Circle */}
      <div
        className={`relative w-full h-full rounded-full overflow-hidden border-3 shadow-lg transition-all duration-300 ${
          state === 'speaking'
            ? 'border-amber-400 dark:border-amber-400 ring-4 ring-amber-400/30'
            : state === 'listening'
            ? 'border-[#27966F] dark:border-[#45B58B] ring-4 ring-[#27966F]/30'
            : 'border-[#176B50]/30 dark:border-[#27966F]/30'
        } ${isAnanya ? 'bg-linear-to-b from-[#F3EBE0] to-[#E2D4C3] dark:from-[#23382F] dark:to-[#172922]' : 'bg-linear-to-b from-[#E0EBF3] to-[#C9DBE8] dark:from-[#1E333C] dark:to-[#14232B]'}`}
      >
        {isAnanya ? (
          // Ananya: Female HR Professional Vector Avatar
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
            {/* Background Radial Shade */}
            <circle cx="100" cy="100" r="95" fill="url(#ananya-bg)" />
            <defs>
              <radialGradient id="ananya-bg" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#FFF9F2" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#DFD2C4" stopOpacity="0.4" />
              </radialGradient>
            </defs>

            {/* Torso & Professional Blazer (Emerald / Forest Green) */}
            <path
              d="M35 200 C35 155, 60 142, 100 142 C140 142, 165 155, 165 200 Z"
              fill="#176B50"
            />
            {/* Blouse / Inner Collar */}
            <path d="M85 142 L100 170 L115 142 Z" fill="#F8F5ED" />
            <path d="M72 142 L100 185 L104 142" stroke="#E8C98A" strokeWidth="1.5" />
            {/* Lapels */}
            <path d="M55 145 L85 195 L100 195 L80 142 Z" fill="#125740" />
            <path d="M145 145 L115 195 L100 195 L120 142 Z" fill="#125740" />

            {/* Neck & Pendant */}
            <path d="M88 115 C88 135, 112 135, 112 115 Z" fill="#DCA382" />
            <circle cx="100" cy="138" r="3.5" fill="#E8C98A" />

            {/* Long Dark Hair (Back) */}
            <path
              d="M50 85 C45 130, 48 160, 58 175 C62 150, 68 115, 68 100 Z"
              fill="#2C1B18"
            />
            <path
              d="M150 85 C155 130, 152 160, 142 175 C138 150, 132 115, 132 100 Z"
              fill="#2C1B18"
            />

            {/* Face Shape */}
            <path
              d="M68 85 C68 126, 132 126, 132 85 C132 50, 68 50, 68 85 Z"
              fill="#E8B291"
            />

            {/* Professional Hair (Front/Bangs) */}
            <path
              d="M66 80 C68 50, 90 38, 100 38 C120 38, 134 50, 134 80 C130 65, 118 55, 100 55 C82 55, 70 65, 66 80 Z"
              fill="#201311"
            />
            {/* Side Hair strands */}
            <path d="M68 75 C64 90, 65 110, 70 120 C67 105, 68 85, 70 75 Z" fill="#201311" />
            <path d="M132 75 C136 90, 135 110, 130 120 C133 105, 132 85, 130 75 Z" fill="#201311" />

            {/* Delicate Gold Earrings */}
            <circle cx="67" cy="98" r="2.5" fill="#E8C98A" />
            <circle cx="133" cy="98" r="2.5" fill="#E8C98A" />

            {/* Eyebrows */}
            <path d="M78 74 Q86 70 93 73" stroke="#2C1B18" strokeWidth="2" strokeLinecap="round" />
            <path d="M107 73 Q114 70 122 74" stroke="#2C1B18" strokeWidth="2" strokeLinecap="round" />

            {/* Eyes */}
            <circle cx="86" cy="84" r="4.5" fill="#2C1B18" />
            <circle cx="87.5" cy="82.5" r="1.5" fill="#FFFFFF" />
            <circle cx="114" cy="84" r="4.5" fill="#2C1B18" />
            <circle cx="115.5" cy="82.5" r="1.5" fill="#FFFFFF" />

            {/* Professional Glasses (Rose Gold Frame) */}
            <rect x="74" y="76" width="23" height="15" rx="5" fill="none" stroke="#B87D65" strokeWidth="1.5" opacity="0.85" />
            <rect x="103" y="76" width="23" height="15" rx="5" fill="none" stroke="#B87D65" strokeWidth="1.5" opacity="0.85" />
            <path d="M97 82 L103 82" stroke="#B87D65" strokeWidth="1.5" opacity="0.85" />

            {/* Nose */}
            <path d="M99 87 Q100 93 97 94" stroke="#C98B68" strokeWidth="1.5" strokeLinecap="round" />

            {/* Mouth / Smile (Animated when speaking) */}
            {state === 'speaking' ? (
              <path
                d="M92 104 Q100 114 108 104 Q100 108 92 104 Z"
                fill="#B84A58"
                className="animate-pulse"
              />
            ) : (
              <path
                d="M92 104 Q100 111 108 104"
                stroke="#B84A58"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </svg>
        ) : (
          // Arjun: Male Technical Lead Vector Avatar
          <svg viewBox="0 0 200 200" className="w-full h-full" fill="none">
            {/* Background Radial Shade */}
            <circle cx="100" cy="100" r="95" fill="url(#arjun-bg)" />
            <defs>
              <radialGradient id="arjun-bg" cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#F0F6FA" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#CADCE8" stopOpacity="0.4" />
              </radialGradient>
            </defs>

            {/* Torso & Charcoal Tech Jacket */}
            <path
              d="M30 200 C30 152, 58 140, 100 140 C142 140, 170 152, 170 200 Z"
              fill="#1E2E38"
            />
            {/* Crewneck or Henley Shirt */}
            <path d="M84 140 L100 162 L116 140 Z" fill="#27966F" />
            <path d="M100 162 L100 178" stroke="#176B50" strokeWidth="2" />
            {/* Jacket Collar */}
            <path d="M54 142 L84 190 L100 190 L75 140 Z" fill="#132028" />
            <path d="M146 142 L116 190 L100 190 L125 140 Z" fill="#132028" />

            {/* Neck */}
            <path d="M86 112 C86 132, 114 132, 114 112 Z" fill="#D29977" />

            {/* Face Shape (Sharp, Chiseled Jawline) */}
            <path
              d="M68 82 C68 118, 82 128, 100 128 C118 128, 132 118, 132 82 C132 50, 68 50, 68 82 Z"
              fill="#E0A683"
            />

            {/* Short Textured Black Hair */}
            <path
              d="M64 74 C64 42, 85 32, 100 32 C120 32, 136 44, 136 74 C132 60, 124 50, 100 48 C76 48, 68 62, 64 74 Z"
              fill="#19191D"
            />
            <path d="M88 33 L93 26 L102 33 L108 27 L114 34" stroke="#19191D" strokeWidth="4" strokeLinecap="round" />

            {/* Well-Groomed Stubble / Light Beard Line */}
            <path
              d="M74 96 C76 118, 86 126, 100 126 C114 126, 124 118, 126 96 C124 115, 113 123, 100 123 C87 123, 76 115, 74 96 Z"
              fill="#19191D"
              opacity="0.35"
            />

            {/* Strong Eyebrows */}
            <path d="M76 72 Q85 68 94 71" stroke="#19191D" strokeWidth="2.8" strokeLinecap="round" />
            <path d="M106 71 Q115 68 124 72" stroke="#19191D" strokeWidth="2.8" strokeLinecap="round" />

            {/* Confident Eyes */}
            <circle cx="86" cy="81" r="4.2" fill="#19191D" />
            <circle cx="87.2" cy="79.8" r="1.4" fill="#FFFFFF" />
            <circle cx="114" cy="81" r="4.2" fill="#19191D" />
            <circle cx="115.2" cy="79.8" r="1.4" fill="#FFFFFF" />

            {/* Modern Slim Dark Glasses */}
            <rect x="74" y="74" width="24" height="15" rx="3.5" fill="none" stroke="#25352D" strokeWidth="1.8" />
            <rect x="102" y="74" width="24" height="15" rx="3.5" fill="none" stroke="#25352D" strokeWidth="1.8" />
            <path d="M98 79 L102 79" stroke="#25352D" strokeWidth="2" />

            {/* Nose */}
            <path d="M100 83 L101 92 L97 94" stroke="#C48663" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />

            {/* Confident Mouth (Animated when speaking) */}
            {state === 'speaking' ? (
              <path
                d="M93 104 Q100 114 107 104 Q100 108 93 104 Z"
                fill="#4D2E28"
                className="animate-pulse"
              />
            ) : (
              <path
                d="M93 105 Q100 110 107 105"
                stroke="#5E3832"
                strokeWidth="2.2"
                strokeLinecap="round"
                fill="none"
              />
            )}
          </svg>
        )}
      </div>

      {/* Floating Speaking Equalizer Bars */}
      {state === 'speaking' && (
        <div className="absolute -bottom-2 sm:-bottom-3 flex items-end gap-1 bg-[#176B50] dark:bg-[#27966F] px-2.5 py-1 rounded-full shadow-md">
          <div className="w-1 bg-white rounded-full animate-soundwave-1" />
          <div className="w-1 bg-white rounded-full animate-soundwave-2" />
          <div className="w-1 bg-white rounded-full animate-soundwave-3" />
          <div className="w-1 bg-white rounded-full animate-soundwave-4" />
          <div className="w-1 bg-white rounded-full animate-soundwave-5" />
        </div>
      )}
    </div>
  );
};
