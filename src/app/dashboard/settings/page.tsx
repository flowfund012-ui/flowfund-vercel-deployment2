export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { createClient } from '@/lib/supabase/server';
import SettingsPage from '@/components/settings/SettingsPage';

export const metadata = { title: 'Settings & Billing | FlowFund OS' };

export default async function Settings() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [profileResult, ordersResult] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user!.id).single(),
    supabase.from('payment_orders').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(10),
  ]);
  return <SettingsPage profile={profileResult.data} orders={ordersResult.data ?? []} user={user!} />;
}
