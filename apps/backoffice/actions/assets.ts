'use server';

import { revalidatePath } from 'next/cache';
import {
  DeleteObjectDocument,
  DeleteTextureDocument,
} from '@repo/graphql/generated';
import { createProjectClient } from '../lib/graphql';
import { getProjectSession } from '../lib/session-server';

export async function deleteTextureAction(
  projectId: string,
  textureId: string
) {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  try {
    const client = createProjectClient(projectId, project.projectToken);
    await client.project(DeleteTextureDocument, { id: textureId });
    revalidatePath(`/${projectId}/library/textures`);
    revalidatePath(`/${projectId}/library`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Delete failed.',
    };
  }
}

export async function deleteObjectAction(projectId: string, objectId: string) {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  try {
    const client = createProjectClient(projectId, project.projectToken);
    await client.project(DeleteObjectDocument, { id: objectId });
    revalidatePath(`/${projectId}/library/objects`);
    revalidatePath(`/${projectId}/library`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Delete failed.',
    };
  }
}
