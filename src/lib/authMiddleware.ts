import type { AstroGlobal } from 'astro';
import { getSessionFromRequest, getSessionUser, type AuthUser } from './auth';

export async function requireAuth(Astro: AstroGlobal): Promise<AuthUser> {
  const sessionToken = getSessionFromRequest(Astro.request);
  const user = sessionToken ? await getSessionUser(sessionToken) : null;

  if (!user) {
    return Astro.redirect('/admin/login');
  }

  return user;
}

export async function checkAuth(Astro: AstroGlobal): Promise<AuthUser | null> {
  const sessionToken = getSessionFromRequest(Astro.request);
  const user = sessionToken ? await getSessionUser(sessionToken) : null;
  return user;
}