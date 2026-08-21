export type ChoiceKey = string;
export type ChoiceValueKey = string;
export type VisualSelection = Record<ChoiceKey, ChoiceValueKey>;

export type VisualTarget = {
  id?: string;
  key: string;
  name?: string;
  nodePath: string;
  materialSlot?: string;
  targetType?: 'SURFACE' | 'STRUCTURAL' | string;
  description?: string;
};

export type MaterialBinding = {
  choiceKey: ChoiceKey;
  valueKey: ChoiceValueKey;
  targetKey: string;
  materialSlot?: string;
  operation: 'SET_MATERIAL';
  materialAssetRevisionId: string;
  effectId?: string;
};

export type VisibilityBinding = {
  choiceKey: ChoiceKey;
  valueKey: ChoiceValueKey;
  targetKey: string;
  operation: 'SET_VISIBILITY';
  visible: boolean;
  effectId?: string;
};

export type ReplaceComponentBinding = {
  choiceKey: ChoiceKey;
  valueKey: ChoiceValueKey;
  targetKey: string;
  operation: 'REPLACE_COMPONENT';
  linkedAssetKey: string;
  expectedRole: 'OBJECT';
  effectId?: string;
};

export type VisualBinding =
  | MaterialBinding
  | VisibilityBinding
  | ReplaceComponentBinding;

export type UnsupportedVisualEffect = {
  effectId: string;
  operation: string;
  reason: string;
};

export type VisualLinkedAsset = {
  id?: string;
  role:
    | 'OBJECT'
    | 'MATERIAL'
    | 'TEXTURE'
    | 'ENVIRONMENT'
    | 'SHADER'
    | 'ANIMATION';
  key: string;
  assetRevisionId: string;
};

export type VisualSetupOp =
  | {
      id?: string;
      targetKey: string;
      operation: 'SET_MATERIAL';
      materialAssetRevisionId: string;
      materialSlot?: string;
    }
  | {
      id?: string;
      targetKey: string;
      operation: 'SET_VISIBILITY';
      visible: boolean;
    }
  | {
      id?: string;
      targetKey: string;
      operation: 'REPLACE_COMPONENT';
      linkedAssetKey: string;
      expectedRole: 'OBJECT';
    };

export type VisualDocument = {
  productRevisionId: string;
  productModelId: string;
  assetId: string;
  rootObjectAssetRevisionId: string;
  linkedAssets: VisualLinkedAsset[];
  targets: VisualTarget[];
  /** Always-on ProductModel static setup. */
  setups: VisualSetupOp[];
  bindings: VisualBinding[];
  unsupported: UnsupportedVisualEffect[];
};

export type VisualAddressProperty = 'visibility' | 'material' | 'structure';

export type VisualAddress = {
  targetKey: string;
  property: VisualAddressProperty;
  materialSlot?: string;
};

export type VisualBaselineEntry = {
  materialReference?: unknown;
  visible?: boolean;
};

export type VisualBaseline = Record<string, VisualBaselineEntry>;

export type TargetVisualState = {
  materialAssetRevisionId?: string;
  visible?: boolean;
};

/**
 * Runtime projection for reconcile: package desired state + visibility overlay.
 * Not a second semantic derive — visibility is applied from SET_VISIBILITY bindings only.
 */
export type VisualState = {
  structure: Record<string, string>;
  rootSurfaces: Record<
    string,
    { materialAssetRevisionId: string; materialSlot?: string }
  >;
  targets: Record<string, TargetVisualState>;
};

export type NormalizeVisualModelInput = {
  id: string;
  assetId: string;
  objectAssetRevisionId?: string;
  linkedAssets?: VisualLinkedAsset[];
  targets: Array<{
    id: string;
    key: string;
    targetType?: string | null;
    nodePath?: string | null;
    materialSlot?: string | null;
  }>;
};

export type NormalizeVisualChoiceInput = {
  id: string;
  key: string;
  values: Array<{ id: string; key: string; name?: string }>;
};

export type NormalizeVisualEffectInput = {
  id: string;
  choiceValueId: string;
  modelTargetId: string;
  operation: string;
  valueJson: string;
};

export type NormalizeVisualSetupInput = {
  id: string;
  modelTargetId: string;
  operation: string;
  valueJson: string;
};

export type NormalizeVisualDocumentInput = {
  productRevisionId: string;
  model: NormalizeVisualModelInput;
  choices: NormalizeVisualChoiceInput[];
  visualEffects: NormalizeVisualEffectInput[];
  visualSetups?: NormalizeVisualSetupInput[];
};
