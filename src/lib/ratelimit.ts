// Rate limiter - pure in-memory, no external dependencies
const store = new Map();

function limitFn(key, limit, windowMs) {
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

export const ratelimit = limitFn;
export const rateLimit = limitFn;
export const authLimiter = (ip) => limitFn(ip + ':auth', 5, 60000);
export const apiLimiter = (ip) => limitFn(ip + ':api', 60, 60000);
export const paymentLimiter = (ip) => limitFn(ip + ':payment', 3, 600000);
export const webhookLimiter = (ip) => limitFn(ip + ':webhook', 100, 60000);
export default limitFn;
