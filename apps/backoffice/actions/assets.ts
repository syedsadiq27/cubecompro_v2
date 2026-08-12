'use server';

import { revalidatePath } from 'next/cache';
import { graphRequest } from '@repo/product-graph';
import {
  DELETE_OBJECT_ASSET_MUTATION,
  DELETE_TEXTURE_ASSET_MUTATION,
} from '@repo/product-graph';
import { getProjectSession } from '@/lib/session-server';

export async function deleteTextureAction(
  projectId: string,
  textureId: string
) {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  try {
    await graphRequest(
      DELETE_TEXTURE_ASSET_MUTATION,
      { id: textureId },
      project.projectToken
    );
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
    await graphRequest(
      DELETE_OBJECT_ASSET_MUTATION,
      { id: objectId },
      project.projectToken
    );
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
