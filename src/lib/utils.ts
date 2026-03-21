import type { Course, LearningPath, VaultItem } from '@/types';

export const fm = (n: number | string): string =>
  '$' + parseFloat(String(n || 0)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const fd = (s: string): string =>
  new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export const today = (): string => new Date().toISOString().split('T')[0];

export const daysAgo = (n: number): string => {
  const d = new Date(); d.setDate(d.getDate() - n);
  return d.toISOString().split('T')[0];
};

export const CAT_ICONS: Record<string, string> = {
  Food: '🍔', Transport: '🚗', Housing: '🏠', Entertainment: '🎮',
  Health: '💊', Business: '💼', Savings: '🏦', Other: '📦',
};
export const CAT_COLORS: Record<string, string> = {
  Food: '#ff7043', Transport: '#29b6f6', Housing: '#ab47bc', Entertainment: '#00f2ff',
  Health: '#ec407a', Business: '#EBC96D', Savings: '#66bb6a', Other: '#78909c',
};

export const COURSES: Course[] = [
  { id: 'c1', title: 'Budget Mastery 101',        desc: 'Master the 50/30/20 rule',       path: 'beginner', xp: 100, lessons: 8,  icon: '💰', dur: '2h',   requiredPlan: 'free'    },
  { id: 'c2', title: 'Debt Elimination Protocol', desc: 'Snowball vs avalanche method',   path: 'beginner', xp: 150, lessons: 10, icon: '🎯', dur: '2.5h', requiredPlan: 'free'    },
  { id: 'c3', title: 'Student Survival Kit',      desc: 'Finance on a student budget',    path: 'student',  xp: 120, lessons: 6,  icon: '🎓', dur: '1.5h', requiredPlan: 'free'    },
  { id: 'c4', title: 'Side Income Blueprint',     desc: 'Build streams outside your job', path: 'student',  xp: 200, lessons: 12, icon: '⚡', dur: '3h',   requiredPlan: 'pro'     },
  { id: 'c5', title: 'Business Cash Flow',        desc: 'Keep your business healthy',     path: 'business', xp: 250, lessons: 14, icon: '💼', dur: '4h',   requiredPlan: 'pro'     },
  { id: 'c6', title: 'Passive Income Vault',      desc: 'Dividends, royalties & more',    path: 'passive',  xp: 300, lessons: 16, icon: '🔐', dur: '5h',   requiredPlan: 'premium' },
];

export const LEARNING_PATHS: LearningPath[] = [
  { id: 'beginner', label: 'Beginner Blueprint', icon: '🌱', locked: false, requiredPlan: 'free'    },
  { id: 'student',  label: 'Student Survival',   icon: '🎓', locked: false, requiredPlan: 'free'    },
  { id: 'business', label: 'Business Finance',   icon: '💼', locked: false, requiredPlan: 'pro'     },
  { id: 'passive',  label: 'Passive Income',     icon: '🚀', locked: true,  requiredPlan: 'premium' },
];

export const DAILY_CHALLENGES = [
  'Track every single expense today — even the €0.50 coffee ☕',
  'Calculate your exact savings rate this month 📊',
  "Review all subscriptions — cancel at least one you don't use 🔄",
  'Set one concrete financial goal with a deadline 🎯',
  "Move 5% of today's income to savings immediately 💰",
  'Look up one investing term you don\'t know yet 📚',
  'Tell someone one thing you learned about money today 💬',
];

export const VAULT_ITEMS: VaultItem[] = [
  { id: 'v1', name: 'FlowFund Command Center',     desc: 'Complete Notion financial OS with 12 modules',         size: '12.4 MB', type: 'finance',  icon: '📊', badge: 'Premium',    requiredPlan: 'free'    },
  { id: 'v2', name: 'Financial Goal Tracker',      desc: '30-day goal tracking spreadsheet with automations',    size: '3.2 MB',  type: 'finance',  icon: '🎯', badge: 'Popular',    requiredPlan: 'free'    },
  { id: 'v3', name: 'Business Expense Analyzer',   desc: 'AI-powered expense categorizer for businesses',        size: '5.7 MB',  type: 'business', icon: '💼', badge: 'New',        requiredPlan: 'pro'     },
  { id: 'v4', name: '30-Day Wealth Blueprint',     desc: 'Step-by-step guide to financial freedom in a month',   size: '8.3 MB',  type: 'books',    icon: '📖', badge: 'Bestseller', requiredPlan: 'pro'     },
  { id: 'v5', name: 'AI-Powered Budget Planner',   desc: 'Web-based budget planner with AI suggestions',         size: 'Web App', type: 'tools',    icon: '🤖', badge: 'AI',         requiredPlan: 'premium' },
  { id: 'v6', name: 'Investment Portfolio Tracker',desc: 'Real-time portfolio tracker with risk analysis',        size: '32 MB',   type: 'tools',    icon: '📈', badge: 'Pro',        requiredPlan: 'premium' },
];

export const MODULE_BG: Record<string, string> = {
  dashboard: 'radial-gradient(ellipse at 50% 0%,#0b0e17 0%,#000 100%)',
  mission:   '#111111',
  autopilot: '#020617',
  growth:    '#020617',
  academy:   '#0f172a',
  vault:     '#020617',
  security:  '#050a17',
};

export const planCanAccess = (userPlan: string, requiredPlan: string): boolean => {
  const order = { free: 0, pro: 1, premium: 2 };
  return (order[userPlan as keyof typeof order] ?? 0) >= (order[requiredPlan as keyof typeof order] ?? 0);
};
