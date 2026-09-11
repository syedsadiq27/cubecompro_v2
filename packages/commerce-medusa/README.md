# @repo/commerce-medusa — Phase 3

HTTP adapter that implements hosted `cubecom` live-state against `apps/commerce`.

## Scope (narrow)

```text
ResolvedCommerce
  → CommerceRuntime.fetchState()
  → Medusa Store HTTP API
  → normalized CommerceState
```

- Cart / checkout: stubbed (`CommerceRuntimeNotSupportedError`) until after the live-state checkpoint
- Catalog publish: not in this package for Phase 3
- No `@medusajs/*` imports — service boundary is HTTP only
- Medusa IDs / DTOs never appear in `CommerceState`

## Usage

```ts
import { createMedusaCommerceRuntime } from '@repo/commerce-medusa';

const runtime = createMedusaCommerceRuntime({
  resolveConnection: async (connectionRef) => {
    // Load engine-private fields from IntegrationConnection.configJson
    // for connectionRef (provider: "cubecom"). Never from Shopify accessToken.
    return {
      baseUrl: 'http://localhost:9000',
      publishableApiKey: 'pk_...',
      regionId: 'reg_...',
    };
  },
});

const state = await runtime.fetchState(resolvedCommerce);
```

Merchant UIs call CubeCom GraphQL (`resolveCommerceLive`) only:

```text
Browser → CubeCom API → commerce-core → commerce-medusa → Medusa HTTP
```

No merchant browser → Medusa path.

## Tests

```bash
yarn workspace @repo/commerce-medusa test
```

Optional live check against a running `apps/commerce`:

```bash
COMMERCE_MEDUSA_INTEGRATION=1 \
MEDUSA_PUBLISHABLE_KEY=pk_... \
MEDUSA_VARIANT_ID=variant_... \
MEDUSA_REGION_ID=reg_... \
yarn workspace @repo/commerce-medusa test:integration
```

## Disappearance test

Deleting this package must not require changes to `@repo/commerce-core`, `@repo/product-graph`, or `apps/api` contracts.
