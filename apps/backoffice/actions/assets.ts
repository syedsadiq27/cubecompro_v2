'use server';

import { revalidatePath } from 'next/cache';
import {
  CREATE_MATERIAL_ASSET_MUTATION,
  CREATE_OBJECT_ASSET_MUTATION,
  CREATE_OBJECT_ASSET_REVISION_MUTATION,
  CREATE_TEXTURE_ASSET_MUTATION,
  DELETE_OBJECT_ASSET_MUTATION,
  DELETE_TEXTURE_ASSET_MUTATION,
  MATERIAL_ASSET_REVISIONS_QUERY,
  MATERIAL_FACTORS,
  ME_QUERY,
  OBJECT_ASSET_REVISIONS_QUERY,
  PUBLISH_MATERIAL_ASSET_MUTATION,
  PUBLISH_OBJECT_ASSET_MUTATION,
  TEXTURE_ASSETS_QUERY,
  UPDATE_MATERIAL_ASSET_MUTATION,
  UPDATE_OBJECT_ASSET_STATUS_MUTATION,
  graphRequest,
  materialDefinitionFromValues,
} from '@repo/product-graph';
import { getProjectSession } from '@/lib/session-server';

function buildMaterialDocumentJson(formData: FormData): string {
  const rawDocument = String(formData.get('documentJson') ?? '').trim();
  if (rawDocument) return rawDocument;

  const values: Record<string, string | number | boolean> = {};
  for (const factor of MATERIAL_FACTORS) {
    const raw = formData.get(factor.key);
    if (factor.type === 'boolean') {
      values[factor.key] = raw === 'on' || raw === 'true';
      continue;
    }
    if (factor.type === 'number') {
      const parsed = Number(raw ?? factor.default);
      values[factor.key] = Number.isFinite(parsed)
        ? parsed
        : (factor.default as number);
      continue;
    }
    values[factor.key] = String(raw ?? factor.default);
  }
  return JSON.stringify(materialDefinitionFromValues(values));
}

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

    await graphRequest(
      CREATE_MATERIAL_ASSET_MUTATION,
      {
        input: {
          organizationId,
          projectId,
          name,
          code,
          documentJson: buildMaterialDocumentJson(formData),
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

  if (!name) {
    return { ok: false, error: 'Name is required.' };
  }

  try {
    await graphRequest(
      UPDATE_MATERIAL_ASSET_MUTATION,
      {
        input: {
          id: materialId,
          name,
          code,
          documentJson: buildMaterialDocumentJson(formData),
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

export async function createTextureAction(
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
    return { ok: false, error: 'Image file is required.' };
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
    await graphRequest(
      CREATE_TEXTURE_ASSET_MUTATION,
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
    revalidatePath(`/${projectId}/library`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Upload failed.',
    };
  }
}

export async function createObjectRevisionAction(
  projectId: string,
  objectAssetId: string,
  formData: FormData
) {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) {
    return { ok: false, error: 'GLB/GLTF file is required.' };
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const fileBase64 = bytes.toString('base64');
    const created = await graphRequest<{
      createObjectAssetRevision: {
        id: string;
        version: number;
        contentHash: string;
      };
    }>(
      CREATE_OBJECT_ASSET_REVISION_MUTATION,
      {
        input: {
          objectAssetId,
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
      id: created.createObjectAssetRevision.id,
      version: created.createObjectAssetRevision.version,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Upload failed.',
    };
  }
}

export async function listObjectRevisionsAction(
  projectId: string,
  objectAssetId: string
) {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false as const, error: 'Session missing.', revisions: [] };
  }

  try {
    const data = await graphRequest<{
      objectAssetRevisions: Array<{
        id: string;
        version: number;
        status?: string;
        contentHash: string;
        format?: string | null;
        sizeBytes?: number | null;
        frozenAt: string;
      }>;
    }>(
      OBJECT_ASSET_REVISIONS_QUERY,
      { objectAssetId },
      project.projectToken
    );
    return {
      ok: true as const,
      revisions: data.objectAssetRevisions,
    };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : 'Failed to load revisions.',
      revisions: [],
    };
  }
}

export async function listMaterialRevisionsAction(
  projectId: string,
  materialAssetId: string
) {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false as const, error: 'Session missing.', revisions: [] };
  }

  try {
    const data = await graphRequest<{
      materialAssetRevisions: Array<{
        id: string;
        version: number;
        status?: string;
        contentHash: string;
        frozenAt: string;
        documentUrl?: string | null;
        textureUsages: Array<{
          slot: string;
          textureAssetRevisionId: string;
          textureName?: string | null;
          wrapS?: string | null;
          wrapT?: string | null;
        }>;
      }>;
    }>(
      MATERIAL_ASSET_REVISIONS_QUERY,
      { materialAssetId },
      project.projectToken
    );
    return {
      ok: true as const,
      revisions: data.materialAssetRevisions,
    };
  } catch (error) {
    return {
      ok: false as const,
      error:
        error instanceof Error ? error.message : 'Failed to load revisions.',
      revisions: [],
    };
  }
}

export async function listTexturesForPinningAction(projectId: string) {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false as const, error: 'Session missing.', textures: [] };
  }

  try {
    const data = await graphRequest<{
      textureAssets: Array<{
        id: string;
        name: string;
        code?: string | null;
        currentRevisionId?: string | null;
        fileUrl?: string | null;
      }>;
    }>(TEXTURE_ASSETS_QUERY, { projectId }, project.projectToken);
    return {
      ok: true as const,
      textures: data.textureAssets.filter((row) => row.currentRevisionId),
    };
  } catch (error) {
    return {
      ok: false as const,
      error: error instanceof Error ? error.message : 'Failed to load textures.',
      textures: [],
    };
  }
}

export async function publishMaterialAction(
  projectId: string,
  materialId: string
) {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  try {
    await graphRequest(
      PUBLISH_MATERIAL_ASSET_MUTATION,
      { id: materialId },
      project.projectToken
    );
    revalidatePath(`/${projectId}/library`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Publish failed.',
    };
  }
}

export async function publishObjectAction(
  projectId: string,
  objectAssetId: string
) {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  try {
    await graphRequest(
      PUBLISH_OBJECT_ASSET_MUTATION,
      { id: objectAssetId },
      project.projectToken
    );
    revalidatePath(`/${projectId}/library`);
    revalidatePath(`/${projectId}/library/objects`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Publish failed.',
    };
  }
}

export async function setObjectAssetStatusAction(
  projectId: string,
  objectAssetId: string,
  status: 'READY' | 'ARCHIVED' | 'FAILED' | 'PROCESSING'
) {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  try {
    await graphRequest(
      UPDATE_OBJECT_ASSET_STATUS_MUTATION,
      {
        input: {
          id: objectAssetId,
          status,
        },
      },
      project.projectToken
    );
    revalidatePath(`/${projectId}/library/objects`);
    revalidatePath(`/${projectId}/library`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Status update failed.',
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
