Phase 4C — Object Replacement / Composition (REPLACE_COMPONENT)

STATUS: IMPLEMENTED (narrow)
Depends on: 4B ✅ frozen multi-asset model graph
Supporting notes: `4C-implementation.md`

==================================================
GOAL
==================================================

Prove deterministic, selection-driven activation of additional immutable
ObjectAssetRevisions via explicit VisualBinding / REPLACE_COMPONENT.

Invariant to prove:

same ProductRevision
+ same Selection
+ same frozen asset graph
= same active asset set

==================================================
HARD GUARDRAILS
==================================================

1. Root authority remains ProductModel.objectAssetRevisionId.
   OBJECT/root is a mechanical mirror only — never a second write authority.

2. Only immutable revision-backed resources may become render-active.
   OBJECT links (ObjectAssetRevision) may activate.
   MATERIAL / TEXTURE links may remain listed in assetUniverse but MUST NOT
   become render-active until 4D.

3. ProductModelAsset[] is a resource registry, not the configuration language.
   Explicit VisualBinding drives activation — never key/name coincidence.

4. ATTACH_OBJECT is OUT OF SCOPE (belongs to 4F with attachment frames).

==================================================
SCOPE
==================================================

In:

- REPLACE_COMPONENT
- linked ObjectAssetRevision keys
- ModelTarget local-frame inheritance (replacement occupies authored target frame)
- deriveVisualState(assetUniverse + activeAssets)
- resolveConfiguration surfaces active object revisions + effects

Out:

- ATTACH_OBJECT
- transforms / attachment points
- material/texture activation
- editor multi-asset authoring UX (4E)
- decorations

==================================================
FLOW
==================================================

Selection
  → explicit VisualEffect(REPLACE_COMPONENT)
  → linkedAssetKey + role OBJECT
  → ProductModelAsset OBJECT link
  → exact ObjectAssetRevision
  → activeAssets / resolve threeD.effects

Value contract:

{ "linkedAssetKey": "wood-legs", "role": "OBJECT" }

==================================================
ROADMAP (APPROVED)
==================================================

4A ✅ Immutable exact root asset
4B ✅ Typed multi-asset model graph (frozen)
4C ✅ REPLACE_COMPONENT (this slice)
4D ✅ Material + Texture revisions + SET_MATERIAL
4E — Integrated multi-asset authoring / replay
4F — Attachment points + ATTACH_OBJECT + transforms
4G — Decorations

==================================================
ACCEPTANCE
==================================================

1. Root always active.
2. Explicit binding + selection activates replacement ObjectAssetRevision.
3. No binding → no replacement, even if selection value key equals an asset key.
4. MATERIAL/TEXTURE never appear in activeAssets material/texture lists.
5. OBJECT/root cannot be independently edited/deleted/repointed via link APIs.
6. Reload / re-resolve with same Selection returns the same active set.

Then STOP unless 4D is explicitly approved.
