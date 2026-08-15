import {
  deriveAvailability,
  formatValidationIssues,
  validateSelection,
  type KernelChoice,
  type KernelConstraint,
  type KernelValidationResult,
  type Selection,
} from '@repo/product-graph';
import type { GraphChoice, GraphConstraint, GraphDetail } from '@repo/product-graph';

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

export type ConfiguratorPreviewState = {
  selection: Selection;
  validation: KernelValidationResult;
  availability: Record<string, Record<string, boolean>>;
  issueLabels: string[];
};

export function evaluateConfiguratorPreview(
  detail: GraphDetail,
  selection: Selection
): ConfiguratorPreviewState {
  const choices = toKernelChoices(detail.choices);
  const constraints = toKernelConstraints(detail.constraints);
  const validation = validateSelection(selection, choices, constraints);
  const availability = deriveAvailability(selection, choices, constraints);
  return {
    selection,
    validation,
    availability,
    issueLabels: formatValidationIssues(validation.issues),
  };
}

export function isChoiceValueAvailable(
  availability: Record<string, Record<string, boolean>>,
  choiceKey: string,
  valueKey: string
): boolean {
  return availability[choiceKey]?.[valueKey] !== false;
}
