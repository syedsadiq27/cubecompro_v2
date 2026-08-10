import { cookies } from 'next/headers';
import {
  COOKIE_MAX_AGE,
  SESSION_COOKIES,
  type ProjectSession,
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
    firstName: jar.get(SESSION_COOKIES.firstName)?.value ?? '',
    lastName: jar.get(SESSION_COOKIES.lastName)?.value ?? '',
    role: jar.get(SESSION_COOKIES.role)?.value ?? '',
  };
}

export async function getProjectSession(): Promise<ProjectSession | null> {
  const jar = await cookies();
  const projectId = jar.get(SESSION_COOKIES.projectId)?.value;
  const projectToken = jar.get(SESSION_COOKIES.projectToken)?.value;
  if (!projectId || !projectToken) return null;

  return {
    projectId,
    projectName: jar.get(SESSION_COOKIES.projectName)?.value ?? '',
    projectToken,
  };
}

export async function setSessionUser(user: SessionUser): Promise<void> {
  const jar = await cookies();
  const options = cookieOptions();
  jar.set(SESSION_COOKIES.token, user.token, options);
  jar.set(SESSION_COOKIES.userId, user.userId, options);
  jar.set(SESSION_COOKIES.email, user.email, options);
  jar.set(SESSION_COOKIES.firstName, user.firstName, options);
  jar.set(SESSION_COOKIES.lastName, user.lastName, options);
  jar.set(SESSION_COOKIES.role, user.role, options);
}

export async function setProjectSession(project: ProjectSession): Promise<void> {
  const jar = await cookies();
  const options = cookieOptions();
  jar.set(SESSION_COOKIES.projectId, project.projectId, options);
  jar.set(SESSION_COOKIES.projectName, project.projectName, options);
  jar.set(SESSION_COOKIES.projectToken, project.projectToken, options);
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  for (const key of Object.values(SESSION_COOKIES)) {
    jar.delete(key);
  }
}

export async function clearProjectSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(SESSION_COOKIES.projectId);
  jar.delete(SESSION_COOKIES.projectName);
  jar.delete(SESSION_COOKIES.projectToken);
}
