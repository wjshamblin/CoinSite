import { db, AdminUsers, AdminSessions, eq, lt } from 'astro:db';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

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
    console.error('Error verifying password:', error);
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
    console.error('Error getting session user:', error);
    return null;
  }
}

export async function deleteSession(sessionToken: string): Promise<void> {
  try {
    await db.delete(AdminSessions).where(eq(AdminSessions.id, sessionToken));
  } catch (error) {
    console.error('Error deleting session:', error);
  }
}

export async function cleanExpiredSessions(): Promise<void> {
  try {
    const now = new Date();
    await db.delete(AdminSessions).where(lt(AdminSessions.expiresAt, now));
  } catch (error) {
    console.error('Error cleaning expired sessions:', error);
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