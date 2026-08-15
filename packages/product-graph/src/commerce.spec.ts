import {
  CommerceNormalizeError,
  canonicalizeCommerceIdentity,
  normalizeCommerceMappingSet,
} from './commerce';

const revisionChoices = [
  {
    key: 'frame',
    required: true,
    values: [{ key: 'walnut' }, { key: 'oak' }],
  },
  {
    key: 'warranty',
    required: false,
    values: [{ key: 'extended' }],
  },
  {
    key: 'stitching',
    required: true,
    values: [{ key: 'red' }, { key: 'blue' }],
  },
];

describe('normalizeCommerceMappingSet', () => {
  it('normalizes sparse optional terms to null', () => {
    const set = normalizeCommerceMappingSet({
      productRevisionId: 'rev-1',
      provider: 'shopify',
      identityChoiceKeys: ['frame', 'warranty'],
      revisionChoices,
      mappings: [
        {
          externalId: 'var-123',
          sku: 'SKU-WAL',
          terms: [{ choiceKey: 'frame', valueKey: 'walnut' }],
        },
      ],
    });

    expect(set).toEqual({
      productRevisionId: 'rev-1',
      provider: 'shopify',
      identityChoiceKeys: ['frame', 'warranty'],
      mappings: [
        {
          identity: { frame: 'walnut', warranty: null },
          externalReference: {
            type: 'VARIANT',
            id: 'var-123',
            sku: 'SKU-WAL',
          },
        },
      ],
    });
  });

  it('allows empty identityChoiceKeys with a single {} mapping', () => {
    const set = normalizeCommerceMappingSet({
      productRevisionId: 'rev-1',
      provider: 'shopify',
      identityChoiceKeys: [],
      revisionChoices,
      mappings: [{ externalId: 'only', terms: [] }],
    });
    expect(set.identityChoiceKeys).toEqual([]);
    expect(set.mappings[0]?.identity).toEqual({});
    expect(
      canonicalizeCommerceIdentity([], set.mappings[0]!.identity)
    ).toBe('[]');
  });

  it('rejects terms outside identityChoiceKeys', () => {
    expect(() =>
      normalizeCommerceMappingSet({
        productRevisionId: 'rev-1',
        provider: 'shopify',
        identityChoiceKeys: ['frame'],
        revisionChoices,
        mappings: [
          {
            externalId: 'x',
            terms: [
              { choiceKey: 'frame', valueKey: 'walnut' },
              { choiceKey: 'stitching', valueKey: 'red' },
            ],
          },
        ],
      })
    ).toThrow(CommerceNormalizeError);
  });

  it('rejects required identity Choice missing a term', () => {
    expect(() =>
      normalizeCommerceMappingSet({
        productRevisionId: 'rev-1',
        provider: 'shopify',
        identityChoiceKeys: ['frame', 'warranty'],
        revisionChoices,
        mappings: [
          {
            externalId: 'x',
            terms: [{ choiceKey: 'warranty', valueKey: 'extended' }],
          },
        ],
      })
    ).toThrow(/required identity Choice frame/);
  });

  it('rejects duplicate semantic identities', () => {
    expect(() =>
      normalizeCommerceMappingSet({
        productRevisionId: 'rev-1',
        provider: 'shopify',
        identityChoiceKeys: ['frame', 'warranty'],
        revisionChoices,
        mappings: [
          {
            externalId: 'a',
            terms: [{ choiceKey: 'frame', valueKey: 'walnut' }],
          },
          {
            externalId: 'b',
            terms: [{ choiceKey: 'frame', valueKey: 'walnut' }],
          },
        ],
      })
    ).toThrow(/Duplicate semantic CommerceIdentity/);
  });

  it('rejects identityChoiceKeys not on the revision', () => {
    expect(() =>
      normalizeCommerceMappingSet({
        productRevisionId: 'rev-1',
        provider: 'shopify',
        identityChoiceKeys: ['color'],
        revisionChoices,
        mappings: [],
      })
    ).toThrow(/not on product revision/);
  });

  it('rejects at most one value per Choice', () => {
    expect(() =>
      normalizeCommerceMappingSet({
        productRevisionId: 'rev-1',
        provider: 'shopify',
        identityChoiceKeys: ['frame'],
        revisionChoices,
        mappings: [
          {
            externalId: 'x',
            terms: [
              { choiceKey: 'frame', valueKey: 'walnut' },
              { choiceKey: 'frame', valueKey: 'oak' },
            ],
          },
        ],
      })
    ).toThrow(/at most one value per Choice/);
  });

  it('stores canonical signature as structured JSON text', () => {
    expect(
      canonicalizeCommerceIdentity(
        ['frame', 'warranty'],
        { frame: 'walnut', warranty: null }
      )
    ).toBe('[["frame","walnut"],["warranty",null]]');
  });
});
