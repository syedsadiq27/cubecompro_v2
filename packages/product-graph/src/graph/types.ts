export type GraphChoiceValue = {
  id: string;
  key: string;
  name: string;
  sortOrder: number;
};

export type GraphChoice = {
  id: string;
  key: string;
  name: string;
  type: string;
  required: boolean;
  sortOrder: number;
  values: GraphChoiceValue[];
};

/** @deprecated Use GraphChoiceValue */
export type GraphAttributeValue = GraphChoiceValue;
/** @deprecated Use GraphChoice */
export type GraphAttribute = GraphChoice;

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

export type GraphModelLinkedAsset = {
  id: string;
  role: string;
  key: string;
  assetRevisionId: string;
};

export type GraphModel = {
  id: string;
  key: string;
  name: string;
  /** Parent ObjectAsset id (library identity). */
  assetId: string;
  /** Exact immutable ObjectAssetRevision pin. */
  objectAssetRevisionId: string;
  /** Typed multi-asset universe for this model (4B). */
  linkedAssets: GraphModelLinkedAsset[];
  targets: GraphTarget[];
  /** Always-on ProductModel static setup (4E.1 visual stack). */
  visualSetups?: GraphVisualSetup[];
};

export type GraphVisualSetup = {
  id: string;
  productModelId: string;
  modelTargetId: string;
  operation: string;
  valueJson: string;
  sortOrder?: number;
};

export type GraphVisualEffect = {
  id: string;
  choiceValueId: string;
  modelTargetId: string;
  operation: string;
  valueJson: string;
};

export type GraphVariantSelection = {
  id: string;
  choiceId: string;
  choiceValueId: string;
};

export type GraphVariant = {
  id: string;
  provider: string;
  externalId: string;
  sku?: string | null;
  selections?: GraphVariantSelection[];
};

export type GraphCommerceMappingTerm = {
  choiceValueId: string;
  choiceKey?: string | null;
  choiceValueKey?: string | null;
};

export type GraphCommerceMapping = {
  id: string;
  identitySignature: string;
  externalType: string;
  externalId: string;
  sku?: string | null;
  terms: GraphCommerceMappingTerm[];
};

export type GraphCommerceMappingSet = {
  id: string;
  provider: string;
  identityChoices: Array<{
    choiceId: string;
    choiceKey?: string | null;
    sortOrder: number;
  }>;
  mappings: GraphCommerceMapping[];
  domainJson: string;
};

export type GraphDetail = {
  id: string;
  version: number;
  status: string;
  publishedAt?: string | null;
  graphUri?: string | null;
  choices: GraphChoice[];
  rules: GraphRule[];
  constraints: GraphConstraint[];
  models: GraphModel[];
  visualEffects: GraphVisualEffect[];
  variants: GraphVariant[];
  commerceMappingSets?: GraphCommerceMappingSet[];
};

export type GraphSessionAuth = {
  token: string;
  apiUrl: string;
  productRevisionId?: string;
  /** @deprecated Use productRevisionId */
  graphVersionId?: string;
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
 * Invariant: productId, productRevisionId, sceneVersionId, and publishedRevisionId MUST remain distinct concepts.
 */
export type PublishedRevision = {
  productId: string;
  productRevisionId: string;
  sceneVersionId: string;
  publishedRevisionId: string;
  publishedAt: string;
  graph: GraphDetail;
  rules: GraphRule[];
  variants: GraphVariant[];
  visualEffects: GraphVisualEffect[];
  environmentPreset?: string;
};
