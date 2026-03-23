export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { createClient } from '@/lib/supabase/server';
import AutopilotPage from '@/components/autopilot/AutopilotPage';

export const metadata = { title: 'AutoPilot | FlowFund OS' };
export const revalidate = 0;

export default async function AutoPilotPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [settingsResult, goalsResult, txResult] = await Promise.all([
    supabase.from('autopilot_settings').select('*').eq('user_id', user!.id).single(),
    supabase.from('savings_goals').select('*').eq('user_id', user!.id).eq('completed', false).order('created_at', { ascending: false }),
    supabase.from('transactions').select('amount,type').eq('user_id', user!.id),
  ]);

  return (
    <AutopilotPage
      initialSettings={settingsResult.data ?? null}
      initialGoals={goalsResult.data ?? []}
      totalIncome={(txResult.data ?? []).filter(t => t.type === 'income').reduce((s, t) => s + Number(t.amount), 0)}
      totalExpenses={(txResult.data ?? []).filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)}
      userId={user!.id}
    />
  );
}
