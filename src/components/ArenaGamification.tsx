import React, { useState } from 'react';
import {
  KnowledgeIsland,
  TimelineMilestone,
  LeaderboardUser,
  UserStats,
} from '../types/index.ts';
import {
  Compass,
  MapPin,
  Lock,
  Unlock,
  Star,
  Award,
  Flame,
  ChevronRight,
  Sparkles,
  Key,
  ShieldCheck,
  CheckCircle,
  HelpCircle,
  Clock,
  Play,
} from 'lucide-react';

interface ArenaGamificationProps {
  islands: KnowledgeIsland[];
  milestones: TimelineMilestone[];
  leaderboard: LeaderboardUser[];
  userStats: UserStats;
  onSelectIsland: (island: KnowledgeIsland) => void;
  onSelectMilestone: (milestone: TimelineMilestone) => void;
  onOpenBadgesModal: () => void;
}

export const ArenaGamification: React.FC<ArenaGamificationProps> = ({
  islands,
  milestones,
  leaderboard,
  userStats,
  onSelectIsland,
  onSelectMilestone,
  onOpenBadgesModal,
}) => {
  const [activeTab, setActiveTab] = useState<'geography' | 'history'>('geography');

  return (
    <section id="gamification-arena" className="py-16 bg-slate-900 text-white relative overflow-hidden">
      {/* Background Grid Pattern & Ambient Lights */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs sm:text-sm font-bold mb-3 shadow-lg">
            <span>🎮 ĐẤU TRƯỜNG SỬ ĐỊA</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            <span className="text-amber-200">Học mà chơi – Chơi mà học!</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-3">
            Chinh Phục Tri Thức Cùng{' '}
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 bg-clip-text text-transparent">
              HIGEOEDU
            </span>
          </h2>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Chọn đảo thám hiểm trên bản đồ kho báu hoặc du hành ngược thời gian giải mã các mật mã lịch sử để tích lũy XP và mở khóa toàn bộ kho báu tri thức!
          </p>

          {/* Dual Tab Switcher */}
          <div className="mt-8 inline-flex p-1.5 bg-slate-800/90 backdrop-blur-md rounded-2xl border border-slate-700 shadow-xl">
            <button
              onClick={() => setActiveTab('geography')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer ${
                activeTab === 'geography'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-900/30 scale-102'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span className="text-lg">🌍</span>
              <span>Bản đồ kho báu (Địa lí)</span>
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm sm:text-base transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-orange-900/30 scale-102'
                  : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
              }`}
            >
              <span className="text-lg">⏳</span>
              <span>Trục thời gian (Lịch sử)</span>
            </button>
          </div>
        </div>

        {/* Main Content: Left Map/Timeline (8 cols) + Right Leaderboard (4 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Interactive Tab View (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* TAB 1: GEOGRAPHY TREASURE MAP */}
            {activeTab === 'geography' && (
              <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">🗺️</span>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        Hải Trình 7 Đảo Tri Thức
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Hoàn thành từ 70% trở lên ở mỗi đảo để nhận thưởng XP và mở khóa đảo tiếp theo!
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-emerald-300">
                      Đã mở: {userStats.unlockedIslands.length}/7 Đảo
                    </span>
                  </div>
                </div>

                {/* Interactive Map Canvas Grid */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {islands.map((island, index) => {
                    const isUnlocked = userStats.unlockedIslands.includes(island.id) || !island.isLocked;

                    return (
                      <div
                        key={island.id}
                        onClick={() => {
                          if (isUnlocked) onSelectIsland(island);
                        }}
                        className={`group relative p-5 rounded-2xl border transition-all duration-300 ${
                          isUnlocked
                            ? 'bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-600/80 hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-950/40 hover:-translate-y-1 cursor-pointer'
                            : 'bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed'
                        }`}
                      >
                        {/* Island Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-slate-700/60 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform shadow-inner">
                              {island.icon}
                            </div>
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="text-xs font-bold text-slate-400">Đảo #{index + 1}</span>
                                {isUnlocked ? (
                                  <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/30">
                                    Sẵn sàng
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.2 text-[10px] font-bold bg-slate-700 text-slate-400 rounded-md flex items-center gap-0.5">
                                    <Lock className="w-2.5 h-2.5" /> Khóa
                                  </span>
                                )}
                              </div>
                              <h4 className="text-base font-extrabold text-white group-hover:text-emerald-300 transition-colors">
                                {island.title}
                              </h4>
                            </div>
                          </div>

                          {/* XP Badge */}
                          <div className="text-right">
                            <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2 py-1 rounded-lg border border-amber-400/20">
                              +{island.xpReward} XP
                            </span>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="mt-3 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                          {island.description}
                        </p>

                        {/* Progress and Stars */}
                        <div className="mt-4 pt-3 border-t border-slate-700/60 flex items-center justify-between text-xs">
                          {isUnlocked ? (
                            <>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3].map((star) => (
                                  <Star
                                    key={star}
                                    className={`w-3.5 h-3.5 ${
                                      star <= island.stars
                                        ? 'fill-amber-400 text-amber-400'
                                        : 'text-slate-600'
                                    }`}
                                  />
                                ))}
                                <span className="text-slate-400 text-[11px] ml-1">
                                  {island.completedPercent}%
                                </span>
                              </div>

                              <div className="flex items-center gap-1 font-bold text-emerald-400 group-hover:translate-x-1 transition-transform">
                                <span>Vào Đảo</span>
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </>
                          ) : (
                            <div className="text-[11px] text-slate-500 flex items-center gap-1">
                              <Lock className="w-3 h-3" />
                              <span>Cần đạt {island.minPercentToUnlock}% ở đảo trước để mở</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: HISTORY TIMELINE */}
            {activeTab === 'history' && (
              <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-700 gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">⏳</span>
                      <h3 className="text-xl sm:text-2xl font-black text-white">
                        Trục Thời Gian Lịch Sử Hào Hùng
                      </h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1">
                      Bấm vào từng mốc son để giải mã mật mã lịch sử và nhận huy hiệu danh dự!
                    </p>
                  </div>
                  <div className="flex items-center gap-2 bg-amber-950/60 border border-amber-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-amber-300">
                      Đã giải mã: {userStats.unlockedMilestones.length}/7 Mốc
                    </span>
                  </div>
                </div>

                {/* Timeline Flow */}
                <div className="mt-8 relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-gradient-to-b before:from-amber-400 before:via-orange-500 before:to-emerald-500">
                  {milestones.map((ms) => {
                    const isUnlocked = userStats.unlockedMilestones.includes(ms.id) || ms.isUnlocked;

                    return (
                      <div
                        key={ms.id}
                        onClick={() => onSelectMilestone(ms)}
                        className={`group relative p-4 sm:p-5 rounded-2xl border transition-all duration-300 cursor-pointer ${
                          isUnlocked
                            ? 'bg-gradient-to-r from-slate-800/90 to-slate-900/90 border-slate-600/80 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-950/40 hover:scale-101'
                            : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        {/* Milestone Node Dot */}
                        <div
                          className={`absolute -left-6 sm:-left-8 top-5 w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-md border-2 ${
                            isUnlocked
                              ? 'bg-amber-500 border-white text-slate-900 animate-pulse-subtle'
                              : 'bg-slate-700 border-slate-600 text-slate-400'
                          }`}
                        >
                          {isUnlocked ? '✓' : '🔒'}
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-black text-sm sm:text-base border border-amber-500/30">
                              {ms.year}
                            </span>
                            <div>
                              <h4 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                                {ms.title}
                              </h4>
                              <p className="text-xs text-amber-400 font-semibold">
                                Người anh hùng: {ms.heroName}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
                              +{ms.xpReward} XP
                            </span>
                            <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-extrabold text-xs flex items-center gap-1 group-hover:scale-105 transition-transform">
                              <Key className="w-3 h-3 text-slate-950" />
                              <span>Giải mã</span>
                            </div>
                          </div>
                        </div>

                        <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                          {ms.shortDesc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Weekly Leaderboard & Badges (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Leaderboard Card */}
            <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 shadow-2xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-700">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏆</span>
                  <h3 className="text-lg font-black text-white">
                    BẢNG XẾP HẠNG TUẦN
                  </h3>
                </div>
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Top 5
                </span>
              </div>

              {/* Student Rows */}
              <div className="mt-4 space-y-2.5">
                {leaderboard.map((user) => {
                  const medalIcons = ['🥇', '🥈', '🥉'];
                  const isTop3 = user.rank <= 3;

                  return (
                    <div
                      key={user.rank}
                      className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all ${
                        user.isCurrentUser
                          ? 'bg-amber-500/20 border-amber-400/50 shadow-md ring-1 ring-amber-400/40'
                          : 'bg-slate-900/60 border-slate-700/60 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs ${
                            user.rank === 1
                              ? 'text-yellow-300'
                              : user.rank === 2
                              ? 'text-slate-300'
                              : user.rank === 3
                              ? 'text-amber-500'
                              : 'text-slate-400'
                          }`}
                        >
                          {isTop3 ? medalIcons[user.rank - 1] : `#${user.rank}`}
                        </div>

                        <div className="text-lg">{user.avatar}</div>

                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs sm:text-sm font-bold text-white">
                              {user.name}
                            </span>
                            {user.isCurrentUser && (
                              <span className="px-1.5 py-0.2 text-[9px] font-extrabold bg-amber-400 text-slate-950 rounded-sm">
                                BẠN
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            {user.badge}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-black text-amber-400">
                          {user.xp.toLocaleString()} XP
                        </div>
                        <div className="text-[10px] text-orange-400 flex items-center justify-end gap-0.5 font-bold">
                          <Flame className="w-2.5 h-2.5 fill-orange-400" />
                          <span>{user.streak}d</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* View All Badges Trigger Button */}
              <div className="mt-5 pt-4 border-t border-slate-700/80">
                <button
                  onClick={onOpenBadgesModal}
                  className="w-full py-2.5 rounded-xl bg-slate-700/60 hover:bg-slate-700 border border-slate-600 text-amber-300 hover:text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>Kho Huy Hiệu Của Bạn ({userStats.badges.length})</span>
                </button>
              </div>
            </div>

            {/* Daily Tip Widget */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/80 to-slate-900 border border-indigo-800/50 shadow-xl text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Mẹo thám hiểm thông minh</span>
              </div>
              <p className="text-slate-300 leading-relaxed">
                Đạt chuỗi streak học tập 7 ngày liên tiếp để nhận gấp đôi XP khi giải mã các mật mã lịch sử!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
