'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { graphRequest } from '@repo/product-graph';
import {
  CREATE_PRODUCT_MUTATION,
  DELETE_PRODUCT_MUTATION,
  ME_QUERY,
  PRODUCT_GRAPH_VERSIONS_QUERY,
  PUBLISH_GRAPH_VERSION_MUTATION,
  UPDATE_PRODUCT_MUTATION,
} from '@repo/product-graph';
import { forceRelogin, isStaleAuthError } from '@/lib/auth-recovery';
import {
  getProjectSession,
  getSessionUser,
} from '@/lib/session-server';

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
    await graphRequest<{ deleteProduct: boolean }>(
      DELETE_PRODUCT_MUTATION,
      { id: productId },
      project.projectToken
    );
    revalidatePath(`/${projectId}/products`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Delete failed.',
    };
  }
}

export async function setProductStatusAction(
  projectId: string,
  productId: string,
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
): Promise<MutationResult> {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Project session missing.' };
  }

  try {
    await graphRequest(
      UPDATE_PRODUCT_MUTATION,
      {
        input: {
          id: productId,
          status,
        },
      },
      project.projectToken
    );
    revalidatePath(`/${projectId}/products`);
    revalidatePath(`/${projectId}/products/${productId}`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Status update failed.',
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
    await graphRequest(
      UPDATE_PRODUCT_MUTATION,
      {
        input: {
          id: productId,
          name: String(formData.get('Name') ?? ''),
          key: String(formData.get('key') ?? ''),
        },
      },
      project.projectToken
    );
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

export async function createProductAction(
  projectId: string,
  formData: FormData
): Promise<MutationResult> {
  const [user, project] = await Promise.all([
    getSessionUser(),
    getProjectSession(),
  ]);
  if (!user || !project || project.projectId !== projectId) {
    return { ok: false, error: 'Session missing.' };
  }

  const name = String(formData.get('Name') ?? '').trim();
  const key = String(formData.get('key') ?? '').trim();
  if (!name || !key) {
    return { ok: false, error: 'Name and key are required.' };
  }

  try {
    const me = await graphRequest<{
      me: { organizationId?: string | null };
    }>(ME_QUERY, undefined, user.token);
    const organizationId = me.me.organizationId;
    if (!organizationId) {
      return { ok: false, error: 'No organization on session.' };
    }

    const data = await graphRequest<{
      createProduct: { id: string };
    }>(
      CREATE_PRODUCT_MUTATION,
      {
        input: {
          organizationId,
          projectId,
          name,
          key,
        },
      },
      project.projectToken
    );

    revalidatePath(`/${projectId}/products`);
    redirect(`/${projectId}/products/${data.createProduct.id}`);
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      String((error as { digest?: string }).digest).startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }
    if (isStaleAuthError(error)) {
      forceRelogin();
    }
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Create failed.',
    };
  }
}

export async function publishProductGraphAction(
  projectId: string,
  productId: string
): Promise<MutationResult> {
  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    return { ok: false, error: 'Project session missing.' };
  }

  try {
    const versions = await graphRequest<{
      productRevisions: Array<{ id: string; status: string }>;
    }>(
      PRODUCT_GRAPH_VERSIONS_QUERY,
      { productId },
      project.projectToken
    );
    const draft = versions.productRevisions.find(
      (version) => version.status === 'DRAFT'
    );
    if (!draft) {
      return { ok: false, error: 'No draft graph version to publish.' };
    }

    await graphRequest(
      PUBLISH_GRAPH_VERSION_MUTATION,
      { id: draft.id },
      project.projectToken
    );
    revalidatePath(`/${projectId}/products/${productId}`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Publish failed.',
    };
  }
}

export async function goToNewProduct(projectId: string): Promise<void> {
  redirect(`/${projectId}/products/new`);
}
