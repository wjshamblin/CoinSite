import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { checkRateLimit, getRateLimitHeaders, LOGIN_RATE_LIMIT } from '../src/lib/rateLimit';

describe('Rate Limiting', () => {
  beforeEach(() => {
    // Reset the rate limit store between tests by using unique identifiers
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('checkRateLimit', () => {
    it('should allow first request', () => {
      const result = checkRateLimit('test-ip-1', { windowMs: 60000, maxAttempts: 5 });

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(4);
    });

    it('should decrement remaining attempts', () => {
      const config = { windowMs: 60000, maxAttempts: 5 };
      const id = 'test-ip-2';

      checkRateLimit(id, config);
      const result = checkRateLimit(id, config);

      expect(result.allowed).toBe(true);
      expect(result.remaining).toBe(3);
    });

    it('should block after max attempts exceeded', () => {
      const config = { windowMs: 60000, maxAttempts: 3 };
      const id = 'test-ip-3';

      checkRateLimit(id, config); // 1
      checkRateLimit(id, config); // 2
      checkRateLimit(id, config); // 3
      const result = checkRateLimit(id, config); // 4 - should be blocked

      expect(result.allowed).toBe(false);
      expect(result.remaining).toBe(0);
    });

    it('should reset after window expires', () => {
      const config = { windowMs: 1000, maxAttempts: 2 };
      const id = 'test-ip-4';

      checkRateLimit(id, config);
      checkRateLimit(id, config);
      const blockedResult = checkRateLimit(id, config);
      expect(blockedResult.allowed).toBe(false);

      // Advance time past the window
      vi.advanceTimersByTime(1500);

      const newResult = checkRateLimit(id, config);
      expect(newResult.allowed).toBe(true);
      expect(newResult.remaining).toBe(1);
    });

    it('should use default config when not specified', () => {
      const result = checkRateLimit('test-ip-5');

      expect(result.allowed).toBe(true);
      // Default is 5 attempts per 15 minutes
      expect(result.remaining).toBe(4);
    });
  });

  describe('getRateLimitHeaders', () => {
    it('should return correct headers', () => {
      const result = {
        allowed: true,
        remaining: 3,
        resetTime: 1700000000000,
      };

      const headers = getRateLimitHeaders(result);

      expect(headers['X-RateLimit-Remaining']).toBe('3');
      expect(headers['X-RateLimit-Reset']).toBe('1700000000');
    });
  });

  describe('LOGIN_RATE_LIMIT', () => {
    it('should have correct default values', () => {
      expect(LOGIN_RATE_LIMIT.maxAttempts).toBe(5);
      expect(LOGIN_RATE_LIMIT.windowMs).toBe(15 * 60 * 1000);
    });
  });
});
