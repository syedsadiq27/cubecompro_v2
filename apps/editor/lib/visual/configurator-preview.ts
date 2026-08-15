import {
  deriveAvailability,
  formatValidationIssues,
  isSelectionComplete,
  resolveCommerce,
  validateSelection,
  type CommerceMappingSet,
  type CommerceResolution,
  type KernelChoice,
  type KernelConstraint,
  type KernelValidationResult,
  type Selection,
} from '@repo/product-graph';
import type {
  GraphChoice,
  GraphConstraint,
  GraphDetail,
} from '@repo/product-graph';
import type { VisualDocument } from './types';

export function toKernelChoices(
  choices: readonly GraphChoice[]
): KernelChoice[] {
  return choices.map((choice) => ({
    key: choice.key,
    required: choice.required,
    values: choice.values.map((value) => ({ key: value.key })),
  }));
}

export function toKernelConstraints(
  constraints: readonly GraphConstraint[]
): KernelConstraint[] {
  return constraints
    .map((constraint) => ({
      id: constraint.id,
      terms: constraint.terms
        .filter(
          (term) =>
            typeof term.choiceKey === 'string' &&
            term.choiceKey.length > 0 &&
            typeof term.choiceValueKey === 'string' &&
            term.choiceValueKey.length > 0
        )
        .map((term) => ({
          choiceKey: term.choiceKey as string,
          choiceValueKey: term.choiceValueKey as string,
        })),
    }))
    .filter((constraint) => constraint.terms.length >= 2);
}

export type KernelValidityLabel = 'VALID' | 'INVALID';
export type KernelCompletenessLabel = 'COMPLETE' | 'INCOMPLETE';
export type CommerceResolutionLabel = 'RESOLVED' | 'UNMAPPED';
export type VisualStatusLabel =
  | 'NO MODEL'
  | 'NO BINDINGS'
  | 'NO EFFECT'
  | 'BOUND';

/** Presentation-only purchase line from known facts (no CommerceState invent). */
export type PurchasePreviewLabel =
  | 'UNAVAILABLE'
  | 'PROVIDER STATE NOT LOADED';

export type ConfiguratorLayerStatus = {
  validity: KernelValidityLabel;
  completeness: KernelCompletenessLabel;
  commerce: CommerceResolutionLabel;
  commerceResolution: CommerceResolution | null;
  purchase: PurchasePreviewLabel;
  visual: VisualStatusLabel;
};

export type ConfiguratorPreviewState = {
  selection: Selection;
  validation: KernelValidationResult;
  availability: Record<string, Record<string, boolean>>;
  issueLabels: string[];
  layers: ConfiguratorLayerStatus;
};

export function mappingSetFromGraphDetail(
  detail: GraphDetail
): CommerceMappingSet | null {
  const raw = detail.commerceMappingSets?.[0];
  if (!raw?.domainJson) return null;
  try {
    const parsed = JSON.parse(raw.domainJson) as CommerceMappingSet;
    if (
      !parsed ||
      typeof parsed !== 'object' ||
      !Array.isArray(parsed.identityChoiceKeys) ||
      !Array.isArray(parsed.mappings)
    ) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function evaluateVisualStatus(
  visualDocument: VisualDocument | null | undefined,
  selection: Selection
): VisualStatusLabel {
  if (!visualDocument) return 'NO MODEL';
  if (visualDocument.bindings.length === 0) return 'NO BINDINGS';
  const hits = visualDocument.bindings.filter(
    (binding) => selection[binding.choiceKey] === binding.valueKey
  );
  return hits.length > 0 ? 'BOUND' : 'NO EFFECT';
}

function purchasePreviewLabel(input: {
  valid: boolean;
  complete: boolean;
  commerce: CommerceResolutionLabel;
}): PurchasePreviewLabel {
  if (!input.valid || !input.complete || input.commerce === 'UNMAPPED') {
    return 'UNAVAILABLE';
  }
  return 'PROVIDER STATE NOT LOADED';
}

export function evaluateConfiguratorPreview(
  detail: GraphDetail,
  selection: Selection,
  visualDocument?: VisualDocument | null
): ConfiguratorPreviewState {
  const choices = toKernelChoices(detail.choices);
  const constraints = toKernelConstraints(detail.constraints);
  const validation = validateSelection(selection, choices, constraints);
  const availability = deriveAvailability(selection, choices, constraints);
  const complete = isSelectionComplete(selection, choices);

  const mappingSet = mappingSetFromGraphDetail(detail);
  let commerceResolution: CommerceResolution | null = null;
  let commerce: CommerceResolutionLabel = 'UNMAPPED';
  if (mappingSet) {
    commerceResolution = resolveCommerce({ selection, mappingSet });
    commerce =
      commerceResolution.status === 'RESOLVED' ? 'RESOLVED' : 'UNMAPPED';
  }

  const validity: KernelValidityLabel = validation.valid ? 'VALID' : 'INVALID';
  const completeness: KernelCompletenessLabel = complete
    ? 'COMPLETE'
    : 'INCOMPLETE';

  return {
    selection,
    validation,
    availability,
    issueLabels: formatValidationIssues(validation.issues),
    layers: {
      validity,
      completeness,
      commerce,
      commerceResolution,
      purchase: purchasePreviewLabel({
        valid: validation.valid,
        complete,
        commerce,
      }),
      visual: evaluateVisualStatus(visualDocument, selection),
    },
  };
}

export function isChoiceValueAvailable(
  availability: Record<string, Record<string, boolean>>,
  choiceKey: string,
  valueKey: string
): boolean {
  return availability[choiceKey]?.[valueKey] !== false;
}
