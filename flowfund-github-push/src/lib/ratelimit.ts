import { NextRequest } from 'next/server';

const memStore = new Map<string, { count: number; reset: number }>();

function memRateLimit(key: string, limit: number, windowMs: number): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = memStore.get(key);
  if (!entry || entry.reset < now) {
    memStore.set(key, { count: 1, reset: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }
  if (entry.count >= limit) return { success: false, remaining: 0 };
  entry.count++;
  return { success: true, remaining: limit - entry.count };
}

export const RATE_LIMITS = {
  auth:    { limit: 5,   windowMs: 60_000  },
  api:     { limit: 60,  windowMs: 60_000  },
  payment: { limit: 3,   windowMs: 600_000 },
  webhook: { limit: 100, windowMs: 60_000  },
  action:  { limit: 30,  windowMs: 60_000  },
} as const;

type RateLimitKey = keyof typeof RATE_LIMITS;

export async function rateLimit(
  req: NextRequest | string,
  type: RateLimitKey = 'api'
): Promise<{ success: boolean; remaining: number }> {
  const config = RATE_LIMITS[type];
  const ip = typeof req === 'string' ? req : (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1'
  );
  const key = `ff:rl:${type}:${ip}`;

  // Try Upstash Redis if configured
  const redisUrl   = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (redisUrl && redisToken) {
    try {
      const { Ratelimit } = await import('@upstash/ratelimit');
      const { Redis }     = await import('@upstash/redis');
      const redis   = new Redis({ url: redisUrl, token: redisToken });
      const limiter = new Ratelimit({
        redis,
        limiter: Ratelimit.slidingWindow(config.limit, `${config.windowMs}ms`),
        analytics: false,
        prefix: 'ff:rl',
      });
      const result = await limiter.limit(key);
      return { success: result.success, remaining: result.remaining };
    } catch {}
  }

  return memRateLimit(key, config.limit, config.windowMs);
}

export function rateLimitResponse() {
  return new Response(
    JSON.stringify({ ok: false, error: 'Too many requests. Please slow down.', code: 'RATE_LIMITED' }),
    { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': '60' } }
  );
}
