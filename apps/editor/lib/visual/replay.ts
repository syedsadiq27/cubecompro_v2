import type { Object3D, Material } from 'three';
import {
  coerceMaterialDocument,
  materialAssetRevisionDocumentUrl,
  objectAssetRevisionDocumentUrl,
  type GraphSessionAuth,
} from '@repo/product-graph';
import { createStandardMaterialFromDocument } from '../apply-library-material';
import { loadModel } from '../load-model';
import { projectRuntimeVisualState } from './desired-state';
import type { StructuralSlotBaseline } from './object-runtime';
import { ObjectRuntimeRegistry } from './object-runtime';
import { reconcileScene } from './reconcile';
import type {
  VisualBaseline,
  VisualDocument,
  VisualSelection,
} from './types';
import type { ObjectRuntimeInstance } from './object-runtime';

export type VisualReplayContext = {
  generation: number;
  objectRegistry: ObjectRuntimeRegistry;
  structuralBaselines: Map<string, StructuralSlotBaseline>;
  mountedInstances: Map<string, ObjectRuntimeInstance>;
};

export function createVisualReplayContext(): VisualReplayContext {
  return {
    generation: 0,
    objectRegistry: new ObjectRuntimeRegistry(),
    structuralBaselines: new Map(),
    mountedInstances: new Map(),
  };
}

export async function resolveMaterialMap(
  materialAssetRevisionIds: string[],
  auth: GraphSessionAuth | null | undefined,
  cache: Map<string, Material>
): Promise<Record<string, Material>> {
  const out: Record<string, Material> = {};
  for (const id of materialAssetRevisionIds) {
    const cached = cache.get(id);
    if (cached) {
      out[id] = cached;
      continue;
    }
    if (!auth) {
      throw new Error('Cannot resolve materials without graph auth');
    }
    const response = await fetch(
      materialAssetRevisionDocumentUrl(auth.apiUrl, id),
      {
        headers: { Authorization: `Bearer ${auth.token}` },
        cache: 'no-store',
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to load material revision ${id} (${response.status})`
      );
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
    ids.add(binding.materialAssetRevisionId);
  }
  return [...ids];
}

async function ensureObjectSources(
  revisionIds: string[],
  auth: GraphSessionAuth | null | undefined,
  registry: ObjectRuntimeRegistry,
  isCurrent: () => boolean
): Promise<boolean> {
  for (const revisionId of revisionIds) {
    if (registry.hasSource(revisionId)) continue;
    if (!auth) {
      throw new Error('Cannot resolve object revisions without graph auth');
    }
    const url = objectAssetRevisionDocumentUrl(auth.apiUrl, revisionId);
    const loaded = await loadModel(url, {
      Authorization: `Bearer ${auth.token}`,
    });
    if (!isCurrent()) return false;
    registry.registerSource(revisionId, loaded);
  }
  return isCurrent();
}

export async function replayVisualDocument(options: {
  root: Object3D;
  document: VisualDocument;
  baseline: VisualBaseline;
  selection: VisualSelection;
  auth?: GraphSessionAuth | null;
  materialCache?: Map<string, Material>;
  productRevisionId?: string;
  context: VisualReplayContext;
  /** Called after bumping generation; returns whether this run is still current. */
  isCurrent?: (generation: number) => boolean;
}): Promise<{ generation: number; applied: boolean }> {
  const {
    root,
    document,
    baseline,
    selection,
    auth,
    productRevisionId,
    context,
  } = options;
  const cache = options.materialCache ?? new Map<string, Material>();

  context.generation += 1;
  const generation = context.generation;
  const isCurrent = () =>
    options.isCurrent
      ? options.isCurrent(generation)
      : context.generation === generation;

  const state = projectRuntimeVisualState(baseline, document, selection, {
    productRevisionId: productRevisionId ?? document.productRevisionId,
  });

  const structureRevisionIds = [...new Set(Object.values(state.structure))];
  const sourcesOk = await ensureObjectSources(
    structureRevisionIds,
    auth,
    context.objectRegistry,
    isCurrent
  );
  if (!sourcesOk) {
    return { generation, applied: false };
  }

  const materials = await resolveMaterialMap(
    collectMaterialAssetIds(document, selection),
    auth,
    cache
  );
  if (!isCurrent()) {
    return { generation, applied: false };
  }

  reconcileScene({
    root,
    document,
    state,
    surfaceBaseline: baseline,
    structuralBaselines: context.structuralBaselines,
    materials,
    objectRegistry: context.objectRegistry,
    mountedInstances: context.mountedInstances,
  });

  return { generation, applied: true };
}
