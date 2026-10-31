export type Subject = 'history' | 'geography';

export type ActiveModule = 'intro' | 'challenge' | 'ai' | 'blog' | 'contact';

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'fill_blank'
  | 'short_answer'
  | 'drag_drop';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  hint: string;
  explanation: string;
  xp: number;
  matchPairs?: Array<{ left: string; right: string }>;
}

export interface KnowledgeIsland {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  category: 'natural' | 'climate' | 'rivers' | 'vietnam' | 'world' | 'maps';
  description: string;
  questionCount: number;
  minPercentToUnlock: number;
  xpReward: number;
  isLocked: boolean;
  stars: number;
  completedPercent: number;
  accentColor: string;
  questions: Question[];
}

export interface TimelineMilestone {
  id: string;
  year: number | string;
  title: string;
  shortDesc: string;
  heroName: string;
  secretCode: string;
  fullStory: string;
  xpReward: number;
  isUnlocked: boolean;
  questions: Question[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string[];
  tags: string[];
  author: string;
  date: string;
  readTime: string;
  coverGradient: string;
  icon: string;
  keyTakeaways: string[];
  relatedSubject: Subject;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  xp: number;
  level: number;
  avatar: string;
  badge: string;
  streak: number;
  isCurrentUser?: boolean;
}

export interface UserStats {
  xp: number;
  level: number;
  streak: number;
  completedQuizzes: number;
  correctAnswersCount: number;
  badges: string[];
  unlockedIslands: string[];
  unlockedMilestones: string[];
}

export type MascotMood =
  | 'welcome'
  | 'correct'
  | 'wrong'
  | 'thinking'
  | 'celebrate'
  | 'hint'
  | 'completed';
