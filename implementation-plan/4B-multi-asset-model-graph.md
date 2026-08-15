Phase 4B — Multi-Asset Model Graph

STATUS: IMPLEMENTED (stop unless 4C is explicitly approved)
Depends on: 4A ✅ frozen single-root ObjectAssetRevision pinning
Supporting notes: `4B-implementation.md`

==================================================
GOAL
==================================================

Extend the asset architecture so one ProductModel can link many immutable
asset revisions (objects, materials, textures, environments, later shaders /
animations), while visual rules decide which linked assets participate for a
Selection.

Preserve 4A’s proven root pin. Soften “one object only” into:

A ProductModel has one required root object asset revision, and may link many
additional immutable asset revisions of different types.

Do not turn ProductModel into a naked AssetRevision[] bag.
Do not invent a generic AssetDependency(from, to, type, metadata) graph yet.

==================================================
WHY NOT NAKED ARRAYS
==================================================

Do not do:

ProductModel
→ AssetRevision[]

because then this means nothing:

asset #1 = chair.glb
asset #2 = walnut material
asset #3 = logo texture
asset #4 = HDRI

Every linked asset must carry an explicit semantic role and key.

==================================================
ASSET IDENTITY (GENERALIZE)
==================================================

Conceptually generalize identity / revisioning across kinds:

Asset
├── OBJECT
├── MATERIAL
├── TEXTURE
├── ENVIRONMENT
├── later SHADER
└── later ANIMATION

Asset
→ AssetRevision 🔒 (immutable bytes + contentHash + frozenAt)

4A already proved this for OBJECT via ObjectAsset → ObjectAssetRevision.
4B may keep existing concrete tables at first and introduce a shared conceptual
model; do not force a premature universal Asset table if concrete tables still
fit. Identity/revision immutability is the shared rule.

==================================================
CORE MODEL
==================================================

Keep the root model special:

ProductRevision
→ ProductModel
   ├── rootObjectAssetRevisionId   (required, 4A pin)
   └── ProductModelAsset[]         (many-to-many link layer)

ProductModelAsset
- id
- productModelId
- assetRevisionId          (exact immutable revision)
- role                     (OBJECT | MATERIAL | TEXTURE | ENVIRONMENT | …)
- key                      (stable semantic key within the model)

Example — Alder Table Model:

OBJECT
- root-table          (also mirrored by rootObjectAssetRevisionId)
- pedestal-base
- four-leg-base
- drawer-module

MATERIAL
- walnut
- oak
- marble

TEXTURE
- walnut-normal
- marble-roughness

ENVIRONMENT
- studio-light
- showroom-light

Cardinality:

ProductModel ↔ many ObjectAssetRevisions
ProductModel ↔ many Material/TextureAssetRevisions
ProductModel ↔ many EnvironmentAssetRevisions
…later shaders / animations

Many products may share the same AssetRevision.
One product model may link many AssetRevisions.
That is many-to-many at the link layer, typed by role/key.

==================================================
ARCHITECTURAL SPLIT (FREEZE)
==================================================

1. ProductModelAsset
   = which immutable assets are available to this model (the asset universe)

2. Visual rules / bindings
   = when / how those assets participate for a Selection

Do not put business rules on ProductModelAsset rows
(e.g. “if choice = pedestal”). Ownership and projection stay separate.

Conceptually:

Selection
+ ProductModelAsset links
+ Visual rules / bindings
        ↓
deriveVisualState()
        ↓
active objects
active materials
active environment
…

Examples:

Base Style = Pedestal
→ load/use key pedestal-base

Base Style = Four Leg
→ load/use key four-leg-base

Top Material = Marble
→ use marble material

Scene = Showroom
→ use showroom environment

==================================================
ROOT VS COMPOSITION
==================================================

Revised 4A-compatible rule:

- root ObjectAssetRevision remains singular and required
- additional ObjectAssetRevisions participate through composition / rules,
  not by becoming additional roots
- materials, textures, environments never become roots

So:

ProductModel
├── rootObjectAssetRevisionId
└── ProductModelAsset[]
      ├── additional objects
      ├── materials
      ├── textures
      ├── environments
      └── later shaders / animations

==================================================
IMMUTABILITY (CARRY FORWARD FROM 4A)
==================================================

- AssetRevision content cannot change after create
- Published ProductRevision cannot silently upgrade links to “latest”
- Draft may explicitly add / remove / repoint ProductModelAsset rows
- Cloning a ProductRevision clones ProductModelAsset pins as-is
- New bytes → new AssetRevision, never overwrite

==================================================
DO NOT IMPLEMENT IN 4B
==================================================

- generic AssetDependency graph
- putting choice/if logic on ProductModelAsset
- full REPLACE_COMPONENT / ATTACH_OBJECT runtime (that is 4C)
- MaterialAssetRevision / TextureAssetRevision as a full platform (4D)
- real multi-asset authoring/replay UX (4E)
- attachment points / semantic transforms (4F)
- decorations (4G)
- release / revoke lifecycle
- shader / animation systems

4B answers only:

How does this ProductModel reference many exact AssetRevisions, with typed
roles/keys, while preserving one root object pin?

==================================================
ROADMAP (UPDATED)
==================================================

4A ✅ Immutable root asset pinning

4B ✅ Multi-Asset Model Graph (FROZEN)
     ProductModel ↔ many immutable AssetRevisions via ProductModelAsset
     OBJECT/root is a mechanical mirror of objectAssetRevisionId only

4C ✅ REPLACE_COMPONENT
     Selection → explicit binding → linked ObjectAssetRevision activation
     ATTACH_OBJECT deferred to 4F

4D — Material + Texture Assets
     MaterialAssetRevision / TextureAssetRevision
     SET_MATERIAL → exact MaterialAssetRevision

4E — Integrated Multi-Asset Authoring / replay

4F — Attachment points + ATTACH_OBJECT + transforms

4G — Decorations

==================================================
DEFINITION OF DONE (WHEN STARTED)
==================================================

4B is green when:

- ProductModel keeps one required root ObjectAssetRevision
- ProductModel can link many additional AssetRevisions via ProductModelAsset
  with role + key
- published pins do not auto-upgrade
- draft clone preserves linked pins
- no naked ProductModel.assets[] without role/key
- no generic dependency graph
- deriveVisualState() contract is specified (even if only root+declared links
  resolve in this slice)

Then STOP unless 4C is explicitly approved.

Report:
- schema for ProductModelAsset (or equivalent)
- how root relates to OBJECT role links
- immutability / clone / publish behavior
- what deriveVisualState() returns in 4B vs deferred to 4C+
- tests / typecheck / manual proof
- contradictions with 4A
