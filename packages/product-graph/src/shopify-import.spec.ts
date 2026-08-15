import {
  planShopifyProductImport,
  shopifyLabelToSemanticKey,
  ShopifyImportError,
} from './shopify-import';
import { resolveCommerce } from './commerce';

const frameFabricProduct = {
  id: 9001,
  title: 'Studio Chair',
  handle: 'studio-chair',
  options: [
    { name: 'Frame', values: ['Walnut', 'Oak'] },
    { name: 'Fabric', values: ['Beige', 'Black'] },
  ],
  variants: [
    { id: 123, sku: 'WAL-BEI', option1: 'Walnut', option2: 'Beige' },
    { id: 124, sku: 'WAL-BLK', option1: 'Walnut', option2: 'Black' },
    { id: 125, sku: 'OAK-BEI', option1: 'Oak', option2: 'Beige' },
  ],
};

describe('planShopifyProductImport', () => {
  it('maps options/values/variants without inventing constraints', () => {
    const plan = planShopifyProductImport(frameFabricProduct);
    expect(plan.identityChoiceKeys).toEqual(['frame', 'fabric']);
    expect(plan.choices).toEqual([
      {
        key: 'frame',
        name: 'Frame',
        values: [
          { key: 'walnut', name: 'Walnut' },
          { key: 'oak', name: 'Oak' },
        ],
      },
      {
        key: 'fabric',
        name: 'Fabric',
        values: [
          { key: 'beige', name: 'Beige' },
          { key: 'black', name: 'Black' },
        ],
      },
    ]);
    expect(plan.mappings).toHaveLength(3);
    expect(plan.mappings.map((m) => m.externalId)).toEqual([
      '123',
      '124',
      '125',
    ]);
  });

  it('resolves mapped selections and leaves Oak+Black UNMAPPED', () => {
    const plan = planShopifyProductImport(frameFabricProduct);
    const mappingSet = {
      productRevisionId: 'rev',
      provider: 'shopify',
      identityChoiceKeys: plan.identityChoiceKeys,
      mappings: plan.mappings.map((mapping) => ({
        identity: Object.fromEntries(
          mapping.terms.map((term) => [term.choiceKey, term.valueKey])
        ),
        externalReference: {
          type: 'VARIANT' as const,
          id: mapping.externalId,
          ...(mapping.sku ? { sku: mapping.sku } : {}),
        },
      })),
    };

    expect(
      resolveCommerce({
        selection: { frame: 'walnut', fabric: 'beige' },
        mappingSet,
      })
    ).toEqual({
      status: 'RESOLVED',
      provider: 'shopify',
      externalReference: { type: 'VARIANT', id: '123', sku: 'WAL-BEI' },
    });

    expect(
      resolveCommerce({
        selection: { frame: 'oak', fabric: 'black' },
        mappingSet,
      })
    ).toEqual({ status: 'UNMAPPED' });
  });

  it('supports Title/Default Title as empty identityChoiceKeys', () => {
    const plan = planShopifyProductImport({
      id: 42,
      title: 'Fixed SKU Tee',
      options: [{ name: 'Title', values: ['Default Title'] }],
      variants: [{ id: 999, sku: 'TEE-1', option1: 'Default Title' }],
    });
    expect(plan.identityChoiceKeys).toEqual([]);
    expect(plan.mappings).toEqual([
      { terms: [], externalId: '999', sku: 'TEE-1' },
    ]);
    expect(
      resolveCommerce({
        selection: {},
        mappingSet: {
          productRevisionId: 'rev',
          provider: 'shopify',
          identityChoiceKeys: [],
          mappings: [
            {
              identity: {},
              externalReference: { type: 'VARIANT', id: '999', sku: 'TEE-1' },
            },
          ],
        },
      }).status
    ).toBe('RESOLVED');
  });

  it('rejects duplicate variant option combinations via normalize', () => {
    expect(() =>
      planShopifyProductImport({
        ...frameFabricProduct,
        variants: [
          ...frameFabricProduct.variants,
          { id: 126, option1: 'Walnut', option2: 'Beige' },
        ],
      })
    ).toThrow(ShopifyImportError);
  });

  it('derives stable semantic keys', () => {
    expect(shopifyLabelToSemanticKey('Walnut Wood')).toBe('walnut-wood');
  });
});
