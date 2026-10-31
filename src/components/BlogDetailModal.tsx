import React from 'react';
import { BlogPost } from '../types/index.ts';
import { ArrowLeft, Clock, Calendar, User, Tag, Sparkles, Share2, BookOpen, ChevronRight, CheckCircle2 } from 'lucide-react';

interface BlogDetailModalProps {
  post: BlogPost;
  allPosts: BlogPost[];
  onClose: () => void;
  onSelectPost: (post: BlogPost) => void;
}

export const BlogDetailModal: React.FC<BlogDetailModalProps> = ({
  post,
  allPosts,
  onClose,
  onSelectPost,
}) => {
  // Find next post
  const currentIndex = allPosts.findIndex((p) => p.id === post.id);
  const nextPost = allPosts[(currentIndex + 1) % allPosts.length];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Navbar */}
        <div className="px-6 py-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-600 hover:text-amber-600 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← Quay lại Blog</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
              {post.relatedSubject === 'history' ? '⏳ Lịch sử' : '🌍 Địa lí'}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          {/* Cover Hero Banner */}
          <div
            className={`w-full h-48 sm:h-64 rounded-2xl bg-gradient-to-r ${post.coverGradient} p-6 sm:p-8 flex flex-col justify-end text-white shadow-xl relative overflow-hidden`}
          >
            <div className="absolute top-4 right-4 text-5xl sm:text-6xl opacity-40 select-none">
              {post.icon}
            </div>

            <div className="relative z-10 space-y-2">
              <div className="flex flex-wrap gap-1.5">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md bg-black/30 backdrop-blur-md text-[11px] font-bold text-white border border-white/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-white leading-tight">
                {post.title}
              </h1>
            </div>
          </div>

          {/* Metadata bar */}
          <div className="flex flex-wrap items-center justify-between py-3 border-y border-slate-100 text-xs text-slate-500 gap-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1 font-semibold text-slate-700">
                <User className="w-3.5 h-3.5 text-amber-500" />
                {post.author}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {post.date}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {post.readTime}
              </span>
            </div>
          </div>

          {/* Key Takeaways Box */}
          {post.keyTakeaways && post.keyTakeaways.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Ghi nhớ nhanh cho học sinh THCS:</span>
              </div>
              <ul className="space-y-1.5 pl-2 text-xs sm:text-sm text-slate-700">
                {post.keyTakeaways.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Article Body Content */}
          <div className="prose prose-slate max-w-none text-slate-700 space-y-4 text-sm sm:text-base leading-relaxed">
            {post.content.map((paragraph, idx) => (
              <p key={idx} className="text-justify">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Next Article Recommendation */}
          {nextPost && (
            <div className="pt-6 border-t border-slate-200">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Bài viết tiếp theo:
              </div>
              <div
                onClick={() => onSelectPost(nextPost)}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-amber-50/60 border border-slate-200 hover:border-amber-300 transition-all flex items-center justify-between cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{nextPost.icon}</div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-amber-700 transition-colors">
                      {nextPost.title}
                    </h4>
                    <p className="text-xs text-slate-500">{nextPost.readTime}</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:translate-x-1 group-hover:text-amber-600 transition-transform" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
