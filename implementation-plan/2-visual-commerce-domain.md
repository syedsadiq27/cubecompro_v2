# CubeCom Visual Domain — Frozen V1 Implementation Handoff

> **Product-first map:** see [`README.md`](./README.md) (1 → 4C). This file is an implementation handoff, not the product narrative.

Status: **Design frozen**
Next source of truth: **implementation**
Do not continue brainstorming unless 2A/2B exposes a concrete contradiction.

---

## 1. Core visual boundary

The product kernel is already frozen separately.

Visuals consume semantic product state; they do not define it.

```text
ProductRevision
    +
Selection
    +
VisualDocument
    ↓
deriveVisualState()   // pure
    ↓
VisualState
    ↓
reconcileScene()      // only Three.js boundary
    ↓
Three.js

Hard rule:

- `deriveVisualState()` must not touch `THREE.*`
- `reconcileScene()` is the only layer allowed to mutate Three.js

Three.js is a renderer, not part of product semantics. 

---

## 2. VisualDocument

`VisualDocument` is a serializable DTO/client contract.

It is **not** a new Prisma entity.

Use current API persistence:

```text
ProductModel
ModelTarget
VisualEffect
ObjectAsset
```

Current DB shape is close enough for v1; do not redesign tables yet.

Conceptually:

```ts
type VisualDocument = {
  productRevisionId: string
  productModelId: string
  assetId: string

  targets: VisualTarget[]
  bindings: VisualBinding[]
}

type VisualTarget = {
  id?: string
  key: string
  nodePath: string
  materialSlot?: string
}
```

Bindings reference semantic product state using keys, not DB IDs:

```text
choiceKey
valueKey
```

DB relations may continue using IDs internally.

---

## 3. Supported visual operations in v1

Support only:

```text
SET_MATERIAL
SET_VISIBILITY
```

Quarantine:

```text
SET_MODEL
transforms
camera state
editor workspace state
selection/hover/gizmo state
animation state
arbitrary JSON semantics
```

Do not invent behavior for `SET_MODEL`.

Treat it as unsupported during normalization.

---

## 4. Typed binding normalization

Raw API transport may contain:

```ts
operation
value: unknown
```

But `unknown` must stop at the normalization boundary.

Normalize immediately into typed bindings.

Example:

```ts
type MaterialBinding = {
  choiceKey: string
  valueKey: string
  targetKey: string
  materialSlot?: string
  operation: "SET_MATERIAL"
  materialAssetId: string
}

type VisibilityBinding = {
  choiceKey: string
  valueKey: string
  targetKey: string
  operation: "SET_VISIBILITY"
  visible: boolean
}
```

Do not let `unknown` propagate through editor/runtime state.

---

## 5. Visual target identity

Use two distinct concepts:

```text
targetKey = CubeCom-authored identity
nodePath  = locator inside the ObjectAsset / GLB
```

Example:

```text
targetKey: "chair-frame"
nodePath: "/Chair/Frame"
```

Bindings reference `targetKey`.

Reconciliation resolves:

```text
targetKey
→ VisualTarget
→ nodePath
→ exactly one Object3D
```

Resolution contract:

```text
0 matches  → error
>1 matches → error
1 match    → valid
```

Never use traversal order such as:

```text
scene.children[3]
```

Node name alone is not sufficient because GLTF node names may duplicate. 

---

## 6. VisualAddress

Define:

```text
VisualAddress =
  targetKey
  + property
  + materialSlot?
```

Examples:

```text
ChairFrame / visibility
ChairFrame / material / 0
ChairFrame / material / 1
```

`materialSlot` is present only when needed. 

---

## 7. Binding conflict rules

For v1:

```text
same VisualAddress
+ different values of same Choice
→ allowed
```

Example:

```text
frame.walnut → Frame/material = Walnut
frame.oak    → Frame/material = Oak
```

Because `frame` is single-valued, these cannot activate simultaneously.

Reject:

```text
same VisualAddress
+ same ChoiceValue duplicated
→ reject
```

Example:

```text
frame.walnut → Frame/material = WalnutA
frame.walnut → Frame/material = WalnutB
```

Also reject:

```text
same VisualAddress
+ different Choices
→ reject in v1
```

Example:

```text
frame.walnut   → Frame/material
finish.premium → Frame/material
```

Do not add priorities/order semantics.

Do not attempt solver-based proof of cross-choice mutual exclusivity yet.

Equivalent uniqueness rule:

```text
(choiceKey, valueKey, VisualAddress)
→ unique
```

These conflict semantics are frozen for v1. 

---

## 8. ObjectAsset / GLB baseline

Deterministic replay requires an explicit baseline.

The baseline is:

```text
ObjectAsset / GLB state immediately after load
before any CubeCom visual binding is applied
```

Capture once.

Do not deep-clone the scene graph.

Capture only CubeCom-managed properties:

```ts
type VisualBaseline = {
  [visualAddress: string]: {
    materialReference?: ...
    visible?: boolean
  }
}
```

No camera state.
No animation state.
No selection state.
No renderer internals.
No editor state.

Correct guarantee:

> `reconcile({})` restores all CubeCom-managed properties to the captured ObjectAsset baseline.

Not “restore the entire Three.js world.” 

---

## 9. Material semantics

`SET_MATERIAL` means assignment:

```text
target.material = resolved MaterialAsset
```

Do not implement it as arbitrary mutation:

```text
material.color.set(...)
material.roughness = ...
```

GLTF meshes may share the same `THREE.Material` object.

Mutating shared material instances can create side effects across multiple meshes.

Material properties belong to the material asset, not to the binding. 

---

## 10. Deterministic replay

The system must not execute visual effects incrementally against the current scene.

Wrong:

```text
selection change
→ execute some effects
→ mutate existing scene
```

Correct:

```text
ObjectAsset baseline
        +
VisualDocument
        +
Selection
        ↓
deriveVisualState()
        ↓
desired VisualState
        ↓
reconcileScene()
```

Important proof:

```text
fresh(A) == A → B → A
```

Also verify:

```text
reconcile({})
→ restores all CubeCom-managed properties to baseline
```

This is the core determinism requirement.

---

## 11. deriveVisualState()

Must be pure.

Inputs:

```text
VisualBaseline
VisualDocument
Selection
```

Output:

```ts
type VisualState = {
  targets: Record<
    string,
    {
      materialAssetId?: string
      visible?: boolean
    }
  >
}
```

Exact internal shape may vary, but:

- no `THREE.Object3D`
- no current scene reads
- no editor UI state
- no mutation
- same input always returns same output

Baseline should be represented in the desired state so restoration is explicit, not hidden inside `reconcileScene()`.

---

## 12. reconcileScene()

This is the only Three.js mutation boundary.

Its job is intentionally boring:

> Make the currently loaded scene equal the desired `VisualState`.

It may:

- resolve targetKey → nodePath → Object3D
- assign resolved material
- set visibility

It must not:

- infer Selection
- modify ProductRevision
- execute business logic
- read visual bindings directly
- rely on previous configuration history

---

## 13. ProductRevision affinity

Every VisualDocument must belong to exactly one ProductRevision.

Required:

```text
VisualDocument.productRevisionId
```

Do not run:

```text
VisualDocument revision 7
+
Selection from revision 8
```

even if the same semantic keys happen to exist.

Fail explicitly on revision mismatch. 

---

## 14. Phase 2A — normalize existing API state

First implementation task:

```text
ProductModel
+ ModelTarget[]
+ VisualEffect[]
+ ProductRevision choices/values
        ↓
normalizeVisualDocument()
        ↓
typed VisualDocument
```

Requirements:

- resolve `choiceKey` / `valueKey`
- resolve `targetKey`
- parse `SET_MATERIAL`
- parse `SET_VISIBILITY`
- reject/report unsupported `SET_MODEL`
- validate target definitions
- validate duplicate/conflicting bindings
- contain no `THREE.*`
- contain no UI/editor state

Do not implement Save yet.

---

## 15. Phase 2B — hydrate + deterministic replay

Then:

```text
load ObjectAsset
↓
captureVisualBaseline()
↓
VisualDocument + Selection
↓
deriveVisualState()
↓
reconcileScene()
```

Required tests:

```text
fresh(A) == A→B→A
```

```text
reconcile({})
restores managed properties to baseline
```

```text
material changes restore correctly
```

```text
visibility changes restore correctly
```

```text
missing target fails
```

```text
ambiguous target fails
```

```text
unsupported SET_MODEL never silently executes
```

```text
same address + same ChoiceValue duplicated → reject
```

```text
same address + different Choice → reject
```

```text
same address + different values of same Choice → allowed
```

No Save until these are green.

---

## 15.5. Phase 2B.5 — Visual Projection Proof

**Not** the product Configurator Preview.

`deriveVisualState()` remains constraint-agnostic (correct).

This phase proves only the visual projection path:

```text
real API Choices / VisualEffects
→ Selection changes (UI click)
→ deriveVisualState()
→ reconcileScene()
→ actual THREE.Mesh.material / visible changes
→ A → B → A deterministic
→ {} restores baseline
```

Naming:

```text
2B.5 Visual Projection Proof     = mapping / projection harness
2B.6 Constraint-aware 3D Preview = same Preview UI + kernel + projection
Configurator Preview             = name for 2B.6 inside the 3D editor
```

Do **not** mix constraints into `deriveVisualState()`.

Acceptance requires at least one automated test that drives a real loaded scene graph (GLB-shaped hierarchy under a mount wrapper) and asserts the resolved `THREE.Mesh` material / visibility — not manual “you should see X” alone.

Requirements:

- No mock behavior cards
- No manual “Apply selection” control
- Click handlers only update Selection (no direct Three.js mutation from the click)
- `deriveVisualState` stays pure / constraint-free
- Do not implement Save in this phase

---

## 15.6. Phase 2B.6 — Constraint-aware 3D Preview

Still the **same** 3D Editor Preview — not a separate configurator product.

```text
Current 3D Editor Preview
        +
Choices / Selection UI
        +
validateSelection()
        +
deriveAvailability()
        ↓
same Three.js projection
```

Integrated proof:

```text
Choices + Constraints + Selection
        ↓
validate / deriveAvailability
        ↓
UI disables unavailable values / surfaces invalid Selection
        ↓
deriveVisualState → reconcileScene → Three.js
```

In scope:

- disable illegal / unavailable ChoiceValues
- show validation feedback
- valid Selection still changes the real 3D model
- A → B → A remains deterministic

Out of scope (creep):

- shopper storefront UX / mobile configurator
- price / inventory / cart / commerce adapters
- save/share configuration
- analytics / publication workflow
- fancy swatch layouts

---

## 16. Phase 2C — Save (implemented)

Vertical slice on the editor Mappings workspace + top-chrome Save:

```text
edit supported binding (SET_MATERIAL / SET_VISIBILITY)
↓
serialize VisualDocument
↓
API create/update/delete (draft revision; auto-create draft from published)
↓
reload productRevisionDetail
↓
same normalized VisualDocument (semantic keys + payloads)
↓
same VisualState via hydrate + replay
```

Definition of done:

```text
save
→ reload
→ replay
→ identical persisted visual behavior
```

Not persisted (still out of scope): camera, gizmo, preview Selection, transforms, publish.

---

## 17. Do not persist in v1

Do not automatically save:

```text
camera orbit
camera presets
selected object
hover
gizmo state
panel/workspace state
preview Selection
temporary material mutation
temporary visibility changes not represented by binding
arbitrary Object3D transforms
```

Transforms are explicitly out of scope.

Do not hide them inside `ModelTarget.metadata`.

If transform persistence becomes necessary later, earn an explicit model/operation.

---

## 18. Current editor cleanup implication

Current editor bootstrap loads API graph/model state but does not hydrate the real visual mappings into authoring/replay state.

Current static/mock mapping inspector must not be part of the proof path.

Anything displayed like:

```text
Frame
Walnut
Chair_Frame
Walnut Wood
```

must come from hydrated API state, not hardcoded constants.

Do not extend the legacy ID-based `properties → values → objects` configuration model.

Use the frozen semantic `ChoiceKey / ChoiceValueKey` contract.

---

## 19. Commerce — freeze contract only, do not implement yet

Keep symmetry with visuals:

```text
ProductRevision
    +
complete valid Selection
    +
CommerceDocument
    ↓
resolveCommerce()     // pure
    ↓
CommerceResolution
    ↓
provider adapter
```

Do not assume:

```text
Selection → Variant
```

Only:

```text
Selection → CommerceResolution
```

Commerce resolution requires a complete + logically valid Selection.

Separate:

```text
CommerceResolution
= sellable identity
```

from:

```text
CommerceState
= live price / inventory / sellability
```

Price/inventory never belong in semantic mapping.

CommerceDocument must also be revision-bound. 

Do not build commerce in this phase.

---

# Frozen V1 model

```text
Product kernel     = what the product means
VisualDocument     = how meaning maps to appearance
VisualState        = desired appearance
Three.js           = mutable renderer
```

CommerceDocument   = how meaning maps to sellable identity
CommerceResolution = resolved identity
CommerceState      = live provider facts

```

```



```



---



# Execution directive

Start implementation now.

Order:

```text
2A — normalizeVisualDocument
2B — baseline + deriveVisualState + reconcileScene + determinism tests
2B.5 — Visual Projection Proof
2B.6 — Constraint-aware 3D Preview (same Preview + validate + availability)
2C — Save (serialize → API → reload parity) — done on this branch
```

Do not:

- redesign Prisma
- create SceneRevision
- create Publication
- implement commerce
- implement SET_MODEL
- implement transforms
- add generic JSON visual semantics
- add priority/order conflict resolution
- add new visual-domain entities

Only stop for design review if implementation produces concrete evidence that one of the frozen contracts above cannot work against the existing CubeCom data/API shape.

```

That should be enough for Cursor to continue without reopening the architecture.
```

