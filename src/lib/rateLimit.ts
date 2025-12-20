/**
 * Simple in-memory rate limiter for authentication endpoints.
 * Note: In serverless environments, this provides basic protection but
 * won't persist across cold starts. For stronger protection, consider
 * using a distributed store like Redis/Upstash.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically
const CLEANUP_INTERVAL = 60 * 1000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;

  lastCleanup = now;
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

export interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxAttempts: number;  // Max attempts per window
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetTime: number;
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { windowMs: 15 * 60 * 1000, maxAttempts: 5 }
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const key = `ratelimit:${identifier}`;
  const entry = rateLimitStore.get(key);

  // If no entry or window expired, start fresh
  if (!entry || now > entry.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      allowed: true,
      remaining: config.maxAttempts - 1,
      resetTime: now + config.windowMs,
    };
  }

  // Increment count
  entry.count++;

  const allowed = entry.count <= config.maxAttempts;
  return {
    allowed,
    remaining: Math.max(0, config.maxAttempts - entry.count),
    resetTime: entry.resetTime,
  };
}

export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetTime / 1000).toString(),
  };
}

// Default config for login attempts: 5 attempts per 15 minutes
export const LOGIN_RATE_LIMIT: RateLimitConfig = {
  windowMs: 15 * 60 * 1000,
  maxAttempts: 5,
};
