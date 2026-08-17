type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export function checkRateLimit(key: string, max = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const current = buckets.get(key);
  if (!current || current.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  return {
    allowed: current.count <= max,
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000)),
  };
}
