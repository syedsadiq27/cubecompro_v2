jest.mock('@repo/commerce-medusa', () => ({
  createMedusaCommerceRuntime: jest.fn((options: {
    resolveConnection: (id: string) => Promise<{
      baseUrl: string;
      publishableApiKey: string;
    }>;
    fetchImpl?: typeof fetch;
  }) => ({
    fetchState: async (resolved: {
      externalReference: { id: string };
      integrationConnectionId: string;
    }) => {
      const connection = await options.resolveConnection(
        resolved.integrationConnectionId
      );
      const response = await (options.fetchImpl ?? fetch)(
        `${connection.baseUrl}/store/product-variants?id=${resolved.externalReference.id}`,
        {
          headers: {
            'x-publishable-api-key': connection.publishableApiKey,
          },
        }
      );
      if (!(response as Response).ok) {
        return {
          sellability: { status: 'UNSELLABLE', reason: 'PROVIDER_BLOCKED' },
        };
      }
      return {
        sellability: { status: 'SELLABLE' },
        price: { amount: '12', currencyCode: 'USD' },
      };
    },
    createCart: async () => {
      throw new Error('not used');
    },
    addCartLine: async () => undefined,
    startCheckout: async () => {
      throw new Error('not used');
    },
  })),
}));

import { createMedusaCommerceRuntime } from '@repo/commerce-medusa';
import {
  createCommerceRuntime,
  UnsupportedCommerceProviderError,
} from './create-commerce-runtime';

describe('createCommerceRuntime', () => {
  it('routes cubecom through the commerce-medusa factory only', async () => {
    const fetchImpl = jest.fn(async () => {
      return { ok: true, status: 200, json: async () => ({}) } as Response;
    });

    const runtime = createCommerceRuntime(
      {
        id: 'conn_1',
        provider: 'cubecom',
        accessToken: '',
        externalAccountId: 'store_demo',
        apiVersion: '2026-07',
        config: {
          baseUrl: 'http://localhost:9000',
          publishableApiKey: 'pk_test',
          regionId: 'reg_test',
        },
      },
      { fetchImpl }
    );

    const state = await runtime.fetchState({
      provider: 'cubecom',
      integrationConnectionId: 'conn_1',
      externalReference: { type: 'VARIANT', id: 'variant_1' },
    });

    expect(createMedusaCommerceRuntime).toHaveBeenCalled();
    expect(state.sellability).toEqual({ status: 'SELLABLE' });
    expect(fetchImpl).toHaveBeenCalled();
    expect(JSON.stringify(state)).not.toMatch(/medusa/i);
  });

  it('rejects non-cubecom providers at the factory boundary', () => {
    expect(() =>
      createCommerceRuntime({
        id: 'conn_shop',
        provider: 'shopify',
        accessToken: 'shpat_x',
        externalAccountId: 'shop.myshopify.com',
        apiVersion: '2026-07',
      })
    ).toThrow(UnsupportedCommerceProviderError);
  });

  it('prefers explicit config over legacy accessToken JSON', async () => {
    const fetchImpl = jest.fn(async () => {
      return { ok: true, status: 200, json: async () => ({}) } as Response;
    });

    const runtime = createCommerceRuntime(
      {
        id: 'conn_2',
        provider: 'cubecom',
        accessToken: JSON.stringify({
          baseUrl: 'http://legacy:9000',
          publishableApiKey: 'pk_legacy',
        }),
        externalAccountId: 'default',
        apiVersion: '2026-07',
        config: {
          baseUrl: 'http://explicit:9000',
          publishableApiKey: 'pk_explicit',
        },
      },
      { fetchImpl }
    );

    await runtime.fetchState({
      provider: 'cubecom',
      integrationConnectionId: 'conn_2',
      externalReference: { type: 'VARIANT', id: 'variant_1' },
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      'http://explicit:9000/store/product-variants?id=variant_1',
      expect.objectContaining({
        headers: { 'x-publishable-api-key': 'pk_explicit' },
      })
    );
  });
});
