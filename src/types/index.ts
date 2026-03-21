// Re-export database types
export * from './database';

// App-specific types
export type TransactionCategory =
  | 'Food' | 'Transport' | 'Housing' | 'Entertainment'
  | 'Health' | 'Business' | 'Savings' | 'Other';

export type Plan = 'free' | 'pro' | 'premium';

export interface Course {
  id: string;
  title: string;
  desc: string;
  path: 'beginner' | 'student' | 'business' | 'passive';
  xp: number;
  lessons: number;
  icon: string;
  dur: string;
  requiredPlan: Plan;
}

export interface LearningPath {
  id: Course['path'];
  label: string;
  icon: string;
  locked: boolean;
  requiredPlan: Plan;
}

export interface VaultItem {
  id: string;
  name: string;
  desc: string;
  size: string;
  type: 'finance' | 'business' | 'tools' | 'books';
  icon: string;
  badge: string;
  requiredPlan: Plan;
}

export type ModuleId =
  | 'dashboard' | 'mission' | 'autopilot'
  | 'growth' | 'academy' | 'vault' | 'security' | 'settings';
