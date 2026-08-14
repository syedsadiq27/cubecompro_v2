import { cookies } from 'next/headers';
import {
  COOKIE_MAX_AGE,
  SESSION_COOKIES,
  type SessionUser,
} from './session';

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: COOKIE_MAX_AGE,
  };
}

export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIES.token)?.value;
  const userId = jar.get(SESSION_COOKIES.userId)?.value;
  if (!token || !userId) return null;

  return {
    token,
    userId,
    email: jar.get(SESSION_COOKIES.email)?.value ?? '',
    name: jar.get(SESSION_COOKIES.name)?.value ?? '',
    role: jar.get(SESSION_COOKIES.role)?.value ?? '',
    organizationId: jar.get(SESSION_COOKIES.organizationId)?.value ?? '',
  };
}

export async function setSessionUser(user: SessionUser): Promise<void> {
  const jar = await cookies();
  const options = cookieOptions();
  jar.set(SESSION_COOKIES.token, user.token, options);
  jar.set(SESSION_COOKIES.userId, user.userId, options);
  jar.set(SESSION_COOKIES.email, user.email, options);
  jar.set(SESSION_COOKIES.name, user.name, options);
  jar.set(SESSION_COOKIES.role, user.role, options);
  jar.set(SESSION_COOKIES.organizationId, user.organizationId, options);
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  for (const key of Object.values(SESSION_COOKIES)) {
    jar.delete(key);
  }
}
