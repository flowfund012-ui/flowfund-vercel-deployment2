import { createClient } from '@/lib/supabase/server';
import SecurityPage from '@/components/security/SecurityPage';
export const metadata = { title: 'Security Hub | FlowFund OS' };
export default async function SecurityHubPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: logs } = await supabase.from('security_logs').select('*').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(20);
  return <SecurityPage initialLogs={logs ?? []} userId={user!.id} />;
}
