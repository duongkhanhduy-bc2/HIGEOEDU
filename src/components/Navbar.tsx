import React, { useState } from 'react';
import { Compass, Sparkles, Flame, Trophy, Menu, X, Award, ChevronRight } from 'lucide-react';
import { UserStats, ActiveModule } from '../types/index.ts';

interface NavbarProps {
  stats: UserStats;
  activeModule: ActiveModule;
  onSelectModule: (module: ActiveModule) => void;
  onOpenBadgesModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  stats,
  activeModule,
  onSelectModule,
  onOpenBadgesModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (module: ActiveModule) => {
    setMobileMenuOpen(false);
    onSelectModule(module);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-amber-200/50 shadow-xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo - click brings to Intro module */}
        <div
          onClick={() => handleNavClick('intro')}
          className="flex items-center gap-2.5 cursor-pointer group"
          title="Về trang Giới thiệu HIGEOEDU"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-amber-600 via-emerald-600 to-sky-600 bg-clip-text text-transparent">
                HIGEOEDU
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide bg-amber-100 text-amber-800 rounded-md border border-amber-200">
                THCS
              </span>
            </div>
            <p className="hidden md:block text-[11px] font-medium text-slate-500 -mt-0.5 tracking-tight">
              Học thông minh – Hiểu thông suốt – Bước cùng AI
            </p>
          </div>
        </div>

        {/* Desktop Menu - Each module can be selected independently */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold text-slate-700">
          <button
            onClick={() => handleNavClick('intro')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              activeModule === 'intro'
                ? 'text-amber-900 bg-amber-100 font-bold shadow-2xs'
                : 'hover:text-amber-600 hover:bg-amber-50/80'
            }`}
          >
            🏠 Giới thiệu
          </button>

          <button
            onClick={() => handleNavClick('challenge')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
              activeModule === 'challenge'
                ? 'text-emerald-950 bg-emerald-100 font-bold shadow-2xs'
                : 'hover:text-emerald-700 hover:bg-emerald-50/80'
            }`}
          >
            🎮 Thử thách tương tác
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>

          <button
            onClick={() => handleNavClick('ai')}
            className={`px-3 py-2 rounded-lg transition-colors flex items-center gap-1 cursor-pointer ${
              activeModule === 'ai'
                ? 'text-sky-950 bg-sky-100 font-bold shadow-2xs'
                : 'hover:text-sky-600 hover:bg-sky-50/80'
            }`}
          >
            🤖 Trợ lí AI
            <span className="px-1.5 py-0.2 text-[9px] bg-sky-500 text-white font-bold rounded-full">
              LIVE
            </span>
          </button>

          <button
            onClick={() => handleNavClick('blog')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              activeModule === 'blog'
                ? 'text-purple-950 bg-purple-100 font-bold shadow-2xs'
                : 'hover:text-purple-700 hover:bg-purple-50/80'
            }`}
          >
            📖 Blog
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`px-3 py-2 rounded-lg transition-colors cursor-pointer ${
              activeModule === 'contact'
                ? 'text-amber-900 bg-amber-100 font-bold shadow-2xs'
                : 'hover:text-amber-600 hover:bg-amber-50/80'
            }`}
          >
            📩 Liên hệ
          </button>
        </nav>

        {/* User Stats & Action CTAs */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* User Gamification Pill */}
          <div
            onClick={onOpenBadgesModal}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/80 hover:border-amber-400 px-2.5 py-1.5 rounded-full cursor-pointer transition-all shadow-xs hover:shadow-md"
            title="Xem thành tích & bảng huy hiệu của bạn"
          >
            {/* Streak */}
            <div className="flex items-center gap-1 text-xs font-bold text-orange-600">
              <Flame className="w-4 h-4 fill-orange-500 text-orange-500 animate-bounce" />
              <span>{stats.streak}</span>
            </div>
            <div className="w-px h-3.5 bg-amber-200" />
            {/* XP */}
            <div className="flex items-center gap-1 text-xs font-black text-amber-700">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{stats.xp} XP</span>
            </div>
            <div className="hidden sm:flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 bg-amber-500 text-white rounded-full">
              <Award className="w-3 h-3" />
              <span>Lv.{stats.level}</span>
            </div>
          </div>

          {/* Prominent CTA: switches to Challenge arena */}
          <button
            onClick={() => handleNavClick('challenge')}
            className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 text-white text-sm font-bold shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all cursor-pointer"
          >
            <span>🚀 Khám phá ngay</span>
          </button>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-hidden"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-amber-100 bg-white/95 backdrop-blur-xl px-4 pt-3 pb-6 space-y-2 shadow-xl animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs text-slate-600 font-medium">
            <span>Tiến độ học tập:</span>
            <span className="font-bold text-amber-700">Level {stats.level} • {stats.xp} XP</span>
          </div>

          <button
            onClick={() => handleNavClick('intro')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-left transition-colors cursor-pointer ${
              activeModule === 'intro'
                ? 'bg-amber-100 text-amber-900 font-bold'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <span>🏠 Giới thiệu</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleNavClick('challenge')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-left transition-colors cursor-pointer ${
              activeModule === 'challenge'
                ? 'bg-emerald-100 text-emerald-950 font-bold'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <span className="flex items-center gap-2">
              🎮 Thử thách tương tác
              <span className="px-1.5 py-0.5 text-[9px] bg-emerald-500 text-white font-bold rounded-md">HOT</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleNavClick('ai')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-left transition-colors cursor-pointer ${
              activeModule === 'ai'
                ? 'bg-sky-100 text-sky-950 font-bold'
                : 'text-slate-700 hover:bg-sky-50'
            }`}
          >
            <span className="flex items-center gap-2">
              🤖 Trợ lí AI
              <span className="px-1.5 py-0.5 text-[9px] bg-sky-500 text-white font-bold rounded-md">AI 24/7</span>
            </span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleNavClick('blog')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-left transition-colors cursor-pointer ${
              activeModule === 'blog'
                ? 'bg-purple-100 text-purple-950 font-bold'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <span>📖 Blog Sổ tay thám hiểm</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <button
            onClick={() => handleNavClick('contact')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-left transition-colors cursor-pointer ${
              activeModule === 'contact'
                ? 'bg-amber-100 text-amber-900 font-bold'
                : 'text-slate-700 hover:bg-amber-50'
            }`}
          >
            <span>📩 Liên hệ & Góp ý</span>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </button>

          <div className="pt-2">
            <button
              onClick={() => handleNavClick('challenge')}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 text-white font-bold text-center shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>🚀 Khám phá ngay</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
