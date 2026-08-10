'use server';

import { revalidatePath } from 'next/cache';
import {
  AddCategoryDocument,
  DeleteCategoryDocument,
  UpdateCategoryDocument,
} from '@repo/graphql/generated';
import { createProjectClient } from '../lib/graphql';
import {
  getProjectSession,
  getSessionUser,
} from '../lib/session-server';

export type CategoryResult = { ok: boolean; error?: string };

export async function addCategoryAction(
  projectId: string,
  formData: FormData
): Promise<CategoryResult> {
  const [user, project] = await Promise.all([
    getSessionUser(),
    getProjectSession(),
  ]);
  if (!user || !project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  const name = String(formData.get('name') ?? '').trim();
  if (!name) return { ok: false, error: 'Name is required.' };

  try {
    const client = createProjectClient(projectId, project.projectToken);
    await client.project(AddCategoryDocument, {
      name,
      projectId,
      description: String(formData.get('description') ?? ''),
      createdBy: user.userId,
    });
    revalidatePath(`/${projectId}/categories`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Could not add category.',
    };
  }
}

export async function updateCategoryAction(
  projectId: string,
  categoryId: string,
  formData: FormData
): Promise<CategoryResult> {
  const [user, project] = await Promise.all([
    getSessionUser(),
    getProjectSession(),
  ]);
  if (!user || !project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  try {
    const client = createProjectClient(projectId, project.projectToken);
    await client.project(UpdateCategoryDocument, {
      id: categoryId,
      name: String(formData.get('name') ?? ''),
      description: String(formData.get('description') ?? ''),
      createdBy: user.userId,
    });
    revalidatePath(`/${projectId}/categories`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : 'Could not update category.',
    };
  }
}

export async function deleteCategoryAction(
  projectId: string,
  categoryId: string
): Promise<CategoryResult> {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  try {
    const client = createProjectClient(projectId, project.projectToken);
    await client.project(DeleteCategoryDocument, { id: categoryId });
    revalidatePath(`/${projectId}/categories`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error ? error.message : 'Could not delete category.',
    };
  }
}
