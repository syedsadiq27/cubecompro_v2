'use server';

import { redirect } from 'next/navigation';
import {
  ForgotPasswordDocument,
  LoginMutationDocument,
  RegisterProjectDocument,
  RegisterUserDocument,
} from '@repo/graphql/generated';
import { createAuthClient, createGlobalClient } from '../lib/graphql';
import {
  clearSession,
  setProjectSession,
  setSessionUser,
} from '../lib/session-server';

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
    const client = createAuthClient();
    const data = await client.auth(LoginMutationDocument, { email, password });
    const payload = data.login;
    if (!payload?.token || !payload.user) {
      return { ok: false, error: 'Invalid login response.' };
    }

    await setSessionUser({
      token: payload.token,
      userId: String(payload.user.id),
      email: payload.user.email ?? email,
      firstName: payload.user.firstname ?? '',
      lastName: payload.user.lastname ?? '',
      role: payload.user.role ?? '',
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
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const firstname = String(formData.get('firstname') ?? '').trim();
  const lastname = String(formData.get('lastname') ?? '').trim();

  if (!email || !password || !firstname || !lastname) {
    return { ok: false, error: 'All fields are required.' };
  }

  try {
    const client = createAuthClient();
    const data = await client.auth(RegisterUserDocument, {
      email,
      password,
      firstname,
      lastname,
      role: 'user',
      active: true,
    });
    const payload = data.registerUser;
    if (!payload?.token || !payload.user) {
      return { ok: false, error: 'Invalid registration response.' };
    }

    await setSessionUser({
      token: payload.token,
      userId: String(payload.user.id),
      email: payload.user.email ?? email,
      firstName: payload.user.firstname ?? firstname,
      lastName: payload.user.lastname ?? lastname,
      role: payload.user.role ?? 'user',
    });
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Registration failed.',
    };
  }

  redirect('/projects');
}

export async function forgotPasswordAction(
  _prev: ActionResult,
  formData: FormData
): Promise<ActionResult> {
  const email = String(formData.get('email') ?? '').trim();
  if (!email) {
    return { ok: false, error: 'Email is required.' };
  }

  try {
    const client = createAuthClient();
    await client.auth(ForgotPasswordDocument, { email });
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : 'Could not send reset email.',
    };
  }
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
    const client = createGlobalClient(user.token);
    const data = await client.global(RegisterProjectDocument, {
      ProductId: projectId,
    });
    const token = data.registerProject?.token;
    if (!token) {
      return { ok: false, error: 'Project registration failed.' };
    }

    await setProjectSession({
      projectId,
      projectName,
      projectToken: token,
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
