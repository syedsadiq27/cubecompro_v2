Phase 4A — Immutable Product Asset Pinning

STATUS: DONE / FROZEN
Stop here. Do not disturb the single-root pin path in follow-on work.
Next slice: 4B — Multi-Asset Model Graph (`4B-multi-asset-model-graph.md`).

Goal:
Make every ProductRevision load exactly one immutable 3D runtime artifact revision, with no fallback, substitution, or “latest asset” behavior.

Do not start 4B+ in this run.

Core model:

ObjectAsset
  → ObjectAssetRevision

ObjectAssetRevision is immutable and represents one exact frozen runtime artifact.

Conceptually:

ObjectAssetRevision
- id
- objectAssetId
- version
- runtimeArtifactUri
- contentHash
- frozenAt

ProductRevision
  → ProductModel
  → objectAssetRevisionId
  → ObjectAssetRevision
  → exact GLB

Hard invariant:

A ProductModel references one exact immutable ObjectAssetRevision.
That reference must never be dynamically upgraded, substituted, repaired, or resolved to “latest”.

Historical behavior must stay stable.

If ProductRevision 7 was published with ObjectAssetRevision 3, it must continue to load revision 3 even after revision 4 exists.

==================================================
IMMUTABILITY
==================================================

Immutability applies to the whole historical chain.

Published ProductRevision:
- ProductModel.objectAssetRevisionId cannot change.
- ObjectAssetRevision content cannot change.

Draft ProductRevision:
- may explicitly repoint ProductModel to another ObjectAssetRevision.

Creating a new ObjectAssetRevision is required whenever runtime artifact bytes change.

Do not overwrite an existing revision.

==================================================
DRAFT CLONING
==================================================

When cloning a ProductRevision:

Revision 7
→ ProductModel A
→ ObjectAssetRevision 3

New draft Revision 8 must initially become:

Revision 8
→ cloned ProductModel B
→ ObjectAssetRevision 3

Do NOT automatically move the clone to the latest asset revision.

Only an explicit edit may repoint revision 8 to revision 4.

Creating a new product revision must not silently change visual representation.

==================================================
INGESTION
==================================================

Supported source may be GLTF / GLB / ZIP as existing ingestion allows.

Normalize ingestion to:

merchant upload
→ validate
→ canonical self-contained GLB
→ calculate content hash
→ store immutable artifact
→ create ObjectAssetRevision

Prefer immutable/content-addressed storage conceptually:

/assets/sha256/<hash>.glb

rather than mutable paths like:

/assets/table.glb

contentHash verifies artifact identity.
Storage must not permit silently replacing the bytes for an existing revision.

Do not build a generic asset processing platform.
Use the smallest existing upload/storage path that satisfies this.

==================================================
MIGRATION
==================================================

Inspect the current schema first.

Expected current direction is roughly:

ProductModel
→ assetId
→ ObjectAsset

Move to:

ObjectAsset
→ ObjectAssetRevision v1
ProductModel
→ objectAssetRevisionId

For existing ObjectAssets:
- create one initial ObjectAssetRevision from the current canonical artifact
- compute/store contentHash
- pin existing ProductModels to that revision

Do not invent historical revisions that never existed.

Keep migration boring.

==================================================
STRICT RUNTIME LOADING
==================================================

The editor/runtime must load only:

ProductRevision
→ ProductModel
→ exact ObjectAssetRevision
→ exact runtimeArtifactUri

Remove every fallback path such as:
- demo chair
- first available asset
- default asset
- another product's asset
- latest asset revision
- silent repair/substitution

Expected failures:

missing ProductModel
→ explicit NOT_CONFIGURED style failure

missing ObjectAssetRevision
→ explicit failure

missing artifact
→ explicit failure

corrupt/hash-mismatched artifact
→ explicit failure

revoked/release lifecycle is NOT part of 4A yet.

Never recover by loading another asset.

==================================================
DO NOT IMPLEMENT IN 4A
==================================================

Do not add:

- Object Library UI/platform
- folders/tags/search
- generic dependency graph
- AssetHealth service
- CompatibilityResult persistence
- release workflow
- AVAILABLE / RETIRED / REVOKED implementation
- MaterialAssetRevision
- TextureAssetRevision
- Publication
- component swapping
- attachment points
- transforms
- decoration
- shader system
- 4B target-authoring work

Those are later slices.

==================================================
TEST / ACCEPTANCE CASES
==================================================

Must prove at least:

1.
ProductRevision A
→ ProductModel
→ ObjectAssetRevision 1
→ exact artifact 1 loads

2.
ProductRevision B
→ ProductModel
→ ObjectAssetRevision 2
→ exact artifact 2 loads

3.
Creating ObjectAssetRevision 3 does NOT change A or B.

4.
Editing a draft may explicitly repoint its ProductModel.

5.
Published ProductRevision cannot repoint its ProductModel.objectAssetRevisionId.

6.
Cloning ProductRevision A creates a new draft that initially still pins ObjectAssetRevision 1.

7.
Changing asset bytes creates a new ObjectAssetRevision rather than mutating the old revision.

8.
Old ProductRevision continues loading the exact old bytes after newer asset revisions exist.

9.
Missing ProductModel fails explicitly.

10.
Missing ObjectAssetRevision fails explicitly.

11.
Missing/corrupt/hash-mismatched artifact fails explicitly.

12.
No fallback/demo/first-asset behavior remains.

13.
Another product's ObjectAssetRevision is never substituted.

==================================================
DEFINITION OF DONE
==================================================

4A is green when this is real:

ProductRevision
→ exact revision-bound ProductModel
→ exact immutable ObjectAssetRevision
→ exact canonical GLB
→ strict editor/runtime load

and historical product revisions cannot change merely because new asset revisions are uploaded later.

Run:
- relevant migrations
- API/unit tests
- editor/runtime tests
- typecheck

Also manually prove with at least two asset revisions that:
- old revision still loads old artifact
- new draft can explicitly move to new artifact
- published old revision stays unchanged

Then STOP.

Report:
- schema changes
- migration/backfill behavior
- storage/hash behavior
- published-revision immutability enforcement
- draft clone behavior
- fallback paths removed
- tests/typecheck
- manual verification performed
- any concrete contradiction discovered

Do not continue into 4B without explicit approval.