import type { ResolvedCommerce } from '@repo/product-graph';

import { CommerceRuntimeNotSupportedError } from './errors';
import { createMedusaCommerceRuntime } from './runtime';

const resolved: ResolvedCommerce = {
  provider: 'cubecom',
  integrationConnectionId: 'conn_1',
  externalReference: { type: 'VARIANT', id: 'variant_1' },
};

describe('createMedusaCommerceRuntime', () => {
  it('fetchState returns normalized CommerceState from store HTTP', async () => {
    const fetchImpl = jest.fn(async () => {
      return {
        ok: true,
        status: 200,
        json: async () => ({
          product_variants: [
            {
              id: 'variant_1',
              manage_inventory: true,
              allow_backorder: false,
              inventory_quantity: 5,
              calculated_price: {
                calculated_amount: 10,
                currency_code: 'usd',
              },
            },
          ],
        }),
      } as Response;
    });

    const runtime = createMedusaCommerceRuntime({
      resolveConnection: async () => ({
        baseUrl: 'http://localhost:9000',
        publishableApiKey: 'pk_test',
        regionId: 'reg_1',
      }),
      fetchImpl,
    });

    const state = await runtime.fetchState(resolved);

    expect(state.sellability).toEqual({ status: 'SELLABLE' });
    expect(state.price).toEqual({ amount: '10', currencyCode: 'USD' });
    expect(state.inventory).toEqual({ available: 5, tracked: true });
    expect(JSON.stringify(state)).not.toContain('product_variants');
    expect(JSON.stringify(state)).not.toContain('variant_1');

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const calledUrl = String(fetchImpl.mock.calls[0]?.[0]);
    expect(calledUrl).toContain('/store/product-variants');
    expect(calledUrl).toContain('id=variant_1');
    expect(calledUrl).toContain('region_id=reg_1');
  });

  it('fetchState normalizes missing variant without throwing', async () => {
    const runtime = createMedusaCommerceRuntime({
      resolveConnection: async () => ({
        baseUrl: 'http://localhost:9000',
        publishableApiKey: 'pk_test',
      }),
      fetchImpl: async () =>
        ({
          ok: true,
          status: 200,
          json: async () => ({ product_variants: [] }),
        }) as Response,
    });

    await expect(runtime.fetchState(resolved)).resolves.toMatchObject({
      sellability: { status: 'UNSELLABLE', reason: 'NOT_AVAILABLE' },
    });
  });

  it('fetchState normalizes auth failure to PROVIDER_BLOCKED', async () => {
    const runtime = createMedusaCommerceRuntime({
      resolveConnection: async () => ({
        baseUrl: 'http://localhost:9000',
        publishableApiKey: 'pk_bad',
      }),
      fetchImpl: async () =>
        ({
          ok: false,
          status: 401,
          json: async () => ({ message: 'Unauthorized' }),
        }) as Response,
    });

    await expect(runtime.fetchState(resolved)).resolves.toMatchObject({
      sellability: { status: 'UNSELLABLE', reason: 'PROVIDER_BLOCKED' },
    });
  });

  it('stubs cart and checkout until a later phase', async () => {
    const runtime = createMedusaCommerceRuntime({
      resolveConnection: async () => ({
        baseUrl: 'http://localhost:9000',
        publishableApiKey: 'pk_test',
      }),
    });

    await expect(runtime.createCart({ connectionRef: 'conn_1' })).rejects.toBeInstanceOf(
      CommerceRuntimeNotSupportedError
    );
    await expect(
      runtime.addCartLine({
        cartRef: 'cart_1',
        line: { resolved, quantity: 1 },
      })
    ).rejects.toBeInstanceOf(CommerceRuntimeNotSupportedError);
    await expect(
      runtime.startCheckout({ cartRef: 'cart_1' })
    ).rejects.toBeInstanceOf(CommerceRuntimeNotSupportedError);
  });
});
