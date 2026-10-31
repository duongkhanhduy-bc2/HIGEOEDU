import React from 'react';
import { MascotMood } from '../types/index.ts';
import { Sparkles, Compass, BookOpen, Lightbulb, CheckCircle2, HelpCircle, Trophy } from 'lucide-react';

interface MascotProps {
  mood?: MascotMood;
  customMessage?: string;
  size?: 'sm' | 'md' | 'lg';
  showSpeechBubble?: boolean;
  className?: string;
  onMascotClick?: () => void;
}

export const Mascot: React.FC<MascotProps> = ({
  mood = 'welcome',
  customMessage,
  size = 'md',
  showSpeechBubble = true,
  className = '',
  onMascotClick,
}) => {
  // Mood texts and reactions
  const moodData = {
    welcome: {
      tag: '👋 Chào mừng bạn!',
      speech: 'Xin chào nhà thám hiểm nhí! Hôm nay cậu muốn giải mã bí mật Lịch sử hay khám phá Bản đồ Địa lí?',
      robotEyeColor: '#38bdf8', // sky
      expression: 'smile',
      badgeColor: 'bg-emerald-500',
    },
    correct: {
      tag: '🎉 Chuẩn bài luôn!',
      speech: 'Tuyệt đỉnh giác quan! Cậu trả lời cực kỳ chính xác. +XP đã vào túi!',
      robotEyeColor: '#22c55e', // green
      expression: 'happy',
      badgeColor: 'bg-green-500',
    },
    wrong: {
      tag: '👀 Gần đúng rồi nha!',
      speech: 'Đừng nản chí! Hãy xem kỹ gợi ý của tớ và suy nghĩ lại một chút nhé.',
      robotEyeColor: '#f97316', // orange
      expression: 'thinking',
      badgeColor: 'bg-amber-500',
    },
    thinking: {
      tag: '🤔 Đang suy ngẫm...',
      speech: 'Một câu hỏi thật thú vị! Để tớ và robot AI lục lại thư viện tri thức nhé...',
      robotEyeColor: '#a855f7', // purple
      expression: 'pondering',
      badgeColor: 'bg-purple-500',
    },
    celebrate: {
      tag: '🏆 Quá xuất sắc!',
      speech: 'Chúc mừng cậu đã vượt qua thử thách! Huy hiệu vinh quang thuộc về cậu!',
      robotEyeColor: '#eab308', // gold
      expression: 'victory',
      badgeColor: 'bg-amber-500',
    },
    hint: {
      tag: '💡 Gợi ý tri thức',
      speech: 'Mở bản đồ hoặc lật cuốn sách cổ ra xem nào, manh mối nằm ngay trước mắt!',
      robotEyeColor: '#f59e0b', // amber
      expression: 'hint',
      badgeColor: 'bg-yellow-500',
    },
    completed: {
      tag: '🌟 Hoàn thành xuất sắc!',
      speech: 'Cậu đích thực là một Bậc thầy Sử Địa tương lai của HIGEOEDU!',
      robotEyeColor: '#06b6d4', // cyan
      expression: 'proud',
      badgeColor: 'bg-blue-600',
    },
  }[mood] || {
    tag: '🧭 Sẵn sàng khám phá',
    speech: 'Mỗi câu hỏi là một chuyến phiêu lưu kỳ thú!',
    robotEyeColor: '#38bdf8',
    expression: 'smile',
    badgeColor: 'bg-indigo-500',
  };

  const displayText = customMessage || moodData.speech;

  const sizeClasses = {
    sm: 'w-32 h-32',
    md: 'w-48 h-48 md:w-56 md:h-56',
    lg: 'w-64 h-64 md:w-80 md:h-80',
  }[size];

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech Bubble */}
      {showSpeechBubble && (
        <div className="mb-3 max-w-xs md:max-w-sm w-full animate-float transition-all duration-300">
          <div className="relative bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-xl border border-amber-200/80 text-slate-800 text-sm">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-700 mb-1">
              <span className={`w-2 h-2 rounded-full ${moodData.badgeColor} animate-ping`} />
              <span>{moodData.tag}</span>
              {mood === 'hint' && <Lightbulb className="w-3.5 h-3.5 text-amber-500 inline ml-1" />}
              {mood === 'correct' && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 inline ml-1" />}
              {mood === 'celebrate' && <Trophy className="w-3.5 h-3.5 text-amber-500 inline ml-1" />}
            </div>
            <p className="leading-relaxed font-medium text-slate-700 text-xs md:text-sm">
              {displayText}
            </p>
            {/* Bubble Tail */}
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-r border-b border-amber-200/80" />
          </div>
        </div>
      )}

      {/* Mascot Graphic: Explorer Kid + Friendly AI Robot */}
      <div
        onClick={onMascotClick}
        className={`relative ${sizeClasses} cursor-pointer group transition-transform duration-300 hover:scale-105 active:scale-95`}
        title="Bấm vào Mascot để nhận lời động viên từ HIGEOEDU!"
      >
        {/* Glow backdrop */}
        <div className="absolute inset-0 bg-gradient-to-tr from-amber-400/25 via-emerald-400/20 to-sky-400/25 rounded-full blur-2xl -z-10 group-hover:blur-3xl transition-all duration-500" />

        <svg viewBox="0 0 320 320" className="w-full h-full drop-shadow-2xl">
          <defs>
            {/* Gradients */}
            <linearGradient id="explorerSkin" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor="#fba666" />
            </linearGradient>
            <linearGradient id="explorerHat" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
            <linearGradient id="explorerVest" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#059669" />
              <stop offset="100%" stopColor="#065f46" />
            </linearGradient>
            <linearGradient id="robotBody" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f8fafc" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="robotScreen" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="goldCompass" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
            <linearGradient id="ancientBook" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>
            <filter id="glowEffect" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ================= BACKGROUND PARTICLES ================= */}
          <g className="animate-pulse-subtle">
            <circle cx="50" cy="70" r="4" fill="#f59e0b" opacity="0.6" />
            <circle cx="270" cy="90" r="3" fill="#38bdf8" opacity="0.7" />
            <polygon points="280,60 284,68 292,72 284,76 280,84 276,76 268,72 276,68" fill="#fbbf24" opacity="0.8" />
            <polygon points="40,160 43,165 48,168 43,171 40,176 37,171 32,168 37,165" fill="#34d399" opacity="0.7" />
          </g>

          {/* ================= EXPLORER KID (CENTER-LEFT) ================= */}
          <g transform="translate(45, 45)">
            {/* Body / Explorer Vest */}
            <path
              d="M 50 130 C 50 115, 110 115, 110 130 L 120 200 C 120 215, 40 215, 40 200 Z"
              fill="url(#explorerVest)"
            />
            {/* Vest Collar and Pockets */}
            <path d="M 65 130 L 80 160 L 95 130" stroke="#fef08a" strokeWidth="3" fill="none" />
            <rect x="52" y="165" width="22" height="18" rx="3" fill="#047857" stroke="#065f46" strokeWidth="1.5" />
            <rect x="86" y="165" width="22" height="18" rx="3" fill="#047857" stroke="#065f46" strokeWidth="1.5" />

            {/* Neck */}
            <rect x="73" y="112" width="14" height="12" fill="url(#explorerSkin)" rx="2" />

            {/* Head */}
            <circle cx="80" cy="85" r="32" fill="url(#explorerSkin)" />
            {/* Cheeks */}
            <circle cx="62" cy="93" r="5" fill="#f87171" opacity="0.4" />
            <circle cx="98" cy="93" r="5" fill="#f87171" opacity="0.4" />

            {/* Eyes based on mood */}
            {mood === 'correct' || mood === 'celebrate' ? (
              // Happy squint eyes
              <g stroke="#3f2305" strokeWidth="3" fill="none" strokeLinecap="round">
                <path d="M 64 82 Q 70 76, 76 82" />
                <path d="M 84 82 Q 90 76, 96 82" />
              </g>
            ) : mood === 'thinking' ? (
              // Thinking eyes looking up
              <g fill="#3f2305">
                <circle cx="70" cy="79" r="4.5" />
                <circle cx="90" cy="79" r="4.5" />
                <circle cx="72" cy="77" r="1.5" fill="#ffffff" />
                <circle cx="92" cy="77" r="1.5" fill="#ffffff" />
              </g>
            ) : (
              // Big friendly explorer eyes
              <g fill="#3f2305">
                <ellipse cx="69" cy="82" rx="4.5" ry="5.5" />
                <ellipse cx="91" cy="82" rx="4.5" ry="5.5" />
                <circle cx="71" cy="80" r="1.8" fill="#ffffff" />
                <circle cx="93" cy="80" r="1.8" fill="#ffffff" />
              </g>
            )}

            {/* Mouth */}
            {mood === 'celebrate' || mood === 'correct' ? (
              <path d="M 70 96 Q 80 108, 90 96 Z" fill="#b91c1c" />
            ) : mood === 'wrong' ? (
              <path d="M 74 99 Q 80 94, 86 99" stroke="#3f2305" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            ) : (
              <path d="M 72 95 Q 80 102, 88 95" stroke="#3f2305" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            )}

            {/* Hair bangs */}
            <path
              d="M 52 75 C 60 62, 70 65, 80 62 C 90 65, 100 62, 108 75 C 100 70, 90 72, 80 68 C 70 72, 60 70, 52 75 Z"
              fill="#78350f"
            />

            {/* Explorer Safari Hat */}
            <ellipse cx="80" cy="62" rx="42" ry="12" fill="url(#explorerHat)" />
            <path
              d="M 52 60 C 52 35, 108 35, 108 60 Z"
              fill="url(#explorerHat)"
            />
            {/* Hat Band */}
            <path d="M 53 58 C 65 52, 95 52, 107 58" stroke="#fef08a" strokeWidth="4" fill="none" />
            <circle cx="80" cy="54" r="3.5" fill="#f59e0b" />

            {/* LEFT HAND HOLDING GOLDEN COMPASS (Địa lí) */}
            <g transform="translate(18, 140)">
              {/* Arm */}
              <path d="M 45 10 C 25 10, 10 25, 12 40" stroke="#fba666" strokeWidth="12" strokeLinecap="round" fill="none" />
              {/* Compass Body */}
              <circle cx="12" cy="46" r="18" fill="url(#goldCompass)" stroke="#854d0e" strokeWidth="2" />
              <circle cx="12" cy="46" r="14" fill="#ffffff" />
              {/* Compass Dial Directions */}
              <line x1="12" y1="34" x2="12" y2="58" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="0" y1="46" x2="24" y2="46" stroke="#cbd5e1" strokeWidth="1" />
              {/* Red / Blue needle */}
              <polygon points="12,35 15,46 12,44 9,46" fill="#ef4444" />
              <polygon points="12,57 15,46 12,48 9,46" fill="#3b82f6" />
              <circle cx="12" cy="46" r="2.5" fill="#eab308" />
              {/* Compass Glass Glare */}
              <path d="M 6 40 A 12 12 0 0 1 18 36" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.7" />
            </g>

            {/* RIGHT HAND HOLDING ANCIENT BOOK (Lịch sử) */}
            <g transform="translate(95, 142)">
              {/* Arm */}
              <path d="M 10 8 C 25 10, 38 25, 34 42" stroke="#fba666" strokeWidth="12" strokeLinecap="round" fill="none" />
              {/* Ancient Leather Book */}
              <g transform="rotate(-15, 36, 44)">
                <rect x="20" y="24" width="28" height="36" rx="3" fill="url(#ancientBook)" stroke="#451a03" strokeWidth="2" />
                <rect x="23" y="27" width="22" height="30" rx="1.5" fill="#fef3c7" />
                {/* Book Spine Lines and Emblem */}
                <line x1="22" y1="24" x2="22" y2="60" stroke="#f59e0b" strokeWidth="2" />
                <circle cx="34" cy="42" r="5" fill="#d97706" />
                <polygon points="34,39 36,44 31,41 37,41 32,44" fill="#fef08a" />
                {/* Text lines hint */}
                <line x1="26" y1="32" x2="42" y2="32" stroke="#d97706" strokeWidth="1" />
                <line x1="26" y1="52" x2="42" y2="52" stroke="#d97706" strokeWidth="1" />
              </g>
            </g>
          </g>

          {/* ================= FRIENDLY AI ROBOT BUDDY (RIGHT SIDE) ================= */}
          <g transform="translate(195, 100)" className="animate-float">
            {/* Shadow beneath floating robot */}
            <ellipse cx="45" cy="115" rx="24" ry="6" fill="#000000" opacity="0.12" />

            {/* Floating Energy Rings / Thruster */}
            <ellipse cx="45" cy="98" rx="16" ry="5" fill="#38bdf8" opacity="0.6" filter="url(#glowEffect)" />
            <polygon points="38,98 52,98 45,112" fill="#38bdf8" opacity="0.7" />

            {/* Robot Antenna */}
            <line x1="45" y1="18" x2="45" y2="30" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            <circle cx="45" cy="16" r="5" fill={moodData.robotEyeColor} filter="url(#glowEffect)" />

            {/* Robot Head & Body (Futuristic Rounded Capsule) */}
            <rect x="18" y="28" width="54" height="66" rx="27" fill="url(#robotBody)" stroke="#94a3b8" strokeWidth="2" />

            {/* Robot Visor / Screen */}
            <rect x="25" y="42" width="40" height="26" rx="10" fill="url(#robotScreen)" />

            {/* Robot Digital Eyes */}
            <circle cx="37" cy="55" r="5" fill={moodData.robotEyeColor} filter="url(#glowEffect)" />
            <circle cx="53" cy="55" r="5" fill={moodData.robotEyeColor} filter="url(#glowEffect)" />
            {/* Eye glints */}
            <circle cx="35" cy="53" r="1.5" fill="#ffffff" />
            <circle cx="51" cy="53" r="1.5" fill="#ffffff" />

            {/* Robot Chest Heart/Core: Gear or AI Spark */}
            <circle cx="45" cy="80" r="6" fill="#0284c7" />
            <polygon points="45,76 47,82 42,79 48,79 43,82" fill="#ffffff" />

            {/* Little robot waving arm */}
            <path
              d="M 68 55 C 80 50, 85 40, 82 30"
              stroke="#cbd5e1"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="82" cy="28" r="4.5" fill="#38bdf8" />
          </g>
        </svg>

        {/* Mascot Interactive Hint Chip */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2.5 py-0.5 bg-slate-900/80 backdrop-blur-md text-amber-300 text-[10px] font-bold rounded-full border border-amber-400/40 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          ✨ HIGEO & Robot AI
        </div>
      </div>
    </div>
  );
};
