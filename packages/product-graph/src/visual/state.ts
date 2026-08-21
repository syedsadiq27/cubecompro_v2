import {
  isReplaceComponentValue,
  parseReplaceComponentValue,
  type ReplaceComponentValue,
} from './replace-component.js';
import {
  isSetMaterialValue,
  parseSetMaterialValue,
  type SetMaterialValue,
} from '../materials/materials.js';

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

export type ReplaceComponentBinding = {
  choiceKey: string;
  choiceValueKey: string;
  targetKey: string;
  operation: 'REPLACE_COMPONENT';
  linkedAssetKey: string;
  expectedRole: 'OBJECT';
};

export type SetMaterialBinding = {
  choiceKey: string;
  choiceValueKey: string;
  targetKey: string;
  materialSlot?: string;
  operation: 'SET_MATERIAL';
  materialAssetRevisionId: string;
};

export type VisualAssetBinding = ReplaceComponentBinding | SetMaterialBinding;

export type VisualStaticSetup =
  | {
      targetKey: string;
      operation: 'REPLACE_COMPONENT';
      linkedAssetKey: string;
      expectedRole: 'OBJECT';
    }
  | {
      targetKey: string;
      operation: 'SET_MATERIAL';
      materialAssetRevisionId: string;
      materialSlot?: string;
    };

export type DeriveVisualStateInput = {
  rootObjectAssetRevisionId: string;
  linkedAssets: ProductModelLinkedAsset[];
  /**
   * Always-on ProductModel setup. Applied before selection bindings.
   */
  staticSetup?: VisualStaticSetup[];
  selection?: Record<string, string>;
  bindings?: VisualAssetBinding[];
  /**
   * Optional map materialRevisionId → texture revision ids from frozen usages.
   * When omitted, texture actives stay empty (resolve fills after DB load).
   */
  textureRevisionsByMaterialRevisionId?: Record<string, string[]>;
};

export type ActiveObjectReplacement = {
  targetKey: string;
  linkedAssetKey: string;
  objectAssetRevisionId: string;
};

export type ActiveMaterialAssignment = {
  targetKey: string;
  materialSlot?: string;
  materialAssetRevisionId: string;
};

export type DerivedVisualState = {
  rootObjectAssetRevisionId: string;
  /**
   * Desired composition: compositionSlotKey (ModelTarget.key) → ObjectAssetRevision.
   * Absent slot → restore root structural baseline (no empty slot).
   */
  structure: Record<string, string>;
  /**
   * Desired root-owned surface overrides: targetKey → material revision.
   */
  rootSurfaces: Record<
    string,
    { materialAssetRevisionId: string; materialSlot?: string }
  >;
  assetUniverse: {
    objects: ProductModelLinkedAsset[];
    materials: ProductModelLinkedAsset[];
    textures: ProductModelLinkedAsset[];
    environments: ProductModelLinkedAsset[];
    shaders: ProductModelLinkedAsset[];
    animations: ProductModelLinkedAsset[];
  };
  activeAssets: {
    objectAssetRevisionIds: string[];
    objectReplacements: ActiveObjectReplacement[];
    materialAssetRevisionIds: string[];
    materialAssignments: ActiveMaterialAssignment[];
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
 * Baseline + static setup + selection bindings → deterministic VisualState.
 * Precedence: baseline < staticSetup < active configuration overrides.
 * Registry membership never activates materials/textures alone.
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
  const materialAssignments: ActiveMaterialAssignment[] = [];
  const materialLinks = assetUniverse.materials;

  const applyReplace = (op: {
    targetKey: string;
    linkedAssetKey: string;
    expectedRole: 'OBJECT';
  }) => {
    if (op.expectedRole !== 'OBJECT') {
      throw new Error(
        'REPLACE_COMPONENT may only activate OBJECT-linked immutable revisions'
      );
    }
    if (op.linkedAssetKey === PRODUCT_MODEL_ROOT_ASSET_KEY) {
      throw new Error(
        'REPLACE_COMPONENT must not target the reserved OBJECT/root mirror key'
      );
    }
    const link = linkedAssets.find(
      (asset) => asset.role === 'OBJECT' && asset.key === op.linkedAssetKey
    );
    if (!link) {
      throw new Error(
        `REPLACE_COMPONENT references missing OBJECT link "${op.linkedAssetKey}"`
      );
    }
    const existing = objectReplacements.findIndex(
      (entry) => entry.targetKey === op.targetKey
    );
    const next: ActiveObjectReplacement = {
      targetKey: op.targetKey,
      linkedAssetKey: op.linkedAssetKey,
      objectAssetRevisionId: link.assetRevisionId,
    };
    if (existing >= 0) objectReplacements[existing] = next;
    else objectReplacements.push(next);
  };

  const applyMaterial = (op: {
    targetKey: string;
    materialAssetRevisionId: string;
    materialSlot?: string;
  }) => {
    const materialAssetRevisionId = op.materialAssetRevisionId.trim();
    if (!materialAssetRevisionId) {
      throw new Error('SET_MATERIAL requires materialAssetRevisionId');
    }
    if (materialLinks.length > 0) {
      const allowed = materialLinks.some(
        (link) => link.assetRevisionId === materialAssetRevisionId
      );
      if (!allowed) {
        throw new Error(
          `SET_MATERIAL materialAssetRevisionId "${materialAssetRevisionId}" is outside this ProductModel MATERIAL registry`
        );
      }
    }
    const existing = materialAssignments.findIndex(
      (entry) => entry.targetKey === op.targetKey
    );
    const next: ActiveMaterialAssignment = {
      targetKey: op.targetKey,
      ...(op.materialSlot ? { materialSlot: op.materialSlot } : {}),
      materialAssetRevisionId,
    };
    if (existing >= 0) materialAssignments[existing] = next;
    else materialAssignments.push(next);
  };

  for (const setup of input.staticSetup ?? []) {
    if (setup.operation === 'REPLACE_COMPONENT') {
      applyReplace(setup);
      continue;
    }
    if (setup.operation === 'SET_MATERIAL') {
      applyMaterial(setup);
    }
  }

  const selection = input.selection ?? {};
  for (const binding of input.bindings ?? []) {
    if (selection[binding.choiceKey] !== binding.choiceValueKey) {
      continue;
    }
    if (binding.operation === 'REPLACE_COMPONENT') {
      applyReplace(binding);
      continue;
    }
    if (binding.operation === 'SET_MATERIAL') {
      applyMaterial(binding);
    }
  }

  const objectAssetRevisionIds = [
    rootObjectAssetRevisionId,
    ...objectReplacements.map((entry) => entry.objectAssetRevisionId),
  ].filter((id, index, all) => all.indexOf(id) === index);

  const materialAssetRevisionIds = materialAssignments
    .map((entry) => entry.materialAssetRevisionId)
    .filter((id, index, all) => all.indexOf(id) === index);

  const textureAssetRevisionIds: string[] = [];
  const textureMap = input.textureRevisionsByMaterialRevisionId ?? {};
  for (const materialRevisionId of materialAssetRevisionIds) {
    for (const textureRevisionId of textureMap[materialRevisionId] ?? []) {
      if (!textureAssetRevisionIds.includes(textureRevisionId)) {
        textureAssetRevisionIds.push(textureRevisionId);
      }
    }
  }

  const structure: Record<string, string> = {};
  for (const entry of objectReplacements) {
    structure[entry.targetKey] = entry.objectAssetRevisionId;
  }

  const rootSurfaces: DerivedVisualState['rootSurfaces'] = {};
  for (const entry of materialAssignments) {
    rootSurfaces[entry.targetKey] = {
      materialAssetRevisionId: entry.materialAssetRevisionId,
      ...(entry.materialSlot ? { materialSlot: entry.materialSlot } : {}),
    };
  }

  return {
    rootObjectAssetRevisionId,
    structure,
    rootSurfaces,
    assetUniverse,
    activeAssets: {
      objectAssetRevisionIds,
      objectReplacements,
      materialAssetRevisionIds,
      materialAssignments,
      textureAssetRevisionIds,
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

export function setMaterialBindingFromEffectValue(
  value: unknown
): SetMaterialValue {
  return parseSetMaterialValue(value);
}

export {
  isReplaceComponentValue,
  parseReplaceComponentValue,
  isSetMaterialValue,
  parseSetMaterialValue,
};
