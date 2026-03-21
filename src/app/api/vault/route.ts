import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { assetId } = await req.json();
  if (!assetId) return NextResponse.json({ error: 'Missing assetId' }, { status: 400 });
  await supabase.from('vault_downloads').upsert({ user_id: user.id, asset_id: assetId }, { onConflict: 'user_id,asset_id', ignoreDuplicates: true });
  return NextResponse.json({ success: true });
}
