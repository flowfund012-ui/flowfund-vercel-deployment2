import { getSupabaseClient } from '@/lib/supabase/client';
import type {
  RevenueEntry, AutopilotSettings, AcademyProgress,
  VaultDownload, SecurityLog,
} from '@/types/database';

const sb = () => getSupabaseClient();

// ─── Revenue ────────────────────────────────────────────────
export const revenueApi = {
  async getAll(): Promise<RevenueEntry[]> {
    const { data, error } = await sb().from('revenue_entries').select('*').order('date', { ascending: false });
    if (error) throw error;
    return data ?? [];
  },
  async create(input: { source: string; amount: number; type?: string; date?: string }): Promise<RevenueEntry> {
    const { data: { user } } = await sb().auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await sb().from('revenue_entries').insert({ ...input, user_id: user.id }).select().single();
    if (error) throw error;
    return data;
  },
  async delete(id: string): Promise<void> {
    const { error } = await sb().from('revenue_entries').delete().eq('id', id);
    if (error) throw error;
  },
};

// ─── AutoPilot ──────────────────────────────────────────────
export const autopilotApi = {
  async get(): Promise<AutopilotSettings | null> {
    const { data, error } = await sb().from('autopilot_settings').select('*').single();
    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  },
  async upsert(input: Partial<Pick<AutopilotSettings, 'smart_save' | 'smart_save_pct' | 'auto_invest' | 'auto_invest_pct'>>): Promise<AutopilotSettings> {
    const { data: { user } } = await sb().auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await sb()
      .from('autopilot_settings')
      .upsert({ user_id: user.id, ...input }, { onConflict: 'user_id' })
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ─── Academy ────────────────────────────────────────────────
export const academyApi = {
  async get(): Promise<AcademyProgress | null> {
    const { data, error } = await sb().from('academy_progress').select('*').single();
    if (error && error.code === 'PGRST116') return null;
    if (error) throw error;
    return data;
  },
  async completeCourse(courseId: string, xp: number): Promise<AcademyProgress> {
    const current = await academyApi.get();
    const currentDone = current?.completed_courses ?? [];
    if (currentDone.includes(courseId)) throw new Error('Already completed');

    const { data, error } = await sb()
      .from('academy_progress')
      .update({
        xp: (current?.xp ?? 0) + xp,
        completed_courses: [...currentDone, courseId],
      })
      .eq('user_id', (await sb().auth.getUser()).data.user!.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
  async completeDailyChallenge(): Promise<AcademyProgress> {
    const current = await academyApi.get();
    const { data, error } = await sb()
      .from('academy_progress')
      .update({
        xp: (current?.xp ?? 0) + 50,
        streak: (current?.streak ?? 0) + 1,
        last_challenge: new Date().toISOString().split('T')[0],
      })
      .eq('user_id', (await sb().auth.getUser()).data.user!.id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },
};

// ─── Vault ──────────────────────────────────────────────────
export const vaultApi = {
  async getDownloads(): Promise<string[]> {
    const { data, error } = await sb().from('vault_downloads').select('asset_id');
    if (error) throw error;
    return (data ?? []).map(d => d.asset_id);
  },
  async recordDownload(assetId: string): Promise<void> {
    const { data: { user } } = await sb().auth.getUser();
    if (!user) throw new Error('Not authenticated');
    await sb().from('vault_downloads').upsert({ user_id: user.id, asset_id: assetId }, { onConflict: 'user_id,asset_id', ignoreDuplicates: true });
  },
};

// ─── Security ───────────────────────────────────────────────
export const securityApi = {
  async getLogs(limit = 20): Promise<SecurityLog[]> {
    const { data, error } = await sb().from('security_logs').select('*').order('created_at', { ascending: false }).limit(limit);
    if (error) throw error;
    return data ?? [];
  },
  async addLog(event: string, type: 'info' | 'success' | 'error' = 'info'): Promise<void> {
    const { data: { user } } = await sb().auth.getUser();
    if (!user) return;
    await sb().from('security_logs').insert({ user_id: user.id, event, type });
  },
  async clearLogs(): Promise<void> {
    const { data: { user } } = await sb().auth.getUser();
    if (!user) return;
    await sb().from('security_logs').delete().eq('user_id', user.id);
  },
};

// ─── Profile ────────────────────────────────────────────────
export const profileApi = {
  async get() {
    const { data, error } = await sb().from('profiles').select('*').single();
    if (error) throw error;
    return data;
  },
  async update(input: { full_name?: string; onboarded?: boolean }) {
    const { data: { user } } = await sb().auth.getUser();
    if (!user) throw new Error('Not authenticated');
    const { data, error } = await sb().from('profiles').update(input).eq('id', user.id).select().single();
    if (error) throw error;
    return data;
  },
};
