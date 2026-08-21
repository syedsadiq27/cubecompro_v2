/**
 * Product configuration kernel contract (Commit 1).
 *
 * Runtime / domain selections use semantic keys scoped to a ProductRevision.
 * DB ids are persistence-only.
 *
 * Defaults initialize Selection; they are never implicit validation state.
 * Required completeness: every required Choice has exactly one ChoiceValue.
 * ChoiceValue.metadata is descriptive only — never validation, visual, or commerce.
 */

export type ChoiceKey = string;
export type ChoiceValueKey = string;

export type Selection = Record<ChoiceKey, ChoiceValueKey>;

/** V1 kernel authoring: discrete single-select only. */
export const KERNEL_AUTHORING_CHOICE_TYPE = 'SELECT' as const;

export type KernelAuthoringChoiceType = typeof KERNEL_AUTHORING_CHOICE_TYPE;

/** Legacy AttributeType values retained in DB; must not be created by new authoring. */
export const LEGACY_CHOICE_TYPES = [
  'MULTI_SELECT',
  'BOOLEAN',
  'NUMBER',
  'TEXT',
] as const;

export type LegacyChoiceType = (typeof LEGACY_CHOICE_TYPES)[number];

/**
 * Metadata keys that encode validation, visual, or commerce semantics.
 * Descriptive keys (swatchLabel, description, …) remain allowed.
 */
export const FORBIDDEN_CHOICE_VALUE_METADATA_KEYS = [
  'mesh',
  'material',
  'modelId',
  'shopifyVariantId',
  'sku',
  'price',
  'priceDelta',
  'inventory',
  'requires',
  'forbids',
  'condition',
  'effect',
] as const;

export type ChoiceDefaultSpec = {
  key: ChoiceKey;
  defaultValueKey?: ChoiceValueKey | null;
};

export type ChoiceRequiredSpec = {
  key: ChoiceKey;
  required: boolean;
};

/**
 * Apply Choice.defaultValue as initialization only.
 * Does not imply that `{}` validates as the defaults.
 */
export function initializeSelection(
  choices: readonly ChoiceDefaultSpec[]
): Selection {
  const selection: Selection = {};
  for (const choice of choices) {
    if (choice.defaultValueKey) {
      selection[choice.key] = choice.defaultValueKey;
    }
  }
  return selection;
}

/**
 * complete(selection) = every required Choice has exactly one ChoiceValue.
 * Optional Choices may be absent.
 */
export function isSelectionComplete(
  selection: Selection,
  choices: readonly ChoiceRequiredSpec[]
): boolean {
  return choices.every((choice) => {
    if (!choice.required) return true;
    const value = selection[choice.key];
    return typeof value === 'string' && value.length > 0;
  });
}

export function isKernelAuthoringChoiceType(
  type: string
): type is KernelAuthoringChoiceType {
  return type === KERNEL_AUTHORING_CHOICE_TYPE;
}

export function assertKernelAuthoringChoiceType(type: string): void {
  if (!isKernelAuthoringChoiceType(type)) {
    throw new Error(
      `Kernel authoring accepts ${KERNEL_AUTHORING_CHOICE_TYPE} only; refused ${type}`
    );
  }
}

export function findForbiddenChoiceValueMetadataKeys(
  metadata: Record<string, unknown> | null | undefined
): string[] {
  if (!metadata || typeof metadata !== 'object') return [];
  const forbidden = new Set<string>(FORBIDDEN_CHOICE_VALUE_METADATA_KEYS);
  return Object.keys(metadata).filter((key) => forbidden.has(key));
}

export function assertDescriptiveChoiceValueMetadata(
  metadata: Record<string, unknown> | null | undefined
): void {
  const bad = findForbiddenChoiceValueMetadataKeys(metadata);
  if (bad.length > 0) {
    throw new Error(
      `ChoiceValue.metadata is descriptive only; forbidden keys: ${bad.join(', ')}`
    );
  }
}
