export type GraphAttributeValue = {
  id: string;
  key: string;
  name: string;
  sortOrder: number;
};

export type GraphAttribute = {
  id: string;
  key: string;
  name: string;
  type: string;
  required: boolean;
  sortOrder: number;
  values: GraphAttributeValue[];
};

export type GraphRule = {
  id: string;
  conditionJson: string;
  effectJson: string;
};

export type GraphTarget = {
  id: string;
  key: string;
  targetType: string;
  nodePath?: string | null;
  materialSlot?: string | null;
};

export type GraphModel = {
  id: string;
  key: string;
  name: string;
  assetId: string;
  targets: GraphTarget[];
};

export type GraphVisualEffect = {
  id: string;
  attributeValueId: string;
  modelTargetId: string;
  operation: string;
  valueJson: string;
};

export type GraphVariantSelection = {
  id: string;
  attributeId: string;
  attributeValueId: string;
};

export type GraphVariant = {
  id: string;
  provider: string;
  externalId: string;
  sku?: string | null;
  selections?: GraphVariantSelection[];
};

export type GraphDetail = {
  id: string;
  version: number;
  status: string;
  publishedAt?: string | null;
  graphUri?: string | null;
  attributes: GraphAttribute[];
  rules: GraphRule[];
  models: GraphModel[];
  visualEffects: GraphVisualEffect[];
  variants: GraphVariant[];
};

export type GraphSessionAuth = {
  token: string;
  apiUrl: string;
  graphVersionId: string;
};

export type GraphObjectAsset = {
  id: string;
  name: string;
  code: string;
  relativePath: string;
  url: string;
  included: boolean;
  visible: boolean;
};

export type GraphVersionSummary = {
  id: string;
  version?: number;
  status: string;
};
