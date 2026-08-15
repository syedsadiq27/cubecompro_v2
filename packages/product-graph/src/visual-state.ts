import {
  isReplaceComponentValue,
  parseReplaceComponentValue,
  type ReplaceComponentValue,
} from './replace-component.js';

export const PRODUCT_MODEL_ROOT_ASSET_KEY = 'root';

export type ProductModelAssetRole =
  | 'OBJECT'
  | 'MATERIAL'
  | 'TEXTURE'
  | 'ENVIRONMENT'
  | 'SHADER'
  | 'ANIMATION';

export type ProductModelLinkedAsset = {
  id?: string;
  role: ProductModelAssetRole;
  key: string;
  assetRevisionId: string;
};

export type VisualAssetBinding = {
  choiceKey: string;
  choiceValueKey: string;
  targetKey: string;
  operation: 'REPLACE_COMPONENT';
  linkedAssetKey: string;
  expectedRole: 'OBJECT';
};

export type DeriveVisualStateInput = {
  rootObjectAssetRevisionId: string;
  linkedAssets: ProductModelLinkedAsset[];
  /** Choice key → selected value key. */
  selection?: Record<string, string>;
  /** Explicit visual bindings only — never infer from keys/names. */
  bindings?: VisualAssetBinding[];
};

export type ActiveObjectReplacement = {
  targetKey: string;
  linkedAssetKey: string;
  objectAssetRevisionId: string;
};

export type DerivedVisualState = {
  rootObjectAssetRevisionId: string;
  /** Resource registry for this model (not kernel Availability). */
  assetUniverse: {
    objects: ProductModelLinkedAsset[];
    materials: ProductModelLinkedAsset[];
    textures: ProductModelLinkedAsset[];
    environments: ProductModelLinkedAsset[];
    shaders: ProductModelLinkedAsset[];
    animations: ProductModelLinkedAsset[];
  };
  /**
   * Deterministic result of root + explicit bindings + Selection.
   * MATERIAL/TEXTURE never become render-active until 4D immutable revisions.
   */
  activeAssets: {
    objectAssetRevisionIds: string[];
    objectReplacements: ActiveObjectReplacement[];
    materialAssetRevisionIds: string[];
    textureAssetRevisionIds: string[];
    environmentAssetRevisionIds: string[];
    shaderAssetRevisionIds: string[];
    animationAssetRevisionIds: string[];
  };
};

function byRole(
  linkedAssets: ProductModelLinkedAsset[],
  role: ProductModelAssetRole
): ProductModelLinkedAsset[] {
  return linkedAssets.filter((asset) => asset.role === role);
}

function assertRootMirror(
  rootObjectAssetRevisionId: string,
  linkedAssets: ProductModelLinkedAsset[]
) {
  const rootLink = linkedAssets.find(
    (asset) =>
      asset.role === 'OBJECT' && asset.key === PRODUCT_MODEL_ROOT_ASSET_KEY
  );
  if (!rootLink) return;
  if (rootLink.assetRevisionId !== rootObjectAssetRevisionId) {
    throw new Error(
      'OBJECT/root.assetRevisionId must equal ProductModel.objectAssetRevisionId'
    );
  }
}

/**
 * Selection + explicit bindings → deterministic active asset set.
 * No heuristic matching by asset key / choice value name coincidence.
 */
export function deriveVisualState(
  input: DeriveVisualStateInput
): DerivedVisualState {
  const rootObjectAssetRevisionId = input.rootObjectAssetRevisionId.trim();
  if (!rootObjectAssetRevisionId) {
    throw new Error('rootObjectAssetRevisionId is required');
  }

  const linkedAssets = input.linkedAssets ?? [];
  assertRootMirror(rootObjectAssetRevisionId, linkedAssets);

  const assetUniverse = {
    objects: byRole(linkedAssets, 'OBJECT'),
    materials: byRole(linkedAssets, 'MATERIAL'),
    textures: byRole(linkedAssets, 'TEXTURE'),
    environments: byRole(linkedAssets, 'ENVIRONMENT'),
    shaders: byRole(linkedAssets, 'SHADER'),
    animations: byRole(linkedAssets, 'ANIMATION'),
  };

  const objectReplacements: ActiveObjectReplacement[] = [];
  const selection = input.selection ?? {};
  const bindings = input.bindings ?? [];

  for (const binding of bindings) {
    if (binding.operation !== 'REPLACE_COMPONENT') {
      continue;
    }
    if (selection[binding.choiceKey] !== binding.choiceValueKey) {
      continue;
    }
    if (binding.expectedRole !== 'OBJECT') {
      throw new Error(
        'REPLACE_COMPONENT may only activate OBJECT-linked immutable revisions'
      );
    }
    if (binding.linkedAssetKey === PRODUCT_MODEL_ROOT_ASSET_KEY) {
      throw new Error(
        'REPLACE_COMPONENT must not target the reserved OBJECT/root mirror key'
      );
    }

    const link = linkedAssets.find(
      (asset) =>
        asset.role === 'OBJECT' && asset.key === binding.linkedAssetKey
    );
    if (!link) {
      throw new Error(
        `REPLACE_COMPONENT binding references missing OBJECT link "${binding.linkedAssetKey}"`
      );
    }

    objectReplacements.push({
      targetKey: binding.targetKey,
      linkedAssetKey: binding.linkedAssetKey,
      objectAssetRevisionId: link.assetRevisionId,
    });
  }

  const objectAssetRevisionIds = [
    rootObjectAssetRevisionId,
    ...objectReplacements.map((entry) => entry.objectAssetRevisionId),
  ].filter((id, index, all) => all.indexOf(id) === index);

  return {
    rootObjectAssetRevisionId,
    assetUniverse,
    activeAssets: {
      objectAssetRevisionIds,
      objectReplacements,
      materialAssetRevisionIds: [],
      textureAssetRevisionIds: [],
      environmentAssetRevisionIds: [],
      shaderAssetRevisionIds: [],
      animationAssetRevisionIds: [],
    },
  };
}

export function replaceComponentBindingFromEffectValue(
  value: unknown
): ReplaceComponentValue {
  return parseReplaceComponentValue(value);
}

export { isReplaceComponentValue, parseReplaceComponentValue };
