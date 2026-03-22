import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardShell from '@/components/layout/DashboardShell';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return (
    <DashboardShell user={user} profile={profile}>
      {children}
    </DashboardShell>
  );
}
