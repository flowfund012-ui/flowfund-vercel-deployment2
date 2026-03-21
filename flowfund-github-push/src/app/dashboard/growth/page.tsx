import { createClient } from '@/lib/supabase/server';
import GrowthPage from '@/components/growth/GrowthPage';

export const metadata = { title: 'Growth Engine | FlowFund OS' };
export const revalidate = 0;

export default async function GrowthEnginePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [revResult, txResult, profileResult] = await Promise.all([
    supabase.from('revenue_entries').select('*').eq('user_id', user!.id).order('date', { ascending: false }),
    supabase.from('transactions').select('amount,type').eq('user_id', user!.id),
    supabase.from('profiles').select('plan').eq('id', user!.id).single(),
  ]);

  return (
    <GrowthPage
      initialRevenues={revResult.data ?? []}
      totalExpenses={(txResult.data ?? []).filter(t => t.type === 'expense').reduce((s, t) => s + Number(t.amount), 0)}
      plan={profileResult.data?.plan ?? 'free'}
      userId={user!.id}
    />
  );
}
