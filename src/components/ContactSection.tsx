import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, School, Users, Award, MessageSquareHeart } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, content: feedback }),
      });
      setIsSubmitted(true);
      setEmail('');
      setFeedback('');
    } catch (err) {
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-section" className="py-16 bg-gradient-to-b from-slate-50 to-amber-50/50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs sm:text-sm font-bold mb-3 shadow-xs">
            <Mail className="w-4 h-4 text-amber-600" />
            <span>KẾT NỐI VÀ GÓP Ý</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
            📩 Kết Nối Cùng HIGEOEDU
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Đóng góp của bạn là nguồn động lực to lớn giúp đội ngũ phát triển hoàn thiện nền tảng học tập tốt hơn mỗi ngày.
          </p>
        </div>

        {/* 2-Column Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column: Project and Author Info (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-200/80 flex flex-col justify-between space-y-6">
            <div className="space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">
                    Dự án Nghiên cứu Khoa học Kỹ thuật
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    Thông Tin Dự Án HIGEOEDU
                  </h3>
                </div>
              </div>

              {/* Tên đề tài */}
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wide">
                  Tên đề tài:
                </div>
                <div className="text-base font-extrabold text-slate-900 leading-snug">
                  “Phát triển nền tảng trực tuyến HIGEOEDU”
                </div>
                <div className="text-xs text-amber-700 italic">
                  Slogan: “Học thông minh – Hiểu thông suốt – Bước cùng AI”
                </div>
              </div>

              {/* Nhóm tác giả */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Nhóm tác giả & Ban cố vấn:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center font-bold text-amber-800 text-sm">
                      D
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Dương Khánh Duy</div>
                      <div className="text-[11px] text-slate-500">Học sinh Lớp 9A11</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center font-bold text-emerald-800 text-sm">
                      L
                    </div>
                    <div>
                      <div className="font-bold text-xs text-slate-900">Nguyễn Duy Long</div>
                      <div className="text-[11px] text-slate-500">Học sinh Lớp 9A11</div>
                    </div>
                  </div>
                </div>

                {/* Mentor */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-sky-100 flex items-center justify-center font-bold text-sky-800 text-sm">
                    Đ
                  </div>
                  <div>
                    <div className="font-bold text-xs text-slate-900">Phan Lê Ngọc Diệu</div>
                    <div className="text-[11px] text-slate-500">Cố vấn chuyên môn & giáo dục</div>
                  </div>
                </div>

                {/* School */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/80 border border-emerald-200/80 flex items-center gap-3">
                  <School className="w-5 h-5 text-emerald-700 shrink-0" />
                  <div>
                    <div className="text-xs font-extrabold text-emerald-950">
                      Trường THCS Bình Chuẩn 2
                    </div>
                    <div className="text-[11px] text-emerald-800 font-medium">
                      Ngôi trường chắp cánh cho những ước mơ nghiên cứu khoa học
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 text-[11px] text-slate-400">
              * Dự án được thiết kế hoàn toàn vì mục đích giáo dục phi lợi nhuận cho học sinh.
            </div>
          </div>

          {/* Right Column: Feedback Form (6 cols) */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-amber-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <MessageSquareHeart className="w-5 h-5 text-rose-500" />
                <h3 className="text-lg sm:text-xl font-black text-slate-900">
                  Gửi Góp Ý / Báo Lỗi Hệ Thống
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mb-6 leading-relaxed">
                Bạn phát hiện câu hỏi cần cải thiện hay có ý tưởng trò chơi mới? Hãy chia sẻ ngay với chúng mình nhé!
              </p>

              {isSubmitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-300 text-center space-y-3 animate-in fade-in">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 mx-auto flex items-center justify-center text-emerald-600">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <h4 className="font-black text-base text-emerald-950">
                    Gửi Góp Ý Thành Công!
                  </h4>
                  <p className="text-xs sm:text-sm text-emerald-800 leading-relaxed">
                    “Cảm ơn bạn! Góp ý đã được gửi đến đội ngũ HIGEOEDU. 💙”
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-2 text-xs font-bold text-emerald-700 underline cursor-pointer"
                  >
                    Gửi thêm góp ý khác
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Email của bạn:
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Nhập email của bạn..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs sm:text-sm text-slate-900 font-medium transition-all"
                    />
                  </div>

                  {/* Feedback text */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Ý kiến đóng góp / Báo lỗi hệ thống: *
                    </label>
                    <textarea
                      required
                      rows={5}
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      placeholder="Hãy chia sẻ góp ý của bạn..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-hidden focus:border-amber-500 focus:ring-2 focus:ring-amber-200 text-xs sm:text-sm text-slate-900 font-medium transition-all resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting || !feedback.trim()}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-emerald-600 text-white font-extrabold text-sm shadow-lg hover:shadow-xl hover:scale-101 active:scale-99 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Đang gửi...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>📨 Gửi góp ý</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Bảo mật thông tin người dùng</span>
              <span>Phản hồi trong vòng 24h</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
