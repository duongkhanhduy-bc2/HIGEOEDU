import React, { useState } from 'react';
import { BlogPost, Subject } from '../types/index.ts';
import { BookOpen, Clock, Tag, ArrowRight, Sparkles, Search } from 'lucide-react';

interface BlogSectionProps {
  posts: BlogPost[];
  onSelectPost: (post: BlogPost) => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts, onSelectPost }) => {
  const [filterSubject, setFilterSubject] = useState<'all' | Subject>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter((post) => {
    const matchesSubject =
      filterSubject === 'all' || post.relatedSubject === filterSubject;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSubject && matchesSearch;
  });

  return (
    <section id="blog-section" className="py-16 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs sm:text-sm font-bold mb-3 shadow-xs">
            <BookOpen className="w-4 h-4 text-emerald-600" />
            <span>📖 SỔ TAY THÁM HIỂM</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-emerald-700">Blog & Tư liệu học tập</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-3">
            Kho Tàng Bí Kíp & Tư Liệu Độc Quyền
          </h2>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Tuyển tập các bài viết ngắn, mẹo nhớ siêu tốc 5 phút, giải mã bí ẩn địa lí và phân tích các mốc son lịch sử hào hùng do đội ngũ HIGEOEDU biên soạn.
          </p>

          {/* Filter Bar & Search */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            {/* Category pills */}
            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setFilterSubject('all')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterSubject === 'all'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Tất cả (10)
              </button>
              <button
                onClick={() => setFilterSubject('geography')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterSubject === 'geography'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                🌍 Địa lí
              </button>
              <button
                onClick={() => setFilterSubject('history')}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  filterSubject === 'history'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                ⏳ Lịch sử
              </button>
            </div>

            {/* Search input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm bài viết, hashtag..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-amber-500 focus:ring-1 focus:ring-amber-200"
              />
            </div>
          </div>
        </div>

        {/* 3-Column Grid for Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => onSelectPost(post)}
              className="group bg-white rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-amber-300 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
            >
              {/* Card Banner Graphic */}
              <div
                className={`h-44 bg-gradient-to-tr ${post.coverGradient} p-5 flex flex-col justify-between text-white relative overflow-hidden`}
              >
                {/* Floating Big Icon */}
                <div className="absolute -bottom-2 -right-2 text-6xl opacity-35 select-none transition-transform group-hover:scale-110">
                  {post.icon}
                </div>

                <div className="flex items-center justify-between relative z-10">
                  <span className="px-2.5 py-0.5 rounded-md bg-black/25 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-white border border-white/20">
                    {post.relatedSubject === 'history' ? 'Lịch sử' : 'Địa lí'}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-semibold text-white/90">
                    <Clock className="w-3 h-3" />
                    <span>{post.readTime}</span>
                  </span>
                </div>

                <div className="relative z-10 flex flex-wrap gap-1">
                  {post.tags.slice(0, 2).map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-white/20 backdrop-blur-md rounded-md text-[10px] font-semibold text-white"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="font-extrabold text-slate-900 text-base leading-snug group-hover:text-amber-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>

                  <p className="text-slate-600 text-xs leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>

                {/* Card Footer: Read More button */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{post.date}</span>

                  <span className="font-bold text-amber-600 group-hover:text-amber-700 flex items-center gap-1">
                    <span>Đọc tiếp</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-slate-400 text-sm">
            Không tìm thấy bài viết phù hợp với từ khóa "{searchQuery}".
          </div>
        )}
      </div>
    </section>
  );
};
