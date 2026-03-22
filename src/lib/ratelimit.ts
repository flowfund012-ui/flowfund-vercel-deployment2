// Rate limiter - in-memory only (no Redis dependency)
const store = new Map<string, { count: number; reset: number }>();

export function ratelimit(
  key: string,
  limit: number,
  windowMs: number
): { success: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || entry.reset < now) {
    store.set(key, { count: 1, reset: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false, remaining: 0 };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}

export const authLimiter = (ip: string) => ratelimit(ip + ':auth', 5, 60_000);
export const apiLimiter = (ip: string) => ratelimit(ip + ':api', 60, 60_000);
export const paymentLimiter = (ip: string) => ratelimit(ip + ':payment', 3, 600_000);
