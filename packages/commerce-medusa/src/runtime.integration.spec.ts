import { createMedusaCommerceRuntime } from './runtime';

const enabled = process.env['COMMERCE_MEDUSA_INTEGRATION'] === '1';

function readIntegrationEnv() {
  return {
    baseUrl: process.env['MEDUSA_BASE_URL'] ?? 'http://localhost:9000',
    publishableApiKey: process.env['MEDUSA_PUBLISHABLE_KEY'] ?? '',
    variantId: process.env['MEDUSA_VARIANT_ID'] ?? '',
    regionId: process.env['MEDUSA_REGION_ID'],
  };
}

(enabled ? describe : describe.skip)('commerce-medusa integration', () => {
  it('fetchState against apps/commerce returns CommerceState only', async () => {
    const { baseUrl, publishableApiKey, variantId, regionId } =
      readIntegrationEnv();

    expect(publishableApiKey.length).toBeGreaterThan(0);
    expect(variantId.length).toBeGreaterThan(0);

    const runtime = createMedusaCommerceRuntime({
      resolveConnection: async () => ({
        baseUrl,
        publishableApiKey,
        regionId,
      }),
    });

    const state = await runtime.fetchState({
      provider: 'cubecom',
      integrationConnectionId: 'integration-test',
      externalReference: { type: 'VARIANT', id: variantId },
    });

    expect(
      state.sellability.status === 'SELLABLE' ||
        state.sellability.status === 'UNSELLABLE'
    ).toBe(true);
    expect(JSON.stringify(state)).not.toMatch(
      /product_variants|calculated_price|medusa/i
    );
  });
});
