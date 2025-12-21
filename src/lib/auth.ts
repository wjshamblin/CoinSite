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

// Extended user info for admin management
export interface AdminUserDetails {
  id: number;
  username: string;
  email: string | null;
  isActive: boolean;
  lastLogin: Date | null;
  createdAt: Date;
}

/**
 * Get all admin users
 */
export async function getAllUsers(): Promise<AdminUserDetails[]> {
  try {
    const users = await db
      .select()
      .from(AdminUsers)
      .orderBy(AdminUsers.createdAt);

    return users.map(u => ({
      id: u.id,
      username: u.username,
      email: u.email,
      isActive: u.isActive,
      lastLogin: u.lastLogin,
      createdAt: u.createdAt,
    }));
  } catch (error) {
    authLogger.error('Error getting all users', { error: String(error) });
    return [];
  }
}

/**
 * Create a new admin user
 */
export async function createUser(
  username: string,
  password: string,
  email?: string
): Promise<{ success: boolean; error?: string; userId?: number }> {
  try {
    // Check if username already exists
    const existing = await db
      .select()
      .from(AdminUsers)
      .where(eq(AdminUsers.username, username))
      .then(rows => rows[0]);

    if (existing) {
      return { success: false, error: 'Username already exists' };
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Get the next ID
    const maxIdResult = await db
      .select({ maxId: AdminUsers.id })
      .from(AdminUsers)
      .orderBy(AdminUsers.id)
      .then(rows => rows[rows.length - 1]);
    const nextId = (maxIdResult?.maxId || 0) + 1;

    // Insert new user
    await db.insert(AdminUsers).values({
      id: nextId,
      username,
      passwordHash,
      email: email || null,
      isActive: true,
      createdAt: new Date(),
    });

    authLogger.info('New admin user created', { username });
    return { success: true, userId: nextId };
  } catch (error) {
    authLogger.error('Error creating user', { error: String(error), username });
    return { success: false, error: 'An error occurred while creating user' };
  }
}

/**
 * Delete an admin user (cannot delete the last active user)
 */
export async function deleteUser(
  userId: number,
  currentUserId: number
): Promise<{ success: boolean; error?: string }> {
  try {
    // Cannot delete yourself
    if (userId === currentUserId) {
      return { success: false, error: 'Cannot delete your own account' };
    }

    // Check if this is the last active user
    const activeUsers = await db
      .select()
      .from(AdminUsers)
      .where(eq(AdminUsers.isActive, true));

    const userToDelete = await db
      .select()
      .from(AdminUsers)
      .where(eq(AdminUsers.id, userId))
      .then(rows => rows[0]);

    if (!userToDelete) {
      return { success: false, error: 'User not found' };
    }

    // If deleting an active user and it's the last one, prevent deletion
    if (userToDelete.isActive && activeUsers.length <= 1) {
      return { success: false, error: 'Cannot delete the last active administrator' };
    }

    // Delete all sessions for this user first
    await db.delete(AdminSessions).where(eq(AdminSessions.userId, userId));

    // Delete the user
    await db.delete(AdminUsers).where(eq(AdminUsers.id, userId));

    authLogger.info('Admin user deleted', { deletedUserId: userId, byUserId: currentUserId });
    return { success: true };
  } catch (error) {
    authLogger.error('Error deleting user', { error: String(error), userId });
    return { success: false, error: 'An error occurred while deleting user' };
  }
}

/**
 * Toggle user active status
 */
export async function toggleUserActive(
  userId: number,
  currentUserId: number
): Promise<{ success: boolean; error?: string; isActive?: boolean }> {
  try {
    const user = await db
      .select()
      .from(AdminUsers)
      .where(eq(AdminUsers.id, userId))
      .then(rows => rows[0]);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // If deactivating
    if (user.isActive) {
      // Cannot deactivate yourself
      if (userId === currentUserId) {
        return { success: false, error: 'Cannot deactivate your own account' };
      }

      // Check if this is the last active user
      const activeUsers = await db
        .select()
        .from(AdminUsers)
        .where(eq(AdminUsers.isActive, true));

      if (activeUsers.length <= 1) {
        return { success: false, error: 'Cannot deactivate the last active administrator' };
      }

      // Delete sessions when deactivating
      await db.delete(AdminSessions).where(eq(AdminSessions.userId, userId));
    }

    const newStatus = !user.isActive;
    await db
      .update(AdminUsers)
      .set({ isActive: newStatus })
      .where(eq(AdminUsers.id, userId));

    authLogger.info('Admin user status toggled', { userId, isActive: newStatus });
    return { success: true, isActive: newStatus };
  } catch (error) {
    authLogger.error('Error toggling user status', { error: String(error), userId });
    return { success: false, error: 'An error occurred while updating user status' };
  }
}

/**
 * Admin reset password (sets a new password without requiring current password)
 */
export async function adminResetPassword(
  userId: number,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const user = await db
      .select()
      .from(AdminUsers)
      .where(eq(AdminUsers.id, userId))
      .then(rows => rows[0]);

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await db
      .update(AdminUsers)
      .set({ passwordHash })
      .where(eq(AdminUsers.id, userId));

    // Invalidate all sessions for this user
    await db.delete(AdminSessions).where(eq(AdminSessions.userId, userId));

    authLogger.info('Password reset by admin', { userId });
    return { success: true };
  } catch (error) {
    authLogger.error('Error resetting password', { error: String(error), userId });
    return { success: false, error: 'An error occurred while resetting password' };
  }
}