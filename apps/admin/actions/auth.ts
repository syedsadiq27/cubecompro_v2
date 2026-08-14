'use server';

import { redirect } from 'next/navigation';
import { graphRequest, LOGIN_MUTATION } from '@repo/product-graph';
import { clearSession, setSessionUser } from '@/lib/session-server';

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
          organizationId?: string | null;
        };
      };
    }>(LOGIN_MUTATION, { input: { email, password } });

    const role = data.login.user.role ?? '';
    if (role !== 'owner') {
      return {
        ok: false,
        error: 'This console is limited to the owner role.',
      };
    }

    await setSessionUser({
      token: data.login.token,
      userId: data.login.user.id,
      email: data.login.user.email ?? email,
      name: data.login.user.name?.trim() ?? '',
      role,
      organizationId: data.login.user.organizationId ?? '',
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Login failed.',
    };
  }

  redirect('/organizations');
}

export async function logoutAction(): Promise<void> {
  await clearSession();
  redirect('/login');
}
