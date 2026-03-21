import { createClient } from '@/lib/supabase/server';
import type { Plan } from '@/types';
import { logger } from '@/lib/logger';

const PLAN_RANK: Record<string, number> = { free: 0, pro: 1, premium: 2 };

export function planRank(plan: string): number {
  return PLAN_RANK[plan] ?? 0;
}

export function canAccess(userPlan: string, requiredPlan: string): boolean {
  return planRank(userPlan) >= planRank(requiredPlan);
}

export const FEATURE_GATES = {
  growth_engine:     { requiredPlan: 'pro'     as Plan },
  advanced_charts:   { requiredPlan: 'pro'     as Plan },
  csv_export:        { requiredPlan: 'pro'     as Plan },
  academy_course_c4: { requiredPlan: 'pro'     as Plan },
  academy_course_c5: { requiredPlan: 'pro'     as Plan },
  academy_course_c6: { requiredPlan: 'premium' as Plan },
  vault_asset_v3:    { requiredPlan: 'pro'     as Plan },
  vault_asset_v4:    { requiredPlan: 'pro'     as Plan },
  vault_asset_v5:    { requiredPlan: 'premium' as Plan },
  vault_asset_v6:    { requiredPlan: 'premium' as Plan },
  transactions_limit: { free: 50, pro: 5000, premium: Infinity },
} as const;

export async function requirePlan(
  minPlan: Plan
): Promise<{ allowed: true; plan: Plan; userId: string } | { allowed: false; error: string }> {
  try {
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return { allowed: false, error: 'Not authenticated' };

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('plan, plan_expires_at')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) return { allowed: false, error: 'Profile not found' };

    if (profile.plan !== 'free' && profile.plan_expires_at) {
      const expires = new Date(profile.plan_expires_at);
      if (expires < new Date()) {
        await supabase.from('profiles').update({ plan: 'free', plan_expires_at: null }).eq('id', user.id);
        return { allowed: false, error: 'Your plan has expired. Please renew.' };
      }
    }

    if (!canAccess(profile.plan, minPlan)) {
      return { allowed: false, error: `This feature requires the ${minPlan} plan. Upgrade in Settings.` };
    }

    return { allowed: true, plan: profile.plan as Plan, userId: user.id };
  } catch (err) {
    logger.error('require_plan_error', err);
    return { allowed: false, error: 'Access check failed' };
  }
}

export async function checkTransactionLimit(userId: string, plan: Plan): Promise<boolean> {
  const limit = FEATURE_GATES.transactions_limit[plan] ?? FEATURE_GATES.transactions_limit.free;
  if (limit === Infinity) return true;
  const supabase = createClient();
  const { count } = await supabase
    .from('transactions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId);
  return (count ?? 0) < limit;
}

export async function requireOwnership(
  table: 'transactions' | 'savings_goals' | 'revenue_entries',
  resourceId: string
): Promise<{ allowed: true; userId: string } | { allowed: false; error: string }> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { allowed: false, error: 'Not authenticated' };
  const { data } = await supabase.from(table).select('user_id').eq('id', resourceId).single();
  if (!data) return { allowed: false, error: 'Resource not found' };
  if (data.user_id !== user.id) return { allowed: false, error: 'Access denied' };
  return { allowed: true, userId: user.id };
}
