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

export type GraphConstraintTerm = {
  constraintId: string;
  choiceValueId: string;
  choiceKey?: string | null;
  choiceValueKey?: string | null;
};

export type GraphConstraint = {
  id: string;
  productRevisionId: string;
  terms: GraphConstraintTerm[];
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
  constraints: GraphConstraint[];
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
  status?: string;
  metadataUrl?: string | null;
  nodeCount?: number | null;
  meshCount?: number | null;
  materialCount?: number | null;
};

export type ParsedObjectNode = {
  name: string;
  path: string;
  type: 'mesh' | 'group' | 'node';
  materialSlots: number[];
  materialNames?: string[];
  children: ParsedObjectNode[];
};

export type ParsedObjectMetadata = {
  metadataVersion: number;
  assetName: string;
  format: 'glb' | 'gltf';
  nodes: ParsedObjectNode[];
  materials: Array<{ index: number; name: string }>;
  animations: string[];
  stats: {
    nodeCount: number;
    meshCount: number;
    materialCount: number;
    animationCount: number;
  };
};

export type GraphVersionSummary = {
  id: string;
  version?: number;
  status: string;
};

/**
 * Canonical Storefront Runtime Published Revision Artifact Contract.
 * Invariant: productId, graphVersionId, sceneVersionId, and publishedRevisionId MUST remain distinct concepts.
 */
export type PublishedRevision = {
  productId: string;
  graphVersionId: string;
  sceneVersionId: string;
  publishedRevisionId: string;
  publishedAt: string;
  graph: GraphDetail;
  rules: GraphRule[];
  variants: GraphVariant[];
  visualEffects: GraphVisualEffect[];
  environmentPreset?: string;
};

