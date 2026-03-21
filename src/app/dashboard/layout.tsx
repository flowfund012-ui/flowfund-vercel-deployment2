import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardShell from '@/components/layout/DashboardShell';
import Toast from '@/components/ui/Toast';
import Onboarding from '@/components/ui/Onboarding';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000' }}>
      <DashboardShell user={user} profile={profile}>
        {children}
      </DashboardShell>
      <Toast />
      <Onboarding />
    </div>
  );
}
