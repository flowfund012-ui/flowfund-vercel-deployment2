export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { createServerClient } from '@/lib/supabase/server';
import DashboardShell from '@/components/layout/DashboardShell';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) redirect('/');
    let profile = null;
    try {
      const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      profile = data;
    } catch(e) {}
    return (
      <Suspense fallback={<div style={{display:'flex',height:'100vh',alignItems:'center',justifyContent:'center',background:'#07080f',color:'#9b9bba'}}>Loading...</div>}>
        <DashboardShell user={user} profile={profile}>
          {children}
        </DashboardShell>
      </Suspense>
    );
  } catch(e) {
    redirect('/');
  }
}
