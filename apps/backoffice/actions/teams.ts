'use server';

import { revalidatePath } from 'next/cache';
import { graphRequest } from '@repo/product-graph';
import { UPDATE_PROFILE_MUTATION } from '@repo/product-graph';
import {
  getSessionUser,
  setSessionUser,
} from '@/lib/session-server';

type Result = { ok: boolean; error?: string };

export async function updateProfileAction(
  formData: FormData
): Promise<Result> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Not authenticated.' };

  const firstname = String(formData.get('firstname') ?? '').trim();
  const lastname = String(formData.get('lastname') ?? '').trim();
  const name = [firstname, lastname].filter(Boolean).join(' ');

  try {
    const data = await graphRequest<{
      updateProfile: {
        id: string;
        email: string;
        name?: string | null;
        role?: string | null;
      };
    }>(UPDATE_PROFILE_MUTATION, { input: { name } }, user.token);

    const updatedName = data.updateProfile.name?.trim() ?? name;
    const [first = '', ...rest] = updatedName.split(/\s+/);
    await setSessionUser({
      ...user,
      firstName: first,
      lastName: rest.join(' '),
      email: data.updateProfile.email,
      role: data.updateProfile.role ?? user.role,
    });

    revalidatePath('/accounts/profile');
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Update failed.',
    };
  }
}

export async function addUserGroupAction(_formData: FormData): Promise<Result> {
  return {
    ok: false,
    error: 'Creating roles/teams is not enabled on CubeCom API yet.',
  };
}

export async function inviteUserAction(_formData: FormData): Promise<Result> {
  return {
    ok: false,
    error: 'Inviting members is not enabled on CubeCom API yet.',
  };
}
