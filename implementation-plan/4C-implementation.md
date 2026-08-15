# 4C Implementation Notes — REPLACE_COMPONENT

Status: implemented (capability slice)
Depends on: 4B frozen

## Guardrail fixes carried from 4B review

### Root mirror (single authority)

- Authority: `ProductModel.objectAssetRevisionId`
- Mirror: `ProductModelAsset(role=OBJECT, key=root)` kept in sync on create / root repoint / publish tip advance
- `updateProductModelLinkedAsset` / `deleteProductModelLinkedAsset` **reject** OBJECT/root entirely
- `deriveVisualState` throws if mirror disagrees with root pin

### Naming

- `assetUniverse` = linked resource registry (not kernel Availability)
- `activeAssets` = deterministic root + bindings + Selection result

## REPLACE_COMPONENT

### Schema

`VisualOperation.REPLACE_COMPONENT` (migration `20260815193000_visual_operation_replace_component`)

### Binding value

```json
{ "linkedAssetKey": "wood-legs", "role": "OBJECT" }
```

Helpers: `@repo/product-graph` `parseReplaceComponentValue` / `replaceComponentValueJson`

### Authoring validation

`createVisualEffect` / `updateVisualEffect` require:

- `role === "OBJECT"`
- linked key exists on the **same** ProductModel as the ModelTarget
- key is not reserved `root`
- link pins a real `ObjectAssetRevision`

### Runtime

`deriveVisualState({ root, linkedAssets, selection, bindings })`:

- always activates root
- activates explicit REPLACE_COMPONENT matches only
- never activates MATERIAL/TEXTURE
- never matches by selection value key coincidence

`resolveConfiguration.threeD`:

- `rootObjectAssetRevisionId`
- `activeObjectAssetRevisionIds`
- effects include `objectAssetRevisionId` + `linkedAssetKey` for REPLACE_COMPONENT

## Explicitly not in 4C

- ATTACH_OBJECT (→ 4F)
- material/texture render activation (→ 4D)
- editor authoring UX integration (→ 4E)
- attachment transforms

## Verify

```bash
yarn workspace api db:migrate
yarn workspace @repo/product-graph test -- visual-state
yarn workspace api exec tsc --noEmit -p tsconfig.json
```

Manual:

1. Link extra OBJECT revisions on a draft model (`wood-legs`, `metal-legs`)
2. Create ChoiceValue visual effects with REPLACE_COMPONENT → those keys
3. `resolveConfiguration` with each selection → matching `objectAssetRevisionId`
4. Confirm no activation when selection value equals a link key but no binding exists
5. Confirm OBJECT/root link update/delete fails
