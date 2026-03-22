// Rate limiter - in-memory only, no external dependencies
const store = new Map<string, { count: number; reset: number }>();

function limitFn(
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
  if (entry.count >= limit) return { success: false, remaining: 0 };
  entry.count++;
  return { success: true, remaining: limit - entry.count };
}

// Named exports to match all import styles used in the codebase
export const ratelimit = limitFn;
export const rateLimit = limitFn;
export const authLimiter = (ip: string) => limitFn(ip + ':auth', 5, 60_000);
export const apiLimiter = (ip: string) => limitFn(ip + ':api', 60, 60_000);
export const paymentLimiter = (ip: string) => limitFn(ip + ':payment', 3, 600_000);
export const webhookLimiter = (ip: string) => limitFn(ip + ':webhook', 100, 60_000);

export default limitFn;
