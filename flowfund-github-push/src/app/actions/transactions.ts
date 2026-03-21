'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { transactionSchema, safeParse } from '@/lib/validation';
import { checkTransactionLimit, requireOwnership } from '@/lib/access';
import { logger } from '@/lib/logger';
import { trackServerEvent } from '@/lib/analytics';
import type { Plan } from '@/types';

export async function createTransaction(raw: unknown) {
  const supabase = createClient();
  const { data: { user }, error: authErr } = await supabase.auth.getUser();
  if (authErr || !user) return { data: null, error: 'Not authenticated' };

  // Validate input
  const v = safeParse(transactionSchema, raw);
  if (!v.success) return { data: null, error: v.error };

  // Check plan limits
  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user.id).single();
  const plan = (profile?.plan ?? 'free') as Plan;
  const withinLimit = await checkTransactionLimit(user.id, plan);
  if (!withinLimit) {
    return { data: null, error: `Transaction limit reached for ${plan} plan. Upgrade to add more.` };
  }

  try {
    const { data, error } = await supabase
      .from('transactions')
      .insert({ ...v.data, user_id: user.id })
      .select()
      .single();

    if (error) {
      logger.error('tx_create_db_error', error, { userId: user.id });
      return { data: null, error: 'Failed to save transaction' };
    }

    await supabase.from('security_logs').insert({
      user_id: user.id,
      event: `${v.data.type} added: ${v.data.description} ($${v.data.amount.toFixed(2)})`,
      type: 'info',
    });

    trackServerEvent('transaction_created', user.id, { type: v.data.type, amount: v.data.amount });
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/mission');
    return { data, error: null };
  } catch (err) {
    logger.error('tx_create_unexpected', err);
    return { data: null, error: 'Unexpected error. Please try again.' };
  }
}

export async function deleteTransaction(id: string) {
  if (!id?.match(/^[0-9a-f-]{36}$/i)) return { error: 'Invalid ID' };

  // Verify ownership server-side
  const ownership = await requireOwnership('transactions', id);
  if (!ownership.allowed) return { error: ownership.error };

  try {
    const supabase = createClient();
    const { error } = await supabase.from('transactions').delete().eq('id', id).eq('user_id', ownership.userId);
    if (error) {
      logger.error('tx_delete_error', error, { id });
      return { error: 'Failed to delete transaction' };
    }
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/mission');
    return { error: null };
  } catch (err) {
    logger.error('tx_delete_unexpected', err);
    return { error: 'Unexpected error' };
  }
}
