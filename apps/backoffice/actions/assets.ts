'use server';

import { revalidatePath } from 'next/cache';
import { graphRequest } from '@repo/product-graph';
import {
  CREATE_MATERIAL_ASSET_MUTATION,
  CREATE_OBJECT_ASSET_MUTATION,
  DELETE_OBJECT_ASSET_MUTATION,
  DELETE_TEXTURE_ASSET_MUTATION,
  ME_QUERY,
  UPDATE_MATERIAL_ASSET_MUTATION,
} from '@repo/product-graph';
import { getProjectSession } from '@/lib/session-server';

export async function createMaterialAction(
  projectId: string,
  formData: FormData
) {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  const name = String(formData.get('name') ?? '').trim();
  const code = String(formData.get('code') ?? '').trim() || undefined;
  const baseColor = String(formData.get('baseColor') ?? '#8A6040').trim();
  const roughness = Number(formData.get('roughness') ?? 0.55);
  const metallic = Number(formData.get('metallic') ?? 0);

  if (!name) {
    return { ok: false, error: 'Name is required.' };
  }

  try {
    const me = await graphRequest<{
      me: { organizationId?: string | null };
    }>(ME_QUERY, undefined, project.projectToken);
    const organizationId = me.me.organizationId;
    if (!organizationId) {
      return { ok: false, error: 'Organization missing.' };
    }

    const documentJson = JSON.stringify({
      shaderModel: 'PBR',
      baseColor,
      roughness: Number.isFinite(roughness) ? roughness : 0.55,
      metallic: Number.isFinite(metallic) ? metallic : 0,
    });
    await graphRequest(
      CREATE_MATERIAL_ASSET_MUTATION,
      {
        input: {
          organizationId,
          projectId,
          name,
          code,
          documentJson,
        },
      },
      project.projectToken
    );
    revalidatePath(`/${projectId}/library`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Create failed.',
    };
  }
}

export async function updateMaterialAction(
  projectId: string,
  materialId: string,
  formData: FormData
) {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  const name = String(formData.get('name') ?? '').trim();
  const code = String(formData.get('code') ?? '').trim();
  const baseColor = String(formData.get('baseColor') ?? '#8A6040').trim();
  const roughness = Number(formData.get('roughness') ?? 0.55);
  const metallic = Number(formData.get('metallic') ?? 0);

  if (!name) {
    return { ok: false, error: 'Name is required.' };
  }

  try {
    const documentJson = JSON.stringify({
      shaderModel: 'PBR',
      baseColor,
      roughness: Number.isFinite(roughness) ? roughness : 0.55,
      metallic: Number.isFinite(metallic) ? metallic : 0,
    });
    await graphRequest(
      UPDATE_MATERIAL_ASSET_MUTATION,
      {
        input: {
          id: materialId,
          name,
          code,
          documentJson,
        },
      },
      project.projectToken
    );
    revalidatePath(`/${projectId}/library`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Update failed.',
    };
  }
}

export async function createObjectAction(
  projectId: string,
  formData: FormData
) {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  const name = String(formData.get('name') ?? '').trim();
  const code = String(formData.get('code') ?? '').trim() || undefined;
  const file = formData.get('file');

  if (!name) {
    return { ok: false, error: 'Name is required.' };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'GLB/GLTF file is required.' };
  }

  try {
    const me = await graphRequest<{
      me: { organizationId?: string | null };
    }>(ME_QUERY, undefined, project.projectToken);
    const organizationId = me.me.organizationId;
    if (!organizationId) {
      return { ok: false, error: 'Organization missing.' };
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const fileBase64 = bytes.toString('base64');
    const created = await graphRequest<{
      createObjectAsset: {
        id: string;
        status: string;
        nodeCount?: number | null;
        meshCount?: number | null;
      };
    }>(
      CREATE_OBJECT_ASSET_MUTATION,
      {
        input: {
          organizationId,
          projectId,
          name,
          code,
          fileBase64,
          fileName: file.name,
        },
      },
      project.projectToken
    );
    revalidatePath(`/${projectId}/library/objects`);
    revalidatePath(`/${projectId}/library`);
    return {
      ok: true,
      status: created.createObjectAsset.status,
      id: created.createObjectAsset.id,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Upload failed.',
    };
  }
}

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
