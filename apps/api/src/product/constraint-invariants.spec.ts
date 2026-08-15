import {
  assertConstraintValueSet,
  assertNoDuplicateConstraint,
  constraintSignature,
  type ConstraintValueRef,
} from './constraint-invariants';

function ref(
  partial: Partial<ConstraintValueRef> &
    Pick<ConstraintValueRef, 'id' | 'key' | 'choiceId' | 'choiceKey'>
): ConstraintValueRef {
  return {
    productRevisionId: 'rev_1',
    ...partial,
  };
}

describe('constraint-invariants', () => {
  const leather = ref({
    id: 'v1',
    key: 'leather',
    choiceId: 'material',
    choiceKey: 'material',
  });
  const white = ref({
    id: 'v2',
    key: 'white',
    choiceId: 'color',
    choiceKey: 'color',
  });
  const red = ref({
    id: 'v3',
    key: 'red',
    choiceId: 'color',
    choiceKey: 'color',
  });

  it('requires at least two terms', () => {
    expect(() => assertConstraintValueSet('rev_1', [leather])).toThrow(
      /at least 2/
    );
  });

  it('rejects cross-revision values', () => {
    expect(() =>
      assertConstraintValueSet('rev_1', [
        leather,
        { ...white, productRevisionId: 'rev_other' },
      ])
    ).toThrow(/not on product revision/);
  });

  it('rejects two values from the same Choice', () => {
    expect(() => assertConstraintValueSet('rev_1', [white, red])).toThrow(
      /at most one ChoiceValue per Choice/
    );
  });

  it('accepts a valid mutually exclusive pair', () => {
    expect(() =>
      assertConstraintValueSet('rev_1', [leather, white])
    ).not.toThrow();
  });

  it('detects semantic duplicates regardless of term order', () => {
    expect(constraintSignature([leather, white])).toBe(
      constraintSignature([white, leather])
    );
    expect(() =>
      assertNoDuplicateConstraint(
        [white, leather],
        [[leather, white]]
      )
    ).toThrow(/Duplicate constraint/);
  });
});
