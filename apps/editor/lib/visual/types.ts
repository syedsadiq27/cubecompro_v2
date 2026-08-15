export type ChoiceKey = string;
export type ChoiceValueKey = string;
export type VisualSelection = Record<ChoiceKey, ChoiceValueKey>;

export type VisualTarget = {
  id?: string;
  key: string;
  nodePath: string;
  materialSlot?: string;
};

export type MaterialBinding = {
  choiceKey: ChoiceKey;
  valueKey: ChoiceValueKey;
  targetKey: string;
  materialSlot?: string;
  operation: 'SET_MATERIAL';
  materialAssetId: string;
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

export type VisualBinding = MaterialBinding | VisibilityBinding;

export type UnsupportedVisualEffect = {
  effectId: string;
  operation: string;
  reason: string;
};

export type VisualDocument = {
  productRevisionId: string;
  productModelId: string;
  assetId: string;
  targets: VisualTarget[];
  bindings: VisualBinding[];
  unsupported: UnsupportedVisualEffect[];
};

export type VisualAddressProperty = 'visibility' | 'material';

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
  materialAssetId?: string;
  visible?: boolean;
};

export type VisualState = {
  targets: Record<string, TargetVisualState>;
};

export type NormalizeVisualModelInput = {
  id: string;
  assetId: string;
  targets: Array<{
    id: string;
    key: string;
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

export type NormalizeVisualDocumentInput = {
  productRevisionId: string;
  model: NormalizeVisualModelInput;
  choices: NormalizeVisualChoiceInput[];
  visualEffects: NormalizeVisualEffectInput[];
};
