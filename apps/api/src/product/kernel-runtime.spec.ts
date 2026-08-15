import {
  deriveAvailability,
  formatValidationIssues,
  validateSelection,
  type KernelChoice,
  type KernelConstraint,
  type Selection,
} from './kernel-runtime';

describe('kernel-runtime', () => {
  const choices: KernelChoice[] = [
    {
      key: 'material',
      required: true,
      values: [{ key: 'leather' }, { key: 'fabric' }],
    },
    {
      key: 'color',
      required: true,
      values: [{ key: 'white' }, { key: 'black' }],
    },
  ];

  const constraints: KernelConstraint[] = [
    {
      id: 'c1',
      terms: [
        { choiceKey: 'material', choiceValueKey: 'leather' },
        { choiceKey: 'color', choiceValueKey: 'white' },
      ],
    },
  ];

  it('distinguishes validation codes', () => {
    expect(
      validateSelection({ nope: 'x' }, choices, constraints).issues[0]?.code
    ).toBe('unknown_choice');
    expect(
      validateSelection({ material: 'suede' }, choices, constraints).issues[0]
        ?.code
    ).toBe('unknown_value');
    expect(
      validateSelection({ material: 'white' }, choices, constraints).issues[0]
        ?.code
    ).toBe('value_wrong_choice');
    expect(
      validateSelection(
        { material: 'leather', color: 'white' },
        choices,
        constraints
      ).issues[0]?.code
    ).toBe('violated_constraint');
  });

  it('uses replacement semantics for availability', () => {
    const selection: Selection = { material: 'leather', color: 'black' };
    const availability = deriveAvailability(selection, choices, constraints);
    expect(availability.color.white).toBe(false);
    expect(availability.color.black).toBe(true);
  });

  it('formats stable violation codes', () => {
    const result = validateSelection(
      { material: 'leather', color: 'white' },
      choices,
      constraints
    );
    expect(formatValidationIssues(result.issues)).toContain(
      'violated_constraint:material=leather&color=white'
    );
  });
});
