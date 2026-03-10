/**
 * Simple in-memory rate limiter for serverless functions.
 * Uses a sliding window approach per IP.
 */

interface RateLimitConfig {
  /** Window size in milliseconds. */
  windowMs: number;
  /** Max requests per window. */
  max: number;
}

interface Entry {
  count: number;
  resetAt: number;
}

export function rateLimit(config: RateLimitConfig) {
  const store = new Map<string, Entry>();

  // Periodically clean up expired entries to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store) {
      if (now > entry.resetAt) store.delete(key);
    }
  }, config.windowMs * 2);

  return {
    /** Returns true if the request is allowed, false if rate limited. */
    check(key: string): boolean {
      const now = Date.now();
      const entry = store.get(key);

      if (!entry || now > entry.resetAt) {
        store.set(key, { count: 1, resetAt: now + config.windowMs });
        return true;
      }

      entry.count++;
      return entry.count <= config.max;
    },
  };
}
