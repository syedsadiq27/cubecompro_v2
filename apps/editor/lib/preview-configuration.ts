import type { Object3D } from 'three';
import {
  coerceMaterialDocument,
  materialAssetRevisionDocumentUrl,
  type GraphDetail,
  type GraphSessionAuth,
} from '@repo/product-graph';
import { applyMaterialDocumentToNode } from './apply-library-material';
import { findNodeByPath } from './scene-tree';

export type PreviewSelections = Record<string, string>;

export function defaultPreviewSelections(
  detail: GraphDetail | null
): PreviewSelections {
  if (!detail) return {};
  const next: PreviewSelections = {};
  for (const attribute of detail.choices) {
    const first = attribute.values[0];
    if (first) next[attribute.id] = first.id;
  }
  return next;
}

export async function applyPreviewConfiguration(
  root: Object3D,
  detail: GraphDetail,
  selections: PreviewSelections,
  auth?: GraphSessionAuth | null
): Promise<void> {
  const targetsById = new Map(
    detail.models.flatMap((model) =>
      model.targets.map((target) => [target.id, target] as const)
    )
  );

  const visibilityBaseline = new Map<string, boolean>();
  for (const effect of detail.visualEffects) {
    if (effect.operation !== 'SET_VISIBILITY') continue;
    const target = targetsById.get(effect.modelTargetId);
    if (!target?.nodePath) continue;
    visibilityBaseline.set(target.nodePath, true);
  }

  for (const [nodePath, visible] of visibilityBaseline) {
    const node = findNodeByPath(root, nodePath);
    if (node) node.visible = visible;
  }

  for (const effect of detail.visualEffects) {
    const target = targetsById.get(effect.modelTargetId);
    if (!target?.nodePath) continue;

    const attribute = detail.choices.find((entry) =>
      entry.values.some((value) => value.id === effect.choiceValueId)
    );
    if (!attribute) continue;
    const selectedValueId = selections[attribute.id];
    if (selectedValueId !== effect.choiceValueId) continue;

    if (effect.operation === 'SET_VISIBILITY') {
      const node = findNodeByPath(root, target.nodePath);
      if (!node) continue;
      try {
        node.visible = Boolean(JSON.parse(effect.valueJson));
      } catch {
        node.visible = effect.valueJson !== 'false';
      }
      continue;
    }

    if (effect.operation === 'SET_MATERIAL' && auth) {
      let materialAssetRevisionId: string | null = null;
      try {
        const parsed = JSON.parse(effect.valueJson) as {
          materialAssetRevisionId?: string;
        };
        materialAssetRevisionId =
          typeof parsed?.materialAssetRevisionId === 'string'
            ? parsed.materialAssetRevisionId
            : null;
      } catch {
        materialAssetRevisionId = null;
      }
      if (!materialAssetRevisionId) continue;

      const response = await fetch(
        materialAssetRevisionDocumentUrl(auth.apiUrl, materialAssetRevisionId),
        {
          headers: { Authorization: `Bearer ${auth.token}` },
          cache: 'no-store',
        }
      );
      if (!response.ok) continue;
      const raw = (await response.json()) as unknown;
      const document = coerceMaterialDocument(raw);
      applyMaterialDocumentToNode(root, target.nodePath, document);
    }
  }
}
