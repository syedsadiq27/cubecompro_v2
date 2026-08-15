# CubeCom Pro — Product & Engineering Context

> Purpose: durable context for Codex / engineering agents working in the CubeCom Pro repository.
>
> This document captures the product intent, domain semantics, current product surfaces, implementation boundaries, and intended future direction discussed so far. Treat repository code and schema as the source of truth for implementation details. Treat this document as the source of truth for product intent and terminology.
>
> **Critical rule:** do not invent capabilities. If the repository does not support a behavior, document it as planned/open rather than pretending it exists.

---

## 1. Product identity

CubeCom Pro is a configurable-product platform for commerce.

Its core job is to represent what a customer can choose, determine which combinations are valid, resolve the current configuration, drive the visual experience, and hand the resulting sellable state to commerce.

A useful mental model is:

```text
Catalog / product data
        ↓
Configurable product graph
        ↓
Shopper selection
        ↓
Resolution
   ┌────┼─────────────┐
   ↓    ↓             ↓
validity availability visual state
                     ↓
               commerce state
                     ↓
                  cart
```

3D is an important product surface, but the platform is not conceptually "a 3D configurator." The configuration graph is the kernel. The same graph can drive 3D, 2D, headless storefronts, embedded experiences, APIs, and commerce integrations.

Earlier positioning that remains useful:

> Rules first. Variants last.

The platform should allow merchants to encode configuration logic first, then resolve legal configurations to SKU / external variant / price / inventory / cart behavior.

CubeCom Pro should not require merchants to replace their existing PIM, catalog, storefront, or commerce engine. CubeCom owns configuration semantics and resolution; external commerce systems continue to own their respective commerce responsibilities.

---

## 2. Product promise

The strongest product framing discussed so far is:

> Turn product data into interactive, rule-bound, purchasable product experiences.

A configuration should remain coherent across:

- product choices,
- logical constraints,
- availability,
- visual state,
- commerce mapping,
- SKU / external product identity,
- cart payload.

The visual experience and commerce result must not become two independent systems trying to infer each other's state.

---

## 3. Core domain kernel

The conceptual kernel is intentionally small:

```text
Product
Choice
ChoiceValue
Constraint

Selection          // runtime value object
ValidationResult   // computed
Availability       // computed
```

Other objects exist around this kernel for revisioning, visual authoring, assets, commerce, and persistence.

### Product

A Product is the configurable thing being authored and sold.

Product-level lifecycle and revision-level lifecycle are distinct concepts. Do not collapse them just because their enums have similar names.

### Product revision

A product revision is an authored snapshot of product configuration.

Important intended invariant:

```text
DRAFT
→ editable

PUBLISHED
→ immutable
```

Once a revision is published, anything capable of changing how that revision resolves or renders must not remain mutable behind the revision.

This includes more than the GLB itself. The freeze boundary must include the revision-owned visual authoring state such as product model linkage, targets, and visual bindings/effects.

The preferred architecture does **not** add another unnecessary `VisualDocumentRevision` abstraction merely to solve this. Revision ownership should provide the freeze boundary where possible.

### Published vs active

These are not synonyms.

Repository/schema review found a separate `activeRevisionId` concept. Therefore:

- **Published** means an immutable revision exists.
- **Active** means a revision is the one currently selected/served for runtime use.

Do not assume that publishing automatically activates a revision unless the service/resolver implementation proves that behavior.

Likewise, do not assume exact rollback or activation UX without verifying it in the repository.

### Choice

A Choice is a product-local configurable dimension.

Examples:

```text
Frame
Fabric
Legs
```

A Choice is not itself a SKU or commerce variant.

### ChoiceValue

A ChoiceValue is a product-local selectable value for a Choice.

Example:

```text
Choice: Frame
Values:
- Walnut
- Oak
```

Choice and ChoiceValue are intentionally product-local rather than global taxonomy entities unless the implementation explicitly says otherwise.

### Selection

A Selection is the shopper/runtime value object representing the currently selected ChoiceValues.

It is not inherently:

- a SKU,
- a saved configuration record,
- a commerce variant,
- a database entity.

Persist it only when wrapped in an explicit persistence concept such as SavedConfiguration.

### Constraint

Constraints define logical validity.

Constraints are not commerce mappings and should not be used as a synonym for availability.

A safe public semantic statement is:

> Constraints define configuration validity and are enforced during resolution. Authoring may validate constraint structure and references, but does not determine runtime availability.

### Validity

Validity answers:

> Is this selected combination logically allowed?

An invalid selection violates product configuration rules/constraints.

### Availability

Availability is derived from the current partial selection.

The intended semantic contract is:

```text
available(value) =
  there exists at least one valid complete configuration
  containing currentSelection + value
```

This definition matters.

A value may be unavailable even though the current partial selection is not itself invalid.

Therefore:

```text
invalid != unavailable
```

Do not collapse the two concepts to make implementation easier.

### Commerce-mapped

Commerce mapping is another independent state.

A configuration may be:

```text
valid
but not commerce-mapped
```

Likewise, do not use "valid", "available", "resolved", "renderable", and "sellable" as interchangeable status words.

A useful separation is:

```text
valid
→ allowed by configuration semantics

available
→ can participate in at least one valid completion from the current state

resolved
→ resolution has produced an explicit runtime result

renderable
→ enough visual state/assets exist to render the intended experience

commerce-mapped / sellable
→ the result maps to an external commerce identity/cart action
```

Use repository behavior to refine exact definitions, but preserve the conceptual separation.

---

## 4. Resolution

Resolution is the central runtime operation.

Conceptually:

```text
Selection
   ↓
Configuration rules / constraints
   ↓
Resolver
   ├── validity / violations
   ├── availability
   ├── visual state
   └── commerce state
```

Two important behaviors were verified during documentation review:

1. Resolution does **not** automatically apply defaults.
2. Resolution does **not** automatically repair an invalid selection.

Do not document either behavior unless the implementation changes.

The client/runtime is responsible for deciding what to do with incomplete or invalid selections.

The resolver should be treated as deterministic product-domain behavior, not as a UI workflow.

---

## 5. Visual / 3D model

CubeCom's visual layer consumes the same product configuration state rather than defining a parallel configuration model.

High-level relationship:

```text
Product revision
├── ProductModel
├── model / object assets
├── targets
└── visual effects / bindings
```

### ProductModel

The ProductModel connects a product revision to its authored 3D representation.

The exact internal types may include names such as:

- `ProductModel`
- `ProductModelLinkedAssetModel`
- `ModelTargetModel`
- asset revision types

These are implementation names. Do not automatically expose them in operator documentation.

### Assets and embedded textures

A 3D model may contain embedded textures/material relationships.

Do not assume the correct authoring model is to strip textures from GLBs in code. Doing so can destroy wrapping, UV-dependent behavior, material properties, and author intent.

The asset system must respect the model as authored while allowing CubeCom to layer configurable behavior on top.

### Visual targets

The editor needs a way to identify scene objects / configurable parts that visual effects operate on.

Public documentation should favor product language such as:

- scene object,
- target,
- configurable part,
- model component,

rather than exposing internal model class names unless in API reference.

### Visual effects / operations

Repository/schema review surfaced operations including:

```text
REPLACE_COMPONENT
SET_MATERIAL
SET_MODEL
SET_VISIBILITY
```

These describe runtime visual changes triggered by configuration state.

Do not claim exact behavior for an operation simply because it exists in an enum. Trace its actual resolver/runtime behavior before documenting it.

Important semantic idea:

> Asset/target registry membership alone should not imply that an asset is active. A visual effect/binding should explicitly determine activation.

### Freeze boundary

If a ProductRevision is frozen, its visual behavior must also remain reproducible.

This means mutable model-target/binding state must not sit outside the revision freeze boundary in a way that allows an old published revision to render differently later.

---

## 6. Product surfaces

CubeCom Pro should be understood as a multi-surface platform, not merely an API.

Primary surfaces discussed so far:

```text
cubecompro.com              Landing / product site
backoffice.cubecompro.com   Backoffice
3d.cubecompro.com           3D Editor
docs.cubecompro.com         Documentation
api.cubecompro.com          Backend API

future / emerging:
2d.cubecompro.com
ai.cubecompro.com
```

The exact deployment topology can evolve; do not hard-code infrastructure assumptions into product semantics.

### 6.1 Backoffice

Backoffice is the product/configuration authoring surface.

It should allow product operators to work in product language, not GraphQL language.

Responsibilities include, as implemented/verified in the repository:

- product creation and management,
- choices and values,
- configuration rules/constraints,
- commerce mappings,
- product revisions,
- publishing,
- activation where supported,
- Shopify connection/import where supported,
- launching into visual authoring/editor workflows,
- troubleshooting authoring state.

Backoffice should eventually feel like a coherent product authoring application rather than a thin CRUD façade over the schema.

Previously frozen UI direction:

- premium, product-grade UI,
- avoid "vibe-coded" visual quality,
- simple but extensible,
- non-technical users should not need to understand internal schema types.

A prior Backoffice Pass 1 was frozen in `.cursor/rules/backoffice-ui.mdc` and referenced from `AGENTS.md`; future passes should respect that unless explicitly revisiting it.

### 6.2 3D Editor

The 3D Editor is the visual authoring surface.

Known/current capabilities discussed:

- open by project/product/model context,
- GLTF/GLB loading,
- Draco support,
- HDR environment lighting,
- orbit camera,
- click-select scene objects,
- transform gizmo:
  - Move (`W`)
  - Rotate (`E`)
  - Scale (`R`)
- Esc clears selection,
- object outline/tree,
- show/hide,
- selection properties,
- visibility toggle,
- position / rotation / scale,
- simple material color,
- product/model/config context.

The intended direction is to make this usable by non-technical product/3D users.

Potential authoring dimensions discussed:

```text
Location
Color
Material
Decoration
```

But do not turn these into public capabilities merely because they were brainstormed. Verify actual implementation before documenting them.

Important product issue:

> The editor should not expose raw Three.js/scene internals as the primary UX.

The operator should think in terms of product parts and configurable visual behavior.

### 6.3 Customizer

Customizer is the shopper/runtime product surface where the product graph, visual state, availability, and commerce state converge.

It is not merely "an embed page."

Canonical runtime loop:

```text
load product/revision
      ↓
obtain current Selection
      ↓
resolve
      ↓
validity + availability + visual state + commerce state
      ↓
render choices + 3D
      ↓
shopper changes Selection
      ↓
resolve again
```

Important verified correction from repo review:

- the shared UI package exports primitives, **not** a verified public `<CustomizerApp>` SDK.

Therefore do not publicly promise unsupported contracts such as:

- `CustomizerApp`,
- a constructor API,
- undocumented callback APIs,
- iframe `postMessage` protocols,
- custom DOM events,
- web-component APIs,

unless actual exports/runtime implementation prove them.

The Customizer documentation should distinguish:

- incomplete selection,
- invalid selection,
- unavailable value,
- valid selection with no commerce mapping,
- valid + visual-resolved state,
- cart-ready state.

### 6.4 API

The API is a product interface, but it is only one surface.

Do not let repository/schema-centric documentation make CubeCom Pro appear to be primarily an API product.

The developer docs should expose actual public contracts in the docs UI. Developers should not be required to open an inaccessible `/graphql` endpoint to understand fields.

API reference should cover:

```text
Queries
Mutations
Inputs
Objects
Enums
Errors
```

Every public field should ideally show:

```text
name
type
nullability / required
meaning
accepted values
default
example
constraints / invariants
related concept
```

JSON blob fields are hidden schemas and must be documented as such.

Examples to scrutinize:

- `selectionsJson`
- `availabilityJson`
- `cartPayloadJson`
- `conditionJson`
- `effectJson`
- other `*Json` payloads

If their exact shapes are not stable or verified, say so rather than inventing them.

---

## 7. Commerce

CubeCom configuration semantics and commerce semantics must remain separated.

General ownership:

```text
CubeCom Pro
- configuration model
- logical validity
- availability
- visual resolution
- mapping from resolved state to commerce identity

Commerce platform
- catalog/variant system as applicable
- pricing
- inventory
- cart
- checkout
- payment
- fulfillment
```

The exact ownership split may vary by integration, but configuration validity should not be delegated to the commerce platform.

### Commerce mapping

A resolved configuration may project into commerce using fields such as:

- provider,
- SKU,
- product reference,
- variant reference,
- cart payload.

Do not treat a commerce mapping as part of the logical constraint model.

---

## 8. Shopify

Shopify is a real integration direction and repository/schema review found concrete support.

Verified schema capabilities discussed include operations such as:

- start Shopify OAuth,
- disconnect Shopify,
- browse Shopify catalog products,
- preview product import,
- import Shopify product,
- query Shopify commerce/import state,
- commerce mapping to Shopify variant identities.

Exact operation names and behavior should be verified against the current schema/resolvers before publication.

Important product philosophy:

> Do not market or document integration behavior that is not genuinely implemented.

CubeCom Pro deliberately delayed claiming a Shopify integration until there was real integration work rather than fake market positioning.

Shopify is currently the first commerce integration to make real.

---

## 9. commercetools

commercetools is strategically aligned with CubeCom's product graph / projection architecture.

However, documentation review found no equivalent platform-specific commercetools schema support at that time.

Therefore current docs should distinguish:

```text
supported integration
vs
generic integration pattern
vs
planned integration
```

Do not describe commercetools OAuth/import/sync as implemented unless the repository proves it.

A generic CommerceMapping provider mechanism may support a conceptual/manual commercetools pattern, but that is not the same as a first-class commercetools integration.

---

## 10. Documentation architecture

Documentation is a first-class product surface.

The desired style is task-first, precise, Stripe/commercetools-like technical documentation.

Avoid narrative/story-driven documentation.

In particular, the prior Lounge Chair example was overused as an "Act 1–7" story backbone. That approach was rejected.

The Lounge Chair may remain as a small inline example when useful, but never as a narrative thread.

### Product surfaces should be visible

The docs should reflect the actual product:

```text
Get started
Backoffice
3D Editor
Customizer
Developers
Concepts
API Reference
Integrations
Resources
```

Do not reduce docs to "product teams vs developers."

### Canonical ownership

Use clear information ownership.

Recommended conceptual boundaries:

```text
Backoffice
→ operator tasks in the product authoring UI

3D Editor
→ visual authoring tasks

Customizer
→ runtime/shopper behavior

Developers
→ architecture, authentication, integration orientation, implementation guidance

Concepts
→ authoritative domain semantics and invariants

API
→ exact public contracts and transport details

Integrations
→ provider-specific behavior

Resources
→ changelog, limits, troubleshooting, operational reference
```

A concept may be summarized outside Concepts, but authoritative semantics should not be independently redefined in multiple places.

### Public vocabulary vs internal vocabulary

Repository names are evidence, not automatically product language.

Examples:

```text
Internal / implementation            Prefer publicly

GraphVersionStatus                   Revision status
activeRevisionId                     Active revision
ObjectAssetRevision                  Asset revision
ModelTargetModel                     Scene target / target
ProductModelLinkedAssetModel         Linked asset
Resolved3DStateModel                 Resolved visual state
ResolvedCommerceStateModel           Resolved commerce state
```

Raw schema names are appropriate in:

- API reference,
- exact developer examples,
- mutation/query documentation.

They should not dominate:

- Backoffice docs,
- Editor docs,
- Customizer docs,
- navigation,
- product concepts written for operators.

### Documentation truthfulness

Before documenting a product capability:

```text
claim
  ↓
verify in repo
  ↓
trace export/schema/resolver/service/runtime as needed
  ↓
document
```

Never infer a public contract from:

- an enum name,
- an internal class,
- a TODO,
- a mock,
- a UI concept,
- a brainstorm,
- a package name.

### Operator depth

Backoffice / Editor / Customizer docs should be operator manuals, not 5-minute orientation pages.

For each meaningful task, answer:

```text
What does this do?
When should I use it?
What do I need first?
What changes?
What downstream behavior depends on it?
How do I verify the result?
What can go wrong?
```

Examples of desired operator depth:

Backoffice:
- create/edit/archive products,
- choices and values,
- defaults,
- rules/dependencies,
- commerce mappings,
- revisions,
- publish vs activate,
- Shopify import,
- troubleshooting.

Editor:
- base model,
- scene objects,
- configurable parts,
- materials,
- visibility,
- component replacement,
- model changes,
- visual effects,
- preview,
- what gets published,
- troubleshooting.

Customizer:
- initial state,
- selection changes,
- availability,
- invalid states,
- visual resolution,
- commerce resolution,
- cart readiness,
- persistence/share state,
- integration/embedding only where implemented.

### API reference must be self-contained

Do not merely link a developer to `/graphql` or `/api/graphql` if that endpoint is not browsable from the frontend.

The docs themselves must expose public fields/types.

Where possible, generate API reference from the canonical GraphQL schema rather than maintaining copies manually.

---

## 11. Documentation rewrite status

A first major documentation rewrite has already occurred.

It successfully improved:

- task-first structure,
- canonical ownership,
- developer documentation,
- API reference breadth,
- removal of storytelling.

A reviewed ZIP contained roughly:

- 94 MDX pages,
- 12 navigation/meta files,
- dedicated Backoffice,
- Editor,
- Customizer,
- Developers,
- Get started,
- Concepts,
- API reference.

This is considered a good first pass, not something to discard.

Known second-pass needs:

1. remove unsupported/invented product contracts,
2. translate internal schema names into public product vocabulary,
3. deepen operator documentation,
4. make runtime semantics precise,
5. document JSON field shapes,
6. repair stale/broken navigation,
7. remove duplicate/legacy documentation,
8. add cross-surface workflows,
9. add verification sections to operational guides.

The goal is **not** more pages for their own sake.

> Make the existing docs authoritative.

---

## 12. Cross-surface workflows the docs should eventually explain

These are useful because they explain CubeCom as a system rather than as isolated APIs.

### Build a configurable product

```text
Backoffice
create Product
    ↓
define Choices + ChoiceValues
    ↓
define Constraints
    ↓
3D Editor
attach model + map visual behavior
    ↓
Backoffice
map commerce
    ↓
publish revision
    ↓
activate revision
    ↓
Customizer
shopper Selection
    ↓
resolve
    ↓
visual state + commerce state
    ↓
cart
```

Exact publish/activate mechanics must match repository behavior.

### Shopify → 3D configurator

```text
Shopify product
    ↓
CubeCom Shopify import
    ↓
CubeCom product/configuration graph
    ↓
3D Editor visual authoring
    ↓
publish/activate
    ↓
Customizer
    ↓
resolved Shopify commerce identity
    ↓
Shopify cart
```

### Update a published product safely

The intended invariant:

```text
published revision N
→ immutable and reproducible

need changes
→ create/edit draft revision N+1
→ verify
→ publish
→ activate when appropriate
```

Do not mutate published visual/configuration state in place.

---

## 13. UI/product design direction

CubeCom Pro should look like a serious platform, not a prototype.

General direction discussed:

- premium but restrained,
- coherent design system,
- strong typography,
- deliberate spacing,
- avoid generic dashboard/card overload,
- non-technical UX for authoring,
- simple first, extensible underneath.

Backoffice should connect the product surfaces rather than become a large enterprise admin suite prematurely.

A Super Admin concept has been discussed for connecting:

- Backoffice,
- Editor,
- Customizer/packages,
- plan/entitlement access.

The desired direction is simple and extensible, not a complex packaging/billing product in v1.

---

## 14. Pricing / packaging context

Pricing has been explored and should not be treated as final unless the current product/site confirms it.

One prior UI showed:

```text
Starter    $499/mo
Growth     $1,499/mo
Enterprise Custom
```

Earlier pricing was considered potentially aggressive and a launch offer was discussed.

Do not hard-code pricing into engineering/docs context without checking the live source.

---

## 15. Marketing and SEO principles

Marketing should follow reality.

Explicit product principle:

> Do not fake market readiness.

Examples:

- Delay strong Shopify positioning until a real integration exists.
- Do not claim commercetools integration merely because the architecture can support it.
- Documentation is more valuable than speculative blog content because it describes the live product.

SEO topics previously discussed include:

- 3D product configurator,
- product configurator,
- headless product configurator,
- product configuration API,
- Shopify integration,
- eventually commercetools integration.

But product truth takes priority over keyword capture.

---

## 16. Architecture and naming principles

### Prefer a small kernel

Do not invent abstractions unless they protect a real invariant.

Example:

- avoid adding a separate `VisualDocumentRevision` merely to solve immutability if ProductRevision ownership can provide the freeze boundary.

### Product state is primary

Visual and commerce concerns consume the same configuration state.

Avoid architectures where:

```text
form state
3D state
commerce state
```

become separate sources of truth.

### Configuration state first

The architecture has favored a first-class configuration state / resolved-selection concept, with commerce references as projections.

### Resolve at runtime

The preferred direction is a hybrid system with a resolve-at-runtime core rather than encoding every possible combination into a pre-expanded variant table.

### Commerce projections

The configuration graph determines what configuration exists/means.

Commerce systems receive projections/references for the sellable outcome.

---

## 17. Things that are intentionally NOT assumptions

Agents must not assume any of the following without checking current code:

- publishing automatically activates a revision,
- exact Backoffice publish/activate UI behavior,
- automatic selection defaults in resolution,
- automatic repair of invalid selections,
- a public React `<CustomizerApp>` SDK,
- iframe embedding,
- `postMessage` protocols,
- Customizer callbacks/events,
- public web components,
- automatic Shopify webhook synchronization,
- automatic variant updates,
- commercetools-specific OAuth/import/sync,
- exact `SET_MODEL` semantics,
- ConfigurationRule and Constraint being equivalent,
- planned 2D/AI surfaces being production-ready,
- every schema/internal model name being a public concept.

If an implementation detail matters, trace it.

---

## 18. Open / unresolved product questions

These should remain questions until repository/product decisions settle them.

### Product lifecycle

- Does publishing also activate in any workflow?
- Can an active revision be archived directly?
- What is the explicit rollback/activation behavior?
- How do Product-level `ACTIVE/DRAFT/ARCHIVED` states interact with revision status?

### Constraint vs configuration rule

The schema has historically shown both a simple constraint concept and a `ConfigurationRule`-style condition/effect model.

Need to determine:

- whether these are distinct public concepts,
- whether one is legacy/internal,
- how they interact,
- which one should appear in operator docs.

### Visual operations

`SET_MODEL` exists in the schema/enum but historically was not documented.

Trace actual runtime behavior before treating it as a supported editor operation.

### Customizer packaging

Need to decide what becomes the official integration surface:

- hosted customizer,
- React package,
- headless runtime,
- SDK,
- web component,
- iframe,
- other.

Until implemented and intentionally public, do not promise any of these as an API.

### commercetools

Strategically important but should remain "pattern/planned" until there is platform-specific implementation.

---

## 19. Guidance for Codex / agents

When working on CubeCom Pro, use this order:

```text
1. Understand product intent from this document.
2. Inspect repository implementation.
3. Verify behavior.
4. Preserve domain invariants.
5. Implement/document in public product language.
6. Call out mismatches rather than silently inventing bridges.
```

### For implementation tasks

Ask internally:

- Which product surface owns this behavior?
- Which domain invariant could this change?
- Does it alter published revision reproducibility?
- Does it create another source of truth?
- Is this public product behavior or internal plumbing?

### For documentation tasks

Before writing:

```text
claim
→ repository evidence
→ public terminology
→ user task
→ verification
```

Do not optimize first for:
- storytelling,
- marketing prose,
- schema completeness,
- page count.

Optimize for:
- truth,
- operability,
- discoverability,
- precise semantics,
- stable public vocabulary.

### For UI tasks

Do not expose raw persistence/schema concepts just because they exist.

Translate them into the user's job.

Example:

```text
Bad:
Select ProductModelLinkedAssetModel

Better:
Choose the component model used for this option
```

### For future-state work

Clearly label:

```text
CURRENT
PLANNED
OPEN QUESTION
```

Do not blur them.

---

## 20. Current vs future snapshot

### Current / verified direction

```text
Core configuration graph
✓ Product / Choice / ChoiceValue / Constraint semantics

Revisioning
✓ draft/published concepts
✓ published immutability intended
✓ separate active-revision concept exists

Backoffice
✓ product authoring surface exists
✓ current UI direction frozen for Pass 1

3D Editor
✓ model loading / scene interaction / transforms / basic properties
✓ visual authoring architecture exists

Customizer
✓ runtime configuration/resolution concept
✓ do not assume public SDK wrapper

API
✓ GraphQL-backed domain surface
✓ documentation needs/has field-level reference work

Shopify
✓ real integration capabilities exist in schema/repo

commercetools
✗ no first-class platform integration should be assumed

Docs
✓ major task-first rewrite completed
✓ second pass focused on truth + depth
```

### Future / intended

```text
Backoffice
→ deeper product/operator workflows
→ stronger non-technical authoring UX
→ coherent cross-surface navigation

3D Editor
→ richer product-oriented visual authoring
→ clearer material/component/model/decorative workflows
→ less raw scene-engine exposure

Customizer
→ formalized public integration contract
→ precise runtime semantics
→ potentially multiple delivery modes only when intentionally supported

Commerce
→ mature Shopify integration
→ commercetools integration when genuinely implemented
→ generic custom commerce pattern

Platform
→ possible 2D and AI surfaces
→ package/entitlement-aware super admin
→ broader analytics/observability

Docs
→ authoritative operator manuals
→ generated/self-contained API reference
→ cross-surface workflows
→ no invented contracts
```

---

## 21. One-paragraph canonical summary

CubeCom Pro is a configurable-commerce platform whose core is a product-local configuration graph of choices, values, and constraints. A shopper manipulates a Selection; resolution determines logical validity, derived availability, visual state, and commerce state without silently defaulting or repairing the selection. Product revisions provide the freeze boundary for reproducible published behavior, including configuration and revision-owned visual authoring state; publishing and activation are separate concepts unless implementation explicitly combines them. Backoffice authors the configurable product, the 3D Editor authors how configuration affects the scene, Customizer consumes resolution at runtime, and the API/integrations expose the same underlying product semantics to developers and commerce systems. Shopify is the first real commerce integration; commercetools remains a strategic pattern/future integration until implemented. Public docs and UI should use stable product language, keep internal schema names mostly in API reference, and never claim capabilities that cannot be traced to current repository behavior.
