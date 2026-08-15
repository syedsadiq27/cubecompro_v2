import { graphRequest } from './client.js';
import { objectDocumentUrl } from './documents.js';
import {
  PRODUCT_QUERY,
  PRODUCT_REVISION_DETAIL_QUERY,
  PRODUCT_REVISIONS_QUERY,
} from './operations.js';
import type {
  GraphDetail,
  GraphObjectAsset,
  GraphSessionAuth,
  GraphVersionSummary,
} from './types.js';

export function pickGraphVersionId(
  versions: GraphVersionSummary[],
  preferredId?: string
): string {
  if (preferredId) return preferredId;
  const draft = versions.find((version) => version.status === 'DRAFT');
  const published = versions.find((version) => version.status === 'PUBLISHED');
  const selected = draft ?? published ?? versions[0];
  if (!selected) {
    throw new Error('Product has no configuration version');
  }
  return selected.id;
}

export async function resolveGraphVersionId(
  auth: GraphSessionAuth,
  productId: string
): Promise<string> {
  if (auth.productRevisionId) return auth.productRevisionId;
  if (auth.graphVersionId) return auth.graphVersionId;
  const data = await graphRequest<{
    productRevisions: GraphVersionSummary[];
  }>(PRODUCT_REVISIONS_QUERY, { productId }, auth.token, auth.apiUrl);
  return pickGraphVersionId(data.productRevisions);
}

export type ProductEditorBootstrap = {
  product: { id: string; name: string; key: string };
  detail: GraphDetail;
  assets: GraphObjectAsset[];
  modelUrl: string;
  modelName: string;
  productModelId: string;
  assetId: string;
};

export async function bootstrapProductEditor({
  auth,
  productId,
  modelId,
}: {
  auth: GraphSessionAuth;
  productId: string;
  modelId?: string;
}): Promise<ProductEditorBootstrap> {
  const productRevisionId = await resolveGraphVersionId(auth, productId);
  const [productData, detailData] = await Promise.all([
    graphRequest<{
      product: { id: string; name: string; key: string };
    }>(PRODUCT_QUERY, { id: productId }, auth.token, auth.apiUrl),
    graphRequest<{
      productRevisionDetail: GraphDetail;
    }>(
      PRODUCT_REVISION_DETAIL_QUERY,
      { id: productRevisionId },
      auth.token,
      auth.apiUrl
    ),
  ]);

  const detail = detailData.productRevisionDetail;
  const productModel =
    detail.models.find((model) => model.id === modelId) ?? detail.models[0];
  if (!productModel) {
    throw new Error(
      'No product model attached. Attach a library object from the product 3D tab first.'
    );
  }

  const modelUrl = objectDocumentUrl(auth.apiUrl, productModel.assetId);
  const assets: GraphObjectAsset[] = [
    {
      id: productModel.assetId,
      name: productModel.name,
      code: productModel.key,
      relativePath: modelUrl,
      url: modelUrl,
      included: true,
      visible: true,
    },
  ];

  return {
    product: productData.product,
    detail: {
      ...detail,
      id: productRevisionId,
    },
    assets,
    modelUrl,
    modelName: productModel.name,
    productModelId: productModel.id,
    assetId: productModel.assetId,
  };
}
