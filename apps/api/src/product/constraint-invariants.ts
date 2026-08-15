export type ConstraintValueRef = {
  id: string;
  key: string;
  choiceId: string;
  choiceKey: string;
  productRevisionId: string;
};

export function constraintSignature(values: ConstraintValueRef[]): string {
  return [...values]
    .map((value) => `${value.choiceKey}=${value.key}`)
    .sort()
    .join('&');
}

export function assertConstraintValueSet(
  productRevisionId: string,
  values: ConstraintValueRef[]
): void {
  if (values.length < 2) {
    throw new Error('Constraint requires at least 2 ChoiceValues');
  }

  const ids = new Set(values.map((value) => value.id));
  if (ids.size !== values.length) {
    throw new Error('Constraint ChoiceValues must be unique');
  }

  for (const value of values) {
    if (value.productRevisionId !== productRevisionId) {
      throw new Error(
        `ChoiceValue ${value.id} is not on product revision ${productRevisionId}`
      );
    }
  }

  const choiceIds = new Set(values.map((value) => value.choiceId));
  if (choiceIds.size !== values.length) {
    throw new Error(
      'Constraint may include at most one ChoiceValue per Choice'
    );
  }
}

export function assertNoDuplicateConstraint(
  next: ConstraintValueRef[],
  existing: ConstraintValueRef[][]
): void {
  const nextSig = constraintSignature(next);
  for (const terms of existing) {
    if (constraintSignature(terms) === nextSig) {
      throw new Error(`Duplicate constraint: ${nextSig}`);
    }
  }
}
