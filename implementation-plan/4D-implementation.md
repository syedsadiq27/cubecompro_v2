# 4D Implementation Notes — Material + Texture Revisions

Status: implemented (capability slice)
Depends on: 4C REPLACE_COMPONENT frozen

## Schema

- `TextureAssetRevision` — immutable artifact pin (`artifactUri` + `contentHash`)
- `MaterialAssetRevision` — immutable definition pin (`definitionUri` + `contentHash`)
- `MaterialTextureUsage` — slot → exact `TextureAssetRevision` (`BASE_COLOR` | `NORMAL` | `METALLIC_ROUGHNESS` | `OCCLUSION` | `EMISSIVE`)
- Migration `20260816140000_material_texture_asset_revisions` backfills tip → v1 revisions and rewrites:
  - `ProductModelAsset` MATERIAL/TEXTURE links asset id → revision id
  - `VisualEffect` SET_MATERIAL `materialAssetId` → `materialAssetRevisionId`
- Migration `20260816150000_store_relative_document_uris` rewrites stored artifact/definition URIs to **store-relative keys** (no `file://` / host absolute / GCS URLs in DB). Resolve via `DOCUMENT_STORE_PATH` (future: env-selected backend + same relative key).

## Contracts

SET_MATERIAL value:

```json
{ "materialAssetRevisionId": "<MaterialAssetRevision.id>" }
```

`materialAssetId` is rejected.

Library create/update material freezes a new revision (tip columns stay for library UX). Texture create freezes v1 revision.

## Runtime

`deriveVisualState`:

- Activates materials only via explicit `SET_MATERIAL` bindings + Selection
- Optional MATERIAL registry scope (non-empty registry must include revision)
- Registry membership alone never activates
- Texture actives filled from `textureRevisionsByMaterialRevisionId` map

`resolveConfiguration.threeD` adds:

- `activeMaterialAssetRevisionIds`
- `activeTextureAssetRevisionIds`
- effect `materialAssetRevisionId` + `/documents/material-revisions/:id`

## Documents

- `GET /documents/material-revisions/:id` (hash-checked)
- `GET /documents/texture-revisions/:id` (hash-checked)
- Tip `GET /documents/materials/:id` retained for library

## Explicitly not in 4D

- SET_TEXTURE
- Shader / environment / decoration
- ATTACH_OBJECT (4F)
- Full editor material authoring UX polish (4E)
- Advanced THREE texture cache eviction framework (ownership rules noted; factory remains editor-side)

## Verify

```bash
yarn workspace api db:migrate
yarn workspace @repo/product-graph test -- visual-state
yarn workspace @repo/product-graph build
yarn workspace api exec tsc --noEmit -p tsconfig.json
```

Manual:

1. Create textures → tip `currentRevisionId`
2. Create material with texture ids → MaterialAssetRevision + MaterialTextureUsage rows
3. Link MATERIAL revisions on ProductModel
4. SET_MATERIAL → `materialAssetRevisionId`
5. resolveConfiguration Selection → active material + texture revision ids
6. New texture/material revision does not mutate historical revision pins
