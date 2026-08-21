Drop this into Cursor:

```text
Phase 4E — Integrated Multi-Asset Replay

Status:
4A ✅ Immutable exact root asset
4B ✅ Typed multi-asset model graph
4C ✅ REPLACE_COMPONENT
4D ✅ Material + Texture revisions
4E ✅ Integrated multi-asset replay (see `4E-implementation.md`)

Do not continue into 4F without approval.

==================================================
GOAL
==================================================

Prove that one semantic Selection deterministically produces one composed visual state across:

- root object
- replacement object revisions
- root-owned material overrides

The target invariant is:

same ProductRevision
+ same Selection
+ same frozen asset graph
= same composed scene

And:

fresh(A) == A → B → A

==================================================
PURE DESIRED STATE
==================================================

deriveVisualState() must describe the desired result only.

Do NOT encode mutation order into VisualEffect ordering.

Conceptually:

VisualState
├── structure
│    └── compositionSlotKey → exact ObjectAssetRevision
│
└── rootSurfaces
     └── VisualAddress → exact MaterialAssetRevision

deriveVisualState() remains pure.

It must not:
- load assets
- instantiate THREE.Object3D
- mutate scene objects
- fetch materials/textures
- depend on current scene state

==================================================
RECONCILIATION ORDER
==================================================

reconcileScene() owns mutation.

Order is explicit:

1. reconcile structural/component replacements
2. wait for current structural instances to be correct
3. resolve root-owned surface targets
4. reconcile exact material-slot overrides
5. restore removed overrides from the correct baseline

Database row order / VisualEffect order has zero rendering semantics.

Structure always reconciles before surfaces.

==================================================
STRUCTURAL TARGETS VS SURFACE TARGETS
==================================================

REPLACE_COMPONENT operates on structural targets.

SET_MATERIAL in 4E operates only on ROOT-owned surface targets.

Example:

Structural target:
legs
→ /Table/Legs/**

Root surface target:
table-top
→ /Table/Top/TopMesh

This is valid.

But this is NOT valid in 4E:

Structural target:
legs
→ /Table/Legs/**

Surface target:
leg-finish
→ /Table/Legs/LegMesh

SET_MATERIAL → leg-finish

because that surface target lives inside a replaceable structural subtree.

4E authoring/publish validation must reject this.

Do NOT defer detection to reconcileScene().

Rule:

root surface target
∩
replaceable structural subtree
→ INVALID AUTHORING in 4E

Do not introduce:
- temporarily missing targets
- masked targets
- conditional root surface targets
- silent no-op
- fallback target lookup

Replacement-local surface addressing belongs to 4F.

==================================================
OBJECT ASSET SOURCE VS RUNTIME INSTANCE
==================================================

ObjectAssetRevision identifies reusable immutable source data.

It does NOT identify one mutable THREE.Object3D instance.

Runtime distinction:

ObjectAssetRevision
        ↓
AssetRuntimeSource
        ↓ instantiate()
ObjectRuntimeInstance

The source/template may be cached by:

objectAssetRevisionId

But NEVER cache this:

objectRuntimeCache[objectAssetRevisionId]
= mounted THREE.Object3D

because the same revision may be instantiated multiple times.

Example:

ObjectRevision 12
├── instance for slot A
└── instance for slot B

These must be independent THREE.Object3D instances.

==================================================
RUNTIME INSTANCE IDENTITY
==================================================

Conceptually:

ObjectRuntimeInstance {
  runtimeInstanceId
  objectAssetRevisionId
  compositionSlotKey
  object3D
  baseline
}

runtimeInstanceId is runtime-only.

Do NOT persist it.

Do NOT put THREE.Object3D into ProductRevision / VisualDocument persistence.

Each runtime instance owns its own mutable Three.js state and baseline.

==================================================
INSTANCE BASELINE
==================================================

Every loaded object runtime instance must capture and own its own baseline.

Root instance:
→ root baseline

Replacement instance:
→ its own baseline

Never share mutable baseline state between two instances of the same ObjectAssetRevision.

When overrides disappear, restore from the baseline belonging to that exact runtime instance.

==================================================
ASYNC / STALE LOAD SAFETY
==================================================

Structural asset loading may be asynchronous.

Use reconciliation generation/version semantics.

Conceptually:

Selection A
→ reconciliation generation 10
→ begin loading ObjectRevision X

Selection B arrives
→ generation 11
→ desired structure changes

X finishes loading late

generation check:
10 != current 11
→ discard stale result
→ DO NOT mount/reconcile it

Late asset loads must never mutate a newer desired composition.

Do not build a generic async pipeline framework.

Use the smallest generation/token mechanism that makes stale results impossible.

==================================================
RECONCILIATION FLOW
==================================================

Selection
    ↓
deriveVisualState()                 PURE
    ↓
VisualState
├── structure
│    slot → exact ObjectRevision
│
└── rootSurfaces
     VisualAddress → exact MaterialRevision

    ↓

reconcileScene()

1. capture current reconciliation generation

2. reconcile structure
   - resolve exact ObjectAssetRevision
   - load/cache immutable source
   - instantiate independent ObjectRuntimeInstance
   - reject stale async results
   - mount into structural slot

3. resolve ROOT-owned surface targets

4. reconcile exact MaterialAssetRevision / materialSlot

5. restore removed material overrides from exact baseline references

6. resulting scene must equal desired VisualState

==================================================
TARGET COMPATIBILITY
==================================================

Changing the root ObjectAssetRevision invalidates assumptions about target paths.

If a ProductRevision changes root asset revision:

old root revision
→ new root revision

copied targets/bindings may remain as authoring convenience, but must be revalidated.

Do not automatically remap.

Missing or ambiguous target resolution remains an explicit failure.

==================================================
PERSISTENCE RULES
==================================================

Persist:
- semantic bindings
- structural target identity
- surface target identity
- exact ObjectAssetRevision refs
- exact MaterialAssetRevision refs

Never persist:
- THREE.Object3D
- THREE.Material
- THREE.Texture
- runtimeInstanceId
- reconciliation generation
- mounted scene references
- renderer cache state

==================================================
FROZEN 4E RULES
==================================================

1. deriveVisualState describes desired state, never mutation order.

2. Structure reconciles before surfaces.

3. Database / VisualEffect ordering has no rendering semantics.

4. REPLACE_COMPONENT operates on structural targets.

5. SET_MATERIAL in 4E operates only on root-owned surface targets.

6. Replacement-local material targeting is deferred to 4F.

7. Every loaded ObjectRuntimeInstance owns/restores its own baseline.

8. Stale async loads cannot reconcile against a newer Selection.

9. Changing root ObjectAssetRevision requires target compatibility revalidation.

10. THREE.Object3D / Material / Texture instances never enter persistence.

11. A root surface target may not live inside a replaceable structural subtree.

12. ObjectAssetRevision represents reusable immutable source identity,
    never one globally shared mutable THREE.Object3D instance.

==================================================
ACCEPTANCE
==================================================

Use at least one real composition scenario.

Example:

Base Style:
- Pedestal
- Four Leg

Top Material:
- Walnut
- Marble

Verify:

1.
Root object always remains authoritative.

2.
Pedestal selection
→ exact pedestal ObjectAssetRevision active.

3.
Four Leg selection
→ exact four-leg ObjectAssetRevision active.

4.
Walnut
→ exact root surface gets exact Walnut MaterialAssetRevision.

5.
Marble
→ exact root surface gets exact Marble MaterialAssetRevision.

6.
Changing structure does not depend on VisualEffect row ordering.

7.
Changing material does not mutate structural activation semantics.

8.
fresh(A)
==
A → B → A

9.
save → reload → Selection A
==
fresh Selection A

10.
Root surface target inside a replaceable structural subtree
→ authoring validation failure.

11.
Same ObjectAssetRevision used in two composition slots
→ two independent THREE.Object3D instances.

12.
No reparenting/shared-mutation bug between those instances.

13.
Late async load from stale Selection
→ discarded and never mounted.

14.
Removing material override
→ exact GLB baseline material restored.

15.
Missing/ambiguous target
→ explicit failure.

==================================================
OUT OF SCOPE
==================================================

Do NOT implement:

- component-local SET_MATERIAL
- ATTACH_OBJECT
- attachment frames / sockets
- semantic transforms
- offsets / rotation / scale rules
- decoration
- engraving
- decals
- runtime text/image personalization
- generic scene graph DSL
- ordering/priority semantics
- conditional target masking
- automatic target remapping
- persisted runtime instance identity

Those belong to later slices.

==================================================
DEFINITION OF DONE
==================================================

4E is green when:

Selection
→ pure VisualState
→ deterministic structure reconciliation
→ independent object instances
→ root-only material reconciliation
→ exact baseline restoration

and the final scene is history-independent.

Required proofs:

fresh(A) == A → B → A

and:

save → reload → A == fresh(A)

Then STOP.

Report:
- VisualState shape changes
- structural/surface reconciliation flow
- runtime source/instance cache behavior
- stale async protection
- authoring validation for replaceable-subtree conflicts
- baseline ownership
- tests/typecheck
- manual visual proof
- any concrete contradiction discovered

Do not continue into 4F without explicit approval.
```

The key point for Cursor is that 4E is not “build more features.” It is the integration checkpoint proving that 4C object composition and 4D materials can coexist deterministically in one scene without hidden mutation-order or shared-instance bugs.
