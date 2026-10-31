/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { Hero } from './components/Hero.tsx';
import { ArenaGamification } from './components/ArenaGamification.tsx';
import { AiAssistant } from './components/AiAssistant.tsx';
import { BlogSection } from './components/BlogSection.tsx';
import { BlogDetailModal } from './components/BlogDetailModal.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { QuizModal } from './components/QuizModal.tsx';
import { BadgesModal } from './components/BadgesModal.tsx';

import {
  KnowledgeIsland,
  TimelineMilestone,
  BlogPost,
  UserStats,
  Question,
  ActiveModule,
} from './types/index.ts';

import {
  INITIAL_USER_STATS,
  KNOWLEDGE_ISLANDS,
  TIMELINE_MILESTONES,
  BLOG_POSTS,
  WEEKLY_LEADERBOARD,
} from './data/mockData.ts';

export default function App() {
  // Active Module State (Mặc định sau khi đăng nhập là 'intro' - 🏠 Giới thiệu)
  const [activeModule, setActiveModule] = useState<ActiveModule>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.replace('#', '');
      if (['intro', 'challenge', 'ai', 'blog', 'contact'].includes(hash)) {
        return hash as ActiveModule;
      }
    }
    return 'intro';
  });

  // Support browser Back/Forward navigation with URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['intro', 'challenge', 'ai', 'blog', 'contact'].includes(hash)) {
        setActiveModule(hash as ActiveModule);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (!hash) {
        setActiveModule('intro');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Handle switching active module smoothly
  const handleSelectModule = (mod: ActiveModule) => {
    setActiveModule(mod);
    if (typeof window !== 'undefined') {
      if (mod === 'intro') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } else {
        window.location.hash = mod;
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // User Stats with LocalStorage Persistence
  const [userStats, setUserStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('higeoedu_user_stats');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_USER_STATS;
  });

  useEffect(() => {
    try {
      localStorage.setItem('higeoedu_user_stats', JSON.stringify(userStats));
    } catch (e) {}
  }, [userStats]);

  // Quiz Modal States
  const [selectedIsland, setSelectedIsland] = useState<KnowledgeIsland | null>(null);
  const [selectedMilestone, setSelectedMilestone] = useState<TimelineMilestone | null>(null);
  const [customQuizQuestions, setCustomQuizQuestions] = useState<Question[] | null>(null);

  // Blog Detail Modal State
  const [selectedBlogPost, setSelectedBlogPost] = useState<BlogPost | null>(null);

  // Badges Modal
  const [showBadgesModal, setShowBadgesModal] = useState<boolean>(false);

  // Level Up Toast Notification
  const [levelUpNotice, setLevelUpNotice] = useState<string | null>(null);

  // Handle XP and Progression Rewards
  const handleRewardXP = (earnedXP: number, isCompleted: boolean) => {
    setUserStats((prev) => {
      const newXP = prev.xp + earnedXP;
      const newLevel = Math.max(1, Math.floor(newXP / 500) + 1);

      if (newLevel > prev.level) {
        setLevelUpNotice(`Chúc mừng! Bạn đã thăng cấp Level ${newLevel}! 🏆`);
        setTimeout(() => setLevelUpNotice(null), 4000);
      }

      let updatedUnlockedIslands = [...prev.unlockedIslands];
      if (selectedIsland) {
        const currentIndex = KNOWLEDGE_ISLANDS.findIndex((i) => i.id === selectedIsland.id);
        if (currentIndex !== -1 && currentIndex + 1 < KNOWLEDGE_ISLANDS.length) {
          const nextIsland = KNOWLEDGE_ISLANDS[currentIndex + 1];
          if (!updatedUnlockedIslands.includes(nextIsland.id)) {
            updatedUnlockedIslands.push(nextIsland.id);
          }
        }
      }

      let updatedUnlockedMilestones = [...prev.unlockedMilestones];
      if (selectedMilestone) {
        const currentIndex = TIMELINE_MILESTONES.findIndex((m) => m.id === selectedMilestone.id);
        if (currentIndex !== -1 && currentIndex + 1 < TIMELINE_MILESTONES.length) {
          const nextMs = TIMELINE_MILESTONES[currentIndex + 1];
          if (!updatedUnlockedMilestones.includes(nextMs.id)) {
            updatedUnlockedMilestones.push(nextMs.id);
          }
        }
      }

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
        completedQuizzes: isCompleted ? prev.completedQuizzes + 1 : prev.completedQuizzes,
        unlockedIslands: updatedUnlockedIslands,
        unlockedMilestones: updatedUnlockedMilestones,
      };
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-amber-400 selection:text-amber-950">
      {/* Top Navbar */}
      <Navbar
        stats={userStats}
        activeModule={activeModule}
        onSelectModule={handleSelectModule}
        onOpenBadgesModal={() => setShowBadgesModal(true)}
      />

      {/* Level Up Floating Toast */}
      {levelUpNotice && (
        <div className="fixed top-22 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-black text-sm shadow-2xl border-2 border-yellow-300 flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{levelUpNotice}</span>
        </div>
      )}

      {/* Main Container: Mỗi thời điểm CHỈ HIỂN THỊ DUY NHẤT module đang chọn */}
      <main className="flex-1">
        {/* 1. Module 🏠 Giới thiệu (Module mặc định sau khi đăng nhập) */}
        {activeModule === 'intro' && (
          <Hero
            onExploreClick={() => handleSelectModule('challenge')}
            onTryAiClick={() => handleSelectModule('ai')}
          />
        )}

        {/* 2. Module 🎮 Thử thách tương tác (Đấu trường Sử Địa) */}
        {activeModule === 'challenge' && (
          <ArenaGamification
            islands={KNOWLEDGE_ISLANDS}
            milestones={TIMELINE_MILESTONES}
            leaderboard={WEEKLY_LEADERBOARD}
            userStats={userStats}
            onSelectIsland={(island) => setSelectedIsland(island)}
            onSelectMilestone={(ms) => setSelectedMilestone(ms)}
            onOpenBadgesModal={() => setShowBadgesModal(true)}
          />
        )}

        {/* 3. Module 🤖 Trợ lí AI (HIGEOAI 24/7) */}
        {activeModule === 'ai' && (
          <AiAssistant
            onStartCustomQuiz={(questions) => setCustomQuizQuestions(questions)}
          />
        )}

        {/* 4. Module 📖 Blog & Tư liệu (Sổ tay thám hiểm) */}
        {activeModule === 'blog' && (
          <BlogSection
            posts={BLOG_POSTS}
            onSelectPost={(post) => setSelectedBlogPost(post)}
          />
        )}

        {/* 5. Module 📩 Liên hệ & Góp ý */}
        {activeModule === 'contact' && (
          <ContactSection />
        )}
      </main>

      {/* Footer */}
      <Footer onSelectModule={handleSelectModule} />

      {/* Quiz / Challenge Modal */}
      {(selectedIsland || selectedMilestone || customQuizQuestions) && (
        <QuizModal
          island={selectedIsland}
          milestone={selectedMilestone}
          customQuestions={customQuizQuestions}
          onClose={() => {
            setSelectedIsland(null);
            setSelectedMilestone(null);
            setCustomQuizQuestions(null);
          }}
          onRewardXP={handleRewardXP}
        />
      )}

      {/* Blog Detail Modal */}
      {selectedBlogPost && (
        <BlogDetailModal
          post={selectedBlogPost}
          allPosts={BLOG_POSTS}
          onClose={() => setSelectedBlogPost(null)}
          onSelectPost={(post) => setSelectedBlogPost(post)}
        />
      )}

      {/* Badges / Achievements Modal */}
      {showBadgesModal && (
        <BadgesModal
          stats={userStats}
          onClose={() => setShowBadgesModal(false)}
        />
      )}
    </div>
  );
}
