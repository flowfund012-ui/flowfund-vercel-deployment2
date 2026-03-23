export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiOk, apiErr, logger } from '@/lib/logger';
import { rateLimit } from '@/lib/ratelimit';

export async function POST(req: NextRequest) {
  // Lightweight rate limit — 60 req/min
  const rl = await rateLimit(req, 'api');
  if (!rl.success) return apiErr('Too many requests', 429);

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const body = await req.json();
    const events = Array.isArray(body.events) ? body.events.slice(0, 20) : [];

    if (events.length === 0) return apiOk(null);

    const rows = events.map((e: { event: string; properties?: Record<string, unknown> }) => ({
      user_id:    user?.id ?? null,
      event:      String(e.event ?? '').slice(0, 100),
      properties: e.properties ?? {},
      path:       String(e.properties?.path ?? '').slice(0, 200),
    }));

    await supabase.from('analytics_events' as never).insert(rows);
    return apiOk({ received: rows.length });
  } catch (err) {
    logger.error('analytics_api_error', err);
    return apiOk(null); // Silent — never fail for analytics
  }
}
