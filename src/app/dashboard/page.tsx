export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { createClient } from '@/lib/supabase/server';
import DashboardPage from '@/components/dashboard/DashboardPage';

export const metadata = { title: 'Dashboard | FlowFund OS' };
export const revalidate = 0; // Always fresh

export default async function Dashboard() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Parallel data fetch
  const [txResult, goalResult, revResult, profileResult] = await Promise.all([
    supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user!.id)
      .order('date', { ascending: false })
      .limit(50),
    supabase
      .from('savings_goals')
      .select('*')
      .eq('user_id', user!.id)
      .eq('completed', false),
    supabase
      .from('revenue_entries')
      .select('*')
      .eq('user_id', user!.id)
      .order('date', { ascending: false })
      .limit(20),
    supabase
      .from('profiles')
      .select('*')
      .eq('id', user!.id)
      .single(),
  ]);

  return (
    <DashboardPage
      transactions={txResult.data ?? []}
      goals={goalResult.data ?? []}
      revenues={revResult.data ?? []}
      profile={profileResult.data}
      user={user!}
    />
  );
}
