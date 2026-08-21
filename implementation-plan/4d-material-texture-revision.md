Drop this into Cursor:

```text
Phase 4D — Material + Texture Revisions + Deterministic SET_MATERIAL

Status:
4A ✅ exact immutable root asset
4B ✅ typed multi-asset model graph
4C ✅ REPLACE_COMPONENT
4D ✅ Material + Texture revisions + SET_MATERIAL (see `4D-implementation.md`)

Do not continue into 4E/4F/4G without approval.

==================================================
GOAL
==================================================

Prove that a semantic Selection can deterministically apply an exact frozen
MaterialAssetRevision, whose texture usages reference exact immutable
TextureAssetRevisions, without persisting renderer-specific THREE.* state.

Target invariant:

same ProductRevision
+ same Selection
+ same frozen asset graph
= same active MaterialAssetRevision
+ same exact TextureAssetRevision usages
+ same reconciled material assignment

==================================================
FROZEN DOMAIN MODEL
==================================================

TextureAssetRevision
= immutable image artifact only

MaterialAssetRevision
= immutable renderer-neutral PBR definition
  + exact typed texture usages

VisualEffect
SET_MATERIAL
→ exact MaterialAssetRevision
→ exact VisualAddress

Conceptually:

TextureAsset
└── TextureAssetRevision 🔒
     - id
     - textureAssetId
     - version
     - artifactUri   (store-relative key; resolve via DOCUMENT_STORE_PATH / storage env)
     - contentHash
     - frozenAt
     - basic image metadata if actually needed

MaterialAsset
└── MaterialAssetRevision 🔒
     - id
     - materialAssetId
     - version
     - frozen canonical material definition
     - frozenAt
     - contentHash/signature if consistent with current asset pattern
     └── TextureUsage[]
          - semantic slot
          - exact textureAssetRevisionId
          - texCoord?
          - transform?
          - sampler?

Do NOT persist THREE.Material or THREE.Texture state.

==================================================
MATERIAL DEFINITION
==================================================

Keep the v1 material definition deliberately small and renderer-neutral.

Support only PBR fields actually needed by the existing renderer, e.g.:

- baseColor
- roughness
- metalness
- emissive if already supported
- opacity/alpha only if already required

Do not add a generic material graph.

Do not add shader nodes.

Do not add arbitrary Three.js property bags.

Persist semantic material intent, not renderer implementation settings.

==================================================
TEXTURE SEMANTICS
==================================================

TextureAssetRevision represents immutable image bytes.

Sampling/usage semantics belong to the MaterialAssetRevision's TextureUsage,
not to the TextureAssetRevision itself.

This is important because the same image may be used differently.

Example:

TextureRevision 8
→ same walnut image bytes

MaterialRevision A usage:
- BASE_COLOR
- repeat 2x2

MaterialRevision B usage:
- BASE_COLOR
- repeat 6x1

The TextureRevision does not change.

TextureUsage should carry only what the first implementation actually needs:

- semantic slot
- exact texture revision
- texCoord if needed
- transform if needed
- sampler if needed

Do not build a generic texture-node system.

==================================================
SEMANTIC TEXTURE SLOTS
==================================================

Use explicit semantic slots, not arbitrary strings if the existing code allows
a small enum cleanly.

Likely v1:

BASE_COLOR
NORMAL
METALLIC_ROUGHNESS
OCCLUSION
EMISSIVE

Only include slots the renderer can actually support in this slice.

Renderer interpretation belongs in the material factory.

Example semantics:

BASE_COLOR
→ color texture semantics

EMISSIVE
→ color texture semantics

NORMAL
→ tangent-space normal semantics

METALLIC_ROUGHNESS
→ glTF semantics:
   G = roughness
   B = metallic

OCCLUSION
→ R channel

Do not push these renderer/glTF rules into the persisted domain object.

==================================================
SET_MATERIAL CONTRACT
==================================================

SET_MATERIAL must reference an exact MaterialAssetRevision.

No:

MaterialAsset
→ latest revision

No:

material key
→ lookup current tip

No asset-name/key coincidence.

Activation still requires an explicit VisualEffect.

Flow:

Selection
→ active VisualEffect(SET_MATERIAL)
→ exact materialAssetRevisionId
→ MaterialAssetRevision
→ exact TextureUsage dependencies
→ deriveVisualState()
→ material assignment

ProductModelAsset registry membership alone never activates a material.

==================================================
VISUAL ADDRESS / MATERIAL SLOT
==================================================

Preserve the frozen VisualAddress semantics.

For material assignment:

VisualAddress =
- targetKey
- property = material
- materialSlot?

Rules:

single-material mesh
→ materialSlot may be omitted

multi-material mesh
→ materialSlot is required

Never interpret:

SET_MATERIAL(mesh)
→ replace every material slot

Each slot is its own visual address.

Existing conflict semantics remain unchanged.

Do not invent priority/order/fallback behavior.

==================================================
BASELINE RESTORATION
==================================================

This is non-negotiable.

When SET_MATERIAL applies:
→ assign CubeCom-generated material runtime

When it no longer applies:
→ restore the exact captured GLB baseline material reference

Do NOT rebuild or approximate the original GLB material.

Do NOT derive baseline from CubeCom MaterialAsset.

Baseline remains the original ObjectAsset runtime state captured after load.

Required determinism:

fresh(A)
==
A → B → A

and:

no active SET_MATERIAL
→ exact GLB baseline material reference restored

==================================================
RUNTIME MATERIAL FACTORY
==================================================

Add/extend one renderer boundary that turns frozen domain material data into
runtime THREE.Material / THREE.Texture instances.

Conceptually:

MaterialAssetRevision
+ resolved TextureUsages
        ↓
material runtime factory
        ↓
THREE.Material

Only this renderer layer should know Three.js texture/material implementation.

Do not let normalize/derive domain code instantiate THREE.*.

deriveVisualState() should remain pure with respect to renderer state.

reconcileScene() remains the scene mutation boundary.

==================================================
TWO-LEVEL TEXTURE CACHE
==================================================

Use a two-level runtime cache.

1. SOURCE / IMAGE CACHE

key:
textureRevisionId

purpose:
- fetch/decode immutable image resource once
- same TextureRevision should not repeatedly fetch/decode bytes

2. USAGE-SPECIFIC THREE.TEXTURE CACHE

key must include enough usage semantics to distinguish runtime instances:

textureRevisionId
+ semantic slot
+ texCoord
+ sampler
+ transform

Conceptually:

TextureRevision 8
    ↓ source cache
decoded immutable image
    ├── THREE.Texture A, repeat 2x2
    └── THREE.Texture B, repeat 6x1

Do not persist TextureInstance.

This cache is renderer infrastructure only.

Do not assume one TextureRevision = one THREE.Texture instance.

==================================================
RUNTIME RESOURCE OWNERSHIP
==================================================

Make ownership explicit.

Loaded ObjectAsset runtime owns:
- GLB baseline materials
- GLB baseline textures

CubeCom material runtime/cache owns:
- generated THREE.Material instances
- generated usage-specific THREE.Texture instances

Selection changes do NOT immediately dispose previous generated resources.

Bad:

selection A → B
→ dispose A material immediately

because resources may be cached/shared/reused.

Dispose when:
- owning model/runtime is torn down
- cache lifecycle ends
- later explicit eviction policy

Do not build an advanced eviction strategy now.

Just make ownership deterministic and avoid premature disposal.

==================================================
IMMUTABILITY
==================================================

Texture revision immutability:

new image bytes
→ new TextureAssetRevision

Never overwrite old revision.

Material revision immutability:

If any of these change:
- material PBR definition
- exact TextureAssetRevision dependency
- texture usage/sampler/transform semantics that are part of the frozen definition

→ create a new MaterialAssetRevision

Example:

MaterialRevision 4
→ TextureRevision 8

new TextureRevision 9 exists

MaterialRevision 4 stays unchanged.

If material adopts TextureRevision 9:

MaterialRevision 5
→ TextureRevision 9

Historical ProductRevisions using MaterialRevision 4 remain unchanged.

==================================================
HASHING / CANONICAL IDENTITY
==================================================

For TextureAssetRevision:
hash immutable texture artifact bytes.

For MaterialAssetRevision:
its frozen identity must include:
- canonical renderer-neutral material definition
- exact texture revision references
- frozen texture usage semantics

Do not hash mutable runtime THREE state.

Use the same canonicalization approach already established elsewhere where
possible.

Avoid inventing a large generic hashing framework.

==================================================
EMBEDDED GLB MATERIALS / TEXTURES
==================================================

Embedded GLB resources remain baseline/private resources of the
ObjectAssetRevision.

Do NOT automatically promote them into:
- MaterialAsset
- TextureAsset

Do NOT promise lossless embedded-material import in 4D.

CubeCom reusable MaterialAsset / TextureAsset resources are explicitly authored
resources.

No competing authority.

==================================================
NO SET_TEXTURE
==================================================

Do not add:

ChoiceValue
→ SET_TEXTURE
→ TextureAssetRevision

in 4D.

For now the only supported reusable surface path is:

ChoiceValue
→ SET_MATERIAL
→ MaterialAssetRevision
→ TextureAssetRevision(s)

If a real later product needs direct texture switching, that can earn its own
operation.

==================================================
PRODUCT MODEL ASSET REGISTRY
==================================================

4B already established ProductModelAsset[] as the typed asset universe.

For 4D:

- MATERIAL links may reference exact MaterialAssetRevisions
- TEXTURE links may reference exact TextureAssetRevisions

But:

registry membership
!= activation

A material only becomes active through explicit SET_MATERIAL.

A texture only participates through an active MaterialAssetRevision usage.

Do not make texture assets independently render-active.

==================================================
FAILURE BEHAVIOR
==================================================

Fail explicitly for at least:

- SET_MATERIAL points to missing MaterialAssetRevision
- MaterialAssetRevision references missing TextureAssetRevision
- material revision belongs outside allowed model/revision scope
- referenced material resource is not revision-backed
- multi-material target requires materialSlot but none is provided
- invalid/unsupported texture usage
- artifact hash mismatch / texture load failure where applicable

Do not:
- silently use latest material
- silently use latest texture
- silently use GLB material as substitute for a broken explicit SET_MATERIAL
- silently apply another slot

==================================================
TESTS / ACCEPTANCE
==================================================

Use a concrete proof such as:

Top Material Choice:
- Walnut
- Marble

Walnut:
→ SET_MATERIAL
→ Walnut MaterialRevision 4

Walnut MaterialRevision 4:
→ BASE_COLOR TextureRevision 8
→ NORMAL TextureRevision 3

Verify:

1.
Walnut selection
→ exact MaterialRevision 4

2.
MaterialRevision 4
→ exact TextureRevision 8 + 3

3.
Same frozen ProductRevision + Selection
→ same material revision
→ same exact texture revisions
→ same VisualState

4.
Creating TextureRevision 9
does NOT change MaterialRevision 4.

5.
Creating MaterialRevision 5 using TextureRevision 9
does NOT alter products still referencing MaterialRevision 4.

6.
No SET_MATERIAL binding
→ exact GLB baseline material restored.

7.
Walnut → Marble → Walnut
→ same final managed material state as fresh Walnut.

8.
No asset-key/name coincidence activates a material.

9.
ProductModelAsset MATERIAL/TEXTURE membership alone does nothing.

10.
Multi-material mesh:
slot-specific SET_MATERIAL changes only the addressed slot.

11.
Missing material revision fails explicitly.

12.
Missing texture revision fails explicitly.

13.
Runtime caches:
same TextureRevision source is fetched/decoded once where practical,
but different usage transforms/samplers can produce separate THREE.Texture instances.

14.
Selection changes do not prematurely dispose shared/cached resources.

==================================================
OUT OF SCOPE
==================================================

Do NOT implement:

- SET_TEXTURE
- shader graph
- ShaderAsset runtime
- environments
- decals
- engraving
- decoration
- attachment points
- ATTACH_OBJECT
- transforms
- 4E authoring UX
- generic material graph
- generic AssetDependency graph
- lossless embedded GLB material promotion
- cache eviction framework

==================================================
DEFINITION OF DONE
==================================================

4D is green when this is real:

Selection
→ explicit SET_MATERIAL
→ exact immutable MaterialAssetRevision
→ exact frozen TextureAssetRevision usages
→ pure VisualState
→ renderer material factory
→ slot-specific reconcileScene assignment

and removal/change of the binding restores the exact original GLB baseline
material reference.

Run:
- migrations
- focused API/domain tests
- editor/runtime tests
- typecheck
- manual visual proof

Then STOP.

Report:
- schema changes
- material/texture revision model
- normalization path
- material factory behavior
- runtime cache ownership
- baseline restoration proof
- tests/typecheck
- manual verification
- any concrete contradiction discovered

Do not continue into 4E without explicit approval.
```

That is the version I’d give Cursor. The main thing to guard now is scope: 4D should make materials/textures revision-safe and deterministic, not accidentally become a full material editor or shader system.
