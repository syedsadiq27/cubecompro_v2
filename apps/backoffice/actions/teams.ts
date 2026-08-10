'use server';

import { revalidatePath } from 'next/cache';
import {
  AddUserGroupDocument,
  InviteUserDocument,
  UpdateUserProfileDocument,
} from '@repo/graphql/generated';
import { createGlobalClient } from '../lib/graphql';
import { getSessionUser } from '../lib/session-server';

type Result = { ok: boolean; error?: string };

export async function updateProfileAction(
  formData: FormData
): Promise<Result> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Not authenticated.' };

  try {
    const client = createGlobalClient(user.token);
    await client.global(UpdateUserProfileDocument, {
      id: user.userId,
      firstname: String(formData.get('firstname') ?? ''),
      lastname: String(formData.get('lastname') ?? ''),
      role: String(formData.get('role') ?? user.role),
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

export async function addUserGroupAction(formData: FormData): Promise<Result> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Not authenticated.' };

  try {
    const client = createGlobalClient(user.token);
    await client.global(AddUserGroupDocument, {
      organizationId: String(formData.get('organizationId') ?? ''),
      name: String(formData.get('name') ?? ''),
      userId: user.userId,
    });
    revalidatePath('/accounts/usergroups');
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Could not create team.',
    };
  }
}

export async function inviteUserAction(formData: FormData): Promise<Result> {
  const user = await getSessionUser();
  if (!user) return { ok: false, error: 'Not authenticated.' };

  try {
    const client = createGlobalClient(user.token);
    await client.global(InviteUserDocument, {
      id: user.userId,
      email: String(formData.get('email') ?? ''),
      organizationId: String(formData.get('organizationId') ?? ''),
      userGroupId: String(formData.get('userGroupId') ?? ''),
    });
    revalidatePath('/accounts/members');
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Invite failed.',
    };
  }
}
