import { db, AdminUsers, AdminSessions, eq, lt } from 'astro:db';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';
import { authLogger } from './logger';

export interface AuthUser {
  id: number;
  username: string;
  email: string | null;
}

export async function verifyPassword(username: string, password: string): Promise<AuthUser | null> {
  try {
    const user = await db
      .select()
      .from(AdminUsers)
      .where(eq(AdminUsers.username, username))
      .then(rows => rows[0]);

    if (!user || !user.isActive) {
      return null;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return null;
    }

    // Update last login
    await db
      .update(AdminUsers)
      .set({ lastLogin: new Date() })
      .where(eq(AdminUsers.id, user.id));

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  } catch (error) {
    authLogger.error('Error verifying password', { error: String(error), username });
    return null;
  }
}

export async function createSession(userId: number): Promise<string> {
  // Generate a secure session token
  const sessionToken = randomBytes(32).toString('hex');

  // Session expires in 24 hours
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db.insert(AdminSessions).values({
    id: sessionToken,
    userId: userId,
    expiresAt: expiresAt,
    createdAt: new Date(),
  });

  return sessionToken;
}

export async function getSessionUser(sessionToken: string): Promise<AuthUser | null> {
  try {
    if (!sessionToken) {
      return null;
    }

    const session = await db
      .select({
        session: AdminSessions,
        user: AdminUsers,
      })
      .from(AdminSessions)
      .leftJoin(AdminUsers, eq(AdminSessions.userId, AdminUsers.id))
      .where(eq(AdminSessions.id, sessionToken))
      .then(rows => rows[0]);

    if (!session || !session.user || !session.user.isActive) {
      return null;
    }

    // Check if session is expired
    if (new Date() > session.session.expiresAt) {
      // Clean up expired session
      await db.delete(AdminSessions).where(eq(AdminSessions.id, sessionToken));
      return null;
    }

    return {
      id: session.user.id,
      username: session.user.username,
      email: session.user.email,
    };
  } catch (error) {
    authLogger.error('Error getting session user', { error: String(error) });
    return null;
  }
}

export async function deleteSession(sessionToken: string): Promise<void> {
  try {
    await db.delete(AdminSessions).where(eq(AdminSessions.id, sessionToken));
  } catch (error) {
    authLogger.error('Error deleting session', { error: String(error) });
  }
}

export async function cleanExpiredSessions(): Promise<void> {
  try {
    const now = new Date();
    await db.delete(AdminSessions).where(lt(AdminSessions.expiresAt, now));
    authLogger.debug('Cleaned expired sessions');
  } catch (error) {
    authLogger.error('Error cleaning expired sessions', { error: String(error) });
  }
}

export function getSessionFromRequest(request: Request): string | null {
  const cookies = request.headers.get('cookie');
  if (!cookies) {
    return null;
  }

  const sessionMatch = cookies.match(/admin_session=([^;]+)/);
  return sessionMatch ? sessionMatch[1] : null;
}

export function createSessionCookie(sessionToken: string): string {
  // Create secure cookie that expires in 24 hours
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  return `admin_session=${sessionToken}; Path=/; HttpOnly; SameSite=Strict; Secure; Expires=${expires.toUTCString()}`;
}

export function createLogoutCookie(): string {
  return 'admin_session=; Path=/; HttpOnly; SameSite=Strict; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT';
}

/**
 * Update a user's password
 */
export async function updatePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get user
    const user = await db
      .select()
      .from(AdminUsers)
      .where(eq(AdminUsers.id, userId))
      .then(rows => rows[0]);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      authLogger.warn('Invalid current password during password change', { userId });
      return { success: false, error: 'Current password is incorrect' };
    }

    // Hash new password
    const newHash = await bcrypt.hash(newPassword, 10);

    // Update password
    await db
      .update(AdminUsers)
      .set({ passwordHash: newHash })
      .where(eq(AdminUsers.id, userId));

    authLogger.info('Password updated successfully', { userId });
    return { success: true };
  } catch (error) {
    authLogger.error('Error updating password', { error: String(error), userId });
    return { success: false, error: 'An error occurred while updating password' };
  }
}

/**
 * Update a user's email
 */
export async function updateEmail(
  userId: number,
  newEmail: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await db
      .update(AdminUsers)
      .set({ email: newEmail })
      .where(eq(AdminUsers.id, userId));

    authLogger.info('Email updated successfully', { userId });
    return { success: true };
  } catch (error) {
    authLogger.error('Error updating email', { error: String(error), userId });
    return { success: false, error: 'An error occurred while updating email' };
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: number): Promise<AuthUser | null> {
  try {
    const user = await db
      .select()
      .from(AdminUsers)
      .where(eq(AdminUsers.id, userId))
      .then(rows => rows[0]);

    if (!user) return null;

    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  } catch (error) {
    authLogger.error('Error getting user by ID', { error: String(error), userId });
    return null;
  }
}