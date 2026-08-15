We have now frozen the CubeComPro domain architecture. Do not redesign it unless implementation exposes a concrete contradiction.

The core principle is:

ProductRevision + Selection
→ configured semantic product state

3D and commerce are downstream projections of that state. They do not define the product model.

==================================================
1. PRODUCT KERNEL
==================================================

The kernel owns product meaning.

Core types:

type Selection =
  Record<ChoiceKey, ChoiceValueKey>

Optional choices are absent from Selection.
Do not introduce null into Selection.

Kernel responsibilities are split deliberately:

evaluateConfiguration(productRevision, selection)
→ validation
→ completeness

deriveAvailability(productRevision, selection)
→ logical reachable-state availability

These are separate because availability can be more expensive and is not required for every caller.

Strict meanings:

INVALID
→ product constraints are violated

INCOMPLETE
→ required Choice is missing

UNAVAILABLE
→ a candidate value cannot participate in any valid complete configuration

Do not merge these concepts.

==================================================
2. VISUAL PROJECTION
==================================================

Visual is already frozen and 2A/2B are implemented.

Architecture:

ObjectAsset / GLB baseline
+ VisualDocument
+ Selection
→ deriveVisualState()
→ VisualState
→ reconcileScene()
→ Three.js

Rules:

- Visual bindings are sparse.
- A ChoiceValue may have no visual binding.
- V1 supports SET_MATERIAL and SET_VISIBILITY only.
- SET_MODEL remains unsupported.
- deriveVisualState() is pure and contains no THREE.*.
- reconcileScene() is the only Three.js mutation boundary.
- Baseline is captured once after GLB load, before CubeCom changes.
- reconcile({}) restores all CubeCom-managed properties to baseline.
- targetKey is CubeCom identity.
- nodePath resolves targetKey to exactly one scene object.
- missing or ambiguous targets fail.
- material assignment means assign resolved material asset/reference, not mutate shared material properties.

Conflict semantics are frozen around VisualAddress:

VisualAddress =
  targetKey + property + materialSlot?

Rules:

same VisualAddress
+ different values of same Choice
→ allowed

same VisualAddress
+ same ChoiceValue duplicate
→ reject

same VisualAddress
+ different Choices
→ reject

The next visual step is only 2C Save round-trip:

edit supported binding
→ serialize
→ API create/update/delete
→ reload
→ normalize
→ same semantic VisualDocument
→ same VisualState

Do not add transforms, camera persistence, SET_MODEL, new visual entities, or Prisma redesign during 2C.

==================================================
3. COMMERCE PROJECTION
==================================================

Commerce does NOT operate directly on every Choice in the product.

A complete valid product Selection may contain choices that do not affect sellable identity.

Example:

Selection:
{
  frame: "walnut",
  fabric: "beige",
  stitching: "red"
}

Commerce may only care about:

identityChoiceKeys:
["frame", "fabric"]

So commerce projects Selection into a smaller value object.

Types:

type CommerceIdentity =
  Record<ChoiceKey, ChoiceValueKey | null>

Important:

Selection remains:
Record<ChoiceKey, ChoiceValueKey>

CommerceIdentity alone permits null.

Meaning:

choice NOT in identityChoiceKeys
→ commerce does not care about this Choice

choice in identityChoiceKeys + value
→ selected commerce identity dimension

choice in identityChoiceKeys + null
→ this optional Choice participates in commerce identity but is semantically absent

Example:

Product choice:

Warranty
required = false
values:
- Extended

Commerce may distinguish:

{
  frame: "walnut",
  warranty: null
}
→ Shopify variant 123

{
  frame: "walnut",
  warranty: "extended"
}
→ Shopify variant 456

We explicitly do NOT add a fake "None" ChoiceValue to the product kernel.

==================================================
4. COMMERCE MAPPING SET
==================================================

Use this conceptual contract:

CommerceMappingSet
- productRevisionId
- provider
- identityChoiceKeys
- mappings

Each mapping represents exactly one complete CommerceIdentity over identityChoiceKeys.

Conceptually:

type CommerceMapping = {
  identity: CommerceIdentity

  externalReference: {
    type: "VARIANT"
    id: string
    sku?: string
  }
}

The provider-facing identity is intentionally small for v1.

Do not add:
- price
- inventory
- currency
- discounts
- cart state
- shipping
- provider API responses
- fallback rules
- priority
- partial matching

Those belong elsewhere.

==================================================
5. COMMERCE PERSISTENCE
==================================================

Persistence should remain relational.

Conceptually:

CommerceMappingSet
├── productRevisionId
├── provider
├── identityChoices[]
└── CommerceMapping[]
      ├── identitySignature
      └── CommerceMappingTerm[]

CommerceMappingTerm references ChoiceValue relationally.

The relational terms are the semantic source of truth.

identitySignature is only a derived uniqueness / exact lookup artifact.

Do NOT initially hash identitySignature.

Canonicalize structurally.

Example normalized identity:

{
  frame: "walnut",
  warranty: null
}

Canonical representation:

[
  ["frame", "walnut"],
  ["warranty", null]
]

Use deterministic identity-choice ordering.

Serialize that representation directly as identitySignature.

Then uniqueness can be:

@@unique([mappingSetId, identitySignature])

Do not use delimiter-based strings such as:

frame=walnut|warranty=none

The canonical representation must be structural and deterministic.

==================================================
6. NORMALIZATION RULES
==================================================

DB terms may be sparse because null absence is represented by missing relational terms.

Example persisted mapping set:

identity choices:
- frame
- warranty

terms:
- frame.walnut

Normalization produces:

{
  frame: "walnut",
  warranty: null
}

Rules:

- identityChoiceKeys must belong to the same ProductRevision.
- every mapping must define exactly one CommerceIdentity over those keys.
- required identity Choice missing a term → malformed mapping.
- optional identity Choice missing a term → null.
- mapping may not contain terms for Choices outside identityChoiceKeys.
- at most one value per Choice.
- duplicate semantic CommerceIdentity → reject.
- identityChoiceKeys may be empty.

Empty identityChoiceKeys is valid.

Example:

Product has customization choices, but provider exposes only one sellable item.

identityChoiceKeys = []

Then:

{} → provider variant 123

Every complete valid product Selection projects to {} and resolves to the same sellable identity.

Do not invent a fake commerce-relevant Choice just to support this.

==================================================
7. COMMERCE RUNTIME
==================================================

Runtime flow:

Selection
→ caller runs evaluateConfiguration()
→ require complete && valid
→ projectCommerceIdentity()
→ canonicalize identity
→ exact lookup
→ CommerceResolution

Conceptually:

type CommerceResolution =
  | {
      status: "RESOLVED"
      provider: string
      externalReference: {
        type: "VARIANT"
        id: string
        sku?: string
      }
    }
  | {
      status: "UNMAPPED"
    }

resolveCommerce() does NOT:

- validate kernel constraints
- determine completeness
- calculate availability
- query Shopify/commercetools
- fetch price
- fetch inventory
- determine live sellability
- build cart payload
- perform partial matching
- rank mappings
- apply fallback rules

Caller establishes complete + valid first.

Missing exact mapping means:

UNMAPPED

It does NOT mean:

INVALID

==================================================
8. FUTURE LIVE COMMERCE STATE
==================================================

Later, after CommerceResolution:

CommerceResolution
→ provider adapter
→ CommerceState

Possible future facts:

price
inventory
sellability

This produces another distinct state:

UNSELLABLE
→ commerce identity exists, but live provider state prevents purchase

Keep vocabulary strict:

INVALID
= kernel rules violated

INCOMPLETE
= required Choice missing

UNAVAILABLE
= candidate cannot reach valid completion

UNMAPPED
= complete valid configuration has no commerce mapping

UNSELLABLE
= mapping exists, but live provider state blocks purchase

Never collapse these states.

==================================================
9. OWNERSHIP BOUNDARIES
==================================================

Product kernel
--------------
What configurations mean
What is valid
What is complete
What remains logically possible

Visual projection
-----------------
How semantic choices affect appearance

Commerce projection
-------------------
Which semantic choices determine sellable identity

Provider adapter
----------------
What is currently true about that sellable identity

Important function boundaries:

evaluateConfiguration()
does not eagerly calculate availability

deriveAvailability()
does not project visuals or commerce

deriveVisualState()
does not validate kernel semantics

resolveCommerce()
does not validate kernel semantics

resolveCommerce()
does not query external providers

==================================================
10. EXECUTION ORDER
==================================================

Do not change this order:

2C
Visual persistence round-trip — done

then

3A
CommerceMappingSet persistence
+ normalization into domain contract — implemented

then

3B
projectCommerceIdentity()
+ canonical identity signature
+ exact pure resolution
+ tests

then

3C
Shopify / commercetools importer
only when real provider integration begins

then

3D
live commerce state:
price / inventory / sellability / cart

The first Shopify/commercetools integration is the next thing allowed to challenge the commerce model.

Do not widen the model before provider implementation produces a concrete requirement.

==================================================
11. PRODUCT-LEVEL PRINCIPLE
==================================================

The architecture should preserve this statement:

CubeComPro is a product configuration and rule-resolution engine.

3D, commerce, and other experiences are projections of the configured product state.

A useful related invariant:

Variants may bootstrap the product model,
but variants never become the product model.

Variant-first import may infer Choices / ChoiceValues and Commerce mappings from Shopify/commercetools.

Rules-first authoring may define ProductRevision first and map commerce later.

Both converge into the exact same ProductRevision + Selection runtime model.

Do not create separate domain models for variant-first and rules-first workflows.
