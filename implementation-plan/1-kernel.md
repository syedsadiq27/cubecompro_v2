> **Product-first map:** see [`README.md`](./README.md) (1 → 4C). This file is an implementation handoff, not the product narrative.

Below is the implementation markdown I’d use as the handoff to Cursor. It reflects the current CubeCom state, the frozen kernel, the existing Prisma/API ownership, and the decision to migrate conservatively rather than rewrite the schema. The API remains the persistence source of truth; `@repo/product-graph` remains the suite client contract; runtime stays outside the suite UI layer. 

````md
# CubeCom Product Kernel — Implementation Plan

Status: **Ready for implementation**
Scope: **Product semantics kernel only**
Architecture status: **Frozen unless implementation exposes a concrete contradiction**

---

# 1. Goal

Replace the current broad rule/attribute semantics with the smallest correct CubeCom product configuration kernel.

The kernel answers only:

> Given a product revision and a selection, what does the selection mean and is it logically possible?

The kernel does **not** own:

- Three.js state
- models / meshes / materials
- commerce providers
- SKU / price / inventory
- storefront UI state
- saved configurations
- analytics
- personalization/free text
- arbitrary numeric input
- generic rule execution

The frozen core domain is:

```text
Product
└── ProductRevision
    ├── Choice
    │   └── ChoiceValue
    └── Constraint
        └── ConstraintTerm
````

Runtime value:

```ts
type Selection = Record<ChoiceKey, ChoiceValueKey>
```

Computed later:

```text
ValidationResult
Availability
```

External projections:

```text
ProductRevision + Selection
        │
        ├── VisualMapping   → VisualState
        └── CommerceMapping → CommerceResolution
```

Visual and commerce systems consume product semantics.

They do not define or mutate product semantics.

---

# 2. Existing CubeCom State

Current persistence source of truth:

```text
apps/api
└── Prisma + Nest GraphQL / REST
```

Current relevant Prisma models:

```text
Product
ProductGraphVersion
ProductAttribute
AttributeValue
ConfigurationRule

ProductVariant
VariantSelection

ProductModel
ModelTarget
VisualEffect
```

Current ownership boundaries remain unchanged:

```text
apps/api
    persistence + domain APIs

apps/backoffice
    product/catalog authoring

apps/editor
    3D authoring

@repo/product-graph
    suite API SDK/client

@repo/configurator-core
    runtime resolution

@repo/ui
    UI only
```

The existing ownership document already defines `apps/api` as the source of truth and prohibits suite apps from creating parallel persistence. 

---

# 3. Frozen Domain Semantics

## Product

Stable product identity.

Conceptually:

```text
Product
- id
- organization/project ownership
- key
- name
- description
- lifecycle
```

Product must not directly contain:

```text
modelId
meshId
materialId
Shopify variant IDs
SKU mappings
price
inventory
```

Those belong to external projections.

---

## ProductRevision

A revision contains exactly the authored state required to understand and validate a `Selection`.

Conceptually:

```text
ProductRevision
├── Choice[]
└── Constraint[]
```

A change to visual mappings alone must not require a new ProductRevision.

A change to commerce mappings alone must not require a new ProductRevision.

---

## Choice

A single discrete configurable dimension.

Examples:

```text
Frame
Fabric
Legs
Size
```

Choice is product-revision-local.

It is not globally reusable.

Conceptual shape:

```text
Choice
- key
- name
- required
- sortOrder
- defaultValue?
- values[]
```

V1 supports:

```text
single-valued discrete Choice only
```

V1 does not support kernel semantics for:

```text
MULTI_SELECT
TEXT
NUMBER
free-form personalization
quantity
arbitrary numeric dimensions
```

Existing storage for these types is not deleted immediately.

New authoring must not create them.

---

## ChoiceValue

A selectable value inside exactly one Choice.

Example:

```text
Chair.Frame.Walnut
Table.Top.Walnut
```

These are different semantic values.

ChoiceValues are not globally reusable.

Reusable materials/assets live outside the kernel.

Conceptual shape:

```text
ChoiceValue
- key
- name
- sortOrder
- metadata?
```

`metadata` is descriptive only.

Allowed examples:

```json
{
  "swatchLabel": "Natural Walnut",
  "description": "American walnut"
}
```

Forbidden semantic use:

```json
{
  "mesh": "Frame_01",
  "shopifyVariantId": "123",
  "priceDelta": 200,
  "requires": ["legs.brass"]
}
```

Validation, commerce, and visual semantics must never hide inside metadata.

---

# 4. Semantic Identity

Database relations use database IDs.

Runtime/domain selections use semantic keys.

Correct split:

```text
DB identity
    Choice.id
    ChoiceValue.id

Runtime identity
    Choice.key
    ChoiceValue.key
```

Runtime:

```ts
type Selection = Record<string, string>
```

Example:

```json
{
  "frame": "walnut",
  "fabric": "beige",
  "legs": "brass"
}
```

Keys are scoped to a ProductRevision lineage.

They are not globally unique.

Example:

```text
Chair.frame
Table.frame
```

are unrelated.

`name` is presentation.

`key` is semantic identity.

Changing:

```text
walnut
```

to:

```text
dark-walnut
```

is a semantic identity change, not a label rename.

---

# 5. Defaults

`defaultValue` is initialization only.

It must never become hidden validation state.

Example:

```text
Frame.defaultValue = Walnut
```

does NOT mean:

```text
{} == { frame: walnut }
```

Validation of:

```json
{}
```

must validate exactly `{}`.

Initialization may explicitly produce:

```json
{
  "frame": "walnut"
}
```

before handing the Selection to validation.

This preserves deterministic state and replay. 

---

# 6. Required Choices and Completeness

Definition:

```text
complete(selection) =
    every required Choice has exactly one ChoiceValue
```

Optional Choices may be absent.

Example:

```text
Frame       required
Fabric      required
Gift Wrap   optional
```

This is complete:

```json
{
  "frame": "walnut",
  "fabric": "beige"
}
```

`Gift Wrap` does not need to exist in the Selection.

---

# 7. Constraint Semantics

Constraint has exactly one semantic:

> These assignments may not all be true simultaneously.

Example:

```text
material.leather
color.white
```

means:

```text
NOT (
  material = leather
  AND
  color = white
)
```

No:

```text
if
then
effect
operator
kind
priority
enabled
JSON expression
```

Constraint terms are conjunctive by definition.

A constraint is violated when every term matches the current Selection.

Example:

```text
Constraint:
material.leather
color.white
```

Selection:

```json
{
  "material": "leather"
}
```

is not yet invalid.

Selection:

```json
{
  "material": "leather",
  "color": "white"
}
```

is invalid.

---

# 8. Target Constraint Persistence

Add new persistence.

Do NOT mutate `ConfigurationRule` in-place.

Target:

```prisma
model Constraint {
  id                String @id @default(cuid())
  productRevisionId String

  productRevision ProductGraphVersion @relation(
    fields: [productRevisionId],
    references: [id],
    onDelete: Cascade
  )

  terms ConstraintTerm[]

  @@index([productRevisionId])
}

model ConstraintTerm {
  constraintId  String
  choiceValueId String

  constraint Constraint @relation(
    fields: [constraintId],
    references: [id],
    onDelete: Cascade
  )

  choiceValue AttributeValue @relation(
    fields: [choiceValueId],
    references: [id],
    onDelete: Restrict
  )

  @@id([constraintId, choiceValueId])
  @@index([choiceValueId])
}
```

Important:

During the first implementation pass, use the existing table/model names where necessary.

Do NOT perform the vocabulary rename at the same time.

---

# 9. Constraint Service Contract

Implement conceptually:

```ts
createConstraint(
  productRevisionId: string,
  choiceValueIds: string[],
)
```

Validation rules:

```text
1. At least 2 values

2. Every ChoiceValue belongs to the same ProductRevision

3. At most one ChoiceValue from each Choice

4. No semantically duplicate Constraint
```

Example invalid construction:

```text
color.red
color.blue
```

because one single-valued Choice cannot simultaneously contain both.

---

# 10. Duplicate Constraint Detection

Do not add schema complexity initially.

Do not add:

```text
signature
hash
canonical JSON
```

unless implementation proves necessary.

Service-layer duplicate detection is sufficient for V1.

Canonical comparison can conceptually:

```text
map term → choice.key=value.key
sort
compare with existing constraints
```

Example:

```text
frame=walnut&fabric=red
```

and:

```text
fabric=red&frame=walnut
```

are the same semantic Constraint.

---

# 11. Delete Behavior

ConstraintTerm → ChoiceValue must use:

```text
Restrict
```

Do not silently cascade semantic changes.

Example:

```text
Constraint:
Walnut + Red forbidden
```

Deleting:

```text
Walnut
```

must not silently delete or alter the Constraint.

Application behavior:

```text
Delete ChoiceValue Walnut

Referenced by:
- Constraint 17
- Constraint 22

→ reject or require explicit dependency resolution
```

Dependency changes should happen transactionally and intentionally.

---

# 12. Existing Prisma Reconciliation

## Product

Current model is structurally acceptable.

Keep.

Do not modify as part of this implementation slice.

---

## ProductGraphVersion

Conceptually becomes:

```text
ProductRevision
```

But do not rename yet.

Current revision mechanics are usable:

```text
productId
version
status
createdAt
publishedAt

@@unique([productId, version])
```

Current non-kernel children:

```text
models
variants
savedConfigurations
```

must be treated as conceptually outside the kernel.

Do not physically migrate them yet.

Fields:

```text
graphUri
graphSha256
organizationId
```

remain temporarily.

Do not expand their responsibility.

---

## ProductAttribute

Conceptually:

```text
Choice
```

Existing ownership is useful:

```text
graphVersionId
key

@@unique([graphVersionId, key])
```

Do not rename yet.

New authoring restriction:

```text
AttributeType.SELECT only
```

Existing values:

```text
MULTI_SELECT
BOOLEAN
NUMBER
TEXT
```

remain in DB as legacy state until separately audited.

Do not create new instances through current authoring flows.

---

## AttributeValue

Conceptually:

```text
ChoiceValue
```

Existing shape is structurally good.

Keep.

Do not physically rename yet.

Ensure:

```text
defaultValue must belong to its parent Choice
```

at service level.

---

## ConfigurationRule

Freeze.

Do not add new behavior.

Do not extend its JSON format.

Do not build new features on top of:

```text
condition Json
effect Json
```

The current model becomes legacy/read-only after migration.

---

## ProductVariant / VariantSelection

Quarantine.

Do not delete yet.

Do not use them as the core representation of Selection.

A valid CubeCom Selection must not require a ProductVariant row.

Commerce mapping will be reviewed separately later.

---

## ProductModel / ModelTarget / VisualEffect

Outside kernel.

Do not modify as part of this implementation.

Do not add kernel dependencies on them.

Visual persistence will be reconciled separately.

---

# 13. Implementation Sequence

## Commit 1 — Kernel Contract

Implement only behavioral narrowing.

### Tasks

* define semantic `Selection` contract:

```ts
type Selection = Record<ChoiceKey, ChoiceValueKey>
```

* new authoring accepts discrete `SELECT` only
* reject new MULTI_SELECT / BOOLEAN / NUMBER / TEXT configuration Choices
* keep old enum/data intact
* enforce defaultValue belongs to same Choice
* document:

  * default initialization semantics
  * required/completeness semantics
  * metadata descriptive-only restriction

### Do NOT

* rename Prisma tables
* add validator rewrite
* add Availability
* add Publication
* modify visual domain
* modify commerce domain

---

# 14. Commit 2 — Constraint Persistence

Add:

```text
Constraint
ConstraintTerm
```

Implement:

```text
createConstraint()
deleteConstraint()
listConstraints()
```

and service invariants:

```text
>= 2 terms
same revision
one value per choice
no semantic duplicate
```

ChoiceValue delete must respect Constraint references.

Add tests before migration tooling.

### Explicitly banned fields

Do NOT add:

```text
kind
type
operator
condition
effect
priority
enabled
metadata
expression
JSON
```

to Constraint.

If implementation pressure suggests one is needed:

STOP.

Reopen the specific domain decision before extending persistence.

---

# 15. Legacy ConfigurationRule Migration

After Constraint persistence works, implement migration tooling.

Migration supports only recognized legacy shapes.

Example existing shape:

```text
condition:
material = leather

effect:
forbid color = white
```

becomes:

```text
Constraint:
material.leather
color.white
```

Migration behavior:

```text
recognized rule
    → migrate

unrecognized rule
    → report
    → leave untouched
    → do not invent semantics
```

Produce a coverage report:

```text
Total relevant ConfigurationRules
Migrated
Unsupported
Failed
```

Every unsupported rule must include:

```text
rule ID
product ID
revision ID
reason
```

Block new ConfigurationRule writes once Constraint authoring is live.

Do not delete old rows yet.

---

# 16. Runtime Cutover Gate

Do not switch runtime validation in Commit 2.

Runtime cutover requires:

```text
100% of relevant existing rules are either:

- migrated successfully

OR

- explicitly classified unsupported
```

No silent fallback.

No dual rule execution.

Do NOT support:

```text
Constraint first
then ConfigurationRule fallback
```

That would create two semantic truth systems.

---

# 17. Commit 3 — Runtime Cutover

Only after migration gate passes.

Runtime validator reads:

```text
ProductRevision
Choice
ChoiceValue
Constraint
ConstraintTerm
```

and no longer executes ConfigurationRule.

Implement:

```text
validate(selection)
```

first.

Then:

```text
deriveAvailability(selection)
```

using the same validator.

---

# 18. Validation Semantics

Validator must distinguish:

```text
unknown choice
unknown value
value belonging to wrong choice
missing required choice
violated constraint
```

Do not collapse these into one generic invalid state.

The first validator does not need visual or commerce awareness.

---

# 19. Availability Semantics

Logical Availability means:

> Can this ChoiceValue participate in at least one logically valid complete configuration?

It does NOT include:

```text
inventory
SKU existence
commerce provider state
region
merchant disablement
pricing
```

Those belong to Sellability.

Definition:

```text
candidateSelection =
    currentSelection with the candidate Choice replaced

available(choice, value) =
    exists valid complete configuration
    extending candidateSelection
```

Replacement semantics are mandatory.

Example:

```json
currentSelection = {
  "frame": "walnut",
  "fabric": "beige"
}
```

Checking:

```text
frame.oak
```

means:

```json
{
  "frame": "oak",
  "fabric": "beige"
}
```

not:

```text
frame=walnut AND frame=oak
```

This semantic contract is already frozen. 

Do not optimize the solver prematurely.

Correctness first.

---

# 20. Availability vs Sellability

Keep these concepts separate permanently.

```text
Availability
    logical possibility

Sellability
    commerce/runtime purchasability
```

Example:

```text
Walnut

available = true
sellable  = false
```

because valid Walnut configurations exist, but commerce inventory may be unavailable.

Do not let commerce state enter Constraint validation. 

---

# 21. Commit 4 — Vocabulary Cleanup

Only after Constraint + runtime cutover is stable.

Code/domain names:

```text
ProductGraphVersion → ProductRevision
ProductAttribute    → Choice
AttributeValue      → ChoiceValue
```

Prefer Prisma mapping before physical table renames.

Example:

```prisma
model Choice {
  productRevisionId String @map("graphVersionId")

  @@map("ProductAttribute")
}
```

Likewise:

```text
ProductRevision @@map("ProductGraphVersion")
ChoiceValue     @@map("AttributeValue")
```

Goal:

```text
correct domain vocabulary in TypeScript/API
without unnecessary PostgreSQL table churn
```

Physical DB renames can happen later if ever needed.

---

# 22. Visual Boundary

Do not redesign visual persistence in this implementation.

Freeze only this dependency rule:

```text
Product semantics
      │
      └── consumed by Visual Mapping
```

Visual mapping must declare:

```text
productRevisionId
```

Mappings authored for revision 7 cannot silently execute against revision 8.

Semantic references may use:

```text
frame.walnut
fabric.beige
```

but revision affinity remains explicit.

Three.js must consume derived `VisualState`.

Three.js must never define Selection semantics.

Correct:

```text
Selection changes
    ↓
validate
    ↓
derive VisualState
    ↓
Three.js reconciles scene
```

Wrong:

```text
mesh clicked
    ↓
mutate material
    ↓
infer Selection
```

The renderer is not part of the semantic state machine. 

---

# 23. Commerce Boundary

Do not redesign commerce persistence in this implementation.

Freeze only:

```text
CommerceMapping.productRevisionId
```

Commerce consumes:

```text
ProductRevision + validated Selection
```

and returns:

```text
CommerceResolution
```

Kernel does not know:

```text
Shopify variant
commercetools SKU
price
inventory
cart payload
```

Do not assume:

```text
Selection == Variant
```

`ProductVariant` remains quarantined until commerce design is reviewed. 

---

# 24. Publication

Do NOT create a Publication model yet.

Conceptually:

```text
ProductRevision
Visual mapping/revision
Commerce mapping state

        ↓ eventually

Publication
```

But persistence has not earned this noun yet.

Immediate rule:

```text
VisualMapping.productRevisionId
CommerceMapping.productRevisionId
```

Fail loudly on revision mismatches.

When the system eventually requires one atomic live pointer across independent semantic/visual/commerce revisions, then Publication has earned existence. 

---

# 25. Tests Required

## Constraint creation

```text
✓ accepts two values from different choices
✓ accepts N values from N different choices
✗ rejects fewer than two values
✗ rejects value from another ProductRevision
✗ rejects two values from same Choice
✗ rejects semantic duplicate
```

## Choice integrity

```text
✓ ChoiceValue belongs to one Choice
✗ defaultValue from another Choice rejected
✗ new non-SELECT Choice rejected
```

## Delete integrity

```text
✗ deleting referenced ChoiceValue fails
✓ deleting Constraint removes ConstraintTerms
✓ deleting ProductRevision cascades semantic children
```

## Legacy migration

```text
✓ recognized forbid rule migrates
✓ term identities resolve correctly
✓ duplicate migrated rules deduplicated/reported
✗ unknown rule shape is not guessed
✓ unknown shape appears in migration report
```

## Runtime cutover later

```text
✓ valid Selection accepted
✓ constraint violation rejected
✓ missing required choice reported
✓ optional choice may be absent
✓ unknown Choice rejected
✓ invalid ChoiceValue rejected
✓ availability uses replacement semantics
✓ availability checks for valid complete extension
```

---

# 26. Non-Goals

Do not implement during this effort:

```text
generic rule DSL
boolean expression tree
requires operator
pricing rules
visual rules
commerce rules
inventory rules
regional rules
TEXT Choice
NUMBER Choice
MULTI_SELECT Choice
personalization
Publication model
CommerceRevision
generic SceneRevision architecture
graph database
solver optimization
rule priority
rule enable/disable
AI-generated constraints
```

If a real product requirement exposes one of these needs, reopen that specific decision.

Do not pre-build it.

---

# 27. Success Criteria

This implementation is complete when:

```text
1. New configurable authoring is discrete SELECT-only.

2. Selection has one canonical semantic representation:
   Record<ChoiceKey, ChoiceValueKey>.

3. Constraint + ConstraintTerm exist relationally.

4. Constraint invariants are enforced in the service.

5. ChoiceValue deletion cannot silently alter constraints.

6. Legacy ConfigurationRule writes are frozen.

7. Existing rules have a migration coverage report.

8. Runtime does not cut over until migration coverage is known.

9. After cutover, ConfigurationRule is not used as fallback truth.

10. Visual and commerce code have not leaked into ProductRevision semantics.

11. Existing Product/ProductGraphVersion/ProductAttribute/
    AttributeValue storage is reused wherever practical.

12. No speculative architecture was introduced.
```

---

# 28. Implementation Discipline

The domain is frozen, but not sacred.

Implementation is allowed to challenge it.

If implementation exposes a contradiction:

```text
STOP
→ identify exact violated invariant
→ reopen only that decision
→ update this document
→ continue
```

Do not respond to implementation friction by casually adding:

```text
JSON
kind
operator
effect
generic metadata
new version aggregates
```

to make the code compile.

The objective is not maximum extensibility.

The objective is the smallest correct CubeCom configuration kernel that supports real products without coupling product semantics to rendering or commerce.

---

# 29. First Coding Target

Start only here:

```text
Constraint
ConstraintTerm

createConstraint(
  productRevisionId,
  choiceValueIds[]
)
```

Definition of done:

```text
✓ create
✓ inspect terms
✓ reject < 2 terms
✓ reject cross-revision values
✓ reject same-choice values
✓ reject semantic duplicates
✓ restrict deletion of referenced ChoiceValue
✓ tests pass
```

Nothing else is required before this slice works.

No validator.

No availability.

No UI.

No resolver rewrite.

No vocabulary rename.

Make this boring first.

```

This is the implementation plan I’d freeze against the current CubeCom state. It deliberately leaves the existing visual models, commerce/variant models, and publication mechanics alone while replacing the one abstraction we have actually established is wrong: `ConfigurationRule` as generic condition/effect JSON. The current ownership map confirms those models already sit together under the catalog today, which is why the narrow migration is preferable to another broad rewrite. :contentReference[oaicite:8]{index=8}
```
