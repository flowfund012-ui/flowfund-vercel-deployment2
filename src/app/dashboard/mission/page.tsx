export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { createClient } from '@/lib/supabase/server';
import MissionPage from '@/components/mission/MissionPage';

export const metadata = { title: 'Mission Tracker | FlowFund OS' };
export const revalidate = 0;

export default async function MissionTrackerPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user!.id)
    .order('date', { ascending: false })
    .order('created_at', { ascending: false });

  return <MissionPage initialTransactions={transactions ?? []} userId={user!.id} />;
}
