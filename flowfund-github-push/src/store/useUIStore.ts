import { create } from 'zustand';
import type { Profile, Transaction, SavingsGoal, RevenueEntry, AutopilotSettings, AcademyProgress } from '@/types/database';

// ─── UI Store — client-side state only ──────────────────────
// Routing is handled by Next.js App Router
// Data fetching is handled by Server Components + API calls
// This store only holds: session cache, UI toggles, optimistic state

interface UIStore {
  // ── Cached user data (populated after auth) ──
  profile: Profile | null;
  setProfile: (p: Profile | null) => void;

  // ── Data cache (populated by page components) ──
  transactions: Transaction[];
  setTransactions: (t: Transaction[]) => void;
  addTransactionOptimistic: (t: Transaction) => void;
  removeTransactionOptimistic: (id: string) => void;

  goals: SavingsGoal[];
  setGoals: (g: SavingsGoal[]) => void;
  addGoalOptimistic: (g: SavingsGoal) => void;
  removeGoalOptimistic: (id: string) => void;

  revenues: RevenueEntry[];
  setRevenues: (r: RevenueEntry[]) => void;
  addRevenueOptimistic: (r: RevenueEntry) => void;
  removeRevenueOptimistic: (id: string) => void;

  autopilot: AutopilotSettings | null;
  setAutopilot: (a: AutopilotSettings | null) => void;

  academy: AcademyProgress | null;
  setAcademy: (a: AcademyProgress | null) => void;

  vaultDownloads: string[];
  setVaultDownloads: (v: string[]) => void;
  addVaultDownload: (id: string) => void;

  // ── Toast ──
  toast: { message: string; type: 'success' | 'error' | 'gold' } | null;
  showToast: (msg: string, type?: 'success' | 'error' | 'gold') => void;
  clearToast: () => void;

  // ── Loading states ──
  loading: Record<string, boolean>;
  setLoading: (key: string, val: boolean) => void;

  // ── Vault filter ──
  vaultFilter: string;
  setVaultFilter: (f: string) => void;

  // ── Growth period ──
  growthPeriod: '3m' | '6m' | '12m';
  setGrowthPeriod: (p: '3m' | '6m' | '12m') => void;

  // ── Heatmap type ──
  heatmapType: 'revenue' | 'expenses' | 'profit';
  setHeatmapType: (h: 'revenue' | 'expenses' | 'profit') => void;

  // ── Security lockdown ──
  lockdown: boolean;
  setLockdown: (v: boolean) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  // Profile
  profile: null,
  setProfile: (profile) => set({ profile }),

  // Transactions
  transactions: [],
  setTransactions: (transactions) => set({ transactions }),
  addTransactionOptimistic: (t) => set((s) => ({ transactions: [t, ...s.transactions] })),
  removeTransactionOptimistic: (id) => set((s) => ({ transactions: s.transactions.filter(t => t.id !== id) })),

  // Goals
  goals: [],
  setGoals: (goals) => set({ goals }),
  addGoalOptimistic: (g) => set((s) => ({ goals: [g, ...s.goals] })),
  removeGoalOptimistic: (id) => set((s) => ({ goals: s.goals.filter(g => g.id !== id) })),

  // Revenues
  revenues: [],
  setRevenues: (revenues) => set({ revenues }),
  addRevenueOptimistic: (r) => set((s) => ({ revenues: [r, ...s.revenues] })),
  removeRevenueOptimistic: (id) => set((s) => ({ revenues: s.revenues.filter(r => r.id !== id) })),

  // Autopilot
  autopilot: null,
  setAutopilot: (autopilot) => set({ autopilot }),

  // Academy
  academy: null,
  setAcademy: (academy) => set({ academy }),

  // Vault
  vaultDownloads: [],
  setVaultDownloads: (vaultDownloads) => set({ vaultDownloads }),
  addVaultDownload: (id) => set((s) => ({ vaultDownloads: [...s.vaultDownloads, id] })),

  // Toast
  toast: null,
  showToast: (message, type = 'success') => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3200);
  },
  clearToast: () => set({ toast: null }),

  // Loading
  loading: {},
  setLoading: (key, val) => set((s) => ({ loading: { ...s.loading, [key]: val } })),

  // Filters
  vaultFilter: 'all',
  setVaultFilter: (vaultFilter) => set({ vaultFilter }),

  growthPeriod: '6m',
  setGrowthPeriod: (growthPeriod) => set({ growthPeriod }),

  heatmapType: 'revenue',
  setHeatmapType: (heatmapType) => set({ heatmapType }),

  lockdown: false,
  setLockdown: (lockdown) => set({ lockdown }),
}));
