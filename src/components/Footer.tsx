import React from 'react';
import { Compass, Heart, Sparkles, BookOpen, Bot, ShieldCheck } from 'lucide-react';
import { ActiveModule } from '../types/index.ts';

interface FooterProps {
  onSelectModule?: (module: ActiveModule) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectModule }) => {
  const handleNavClick = (module: ActiveModule) => {
    if (onSelectModule) {
      onSelectModule(module);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand Info (5 cols) */}
          <div className="md:col-span-5 space-y-4">
            <div
              onClick={() => handleNavClick('intro')}
              className="flex items-center gap-2 cursor-pointer w-fit"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-emerald-500 flex items-center justify-center text-white font-black text-sm">
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                HIGEOEDU
              </span>
            </div>

            <p className="text-amber-400 font-bold text-sm">
              “Học thông minh – Hiểu thông suốt – Bước cùng AI”
            </p>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Nền tảng học tập chủ động môn Lịch sử và Địa lí dành cho học sinh THCS kết hợp mô hình Gamification, bản đồ tương tác và trợ lý AI thông minh thế hệ mới.
            </p>
          </div>

          {/* Navigation Links (4 cols) */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Khám Phá HIGEOEDU
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => handleNavClick('intro')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  🏠 Giới thiệu nền tảng
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('challenge')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  🎮 Đấu trường Sử Địa (Bản đồ & Trục thời gian)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('ai')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  🤖 Trợ lí Ảo AI (HIGEOAI 24/7)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('blog')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  📖 Sổ tay thám hiểm (Blog & Tư liệu)
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNavClick('contact')}
                  className="hover:text-amber-400 transition-colors cursor-pointer"
                >
                  📩 Liên hệ & Góp ý
                </button>
              </li>
            </ul>
          </div>

          {/* School & Authors (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">
              Nhóm Nghiên Cứu
            </h4>
            <div className="space-y-1.5 text-xs">
              <div className="text-slate-200 font-semibold">Trường THCS Bình Chuẩn 2</div>
              <div>Dương Khánh Duy (9A11)</div>
              <div>Nguyễn Duy Long (9A11)</div>
              <div className="text-slate-400">GVHD: Phan Lê Ngọc Diệu</div>
            </div>

            <div className="pt-2 text-[11px] text-emerald-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Dự án KHKT năm học 2026 - 2027</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-10 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-3">
          <p>© 2026 HIGEOEDU - Dự án Nghiên cứu Khoa học Kỹ thuật.</p>
          <p className="flex items-center gap-1 text-[11px]">
            <span>Được xây dựng với tình yêu Sử – Địa</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>và công nghệ AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
