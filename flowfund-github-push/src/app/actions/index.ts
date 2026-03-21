'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { goalSchema, revenueSchema, autopilotSchema, profileSchema, safeParse } from '@/lib/validation';
import { requirePlan, requireOwnership } from '@/lib/access';
import { logger } from '@/lib/logger';
import { trackServerEvent } from '@/lib/analytics';

// ── Goals ────────────────────────────────────────────────────
export async function createGoal(raw: unknown) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { data: null, error: 'Not authenticated' };

  const v = safeParse(goalSchema, raw);
  if (!v.success) return { data: null, error: v.error };

  try {
    const { data, error } = await supabase.from('savings_goals')
      .insert({ ...v.data, user_id: user.id, deadline: v.data.deadline || null })
      .select().single();
    if (error) { logger.error('goal_create_error', error); return { data: null, error: 'Failed to create goal' }; }
    trackServerEvent('goal_created', user.id, { category: v.data.category });
    revalidatePath('/dashboard/autopilot');
    return { data, error: null };
  } catch (err) { logger.error('goal_create_unexpected', err); return { data: null, error: 'Unexpected error' }; }
}

export async function deleteGoal(id: string) {
  if (!id?.match(/^[0-9a-f-]{36}$/i)) return { error: 'Invalid ID' };
  const ownership = await requireOwnership('savings_goals', id);
  if (!ownership.allowed) return { error: ownership.error };
  const supabase = createClient();
  const { error } = await supabase.from('savings_goals').delete().eq('id', id).eq('user_id', ownership.userId);
  if (error) { logger.error('goal_delete_error', error); return { error: 'Failed to delete goal' }; }
  revalidatePath('/dashboard/autopilot');
  return { error: null };
}

// ── Revenue ──────────────────────────────────────────────────
export async function createRevenue(raw: unknown) {
  // Revenue requires pro+ plan
  const access = await requirePlan('pro');
  if (!access.allowed) return { data: null, error: access.error };

  const v = safeParse(revenueSchema, raw);
  if (!v.success) return { data: null, error: v.error };

  const supabase = createClient();
  try {
    const { data, error } = await supabase.from('revenue_entries')
      .insert({ ...v.data, user_id: access.userId }).select().single();
    if (error) { logger.error('revenue_create_error', error); return { data: null, error: 'Failed to log revenue' }; }
    trackServerEvent('revenue_logged', access.userId, { amount: v.data.amount, type: v.data.type });
    revalidatePath('/dashboard/growth');
    return { data, error: null };
  } catch (err) { logger.error('revenue_create_unexpected', err); return { data: null, error: 'Unexpected error' }; }
}

export async function deleteRevenue(id: string) {
  if (!id?.match(/^[0-9a-f-]{36}$/i)) return { error: 'Invalid ID' };
  const ownership = await requireOwnership('revenue_entries', id);
  if (!ownership.allowed) return { error: ownership.error };
  const supabase = createClient();
  const { error } = await supabase.from('revenue_entries').delete().eq('id', id).eq('user_id', ownership.userId);
  if (error) return { error: 'Failed to delete revenue' };
  revalidatePath('/dashboard/growth');
  return { error: null };
}

// ── AutoPilot ────────────────────────────────────────────────
export async function updateAutopilot(raw: unknown) {
  const v = safeParse(autopilotSchema, raw);
  if (!v.success) return { error: v.error };
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  try {
    const { error } = await supabase.from('autopilot_settings')
      .upsert({ ...v.data, user_id: user.id }, { onConflict: 'user_id' });
    if (error) { logger.error('autopilot_update_error', error); return { error: 'Failed to update settings' }; }
    trackServerEvent('autopilot_updated', user.id, { ss: v.data.smart_save, ai: v.data.auto_invest });
    revalidatePath('/dashboard/autopilot');
    return { error: null };
  } catch (err) { logger.error('autopilot_update_unexpected', err); return { error: 'Unexpected error' }; }
}

// ── Academy ──────────────────────────────────────────────────
const COURSE_XP_MAP: Record<string, { xp: number; requiredPlan: string }> = {
  c1: { xp: 100, requiredPlan: 'free' },
  c2: { xp: 150, requiredPlan: 'free' },
  c3: { xp: 120, requiredPlan: 'free' },
  c4: { xp: 200, requiredPlan: 'pro'  },
  c5: { xp: 250, requiredPlan: 'pro'  },
  c6: { xp: 300, requiredPlan: 'premium' },
};

export async function completeCourse(courseId: string, xp: number) {
  if (!courseId.match(/^c[1-6]$/)) return { error: 'Invalid course ID' };

  const courseInfo = COURSE_XP_MAP[courseId];
  if (!courseInfo) return { error: 'Course not found' };

  // Validate plan access server-side
  const access = await requirePlan(courseInfo.requiredPlan as 'free'|'pro'|'premium');
  if (!access.allowed) return { error: access.error };

  // Validate XP server-side (don't trust client)
  const serverXp = courseInfo.xp;

  const supabase = createClient();
  const { data: current } = await supabase.from('academy_progress')
    .select('xp,completed_courses').eq('user_id', access.userId).single();

  const done = current?.completed_courses ?? [];
  if (done.includes(courseId)) return { error: 'Already completed' };

  try {
    const { error } = await supabase.from('academy_progress')
      .update({ xp: (current?.xp ?? 0) + serverXp, completed_courses: [...done, courseId] })
      .eq('user_id', access.userId);
    if (error) return { error: 'Failed to update progress' };
    trackServerEvent('course_completed', access.userId, { courseId, xp: serverXp });
    revalidatePath('/dashboard/academy');
    return { error: null };
  } catch (err) { logger.error('course_complete_unexpected', err); return { error: 'Unexpected error' }; }
}

export async function completeDailyChallenge() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: current } = await supabase.from('academy_progress')
    .select('xp,streak,last_challenge').eq('user_id', user.id).single();

  const today = new Date().toISOString().split('T')[0];
  if (current?.last_challenge === today) return { error: 'Already completed today' };

  try {
    const { error } = await supabase.from('academy_progress').update({
      xp: (current?.xp ?? 0) + 50,
      streak: (current?.streak ?? 0) + 1,
      last_challenge: today,
    }).eq('user_id', user.id);
    if (error) return { error: 'Failed to save challenge' };
    trackServerEvent('challenge_completed', user.id, { streak: (current?.streak ?? 0) + 1 });
    revalidatePath('/dashboard/academy');
    return { error: null };
  } catch (err) { logger.error('challenge_complete_unexpected', err); return { error: 'Unexpected error' }; }
}

// ── Vault ────────────────────────────────────────────────────
const VAULT_PLAN_MAP: Record<string, string> = {
  v1: 'free', v2: 'free', v3: 'pro', v4: 'pro', v5: 'premium', v6: 'premium',
};

export async function recordVaultDownload(assetId: string) {
  if (!assetId.match(/^v[1-6]$/)) return { error: 'Invalid asset ID' };

  const requiredPlan = VAULT_PLAN_MAP[assetId];
  if (!requiredPlan) return { error: 'Asset not found' };

  const access = await requirePlan(requiredPlan as 'free'|'pro'|'premium');
  if (!access.allowed) return { error: access.error };

  const supabase = createClient();
  await supabase.from('vault_downloads')
    .upsert({ user_id: access.userId, asset_id: assetId }, { onConflict: 'user_id,asset_id', ignoreDuplicates: true });
  await supabase.from('security_logs').insert({
    user_id: access.userId, event: `Asset downloaded: ${assetId}`, type: 'info',
  });
  trackServerEvent('asset_downloaded', access.userId, { assetId });
  return { error: null };
}

// ── Security ─────────────────────────────────────────────────
export async function addSecurityLog(event: string, type: 'info'|'success'|'error' = 'info') {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  const safeEvent = String(event).slice(0, 500);
  await supabase.from('security_logs').insert({ user_id: user.id, event: safeEvent, type });
  revalidatePath('/dashboard/security');
}

export async function clearSecurityLogs() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  await supabase.from('security_logs').delete().eq('user_id', user.id);
  revalidatePath('/dashboard/security');
  return { error: null };
}

// ── Profile ──────────────────────────────────────────────────
export async function updateProfile(raw: unknown) {
  const v = safeParse(profileSchema, raw);
  if (!v.success) return { error: v.error };
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { error } = await supabase.from('profiles')
    .update({ ...v.data, updated_at: new Date().toISOString() }).eq('id', user.id);
  if (error) return { error: 'Failed to update profile' };
  revalidatePath('/dashboard/settings');
  return { error: null };
}
