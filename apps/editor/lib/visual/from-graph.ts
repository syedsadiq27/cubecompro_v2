import type { GraphDetail } from '@repo/product-graph';
import { normalizeVisualDocument } from './normalize';
import type { VisualDocument } from './types';

export function pickProductModel(
  detail: GraphDetail,
  productModelId?: string | null
) {
  if (productModelId) {
    const match = detail.models.find((model) => model.id === productModelId);
    if (!match) {
      throw new Error(`ProductModel ${productModelId} not found on revision`);
    }
    return match;
  }
  const primary = detail.models[0];
  if (!primary) {
    throw new Error('ProductRevision has no ProductModel');
  }
  return primary;
}

export function normalizeVisualDocumentFromGraphDetail(
  detail: GraphDetail,
  productModelId?: string | null
): VisualDocument {
  const model = pickProductModel(detail, productModelId);
  const modelTargetIds = new Set(model.targets.map((t) => t.id));
  const linkedAssets = (model.linkedAssets ?? []).map((asset) => ({
    id: asset.id,
    role: asset.role as VisualDocument['linkedAssets'][number]['role'],
    key: asset.key,
    assetRevisionId: asset.assetRevisionId,
  }));
  return normalizeVisualDocument({
    productRevisionId: detail.id,
    model: {
      id: model.id,
      assetId: model.assetId,
      objectAssetRevisionId: model.objectAssetRevisionId,
      linkedAssets,
      targets: model.targets,
    },
    choices: detail.choices,
    visualEffects: detail.visualEffects.filter((effect) =>
      modelTargetIds.has(effect.modelTargetId)
    ),
    visualSetups: (model.visualSetups ?? []).filter((setup) =>
      modelTargetIds.has(setup.modelTargetId)
    ),
  });
}
