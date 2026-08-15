'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { graphRequest } from '@repo/product-graph';
import {
  DISCONNECT_SHOPIFY_MUTATION,
  IMPORT_SHOPIFY_PRODUCT_MUTATION,
  ME_QUERY,
  PREVIEW_SHOPIFY_PRODUCT_IMPORT_QUERY,
  PRODUCT_SHOPIFY_COMMERCE_QUERY,
  SHOPIFY_CATALOG_PRODUCTS_QUERY,
  SHOPIFY_CONNECTIONS_QUERY,
  SHOPIFY_IMPORT_PROOF_QUERY,
  START_SHOPIFY_OAUTH_MUTATION,
} from '@repo/product-graph';
import {
  getProjectSession,
  getSessionUser,
} from '@/lib/session-server';

export type MutationResult = {
  ok: boolean;
  error?: string;
};

export type ShopifyConnection = {
  id: string;
  organizationId: string;
  provider: string;
  externalAccountId: string;
  displayName?: string | null;
  apiVersion: string;
  hasAccessToken: boolean;
};

export type ShopifyCatalogProduct = {
  id: string;
  title: string;
  handle: string;
  status: string;
  options: string[];
  variantCount: number;
};

export type ShopifyImportPreview = {
  connectionId: string;
  shop: string;
  productName: string;
  identityChoiceKeys: string[];
  identityChoiceNames: string[];
  mappedCount: number;
  unmappedCount: number;
  reviewJson: string;
};

export type ShopifyCommerceView = {
  shop: string;
  displayName?: string | null;
  externalProductId: string;
  identityChoiceKeys: string[];
  identityChoiceNames: string[];
  mappedCount: number;
  unmappedCount: number;
  rows: Array<{
    label: string;
    status: string;
    sku?: string | null;
    externalId?: string | null;
  }>;
};

export type ShopifyImportProof = {
  productId: string;
  productRevisionId: string;
  productName: string;
  choices: Array<{
    key: string;
    name: string;
    values: Array<{ key: string; name: string }>;
  }>;
  identityChoiceNames: string[];
  mappingCount: number;
  constraintCount: number;
  resolutions: Array<{
    label: string;
    status: string;
    externalId?: string | null;
    sku?: string | null;
  }>;
};

async function requireOrgContext(projectId: string) {
  const [user, project] = await Promise.all([
    getSessionUser(),
    getProjectSession(),
  ]);
  if (!user || !project || project.projectId !== projectId) {
    throw new Error('Session missing.');
  }
  const me = await graphRequest<{
    me: { organizationId?: string | null };
  }>(ME_QUERY, {}, user.token);
  const organizationId = me.me.organizationId;
  if (!organizationId) {
    throw new Error('Organization missing.');
  }
  return { user, project, organizationId };
}

export async function getShopifyConnectionsAction(
  projectId: string
): Promise<{ connections: ShopifyConnection[]; error?: string }> {
  try {
    const { organizationId, project } = await requireOrgContext(projectId);
    const data = await graphRequest<{
      shopifyConnections: ShopifyConnection[];
    }>(
      SHOPIFY_CONNECTIONS_QUERY,
      { organizationId },
      project.projectToken
    );
    return { connections: data.shopifyConnections };
  } catch (error) {
    return {
      connections: [],
      error: error instanceof Error ? error.message : 'Failed to load connections.',
    };
  }
}

export async function startShopifyOAuthAction(
  projectId: string,
  formData: FormData
): Promise<MutationResult> {
  try {
    const { organizationId, project } = await requireOrgContext(projectId);
    const shop = String(formData.get('shop') ?? '').trim();
    if (!shop) {
      return { ok: false, error: 'Shop domain is required.' };
    }
    const data = await graphRequest<{
      startShopifyOAuth: { authorizeUrl: string };
    }>(
      START_SHOPIFY_OAUTH_MUTATION,
      {
        input: {
          organizationId,
          projectId,
          shop,
        },
      },
      project.projectToken
    );
    redirect(data.startShopifyOAuth.authorizeUrl);
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof (error as { digest?: string }).digest === 'string' &&
      (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Failed to start OAuth.',
    };
  }
}

export async function disconnectShopifyAction(
  projectId: string,
  integrationConnectionId: string
): Promise<MutationResult> {
  try {
    const { organizationId, project } = await requireOrgContext(projectId);
    await graphRequest(
      DISCONNECT_SHOPIFY_MUTATION,
      {
        input: { organizationId, integrationConnectionId },
      },
      project.projectToken
    );
    revalidatePath(`/${projectId}/integrations/shopify`);
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Disconnect failed.',
    };
  }
}

export async function getShopifyCatalogAction(
  projectId: string,
  query?: string
): Promise<{ products: ShopifyCatalogProduct[]; error?: string }> {
  try {
    const { organizationId, project } = await requireOrgContext(projectId);
    const data = await graphRequest<{
      shopifyCatalogProducts: ShopifyCatalogProduct[];
    }>(
      SHOPIFY_CATALOG_PRODUCTS_QUERY,
      {
        organizationId,
        query: query?.trim() || null,
      },
      project.projectToken
    );
    return { products: data.shopifyCatalogProducts };
  } catch (error) {
    return {
      products: [],
      error: error instanceof Error ? error.message : 'Failed to load catalog.',
    };
  }
}

export async function getShopifyImportPreviewAction(
  projectId: string,
  shopifyProductId: string
): Promise<{ preview: ShopifyImportPreview | null; error?: string }> {
  try {
    const { organizationId, project } = await requireOrgContext(projectId);
    const data = await graphRequest<{
      previewShopifyProductImport: ShopifyImportPreview;
    }>(
      PREVIEW_SHOPIFY_PRODUCT_IMPORT_QUERY,
      {
        input: {
          organizationId,
          shopifyProductId,
        },
      },
      project.projectToken
    );
    return { preview: data.previewShopifyProductImport };
  } catch (error) {
    return {
      preview: null,
      error: error instanceof Error ? error.message : 'Failed to preview import.',
    };
  }
}

export async function confirmShopifyImportAction(
  projectId: string,
  shopifyProductId: string,
  integrationConnectionId: string
): Promise<MutationResult & { productId?: string }> {
  try {
    const { project } = await requireOrgContext(projectId);
    const data = await graphRequest<{
      importShopifyProduct: { productId: string };
    }>(
      IMPORT_SHOPIFY_PRODUCT_MUTATION,
      {
        input: {
          projectId,
          shopifyProductId,
          integrationConnectionId,
        },
      },
      project.projectToken
    );
    revalidatePath(`/${projectId}/products`);
    redirect(
      `/${projectId}/integrations/shopify/import/proof?productId=${data.importShopifyProduct.productId}`
    );
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'digest' in error &&
      typeof (error as { digest?: string }).digest === 'string' &&
      (error as { digest: string }).digest.startsWith('NEXT_REDIRECT')
    ) {
      throw error;
    }
    return {
      ok: false,
      error: error instanceof Error ? error.message : 'Import failed.',
    };
  }
}

export async function getProductShopifyCommerceAction(
  projectId: string,
  productId: string
): Promise<{ view: ShopifyCommerceView | null; error?: string }> {
  try {
    const { organizationId, project } = await requireOrgContext(projectId);
    const data = await graphRequest<{
      productShopifyCommerce: ShopifyCommerceView | null;
    }>(
      PRODUCT_SHOPIFY_COMMERCE_QUERY,
      { productId, organizationId },
      project.projectToken
    );
    return { view: data.productShopifyCommerce };
  } catch (error) {
    return {
      view: null,
      error:
        error instanceof Error ? error.message : 'Failed to load commerce view.',
    };
  }
}

export async function getShopifyImportProofAction(
  projectId: string,
  productId: string
): Promise<{ proof: ShopifyImportProof | null; error?: string }> {
  try {
    const { organizationId, project } = await requireOrgContext(projectId);
    const data = await graphRequest<{
      shopifyImportProof: ShopifyImportProof;
    }>(
      SHOPIFY_IMPORT_PROOF_QUERY,
      { productId, organizationId },
      project.projectToken
    );
    return { proof: data.shopifyImportProof };
  } catch (error) {
    return {
      proof: null,
      error: error instanceof Error ? error.message : 'Failed to load proof.',
    };
  }
}
