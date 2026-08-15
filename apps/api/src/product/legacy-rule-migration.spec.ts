import {
  buildMigrationReport,
  mapLegacyRuleToConstraint,
  migrationGatePasses,
  type ChoiceValueLookup,
} from './legacy-rule-migration';

const values: ChoiceValueLookup[] = [
  {
    attributeKey: 'material',
    valueKey: 'leather',
    choiceValueId: 'cv_leather',
    attributeId: 'attr_material',
  },
  {
    attributeKey: 'color',
    valueKey: 'white',
    choiceValueId: 'cv_white',
    attributeId: 'attr_color',
  },
  {
    attributeKey: 'color',
    valueKey: 'black',
    choiceValueId: 'cv_black',
    attributeId: 'attr_color',
  },
];

describe('legacy-rule-migration', () => {
  it('migrates condition.all + effect.forbid to Constraint terms', () => {
    const result = mapLegacyRuleToConstraint(
      {
        id: 'rule_1',
        productRevisionId: 'rev_1',
        productId: 'prod_1',
        condition: { all: [{ attr: 'material', eq: 'leather' }] },
        effect: { forbid: { attr: 'color', eq: 'white' } },
      },
      values
    );
    expect(result.status).toBe('migrated');
    if (result.status === 'migrated') {
      expect(result.constraint.choiceValueIds).toEqual([
        'cv_leather',
        'cv_white',
      ]);
    }
  });

  it('marks require effects unsupported', () => {
    const result = mapLegacyRuleToConstraint(
      {
        id: 'rule_2',
        productRevisionId: 'rev_1',
        condition: { all: [{ attr: 'material', eq: 'leather' }] },
        effect: { require: { attr: 'color', eq: 'white' } },
      },
      values
    );
    expect(result.status).toBe('unsupported');
  });

  it('marks unresolved values as failed', () => {
    const result = mapLegacyRuleToConstraint(
      {
        id: 'rule_3',
        productRevisionId: 'rev_1',
        condition: { all: [{ attr: 'material', eq: 'suede' }] },
        effect: { forbid: { attr: 'color', eq: 'white' } },
      },
      values
    );
    expect(result.status).toBe('failed');
  });

  it('passes cutover gate when all rules are migrated or unsupported', () => {
    const report = buildMigrationReport([
      mapLegacyRuleToConstraint(
        {
          id: 'a',
          productRevisionId: 'rev_1',
          condition: { all: [{ attr: 'material', eq: 'leather' }] },
          effect: { forbid: { attr: 'color', eq: 'white' } },
        },
        values
      ),
      mapLegacyRuleToConstraint(
        {
          id: 'b',
          productRevisionId: 'rev_1',
          condition: { all: [{ attr: 'material', eq: 'leather' }] },
          effect: { require: { attr: 'color', eq: 'black' } },
        },
        values
      ),
    ]);
    expect(migrationGatePasses(report)).toBe(true);
    expect(report.migrated).toBe(1);
    expect(report.unsupported).toBe(1);
  });
});
