import React from 'react';
import { X, Award, Flame, Sparkles, CheckCircle2, Lock } from 'lucide-react';
import { UserStats } from '../types/index.ts';
import { BADGES_LIST } from '../data/mockData.ts';

interface BadgesModalProps {
  stats: UserStats;
  onClose: () => void;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({ stats, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-amber-200 space-y-6 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shadow-xs">
              🏅
            </div>
            <div>
              <h3 className="font-black text-lg text-slate-900 leading-tight">
                Kho Huy Hiệu Thám Hiểm
              </h3>
              <p className="text-xs text-slate-500">
                Thành tích học tập môn Sử – Địa của bạn
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Stats Ribbon */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/80 text-center">
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Cấp độ</div>
            <div className="text-base font-black text-amber-700">Lv.{stats.level}</div>
          </div>
          <div className="border-x border-amber-200">
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Tổng XP</div>
            <div className="text-base font-black text-amber-600">{stats.xp}</div>
          </div>
          <div>
            <div className="text-[10px] text-slate-500 font-semibold uppercase">Chuỗi ngày</div>
            <div className="text-base font-black text-orange-600 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 fill-orange-500" />
              <span>{stats.streak}d</span>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="overflow-y-auto flex-1 space-y-2.5 pr-1">
          {BADGES_LIST.map((badge) => {
            const isUnlocked =
              stats.badges.includes(badge.title) || badge.unlocked;

            return (
              <div
                key={badge.id}
                className={`p-3 rounded-2xl border flex items-center justify-between gap-3 transition-all ${
                  isUnlocked
                    ? 'bg-white border-amber-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{badge.title.split(' ')[0]}</div>
                  <div>
                    <div className="font-extrabold text-xs sm:text-sm text-slate-900">
                      {badge.title}
                    </div>
                    <div className="text-[11px] text-slate-500 leading-tight">
                      {badge.desc}
                    </div>
                  </div>
                </div>

                <div>
                  {isUnlocked ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3" /> Đã mở
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 text-slate-500 flex items-center gap-0.5">
                      <Lock className="w-3 h-3" /> Khóa
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
