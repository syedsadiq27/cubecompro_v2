export type Selection = Record<string, string>;

export type KernelChoiceValue = {
  key: string;
};

export type KernelChoice = {
  key: string;
  required: boolean;
  values: KernelChoiceValue[];
};

export type KernelConstraintTerm = {
  choiceKey: string;
  choiceValueKey: string;
};

export type KernelConstraint = {
  id?: string;
  terms: KernelConstraintTerm[];
};

export type ValidationIssueCode =
  | 'unknown_choice'
  | 'unknown_value'
  | 'value_wrong_choice'
  | 'missing_required'
  | 'violated_constraint';

export type ValidationIssue = {
  code: ValidationIssueCode;
  choiceKey?: string;
  choiceValueKey?: string;
  terms?: string[];
  message: string;
};

export type KernelValidationResult = {
  valid: boolean;
  issues: ValidationIssue[];
};

function isSelectionComplete(
  selection: Selection,
  choices: readonly KernelChoice[]
): boolean {
  return choices.every((choice) => {
    if (!choice.required) return true;
    const value = selection[choice.key];
    return typeof value === 'string' && value.length > 0;
  });
}

export function validateSelection(
  selection: Selection,
  choices: readonly KernelChoice[],
  constraints: readonly KernelConstraint[]
): KernelValidationResult {
  const issues: ValidationIssue[] = [];
  const choiceByKey = new Map(choices.map((choice) => [choice.key, choice]));

  for (const [choiceKey, choiceValueKey] of Object.entries(selection)) {
    const choice = choiceByKey.get(choiceKey);
    if (!choice) {
      issues.push({
        code: 'unknown_choice',
        choiceKey,
        message: `Unknown choice ${choiceKey}`,
      });
      continue;
    }
    const owned = choice.values.some((value) => value.key === choiceValueKey);
    if (owned) continue;

    const elsewhere = choices.find((candidate) =>
      candidate.values.some((value) => value.key === choiceValueKey)
    );
    if (elsewhere) {
      issues.push({
        code: 'value_wrong_choice',
        choiceKey,
        choiceValueKey,
        message: `Value ${choiceValueKey} does not belong to choice ${choiceKey}`,
      });
    } else {
      issues.push({
        code: 'unknown_value',
        choiceKey,
        choiceValueKey,
        message: `Unknown value ${choiceKey}=${choiceValueKey}`,
      });
    }
  }

  for (const choice of choices) {
    if (!choice.required) continue;
    const value = selection[choice.key];
    if (typeof value !== 'string' || value.length === 0) {
      issues.push({
        code: 'missing_required',
        choiceKey: choice.key,
        message: `Missing required choice ${choice.key}`,
      });
    }
  }

  for (const constraint of constraints) {
    if (constraint.terms.length < 2) continue;
    const violated = constraint.terms.every(
      (term) => selection[term.choiceKey] === term.choiceValueKey
    );
    if (violated) {
      const terms = constraint.terms.map(
        (term) => `${term.choiceKey}=${term.choiceValueKey}`
      );
      issues.push({
        code: 'violated_constraint',
        terms,
        message: `Violated constraint ${terms.join('&')}`,
      });
    }
  }

  return { valid: issues.length === 0, issues };
}

function unsetRequiredChoices(
  selection: Selection,
  choices: readonly KernelChoice[]
): KernelChoice[] {
  return choices.filter((choice) => {
    if (!choice.required) return false;
    const value = selection[choice.key];
    return typeof value !== 'string' || value.length === 0;
  });
}

function canExtendToValidComplete(
  selection: Selection,
  choices: readonly KernelChoice[],
  constraints: readonly KernelConstraint[]
): boolean {
  const structural = validateSelection(selection, choices, constraints);
  const blocking = structural.issues.filter(
    (issue) =>
      issue.code === 'unknown_choice' ||
      issue.code === 'unknown_value' ||
      issue.code === 'value_wrong_choice' ||
      issue.code === 'violated_constraint'
  );
  if (blocking.length > 0) return false;

  if (isSelectionComplete(selection, choices)) {
    return structural.valid;
  }

  const nextChoice = unsetRequiredChoices(selection, choices)[0];
  if (!nextChoice) {
    return structural.valid;
  }

  for (const value of nextChoice.values) {
    const candidate: Selection = {
      ...selection,
      [nextChoice.key]: value.key,
    };
    if (canExtendToValidComplete(candidate, choices, constraints)) {
      return true;
    }
  }
  return false;
}

export function deriveAvailability(
  selection: Selection,
  choices: readonly KernelChoice[],
  constraints: readonly KernelConstraint[]
): Record<string, Record<string, boolean>> {
  const availability: Record<string, Record<string, boolean>> = {};

  for (const choice of choices) {
    availability[choice.key] = {};
    for (const value of choice.values) {
      const candidate: Selection = {
        ...selection,
        [choice.key]: value.key,
      };
      availability[choice.key][value.key] = canExtendToValidComplete(
        candidate,
        choices,
        constraints
      );
    }
  }

  return availability;
}

export function formatValidationIssues(
  issues: readonly ValidationIssue[]
): string[] {
  return issues.map((issue) => {
    switch (issue.code) {
      case 'unknown_choice':
        return `unknown_choice:${issue.choiceKey}`;
      case 'unknown_value':
        return `unknown_value:${issue.choiceKey}=${issue.choiceValueKey}`;
      case 'value_wrong_choice':
        return `value_wrong_choice:${issue.choiceKey}=${issue.choiceValueKey}`;
      case 'missing_required':
        return `missing_required:${issue.choiceKey}`;
      case 'violated_constraint':
        return `violated_constraint:${(issue.terms ?? []).join('&')}`;
      default:
        return issue.message;
    }
  });
}
