import type { AstroGlobal } from 'astro';
import { getSessionFromRequest, getSessionUser, type AuthUser } from './auth';

export async function requireAuth(Astro: AstroGlobal): Promise<AuthUser | Response> {
  const sessionToken = getSessionFromRequest(Astro.request);
  const user = sessionToken ? await getSessionUser(sessionToken) : null;

  if (!user) {
    return Astro.redirect('/admin/login');
  }

  return user;
}

export function isRedirect(result: AuthUser | Response): result is Response {
  return result instanceof Response;
}

export async function checkAuth(Astro: AstroGlobal): Promise<AuthUser | null> {
  const sessionToken = getSessionFromRequest(Astro.request);
  const user = sessionToken ? await getSessionUser(sessionToken) : null;
  return user;
}