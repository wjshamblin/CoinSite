import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateCsrfToken, validateCsrfToken, getCsrfTokenFromRequest } from '../src/lib/csrf';

describe('CSRF Token Utilities', () => {
  describe('generateCsrfToken', () => {
    it('should generate a token with three parts separated by dots', () => {
      const token = generateCsrfToken();
      const parts = token.split('.');
      expect(parts).toHaveLength(3);
    });

    it('should generate unique tokens on each call', () => {
      const token1 = generateCsrfToken();
      const token2 = generateCsrfToken();
      expect(token1).not.toBe(token2);
    });

    it('should generate tokens with valid timestamp prefix', () => {
      const token = generateCsrfToken();
      const [timestamp] = token.split('.');
      const parsedTime = parseInt(timestamp, 36);
      const now = Date.now();

      // Token timestamp should be within last second
      expect(parsedTime).toBeLessThanOrEqual(now);
      expect(parsedTime).toBeGreaterThan(now - 1000);
    });
  });

  describe('validateCsrfToken', () => {
    it('should validate a freshly generated token', () => {
      const token = generateCsrfToken();
      expect(validateCsrfToken(token)).toBe(true);
    });

    it('should reject null token', () => {
      expect(validateCsrfToken(null)).toBe(false);
    });

    it('should reject empty string', () => {
      expect(validateCsrfToken('')).toBe(false);
    });

    it('should reject malformed tokens', () => {
      expect(validateCsrfToken('invalid')).toBe(false);
      expect(validateCsrfToken('one.two')).toBe(false);
      expect(validateCsrfToken('one.two.three.four')).toBe(false);
    });

    it('should reject tokens with invalid signature', () => {
      const token = generateCsrfToken();
      const parts = token.split('.');
      parts[2] = 'invalidsignature';
      const tamperedToken = parts.join('.');
      expect(validateCsrfToken(tamperedToken)).toBe(false);
    });

    it('should reject expired tokens', () => {
      // Mock Date.now to create an old token
      const originalNow = Date.now;
      const oldTime = Date.now() - 2 * 60 * 60 * 1000; // 2 hours ago

      vi.spyOn(Date, 'now').mockImplementation(() => oldTime);
      const token = generateCsrfToken();
      vi.spyOn(Date, 'now').mockImplementation(originalNow);

      expect(validateCsrfToken(token)).toBe(false);
    });
  });

  describe('getCsrfTokenFromRequest', () => {
    it('should extract token from form data', () => {
      const formData = new FormData();
      formData.append('_csrf', 'test-token-value');

      const result = getCsrfTokenFromRequest(formData);
      expect(result).toBe('test-token-value');
    });

    it('should return null if no csrf field present', () => {
      const formData = new FormData();
      formData.append('other', 'value');

      const result = getCsrfTokenFromRequest(formData);
      expect(result).toBeNull();
    });
  });
});
