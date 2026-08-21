# 4E Implementation Notes — Integrated Multi-Asset Replay

Status: implemented (integration checkpoint)
Depends on: 4C REPLACE_COMPONENT + 4D material/texture revisions

## Goal

One Selection → one composed scene across root object, replacements, and root-owned materials, with history independence:

`fresh(A) == A → B → A` (structure + surfaces)

## Shared derivation (single source of truth)

`@repo/product-graph` `deriveVisualState()` owns semantics:

```ts
structure: Record<slotKey, objectAssetRevisionId>
rootSurfaces: Record<targetKey, { materialAssetRevisionId; materialSlot? }>
```

plus existing `activeAssets` for resolve compatibility.

Editor **does not** re-implement derive. It:

1. Normalizes API → shared bindings / linkedAssets (`normalizeVisualDocument`)
2. Calls package `deriveVisualState` via `deriveDesiredVisualState` / `projectRuntimeVisualState`
3. Applies SET_VISIBILITY as a thin non-semantic overlay only

## Authoring validation

`assertNoStructuralSurfaceConflicts` rejects SET_MATERIAL targets whose `nodePath` is under a REPLACE_COMPONENT target’s subtree (same target key also rejected).

Enforced on create/update visual effect and on publish.

## Runtime (editor only)

- `AssetRuntimeSource` cached by `objectAssetRevisionId`
- `instantiate()` → independent `ObjectRuntimeInstance` (renderer-private; may clone)
- Structural baseline per composition slot captured from root GLB; inactive REPLACE restores baseline (never empty slot)
- Reconcile order: structure → surfaces
- Generation token discards stale async object loads

Customizer storefront is out of scope for this slice.

## Follow-on

**4E.1 — Active 3D Editor Authoring State** makes the Editor a real authoring client over this runtime (selection identity, ModelTarget/binding CRUD, dirty/save/reload). See `4E.1-active-3d-editor-authoring-state.md`.

## Explicitly not in 4E

- Component-local SET_MATERIAL (4F)
- ATTACH_OBJECT / transforms / decorations
- Freezing `THREE.Object3D.clone()` as domain contract
- New Prisma entities

## Verify

```bash
yarn workspace @repo/product-graph test
yarn workspace @repo/product-graph build
yarn workspace editor exec jest -- lib/visual
yarn workspace api exec tsc --noEmit -p tsconfig.json
```

Acceptance covered in tests:

- A: REPLACE active → clear selection → original structural subtree restored
- B: same ObjectRevision in two slots → two independent instances
- C: editor imports package derive only (no editor `derive.ts`)

Manual: pedestal/four-leg × walnut/marble; save → reload → Selection A == fresh A.
