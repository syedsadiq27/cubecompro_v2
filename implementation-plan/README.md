# CubeCom Product Model — Docs (1 → 4E)

**Read this first.** Slice files below are implementation handoffs; this page is the product-shaped map.

Organization is **product-first**, not build order.

```text
What is the product?
  → What can a buyer choose?
  → What is logically possible?
  → What does it look like in 3D?
  → What immutable assets does that appearance use?
  → How does a choice change composition?
  → How does it sell?
  → What freezes on publish?
```

Status through 4E:

| Capability | Status |
|---|---|
| Product meaning (kernel) | ✅ Frozen |
| Visual projection (materials / visibility) | ✅ Frozen |
| Commerce mapping + Shopify import | ✅ Frozen (3A–3C) |
| Immutable root 3D pin | ✅ 4A frozen |
| Multi-asset model registry | ✅ 4B frozen |
| REPLACE_COMPONENT activation | ✅ 4C narrow |
| Material + texture revisions + SET_MATERIAL | ✅ 4D narrow |
| Integrated multi-asset replay (structure + root surfaces) | ✅ 4E |
| Active product-first 3D editor authoring | ✅ 4E.1 (visual stack + MODEL/CONFIG) |

Do not start 4F+ without explicit approval.

---

## 1. Product

A **Product** is the merchant catalog entity (name, key, project, status).

A **ProductRevision** is a versioned configuration of that product:

```text
Product
└── ProductRevision   (DRAFT | PUBLISHED | ARCHIVED)
```

- **Draft** — may be edited (choices, constraints, model pins, bindings, commerce maps).
- **Published** — frozen semantic + visual + commerce snapshot for that version.
- Historical revisions must not silently change because library assets or Shopify data moved later.

Persistence source of truth: `apps/api` (Prisma + GraphQL).  
Suite client contract: `@repo/product-graph`.

---

## 2. Meaning — what the buyer can choose

Owned by the **product kernel**. Answers only:

> Given this ProductRevision and a Selection, what does the selection mean, and is it logically possible?

```text
ProductRevision
├── Choice
│   └── ChoiceValue
└── Constraint
    └── ConstraintTerm
```

Runtime:

```ts
type Selection = Record<ChoiceKey, ChoiceValueKey>
```

Computed (separate on purpose):

| Result | Meaning |
|---|---|
| Validation | INVALID / INCOMPLETE vs valid |
| Availability | which values remain reachable |

Kernel does **not** own: Three.js, meshes, materials, SKU/price/inventory, storefront UI, free text, generic rule engines.

Docs: [`1-kernel.md`](./1-kernel.md) · principles also in [`3-commerce-resolutions.md`](./3-commerce-resolutions.md) §1

---

## 3. Appearance — how the selection looks

Visuals **consume** Selection; they do not redefine product meaning.

```text
ProductRevision + Selection + VisualDocument
        ↓
  deriveVisualState()   // pure — no THREE.*
        ↓
  VisualState
        ↓
  reconcileScene()      // only Three.js boundary
```

Authoring atoms (API-backed):

```text
ProductModel
├── ModelTarget          (where in the GLB: node / material slot)
└── VisualEffect         (ChoiceValue → operation on a target)
```

V1 operations in production use:

- `SET_MATERIAL`
- `SET_VISIBILITY`

Bindings use **choiceKey / valueKey / targetKey**, not accidental DB-id coupling in the client contract.

Docs: [`2-visual-commerce-domain.md`](./2-visual-commerce-domain.md)

---

## 4. Assets — exact 3D bytes the product pins

### 4.1 One required root (4A)

Every ProductModel loads **one exact immutable GLB revision**. No “latest”, no demo fallback, no silent swap.

```text
ObjectAsset
  └── ObjectAssetRevision 🔒  (bytes + contentHash + frozenAt)

ProductRevision
  └── ProductModel
        └── objectAssetRevisionId  → exact ObjectAssetRevision
```

Rules:

- Published revision cannot repoint the root pin.
- Draft may explicitly repoint.
- New upload = new `ObjectAssetRevision`, never overwrite.
- Clone draft keeps the same pin (does not jump to tip).

Docs: [`4A-immutable-asset-pinning.md`](./4A-immutable-asset-pinning.md)

### 4.2 Asset universe for the model (4B)

A product may **link** many assets for composition, but every link has a typed role + key. Not a naked `assets[]`.

```text
ProductModel
├── objectAssetRevisionId              ← required root (authority)
└── ProductModelAsset[]                ← registry (many-to-many links)
      role: OBJECT | MATERIAL | TEXTURE | ENVIRONMENT | …
      key:  pedestal-base | walnut | …
      assetRevisionId: exact pin
```

Split (do not merge):

| Layer | Job |
|---|---|
| `ProductModelAsset` | Which immutable assets this model **may** use |
| Visual bindings | **When / how** they participate for a Selection |

`OBJECT/root` is only a **mechanical mirror** of `objectAssetRevisionId` — never a second write authority.

MATERIAL / TEXTURE may be listed in the registry; they must **not** drive render-active state until they have immutable revisions (4D).

Docs: [`4B-multi-asset-model-graph.md`](./4B-multi-asset-model-graph.md) · [`4B-implementation.md`](./4B-implementation.md)

### 4.3 Composition when the buyer chooses (4C)

Narrow capability: **REPLACE_COMPONENT** only.

```text
Selection
  → explicit VisualEffect(REPLACE_COMPONENT)
  → linkedAssetKey + role OBJECT
  → ProductModelAsset OBJECT link
  → exact ObjectAssetRevision
  → activeAssets / resolve threeD
```

Example:

```text
Chair · Leg Style
├── Wood  → REPLACE_COMPONENT → wood-legs  (ObjectAssetRevision)
└── Metal → REPLACE_COMPONENT → metal-legs (ObjectAssetRevision)
```

Hard rules:

- Root always remains active.
- Activation only via **explicit** binding — never “selection value key equals asset key”.
- Replacement occupies the ModelTarget’s authored local frame.
- No ATTACH_OBJECT / transforms yet (that is 4F).

`deriveVisualState` (asset graph) returns:

- `assetUniverse` — registry (≠ kernel Availability)
- `activeAssets` — deterministic root + bindings + Selection

Docs: [`4C-object-replacement.md`](./4C-object-replacement.md) · [`4C-implementation.md`](./4C-implementation.md)

---

## 5. Selling — how configuration maps to commerce

Commerce is a **downstream projection** of ProductRevision + Selection.

```text
ProductRevision + Selection
        ↓
  CommerceMappingSet (identity choices + mappings)
        ↓
  CommerceResolution  (exact external refs / SKU)
```

- Kernel / visual do not invent SKUs.
- Shopify connection + import prove the provider boundary (3C).
- Live price / inventory / checkout execution are later than mapping fidelity.

Docs: [`3-commerce-resolutions.md`](./3-commerce-resolutions.md) · [`3c-commerce-altered.md`](./3c-commerce-altered.md)

---

## 6. Product lifecycle (merchant mental model)

```text
1. Create Product
2. Draft ProductRevision
3. Author Choices + Constraints          ← meaning
4. Attach root ObjectAssetRevision       ← appearance anchor (4A)
5. Link additional OBJECT (and later MAT/TEX) assets  ← universe (4B)
6. Bind ChoiceValues → SET_MATERIAL / SET_VISIBILITY / REPLACE_COMPONENT
7. Map commerce identity + variants      ← selling
8. Publish                               ← freeze pins + graph snapshot
9. Storefront / resolve: Selection → validation + visuals + commerce
```

Archive rules (product ops):

- Archive product → cascade-archive object assets used **only** by that product.
- Archive object → blocked if any non-archived product still pins it.

---

## 7. One diagram (end-to-end)

```text
                    ProductRevision
                           │
         ┌─────────────────┼─────────────────┐
         ▼                 ▼                 ▼
      Meaning           Appearance         Selling
   Choice/Constraint   ProductModel     CommerceMappingSet
   Selection           + Asset universe + VisualEffects
         │                 │                 │
         └────────────┬────┴────────┬────────┘
                      ▼             ▼
              validate /            resolveConfiguration
              availability          ├── threeD (root + REPLACE + materials)
                                    └── commerce resolution
```

Same ProductRevision + same Selection + same frozen asset graph  
→ same validation, same active asset set, same commerce identity.

---

## 8. What comes next

| Slice | Product capability |
|---|---|
| **4F** | Attachment points, ATTACH_OBJECT, transforms |
| **4G** | Decorations (decals, logos, engraving) |

Done recently: **4E** runtime composition; **4E.1** VisualSetup stack + MODEL/CONFIG editor (`4E.1-implementation.md`).

---

## 9. Slice index (implementation order reference)

Use when implementing or debugging a specific handoff. Prefer §§1–7 above for product understanding.

| File | Slice |
|---|---|
| [`1-kernel.md`](./1-kernel.md) | Product semantics kernel |
| [`2-visual-commerce-domain.md`](./2-visual-commerce-domain.md) | Visual domain + commerce domain framing |
| [`3-commerce-resolutions.md`](./3-commerce-resolutions.md) | Commerce architecture freeze |
| [`3c-commerce-altered.md`](./3c-commerce-altered.md) | Shopify connection + import |
| [`4A-immutable-asset-pinning.md`](./4A-immutable-asset-pinning.md) | Immutable root pin |
| [`4B-multi-asset-model-graph.md`](./4B-multi-asset-model-graph.md) | Multi-asset registry |
| [`4B-implementation.md`](./4B-implementation.md) | 4B shipping notes |
| [`4C-object-replacement.md`](./4C-object-replacement.md) | REPLACE_COMPONENT |
| [`4C-implementation.md`](./4C-implementation.md) | 4C shipping notes |
| [`4d-material-texture-revision.md`](./4d-material-texture-revision.md) | Material + texture revisions |
| [`4D-implementation.md`](./4D-implementation.md) | 4D shipping notes |
| [`4e-integrated-multi-asset-replay.md`](./4e-integrated-multi-asset-replay.md) | Integrated multi-asset replay |
| [`4E-implementation.md`](./4E-implementation.md) | 4E shipping notes |
| [`4E.1-active-3d-editor-authoring-state.md`](./4E.1-active-3d-editor-authoring-state.md) | Earlier 4E.1 authoring brief |
| [`4E.1-product-model-visual-stack.md`](./4E.1-product-model-visual-stack.md) | **Canonical** visual stack + MODEL/CONFIGURATION split |
| [`4E.1-implementation.md`](./4E.1-implementation.md) | 4E.1 shipping / pivot notes |
