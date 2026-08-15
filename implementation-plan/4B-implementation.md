# 4B Implementation Notes — Multi-Asset Model Graph

Status: implemented (schema + API + `deriveVisualState` contract)
Depends on: 4A frozen root pin

## What shipped

### Schema

```text
ProductModel
├── objectAssetRevisionId          (required root — unchanged from 4A)
└── ProductModelAsset[]            (typed many-to-many link layer)
      ├── role   OBJECT | MATERIAL | TEXTURE | ENVIRONMENT | SHADER | ANIMATION
      ├── key    stable semantic key within the model
      └── assetRevisionId   exact immutable pin (polymorphic by role)
```

- Unique: `(productModelId, role, key)`
- Migration `20260815192000_product_model_asset_links` backfills `OBJECT/root` for every existing `ProductModel`
- Constant root key: `root` (`PRODUCT_MODEL_ROOT_ASSET_KEY`)

### Root vs additional links

| Concern | Behavior |
|---|---|
| Root pin | Still `ProductModel.objectAssetRevisionId` |
| Mirror | Always kept in sync as `ProductModelAsset(role=OBJECT, key=root)` |
| Additional OBJECT links | Allowed with other keys (`pedestal-base`, …) |
| Cannot | Create/rename/delete the `root` link via linked-asset mutations |

### Role validation (this slice)

| Role | `assetRevisionId` resolves to |
|---|---|
| OBJECT | `ObjectAssetRevision.id` |
| MATERIAL | `MaterialAsset.id` (stand-in until MaterialAssetRevision in 4D) |
| TEXTURE | `TextureAsset.id` (stand-in until TextureAssetRevision in 4D) |
| ENVIRONMENT / SHADER / ANIMATION | Rejected on write — reserved for later slices |

### API

Mutations:

- `createProductModelLinkedAsset`
- `updateProductModelLinkedAsset`
- `deleteProductModelLinkedAsset`

`productRevisionDetail.models[].linkedAssets` returns the universe.

### Immutability / clone / publish

- Draft-only writes (same as other graph authoring)
- Draft clone copies `linkedAssets` pins as-is (no tip jump)
- Publish may still advance **root** tip (existing 4A/product behavior) and syncs `OBJECT/root`
- Additional linked assets are **not** tip-advanced on publish

### `deriveVisualState()` (package `@repo/product-graph`)

```ts
deriveVisualState({
  rootObjectAssetRevisionId,
  linkedAssets: [{ role, key, assetRevisionId }],
})
```

Returns:

- `available` — full linked universe grouped by role
- `active` — **4B:** only `[rootObjectAssetRevisionId]` for objects; other actives empty

Selection-driven activation (REPLACE_COMPONENT, materials, env) is **4C+**.

## What this does *not* do

- Generic `AssetDependency` graph
- Choice/if rules on link rows
- REPLACE_COMPONENT / ATTACH_OBJECT runtime (4C)
- Material/Texture revision tables (4D)
- Authoring UI for multi-asset links (4E)
- Attachment points / decorations

## How to verify

1. Migrate: `yarn workspace api db:migrate`
2. Unit: `yarn workspace @repo/product-graph test visual-state`
3. Attach product model → detail shows `linkedAssets` with `OBJECT/root`
4. Draft: link additional OBJECT / MATERIAL / TEXTURE
5. Clone draft → same link pins
6. Try archive/link ENVIRONMENT → rejected
7. Try delete `root` link → rejected

## Next (4C)

Visual bindings / operations reference `ProductModelAsset.key` (not naked revision ids) so composition stays typed.

## 4B review amendments (applied before/with 4C)

- OBJECT/root is not independently editable; authority is `objectAssetRevisionId`
- MATERIAL/TEXTURE links are registry-only until 4D (must not become render-active in 4C)
- `deriveVisualState` uses `assetUniverse` + `activeAssets` (not kernel Availability)
