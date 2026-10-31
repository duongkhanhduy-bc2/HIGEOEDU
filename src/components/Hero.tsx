import React, { useState } from 'react';
import { Mascot } from './Mascot.tsx';
import { MascotMood } from '../types/index.ts';
import { Compass, BookOpen, Bot, Sparkles, Trophy, ArrowRight, ShieldCheck, PlayCircle } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onTryAiClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onTryAiClick }) => {
  const [mascotMood, setMascotMood] = useState<MascotMood>('welcome');

  const moods: Array<{ id: MascotMood; label: string; icon: string }> = [
    { id: 'welcome', label: 'Chào mừng', icon: '👋' },
    { id: 'correct', label: 'Đúng đáp án', icon: '🎉' },
    { id: 'hint', label: 'Gợi ý', icon: '💡' },
    { id: 'thinking', label: 'Đang nghĩ', icon: '🤔' },
    { id: 'celebrate', label: 'Chúc mừng', icon: '🏆' },
  ];

  return (
    <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:py-20 bg-gradient-to-b from-amber-50/60 via-slate-50 to-white">
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-amber-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-1/2 right-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Big Brand Typography & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            {/* Tagline Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-100/80 border border-amber-200 text-amber-900 text-xs sm:text-sm font-bold shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-600 animate-spin-slow" />
              <span>Nền tảng EdTech Sử – Địa thế hệ mới</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span className="text-amber-700">Dành cho học sinh THCS</span>
            </div>

            {/* H1 Main Brand Title */}
            <h1 className="text-5xl sm:text-6xl xl:text-7xl font-black tracking-tight leading-none text-slate-900">
              <span className="bg-gradient-to-r from-amber-600 via-orange-600 to-emerald-600 bg-clip-text text-transparent">
                HIGEOEDU
              </span>
            </h1>

            {/* Slogan */}
            <p className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
              “Học thông minh – Hiểu thông suốt – Bước cùng AI”
            </p>

            {/* Detailed Description */}
            <p className="text-base sm:text-lg text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Nền tảng học tập chủ động môn <strong>Lịch sử</strong> và <strong>Địa lí</strong> dành cho học sinh THCS dựa trên trò chơi hóa và công nghệ AI đột phá. Biến từng bài học khô khan thành những chuyến thám hiểm bản đồ kho báu và giải mã mật mã lịch sử sống động!
            </p>

            {/* Quote highlight */}
            <div className="inline-block p-3 rounded-2xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/70 text-amber-900 text-sm font-semibold italic">
              ✨ “Mỗi câu hỏi là một chuyến phiêu lưu.”
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 text-white font-extrabold text-base shadow-xl shadow-orange-500/20 hover:shadow-orange-500/35 hover:scale-103 active:scale-97 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <span>🚀 Khám phá ngay</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onTryAiClick}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-white border-2 border-sky-400 text-sky-700 hover:bg-sky-50 font-extrabold text-base shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                <Bot className="w-5 h-5 text-sky-600 group-hover:rotate-12 transition-transform" />
                <span>🤖 Thử Trợ lý AI</span>
              </button>
            </div>

            {/* Feature Highlights Grid */}
            <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
              <div
                onClick={onExploreClick}
                className="p-3 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs hover:border-amber-400 hover:shadow-md transition-all cursor-pointer group"
                title="Khám phá Bản đồ kho báu Địa lí"
              >
                <div className="flex items-center gap-1.5 text-amber-600 font-bold text-xs mb-0.5 group-hover:translate-x-0.5 transition-transform">
                  <Compass className="w-4 h-4" />
                  <span>Bản đồ kho báu</span>
                </div>
                <div className="text-slate-700 text-xs font-medium">7 Đảo tri thức Địa lí</div>
              </div>

              <div
                onClick={onExploreClick}
                className="p-3 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer group"
                title="Khám phá Trục thời gian Lịch sử"
              >
                <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs mb-0.5 group-hover:translate-x-0.5 transition-transform">
                  <BookOpen className="w-4 h-4" />
                  <span>Trục thời gian</span>
                </div>
                <div className="text-slate-700 text-xs font-medium">7 Mốc son lịch sử</div>
              </div>

              <div
                onClick={onTryAiClick}
                className="p-3 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs hover:border-sky-400 hover:shadow-md transition-all cursor-pointer group"
                title="Hỏi đáp cùng Trợ lí AI 24/7"
              >
                <div className="flex items-center gap-1.5 text-sky-600 font-bold text-xs mb-0.5 group-hover:translate-x-0.5 transition-transform">
                  <Bot className="w-4 h-4" />
                  <span>Trợ lí AI 24/7</span>
                </div>
                <div className="text-slate-700 text-xs font-medium">Gợi ý & Giọng nói</div>
              </div>

              <div
                onClick={onExploreClick}
                className="p-3 rounded-xl bg-white/80 border border-slate-200/80 shadow-xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer group"
                title="Xem Bảng xếp hạng Đấu trường"
              >
                <div className="flex items-center gap-1.5 text-purple-600 font-bold text-xs mb-0.5 group-hover:translate-x-0.5 transition-transform">
                  <Trophy className="w-4 h-4" />
                  <span>Đấu trường XP</span>
                </div>
                <div className="text-slate-700 text-xs font-medium">Bảng xếp hạng tuần</div>
              </div>
            </div>
          </div>

          {/* Right Column: Mascot with Floating Interactive Elements */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center relative">
            {/* Mascot Interactive Component */}
            <div className="relative w-full max-w-md flex flex-col items-center">
              <Mascot mood={mascotMood} size="lg" />

              {/* Floating badges surrounding the Mascot */}
              <div className="absolute top-12 -left-2 sm:-left-6 p-2 sm:p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-amber-300 shadow-lg animate-float flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  🧭
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-500 font-medium">Địa lí tương tác</div>
                  <div className="text-xs font-bold text-slate-800">La bàn tri thức</div>
                </div>
              </div>

              <div className="absolute top-24 -right-2 sm:-right-6 p-2 sm:p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-emerald-300 shadow-lg animate-float [animation-delay:1.5s] flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  📜
                </div>
                <div className="text-left">
                  <div className="text-[10px] text-slate-500 font-medium">Lịch sử hào hùng</div>
                  <div className="text-xs font-bold text-slate-800">Cuốn sách cổ</div>
                </div>
              </div>

              <div className="absolute bottom-12 -left-4 sm:-left-8 p-2 rounded-xl bg-white/90 backdrop-blur-md border border-sky-300 shadow-lg animate-float [animation-delay:2s] flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-sky-500" />
                <span className="text-xs font-bold text-sky-900">HIGEORobot AI</span>
              </div>

              {/* Mascot Mood Switcher for interactive delight */}
              <div className="mt-4 p-2 bg-white/80 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-md w-full max-w-sm">
                <div className="text-[11px] font-bold text-slate-500 text-center mb-1.5">
                  Thử biểu cảm Mascot HIGEO:
                </div>
                <div className="flex items-center justify-center gap-1 sm:gap-1.5">
                  {moods.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMascotMood(m.id)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        mascotMood === m.id
                          ? 'bg-amber-500 text-white shadow-xs scale-105'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      <span>{m.icon}</span>
                      <span className="hidden sm:inline">{m.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
