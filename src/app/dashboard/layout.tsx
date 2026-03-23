import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import DashboardShell from '@/components/layout/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return (
    <Suspense fallback={<div style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',background:'#07080f',color:'#9b9bba',fontSize:14}}>Loading FlowFund...</div>}>
      <DashboardShell user={user} profile={profile}>
        {children}
      </DashboardShell>
    </Suspense>
  );
}
