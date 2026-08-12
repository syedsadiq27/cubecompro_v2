'use server';

import { redirect } from 'next/navigation';
import { graphRequest } from '@repo/product-graph';
import { LOGIN_MUTATION } from '@repo/product-graph';
import {
  clearSession,
  setProjectSession,
  setSessionUser,
} from '@/lib/session-server';

export type ActionResult = {
  ok: boolean;
  error?: string;
};

export async function loginAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { ok: false, error: 'Email and password are required.' };
  }

  try {
    const data = await graphRequest<{
      login: {
        token: string;
        user: {
          id: string;
          email: string;
          name?: string | null;
          role?: string | null;
        };
      };
    }>(LOGIN_MUTATION, { input: { email, password } });

    const name = data.login.user.name?.trim() ?? '';
    const [firstName = '', ...rest] = name.split(/\s+/);
    await setSessionUser({
      token: data.login.token,
      userId: data.login.user.id,
      email: data.login.user.email ?? email,
      firstName,
      lastName: rest.join(' '),
      role: data.login.user.role ?? 'owner',
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Login failed.',
    };
  }

  redirect('/projects');
}

export async function registerAction(
  _prev: ActionResult,
  _formData: FormData
): Promise<ActionResult> {
  return {
    ok: false,
    error:
      'Registration is not enabled on the CubeCom API yet. Use the seeded demo user.',
  };
}

export async function forgotPasswordAction(
  _prev: ActionResult,
  _formData: FormData
): Promise<ActionResult> {
  return {
    ok: false,
    error: 'Password reset is not enabled on the CubeCom API yet.',
  };
}

export async function selectProjectAction(
  projectId: string,
  projectName: string
): Promise<ActionResult> {
  const { getSessionUser } = await import('../lib/session-server');
  const user = await getSessionUser();
  if (!user) {
    return { ok: false, error: 'Not authenticated.' };
  }

  try {
    await setProjectSession({
      projectId,
      projectName,
      projectToken: user.token,
    });
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : 'Could not open project.',
    };
  }

  redirect(`/${projectId}/dashboard`);
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect('/login');
}
