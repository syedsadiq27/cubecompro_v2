import type { Object3D, Material } from 'three';
import {
  coerceMaterialDocument,
  materialDocumentUrl,
  type GraphSessionAuth,
} from '@repo/product-graph';
import { createStandardMaterialFromDocument } from '../apply-library-material';
import { deriveVisualState } from './derive';
import { reconcileScene } from './reconcile';
import type {
  VisualBaseline,
  VisualDocument,
  VisualSelection,
} from './types';

export async function resolveMaterialMap(
  materialAssetIds: string[],
  auth: GraphSessionAuth | null | undefined,
  cache: Map<string, Material>
): Promise<Record<string, Material>> {
  const out: Record<string, Material> = {};
  for (const id of materialAssetIds) {
    const cached = cache.get(id);
    if (cached) {
      out[id] = cached;
      continue;
    }
    if (!auth) {
      throw new Error('Cannot resolve materials without graph auth');
    }
    const response = await fetch(materialDocumentUrl(auth.apiUrl, id), {
      headers: { Authorization: `Bearer ${auth.token}` },
      cache: 'no-store',
    });
    if (!response.ok) {
      throw new Error(`Failed to load material asset ${id}`);
    }
    const raw = (await response.json()) as unknown;
    const document = coerceMaterialDocument(raw);
    const material = createStandardMaterialFromDocument(document, id);
    cache.set(id, material);
    out[id] = material;
  }
  return out;
}

export function collectMaterialAssetIds(
  document: VisualDocument,
  selection: VisualSelection
): string[] {
  const ids = new Set<string>();
  for (const binding of document.bindings) {
    if (binding.operation !== 'SET_MATERIAL') continue;
    if (selection[binding.choiceKey] !== binding.valueKey) continue;
    ids.add(binding.materialAssetId);
  }
  return [...ids];
}

export async function replayVisualDocument(options: {
  root: Object3D;
  document: VisualDocument;
  baseline: VisualBaseline;
  selection: VisualSelection;
  auth?: GraphSessionAuth | null;
  materialCache?: Map<string, Material>;
  productRevisionId?: string;
}): Promise<void> {
  const { root, document, baseline, selection, auth, productRevisionId } =
    options;
  const cache = options.materialCache ?? new Map<string, Material>();
  const state = deriveVisualState(baseline, document, selection, {
    productRevisionId: productRevisionId ?? document.productRevisionId,
  });
  const materials = await resolveMaterialMap(
    collectMaterialAssetIds(document, selection),
    auth,
    cache
  );
  reconcileScene(root, document, state, baseline, materials);
}
