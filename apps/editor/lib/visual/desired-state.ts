import {
  deriveVisualState as derivePackageVisualState,
  type DerivedVisualState,
  type ProductModelLinkedAsset,
  type VisualAssetBinding,
  type VisualStaticSetup,
} from '@repo/product-graph';
import { formatVisualAddress } from './address';
import type {
  VisualBaseline,
  VisualDocument,
  VisualSelection,
  VisualState,
} from './types';

/**
 * Transport adapter: map hydrated VisualDocument bindings into the shared
 * package contract, then call the only semantic deriveVisualState.
 */
export function toPackageBindings(
  document: VisualDocument
): VisualAssetBinding[] {
  const bindings: VisualAssetBinding[] = [];
  for (const binding of document.bindings) {
    if (binding.operation === 'REPLACE_COMPONENT') {
      bindings.push({
        choiceKey: binding.choiceKey,
        choiceValueKey: binding.valueKey,
        targetKey: binding.targetKey,
        operation: 'REPLACE_COMPONENT',
        linkedAssetKey: binding.linkedAssetKey,
        expectedRole: 'OBJECT',
      });
      continue;
    }
    if (binding.operation === 'SET_MATERIAL') {
      bindings.push({
        choiceKey: binding.choiceKey,
        choiceValueKey: binding.valueKey,
        targetKey: binding.targetKey,
        operation: 'SET_MATERIAL',
        materialAssetRevisionId: binding.materialAssetRevisionId,
        ...(binding.materialSlot
          ? { materialSlot: binding.materialSlot }
          : {}),
      });
    }
  }
  return bindings;
}

export function toPackageStaticSetup(
  document: VisualDocument
): VisualStaticSetup[] {
  const setups: VisualStaticSetup[] = [];
  for (const setup of document.setups) {
    if (setup.operation === 'REPLACE_COMPONENT') {
      setups.push({
        targetKey: setup.targetKey,
        operation: 'REPLACE_COMPONENT',
        linkedAssetKey: setup.linkedAssetKey,
        expectedRole: 'OBJECT',
      });
      continue;
    }
    if (setup.operation === 'SET_MATERIAL') {
      setups.push({
        targetKey: setup.targetKey,
        operation: 'SET_MATERIAL',
        materialAssetRevisionId: setup.materialAssetRevisionId,
        ...(setup.materialSlot ? { materialSlot: setup.materialSlot } : {}),
      });
    }
  }
  return setups;
}

export function toPackageLinkedAssets(
  document: VisualDocument
): ProductModelLinkedAsset[] {
  return document.linkedAssets.map((asset) => ({
    ...(asset.id ? { id: asset.id } : {}),
    role: asset.role,
    key: asset.key,
    assetRevisionId: asset.assetRevisionId,
  }));
}

/**
 * Sole semantic derivation entry for the editor — delegates to @repo/product-graph.
 */
export function deriveDesiredVisualState(
  document: VisualDocument,
  selection: VisualSelection,
  options?: { productRevisionId?: string }
): DerivedVisualState {
  const expectedRevision =
    options?.productRevisionId ?? document.productRevisionId;
  if (expectedRevision !== document.productRevisionId) {
    throw new Error(
      `VisualDocument revision mismatch: document=${document.productRevisionId} selectionRevision=${expectedRevision}`
    );
  }

  return derivePackageVisualState({
    rootObjectAssetRevisionId: document.rootObjectAssetRevisionId,
    linkedAssets: toPackageLinkedAssets(document),
    staticSetup: toPackageStaticSetup(document),
    selection,
    bindings: toPackageBindings(document),
  });
}

/**
 * Non-semantic overlay: SET_VISIBILITY from static setup then selection bindings.
 */
export function visibilityOverridesFromDocument(
  baseline: VisualBaseline,
  document: VisualDocument,
  selection: VisualSelection
): Record<string, boolean | undefined> {
  const out: Record<string, boolean | undefined> = {};

  for (const target of document.targets) {
    const visibilityAddress = formatVisualAddress({
      targetKey: target.key,
      property: 'visibility',
    });
    const visibility = baseline[visibilityAddress]?.visible;
    if (visibility !== undefined) {
      out[target.key] = visibility;
    }
  }

  for (const setup of document.setups) {
    if (setup.operation !== 'SET_VISIBILITY') continue;
    out[setup.targetKey] = setup.visible;
  }

  for (const binding of document.bindings) {
    if (binding.operation !== 'SET_VISIBILITY') continue;
    if (selection[binding.choiceKey] !== binding.valueKey) continue;
    out[binding.targetKey] = binding.visible;
  }

  return out;
}

/**
 * Build the runtime VisualState used by reconcileScene from package desired state
 * + visibility overlay.
 */
export function projectRuntimeVisualState(
  baseline: VisualBaseline,
  document: VisualDocument,
  selection: VisualSelection,
  options?: { productRevisionId?: string }
): VisualState {
  const desired = deriveDesiredVisualState(document, selection, options);
  const visibility = visibilityOverridesFromDocument(
    baseline,
    document,
    selection
  );

  const targets: VisualState['targets'] = {};
  for (const target of document.targets) {
    const surface = desired.rootSurfaces[target.key];
    targets[target.key] = {
      ...(visibility[target.key] !== undefined
        ? { visible: visibility[target.key] }
        : {}),
      ...(surface
        ? { materialAssetRevisionId: surface.materialAssetRevisionId }
        : {}),
    };
  }

  return {
    structure: { ...desired.structure },
    rootSurfaces: { ...desired.rootSurfaces },
    targets,
  };
}

/** Empty selection → ProductModel default (baseline + static setup). */
export function projectBaselineRuntimeVisualState(
  baseline: VisualBaseline,
  document: VisualDocument
): VisualState {
  return projectRuntimeVisualState(baseline, document, {});
}
