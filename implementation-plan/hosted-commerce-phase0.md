> **Product-first map:** see [`README.md`](./README.md). This file freezes the **hosted CubeComPro Commerce** architectural contract (Phase 0). No implementation scaffolding until this contract is accepted.

Status: **Frozen (Phase 0 canon)**

Do not start Phase 1 (`packages/commerce-core`) or Phase 2 (`apps/commerce`) without this document.

Related frozen work: [`3-commerce-resolutions.md`](./3-commerce-resolutions.md) · [`3c-commerce-altered.md`](./3c-commerce-altered.md) (mapping + Shopify import).

---

# Hosted Commerce — Phase 0 Contract

## 1. Product ownership vs engine

CubeComPro **owns** the commerce product. Medusa (or any later engine) **implements** commerce infrastructure.

```text
CubeComPro Commerce
├── CubeComPro UX
├── CubeComPro APIs
├── CubeComPro tenant model
├── CubeComPro billing
├── CubeComPro product/configuration model
├── CubeComPro workflows
└── Engine (currently Medusa)
    ├── carts
    ├── orders
    ├── inventory
    ├── customers
    └── payments/fulfillment primitives
```

To the merchant this is **CubeComPro Commerce**, not “CubeComPro + Medusa.”

Analogy (with care): Auth0 under authentication, Stripe under payments — except Medusa is a **self-hosted / embedded engine** CubeComPro operates and extends, not a managed SaaS black box. CubeComPro still does **not** vendor Medusa core source.

```text
CubeComPro owns commerce capability
Medusa implements commerce infrastructure

CubeComPro extends Medusa
CubeComPro does not vendor Medusa
```

Differentiation lives in:

```text
ProductGraph → valid configuration → sellable identity → price/inventory → checkout
```

Not in reinventing order state machines, refunds, tax, or fulfillment cores.

---

## 2. Public providers vs private engine

```ts
type CommerceProvider =
  | 'cubecom'
  | 'shopify'
  | 'commercetools';
```

| Public `provider` | Meaning |
| --- | --- |
| `cubecom` | Hosted CubeComPro Commerce |
| `shopify` | Merchant-owned Shopify (BYO) |
| `commercetools` | Merchant-owned / intended CT path |

**Invariant:** persisted ProductGraph mappings use the public provider string. Never persist `"medusa"` as `provider`. Medusa is an implementation detail of a `cubecom` connection.

Engine fields (engine kind, base URL, store id, region id, credentials) live **only** on `IntegrationConnection` (or equivalent connection record). They do not belong in ProductGraph.

---

## 3. Mapping vs connection

**ProductGraph owns sellable identity.** A mapping carries:

```ts
{
  provider: 'cubecom',
  externalReference: /* opaque */,
  integrationConnectionId?: string, // explicit override only
}
```

Use opaque external references everywhere above adapters:

| Prefer | Avoid |
| --- | --- |
| `externalVariantRef` / opaque `externalId` | `medusaVariantId` |
| `externalOrderRef` | `medusaOrderId` |
| `externalCustomerRef` | engine-prefixed domain fields |

**Organization owns the commerce relationship** via connection(s).

```ts
type CommerceConnectionRef = string;

// Logical connection (suite / API)
{
  provider: 'cubecom',
  connectionRef: 'conn_xyz',
}

// Connection-private (never ProductGraph)
{
  engine: 'medusa',
  baseUrl: '...',
  storeId: '...',
  regionId: '...',
  credentials: '...',
}
```

---

## 4. Logical tenancy vs physical isolation

**Logical tenant = Organization.**

```text
Organization
   ↓
CubeCom commerce connection
   ↓
logical hosted-commerce tenant
```

v1: **one default hosted `cubecom` connection per Organization.**

That defines the **logical** tenancy boundary only.

**Physical engine isolation is intentionally undecided** in Phase 0. Do **not** bake any of the following into Phase 2 scaffolding as architecture:

```text
Organization A → Medusa instance A
Organization B → Medusa instance B
```

Allowed later choices (hardening): shared Medusa infrastructure, store-per-org, DB-per-org, or instance-per-org.

```text
Logical tenant      = Organization
Physical isolation  = deferred to hardening
```

---

## 5. Connection resolution precedence

Optional `integrationConnectionId` on a mapping is an **explicit override**. The moment multiple `cubecom` connections exist, “pick any / first” is forbidden.

```ts
resolveCommerceConnection({
  mappingConnectionId,
  projectDefaultConnectionId, // future
  organizationDefaultConnectionId,
}): CommerceConnectionRef
```

Precedence:

```text
1. Mapping explicit connection
2. Project default              // future; not required for v1
3. Organization default
4. Otherwise error
```

No “pick the first CubeCom connection.”

Escape hatches without redesign:

- Multiple `cubecom` connections per org → unique on `(organizationId, provider, externalAccountId)` (hosted store id as external account).
- Project default later → project setting, not ProductGraph engine fields.
- Storefront / environment later → points at a connection; mappings stay provider + opaque refs.

---

## 6. Package and purity boundaries

```text
product-graph
├── resolveCommerce()
├── ResolvedCommerce
├── normalized CommerceState shapes
└── canPurchase()                 // pure policy over normalized state

commerce-core
├── FetchCommerceState            // I/O port
├── CommerceRuntime               // cart / checkout / live reads
└── CommerceCatalogPublisher      // publish revision → catalog write

commerce-medusa
└── all Medusa translation / DTO / ID knowledge

apps/commerce
└── CubeComPro Commerce runtime powered by Medusa (extend; do not fork core)
```

Dependency direction:

```text
commerce-core  → imports types from →  product-graph
commerce-medusa → implements → commerce-core
```

Not the reverse. `product-graph`, Backoffice, and `apps/api` domain/GraphQL layers must not import `@medusajs/*`.

Keep runtime purchasing and catalog publish **visibly separate** even if they share a package:

```ts
interface CommerceRuntime {
  fetchState(...): Promise<CommerceState>;
  createCart(...);
  addCartLine(...);
  startCheckout(...);
}

interface CommerceCatalogPublisher {
  publishSellable(...);
}
```

Do not let `commerce-core` become a generic “everything commerce” bag. Do not put `CatalogSync` / publisher APIs into the first skeleton as if they were the same flow as live resolve.

### Phase 1 package rule

```text
Phase 1 implements:
- FetchCommerceState
- CommerceRuntime minimal surface
- resolveCommerceConnection (deterministic precedence)

Phase 1 declares only:
- CommerceCatalogPublisher placeholder / contract boundary

Catalog publishing behavior starts after the live-state checkpoint.
```

`CommerceCatalogPublisher` belonging in `commerce-core` and being stub-only in Phase 1 is intentional: the package owns the boundary; Phase 1 must not implement publish behavior.

Spine:

```text
ProductGraph
  resolveCommerce()
        ↓
  ResolvedCommerce
        ↓
  FetchCommerceState          ← commerce-core port
        ↓
  CommerceState
        ↓
  canPurchase()               ← pure product-graph logic
```

---

## 7. Modes (same ports, different packaging)

| Mode | Public provider | Who runs the engine |
| --- | --- | --- |
| Hosted CubeComPro Commerce | `cubecom` | CubeComPro (`apps/commerce`) |
| BYO Shopify | `shopify` | Merchant |
| BYO / intended CT | `commercetools` | Merchant |

Suite UX may look unified (Orders, Inventory, Customers). Internally those are **views over `commerce-core`**, not CubeCom product-kernel aggregates. Routes must still know hosted vs connected mode.

---

## 8. Architectural tests

**Disappearance test:** If Medusa disappeared tomorrow, could `commerce-core` (and ProductGraph sellability types) stay mostly unchanged? If yes, the boundary is right.

**Leakage test:** If `product-graph`, Backoffice, or `apps/api` GraphQL domain types import Medusa types or name `medusaOrderId`-style fields, the abstraction has failed.

**Boundary checkpoint (first true proof):** configuration-resolution path goes

```text
ProductGraph → commerce-core → commerce-medusa → Medusa
  → normalized CommerceState
```

with **zero Medusa leakage upward** — before investing in full checkout UX or Backoffice commerce chrome.

---

## 9. Phase 0 freeze summary

```text
Public provider
  cubecom | shopify | commercetools

Engine
  private to IntegrationConnection
  cubecom may currently resolve to medusa

Logical tenancy
  Organization

Physical engine isolation
  intentionally undecided

Default hosted connection
  one default cubecom connection / Organization in v1

Mapping
  provider
  externalReference (opaque)
  integrationConnectionId?     // explicit override

Connection resolution
  mapping override
    → project default (future)
    → organization default
    → fail

product-graph owns
  resolveCommerce
  ResolvedCommerce
  normalized CommerceState
  canPurchase

commerce-core owns
  FetchCommerceState
  CommerceRuntime
  CommerceCatalogPublisher (Phase 1: declare placeholder only)
  provider-neutral execution contracts
  resolveCommerceConnection

Phase 1 implements runtime spine only; catalog publish after checkpoint

commerce-medusa owns
  all Medusa translation / DTO / ID knowledge

apps/commerce
  CubeComPro Commerce runtime powered by Medusa

Boundary checkpoint
  ProductGraph → commerce-core → Medusa
  → normalized CommerceState
  with zero Medusa leakage upward
```

**One-line rule:** Organization owns the commerce relationship; ProductGraph owns sellable identity; the connection chooses the engine; Medusa remains replaceable.

### Merchant path rule (enforce)

```text
Browser → CubeCom API → commerce-core → adapter → engine
```

No merchant browser → Medusa path. `backoffice.cubecompro.com` is the merchant commerce surface; `commerce.cubecompro.com/app` is engineering/ops only.

### Connection config shape

```ts
{
  provider: "cubecom",
  externalAccountId: "store_xxx",
  configJson: {
    baseUrl: "https://commerce.cubecompro.com",
    publishableApiKey: "pk_...",
    regionId: "reg_..."
  },
  accessToken: "" // Shopify OAuth / privileged secrets only — never cubecom engine config
}
```

Publishable Store keys live in `configJson`. Privileged admin credentials must use a separate secret field when introduced — never collapse into `accessToken` alongside Shopify OAuth.

### First Backoffice proof order

```text
1. Product live commerce state (resolveCommerceLive)
2. Add to cart
3. Checkout
4. Orders
5. Inventory
6. Customers
```

---

## 10. Implementation sequence (after Phase 0)

Architecture work **stops here**. Next commits implement in order:

1. Phase 0 doc (this file) — **done when merged**
2. `packages/commerce-core` skeleton — implement `FetchCommerceState` + minimal `CommerceRuntime` + connection resolution; **declare only** `CommerceCatalogPublisher` placeholder (no publish behavior until after checkpoint)
3. `apps/commerce` Medusa **application** scaffold (extend published `@medusajs/*`; do not vendor core) — **done when Phase 2 merged**
4. `packages/commerce-medusa` adapter — **Phase 3: `fetchState` over HTTP only; cart/checkout stubbed**
5. **Checkpoint:** API `resolveCommerceLive` → connection resolve → `createCommerceRuntime` → fetchState → `canPurchase` — **done when PR #5 merged**
6. Cart / checkout vertical slice
7. Backoffice read views over `commerce-core`
8. Hardening: physical isolation choice, entitlements, sync jobs

Phase 2 acceptance (scaffold only):

```text
apps/commerce starts independently
uses published @medusajs/*
owns DB/config/migrations/runtime
exposes /health
runs Medusa Admin for internal/dev
imports nothing from product-graph or commerce-core
no CubeCom app imports apps/commerce
@medusajs/* only in apps/commerce (Phase 3 adapter uses HTTP; no @medusajs/*)
```

Phase 3 acceptance (`@repo/commerce-medusa`):

```text
only this package talks to Medusa (via HTTP)
input: ResolvedCommerce + connection config resolver
output: CommerceState
Medusa variant/product IDs never escape in CommerceState
missing/errors → normalized sellability (not Medusa-shaped errors)
no catalog publishing
cart/checkout stubbed until after live-state checkpoint
disappearance: delete package → commerce-core / product-graph / apps/api unchanged
```

PR #5 acceptance (`apps/api` live spine):

```text
resolveCommerce → resolveCommerceConnection → createCommerceRuntime(connection)
  → fetchState → CommerceState → canPurchase
apps/api never reads medusaBaseUrl / medusa client types outside createCommerceRuntime
Shopify resolveCommerce + resolveConfiguration paths unchanged
proved cases: SELLABLE, OUT_OF_STOCK, PROVIDER_BLOCKED, UNMAPPED, mapping>org default, no connection fails
```

Explicit non-goals until checkpoint passes:

- Forking Medusa into `packages/`
- Replacing the Shopify path
- Native `commerce-native` engine
- Rebuilding order/payment cores in Nest
- Deciding instance-per-org vs shared Medusa topology
