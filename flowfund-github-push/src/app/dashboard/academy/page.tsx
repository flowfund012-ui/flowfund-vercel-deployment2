import { createClient } from '@/lib/supabase/server';
import { AcademyPageComponent } from '@/components/academy/AcademyPage';

export const metadata = { title: 'Personal Academy | FlowFund OS' };

export default async function PersonalAcademyPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: progress } = await supabase.from('academy_progress').select('*').eq('user_id', user!.id).single();
  const { data: profile } = await supabase.from('profiles').select('plan').eq('id', user!.id).single();
  return <AcademyPageComponent initialProgress={progress ?? null} plan={profile?.plan ?? 'free'} userId={user!.id} />;
}
