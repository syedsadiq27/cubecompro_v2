import {
  mapMedusaVariantToCommerceState,
  pickVariantFromStoreResponse,
} from './map-state';

describe('mapMedusaVariantToCommerceState', () => {
  const observedAt = new Date('2026-01-01T00:00:00.000Z');

  it('maps missing variant to NOT_AVAILABLE', () => {
    expect(mapMedusaVariantToCommerceState(undefined, observedAt)).toEqual({
      sellability: { status: 'UNSELLABLE', reason: 'NOT_AVAILABLE' },
      observedAt,
    });
  });

  it('maps in-stock managed inventory to SELLABLE', () => {
    expect(
      mapMedusaVariantToCommerceState(
        {
          id: 'variant_1',
          manage_inventory: true,
          allow_backorder: false,
          inventory_quantity: 3,
          calculated_price: {
            calculated_amount: 19.5,
            currency_code: 'usd',
          },
        },
        observedAt
      )
    ).toEqual({
      price: { amount: '19.5', currencyCode: 'USD' },
      inventory: { available: 3, tracked: true },
      sellability: { status: 'SELLABLE' },
      observedAt,
    });
  });

  it('maps zero inventory without backorder to OUT_OF_STOCK', () => {
    expect(
      mapMedusaVariantToCommerceState(
        {
          id: 'variant_1',
          manage_inventory: true,
          allow_backorder: false,
          inventory_quantity: 0,
        },
        observedAt
      )
    ).toEqual({
      inventory: { available: 0, tracked: true },
      sellability: { status: 'UNSELLABLE', reason: 'OUT_OF_STOCK' },
      observedAt,
    });
  });

  it('keeps untracked inventory sellable', () => {
    expect(
      mapMedusaVariantToCommerceState(
        {
          id: 'variant_1',
          manage_inventory: false,
          inventory_quantity: null,
        },
        observedAt
      ).sellability
    ).toEqual({ status: 'SELLABLE' });
  });
});

describe('pickVariantFromStoreResponse', () => {
  it('finds variant by id without leaking other ids', () => {
    const picked = pickVariantFromStoreResponse(
      {
        product_variants: [
          { id: 'variant_a' },
          { id: 'variant_b', inventory_quantity: 2 },
        ],
      },
      'variant_b'
    );
    expect(picked?.id).toBe('variant_b');
    expect(picked?.inventory_quantity).toBe(2);
  });
});
