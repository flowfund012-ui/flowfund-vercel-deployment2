import { createClient } from '@/lib/supabase/server';
import { VaultPage } from '@/components/vault/VaultPage';

export const metadata = { title: 'Vault Access | FlowFund OS' };

export default async function VaultAccessPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const [dlResult, profileResult, acResult] = await Promise.all([
    supabase.from('vault_downloads').select('asset_id').eq('user_id', user!.id),
    supabase.from('profiles').select('plan').eq('id', user!.id).single(),
    supabase.from('academy_progress').select('completed_courses').eq('user_id', user!.id).single(),
  ]);
  const academyDone = (acResult.data?.completed_courses ?? []).length;
  return (
    <VaultPage
      downloadedIds={(dlResult.data ?? []).map(d => d.asset_id)}
      plan={profileResult.data?.plan ?? 'free'}
      userId={user!.id}
      academyDone={academyDone}
    />
  );
}
