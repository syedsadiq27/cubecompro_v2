> **Product-first map:** see [`README.md`](./README.md) (1 → 4C). This file is an implementation handoff, not the product narrative.

Phase 3A and 3B are complete.

Do not revisit or redesign:
- CommerceMappingSet persistence
- CommerceIdentity projection
- exact resolution
- ProductRevision / Selection semantics
- kernel validation
- visual architecture

Next is Phase 3C.

==================================================
PHASE 3C — SHOPIFY CONNECTION + IMPORT
==================================================

Goal:

Connect a real Shopify shop to CubeCom, import one real configurable Shopify product, and produce:

Shopify product/options/variants
        ↓
CubeCom ProductRevision
+ Choice / ChoiceValue
+ CommerceMappingSet

This phase is about proving the provider boundary with real Shopify data.

Do NOT continue into live price/inventory/sellability or checkout execution unless explicitly asked.

==================================================
1. FIRST INSPECT EXISTING INTEGRATION OWNERSHIP
==================================================

Before adding schema, inspect the current codebase for any existing concept that already owns:

CubeCom organization/project
↔ external provider account/shop
↔ credentials / OAuth tokens

Look for things like:
- Integration
- Connection
- ProviderAccount
- ExternalAccount
- Credential
- OAuth installation

If an existing model fits, reuse it.

Do NOT create CommerceConnection just because the architecture diagram needs a noun.

If nothing suitable exists, add the smallest provider connection model required by Shopify authentication.

Conceptually only:

IntegrationConnection
- id
- organizationId
- provider
- externalAccountId
- credentials/config reference

For Shopify, externalAccountId should represent the actual shop/account identity.

Keep credentials secure. Do not put access tokens into commerce mappings or ProductRevision.

Report what existing model you found before inventing a new one.

If nothing exists, create the minimum model and continue.

Do not stop for naming bikeshedding.

==================================================
2. COMMERCE MAPPING SCOPE
==================================================

A real mapping cannot be globally scoped only by:

provider = SHOPIFY

It must eventually belong to the actual Shopify installation/account.

So after 3C, the effective scope should be:

ProductRevision
+ Shopify integration/account
→ CommerceMappingSet

If the current 3A schema only contains provider, evolve it minimally to reference the real integration scope.

Do not introduce:
- multiple inheritance
- global provider registry architecture
- connection versioning
- connection lifecycle state machine

Only enough to bind mappings to the real Shopify shop.

==================================================
3. SHOPIFY IMPORT TARGET
==================================================

Implement the smallest real import path for ONE Shopify product.

Input:

Shopify product
├── options
├── option values
└── variants

Output:

CubeCom ProductRevision
├── Choices
├── ChoiceValues
└── CommerceMappingSet
     ├── identityChoiceKeys
     └── mappings

The import semantics are:

Shopify option
→ Choice

Shopify option value
→ ChoiceValue

Shopify variant
→ CommerceMapping

Example:

Shopify:

Frame:
- Walnut
- Oak

Fabric:
- Beige
- Black

Variants:
Walnut + Beige → variant 123
Walnut + Black → variant 124
Oak + Beige    → variant 125

CubeCom:

Choice "frame"
- walnut
- oak

Choice "fabric"
- beige
- black

CommerceMappingSet.identityChoiceKeys:
["frame", "fabric"]

Mappings:
{ frame: walnut, fabric: beige } → Shopify variant 123
{ frame: walnut, fabric: black } → Shopify variant 124
{ frame: oak, fabric: beige }    → Shopify variant 125

Oak + Black is NOT automatically a kernel Constraint.

It remains:

complete + valid Selection
→ CommerceIdentity exists
→ no exact mapping
→ UNMAPPED

This distinction is mandatory.

==================================================
4. VARIANTS MAY BOOTSTRAP, NOT DEFINE THE KERNEL
==================================================

Freeze this invariant:

Variants may bootstrap the product model,
but variants never become the product model.

Do NOT reintroduce ProductVariant as the CubeCom runtime domain.

Do NOT attach Shopify variant IDs to ChoiceValue.

Do NOT infer kernel constraints from missing Shopify variants.

Provider IDs belong in CommerceMapping external references.

==================================================
5. SEMANTIC KEYS
==================================================

Persistence uses IDs/FKs.

Runtime uses semantic keys.

Continue the frozen identity rule:

DB:
Choice.id
ChoiceValue.id

Runtime:
choiceKey
valueKey

Shopify import must create deterministic CubeCom semantic keys for imported options/values.

Do not use raw Shopify IDs as ChoiceKey/ChoiceValueKey.

Keys should be stable within the ProductRevision lineage.

Use the existing key-generation conventions in the codebase if they exist.

Do not invent a new global key registry.

==================================================
6. IMPORT MUST BE IDEMPOTENT / SAFE
==================================================

Do not build a full sync engine yet.

But importing the same Shopify product twice must not blindly duplicate the entire CubeCom model.

At minimum, choose and implement one explicit behavior:

A. create only if no linked import exists, otherwise reject clearly

OR

B. update/reconcile the existing imported product deterministically

Prefer the simpler option based on current codebase.

Do NOT build:
- background sync
- webhooks
- diff engine
- conflict-resolution framework
- provider event processing

Those are later concerns.

The important thing is no accidental duplicate CubeCom products/mappings from repeated clicks.

==================================================
7. IMPORT VALIDATION
==================================================

The importer must reject/report malformed provider data rather than silently producing bad CubeCom state.

Check at least:

- product has usable option/value structure
- every imported variant can be represented using imported choices
- no variant contains two values for the same Choice
- no duplicate semantic CommerceIdentity
- CommerceMappingSet belongs to imported ProductRevision
- all mapped values belong to that revision
- integration/account scope matches the Shopify source

Reuse 3A/3B invariants rather than reimplementing them differently.

==================================================
8. DO NOT BUILD GENERIC PROVIDER IMPORT ARCHITECTURE
==================================================

Shopify is the first provider proof.

It is fine to have Shopify-specific code such as:

ShopifyProductImporter

or equivalent existing service naming.

Do NOT introduce:

GenericCommerceImporter
ProviderImportEngine
CatalogProjectionFramework
ImportStrategy registry
CommerceProviderPlugin
UniversalVariantNormalizer

unless an existing architecture genuinely requires one.

When commercetools arrives later, inspect the duplication then.

Concrete provider code is preferred over speculative abstraction.

==================================================
9. PROVIDER API BOUNDARY
==================================================

Keep Shopify I/O separate from import transformation logic.

Desired shape:

Shopify API client
        ↓
raw Shopify DTO/data
        ↓
pure/minimally stateful import mapping logic
        ↓
CubeCom API/service persistence

Do not mix:
- GraphQL/network calls
- CubeCom semantic inference
- Prisma writes

inside one giant method if it can be trivially separated.

But also do not create a framework.

A small client + importer/service is sufficient.

==================================================
10. WHAT 3C DOES NOT INCLUDE
==================================================

Explicitly OUT:

- live price
- inventory
- sellability
- cart
- checkout
- Shopify line-item properties
- gift wrap execution
- engraving
- dynamic custom fields
- CommerceExecution
- ShopifyExecutionConfig
- generic commerce execution model
- webhooks
- continuous sync
- scheduled sync
- commercetools importer
- visual changes
- kernel changes
- automatic constraint generation from missing variants

Do not drift into 3D or 3E.

==================================================
11. UI / MANUAL PROOF
==================================================

Use the smallest UI/API path already available.

We need to be able to prove:

1. Connect/select a Shopify shop.
2. Pick/import one Shopify product.
3. Inspect the resulting CubeCom product.
4. Confirm Shopify options became Choices/ChoiceValues.
5. Confirm variants became CommerceMappings.
6. Confirm 3B can resolve a mapped configuration.
7. Confirm a logically valid configuration with no Shopify variant returns UNMAPPED.

Do not build a polished integration marketplace.

A basic admin/backoffice import flow is enough.

If UI work is significantly larger than the backend proof, expose/test the import through the simplest existing API/admin surface first.

==================================================
12. TESTS
==================================================

Add focused tests for at least:

Shopify product:
Frame = Walnut | Oak
Fabric = Beige | Black

Variants:
Walnut + Beige → 123
Walnut + Black → 124
Oak + Beige    → 125

Verify:

- Choices/ChoiceValues generated correctly
- identityChoiceKeys = frame + fabric
- 3 mappings generated
- mapped Selection resolves to correct external variant
- Oak + Black remains kernel-valid if no Constraint exists
- Oak + Black resolves UNMAPPED
- repeated import does not create accidental duplicates
- mapping is scoped to correct ProductRevision/integration
- malformed duplicate provider combination fails clearly

Also cover zero-option / one-variant Shopify product if Shopify exposes that shape cleanly:

identityChoiceKeys = []
{} → single Shopify variant

This case is important because the commerce model explicitly supports empty identity choice sets.

==================================================
13. DEFINITION OF DONE
==================================================

3C is green when a real Shopify product can cross this boundary:

real Shopify shop
        ↓
Shopify API
        ↓
import
        ↓
CubeCom ProductRevision
+ Choice / ChoiceValue
+ CommerceMappingSet
        ↓
existing 3B resolver
        ↓
RESOLVED | UNMAPPED

And the result survives reload from persisted state.

Verification should include:
- tests
- typecheck
- one real manual Shopify import
- one mapped resolution
- one valid-but-unmapped resolution

Then STOP.

Do not automatically continue to 3D or 3E.

**Status: implemented on branch** — IntegrationConnection + Shopify Admin product import + pure planShopifyProductImport + API mutations. Live shop verification requires a real Admin API token.

Report:
- schema changes, if any
- connection model reused/created
- Shopify API surface used
- import path
- manual verification steps
- tests/typecheck results
- concrete Shopify behavior that challenged any frozen assumption

==================================================
AFTER 3C
==================================================

3D and 3E are parallel future slices:

3D — Live Commerce State
ResolvedCommerce
→ Shopify
→ price / inventory / sellability

3E — Shopify Execution Proof
static Shopify line-item property bindings
→ pure payload projection
→ cart/API execution

Do not implement either in this run.