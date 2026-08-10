'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import {
  SoftDeleteProductDocument,
  UpdateProductMetadataDocument,
} from '@repo/graphql/generated';
import { createProjectClient } from '../lib/graphql';
import {
  getProjectSession,
  getSessionUser,
} from '../lib/session-server';

export type MutationResult = {
  ok: boolean;
  error?: string;
};

export async function softDeleteProductAction(
  projectId: string,
  productId: string
): Promise<MutationResult> {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Project session missing.' };
  }

  try {
    const client = createProjectClient(projectId, project.projectToken);
    await client.project(SoftDeleteProductDocument, { id: productId });
    revalidatePath(`/${projectId}/products`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Delete failed.',
    };
  }
}

export async function updateProductMetadataAction(
  projectId: string,
  productId: string,
  formData: FormData
): Promise<MutationResult> {
  const [user, project] = await Promise.all([
    getSessionUser(),
    getProjectSession(),
  ]);
  if (!user || !project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  try {
    const client = createProjectClient(projectId, project.projectToken);
    await client.project(UpdateProductMetadataDocument, {
      id: productId,
      Name: String(formData.get('Name') ?? ''),
      Description: String(formData.get('Description') ?? ''),
      code: String(formData.get('code') ?? ''),
      Department: String(formData.get('Department') ?? ''),
      Manufacture: String(formData.get('Manufacture') ?? ''),
      active: formData.get('active') === 'on',
      projectId: Number(projectId),
      userId: Number(user.userId),
    });
    revalidatePath(`/${projectId}/products/${productId}`);
    revalidatePath(`/${projectId}/products`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Update failed.',
    };
  }
}

export async function goToNewProduct(projectId: string): Promise<void> {
  redirect(`/${projectId}/products/new`);
}
