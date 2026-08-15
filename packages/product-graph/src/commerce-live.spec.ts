import {
  canPurchase,
  toResolvedCommerce,
  type CommerceState,
} from './commerce-live';
import type { CommerceResolution } from './commerce';

const resolved: CommerceResolution = {
  status: 'RESOLVED',
  provider: 'SHOPIFY',
  integrationConnectionId: 'conn-1',
  externalReference: { type: 'VARIANT', id: 'gid://shopify/ProductVariant/1' },
};

const unmapped: CommerceResolution = { status: 'UNMAPPED' };

const sellable: CommerceState = {
  sellability: { status: 'SELLABLE' },
  inventory: { available: 0 },
};

const unsellable: CommerceState = {
  sellability: { status: 'UNSELLABLE', reason: 'OUT_OF_STOCK' },
  inventory: { available: 0 },
};

describe('commerce live-state contract', () => {
  it('toResolvedCommerce requires RESOLVED + integrationConnectionId', () => {
    expect(
      toResolvedCommerce({
        resolution: { ...resolved, integrationConnectionId: undefined },
      })
    ).toBeNull();

    expect(toResolvedCommerce({ resolution: unmapped })).toBeNull();

    expect(
      toResolvedCommerce({
        resolution: { ...resolved, integrationConnectionId: undefined },
        integrationConnectionId: 'conn-arg',
      })
    ).toEqual({
      provider: 'SHOPIFY',
      integrationConnectionId: 'conn-arg',
      externalReference: resolved.externalReference,
    });

    expect(toResolvedCommerce({ resolution: resolved })).toEqual({
      provider: 'SHOPIFY',
      integrationConnectionId: 'conn-1',
      externalReference: resolved.externalReference,
    });
  });

  it('canPurchase requires valid+complete+RESOLVED+SELLABLE', () => {
    expect(
      canPurchase({
        evaluation: { valid: true, complete: true },
        resolution: resolved,
        commerceState: sellable,
      })
    ).toBe(true);

    expect(
      canPurchase({
        evaluation: { valid: true, complete: false },
        resolution: resolved,
        commerceState: sellable,
      })
    ).toBe(false);

    expect(
      canPurchase({
        evaluation: { valid: false, complete: true },
        resolution: resolved,
        commerceState: sellable,
      })
    ).toBe(false);

    expect(
      canPurchase({
        evaluation: { valid: true, complete: true },
        resolution: unmapped,
        commerceState: sellable,
      })
    ).toBe(false);

    expect(
      canPurchase({
        evaluation: { valid: true, complete: true },
        resolution: resolved,
        commerceState: unsellable,
      })
    ).toBe(false);
  });

  it('inventory zero does not alone block purchase when SELLABLE', () => {
    expect(
      canPurchase({
        evaluation: { valid: true, complete: true },
        resolution: resolved,
        commerceState: {
          sellability: { status: 'SELLABLE' },
          inventory: { available: 0 },
        },
      })
    ).toBe(true);
  });
});
