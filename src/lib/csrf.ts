/**
 * CSRF (Cross-Site Request Forgery) protection utilities.
 *
 * Generates and validates CSRF tokens to prevent malicious sites
 * from submitting forms on behalf of authenticated users.
 */

import { randomBytes, createHmac } from 'crypto';

// Secret key for HMAC - in production, this should be an environment variable
const CSRF_SECRET = process.env.CSRF_SECRET || 'csrf-secret-key-change-in-production';

// Token expiry time (1 hour)
const TOKEN_EXPIRY_MS = 60 * 60 * 1000;

/**
 * Generate a CSRF token that includes a timestamp for expiry validation.
 * Token format: timestamp.randomBytes.hmacSignature
 */
export function generateCsrfToken(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = randomBytes(16).toString('hex');
  const data = `${timestamp}.${randomPart}`;
  const signature = createHmac('sha256', CSRF_SECRET)
    .update(data)
    .digest('hex')
    .substring(0, 16);

  return `${data}.${signature}`;
}

/**
 * Validate a CSRF token.
 * Checks both the signature and expiry time.
 */
export function validateCsrfToken(token: string | null): boolean {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 3) return false;

  const [timestamp, randomPart, signature] = parts;

  // Verify signature
  const data = `${timestamp}.${randomPart}`;
  const expectedSignature = createHmac('sha256', CSRF_SECRET)
    .update(data)
    .digest('hex')
    .substring(0, 16);

  if (signature !== expectedSignature) return false;

  // Check expiry
  const tokenTime = parseInt(timestamp, 36);
  if (isNaN(tokenTime)) return false;

  const now = Date.now();
  if (now - tokenTime > TOKEN_EXPIRY_MS) return false;

  return true;
}

/**
 * Get CSRF token from request (checks both form data and headers).
 */
export function getCsrfTokenFromRequest(formData: FormData): string | null {
  // Check form field first
  const formToken = formData.get('_csrf') as string | null;
  if (formToken) return formToken;

  return null;
}

/**
 * Create a hidden input field HTML for including in forms.
 */
export function csrfHiddenInput(token: string): string {
  return `<input type="hidden" name="_csrf" value="${token}" />`;
}
