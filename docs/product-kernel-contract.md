# Product kernel contract (Commit 1)

Frozen behavioral narrowing for product configuration semantics.

Canonical types: `@repo/product-graph` → `kernel.ts`.

Implementation plan: [`implementation-plan/kernel.md`](../implementation-plan/kernel.md).

## Selection

```ts
type ChoiceKey = string;
type ChoiceValueKey = string;
type Selection = Record<ChoiceKey, ChoiceValueKey>;
```

- Runtime identity: `Choice.key` / `ChoiceValue.key` (revision-scoped).
- DB identity: row ids — persistence only.
- `name` is presentation; changing a `key` is a semantic identity change.

## Defaults

`defaultValue` is **initialization only**.

- `initializeSelection(choices)` may produce `{ frame: "walnut" }` from defaults.
- Validating `{}` must validate exactly `{}` — defaults are never injected inside validation.
- `defaultValue` / `defaultValueId` must reference a ChoiceValue of the **same** Choice.

## Required / completeness

```text
complete(selection) =
  every required Choice has exactly one ChoiceValue
```

Optional Choices may be absent from the Selection.

## Authoring type (V1)

New Choices must be discrete single-select:

```text
AttributeType.SELECT  (kernel authoring)
```

Legacy DB values may remain:

```text
MULTI_SELECT | BOOLEAN | NUMBER | TEXT
```

New authoring flows must not create them. Enums stay in Prisma until a later audit.

## Metadata

`ChoiceValue.metadata` is descriptive only (e.g. `swatchLabel`, `description`).

Forbidden semantic use (rejected on write when present):

```text
mesh, material, modelId, shopifyVariantId, sku, price, priceDelta,
inventory, requires, forbids, condition, effect
```

Validation, visual, and commerce semantics must not hide in metadata.

## Out of scope (later commits)

- Legacy ConfigurationRule migration (Commit 2b)
- Runtime validate / Availability (Commit 3)
- Vocabulary rename Choice / ProductRevision (Commit 4)
- Visual and commerce domains

## Constraints (Commit 2)

Persistence:

```text
Constraint (productRevisionId → ProductGraphVersion)
└── ConstraintTerm (choiceValueId → AttributeValue, onDelete Restrict)
```

Service:

```text
createConstraint(productRevisionId, choiceValueIds[])
listConstraints(productRevisionId)
deleteConstraint(id)
```

Invariants: ≥2 terms, same revision, one value per Choice, no semantic duplicate.
Deleting a ChoiceValue referenced by a Constraint is rejected.

## Legacy ConfigurationRule migration (Commit 2b)

Recognized shape only:

```text
condition: { all: [{ attr, eq }, ...] } | { attr, eq }
effect:    { forbid: { attr, eq } }
```

→ Constraint terms = condition values + forbidden value.

Unsupported (left in place, reported): `require`, `any`, other effect shapes.

Failed: keys that do not resolve to ChoiceValues on the revision.

New `createConfigurationRule` writes are blocked; use `createConstraint`.

CLI:

```bash
yarn workspace api kernel:migrate-rules:dry
yarn workspace api kernel:migrate-rules
```

Cutover gate passes when `failed === 0` and every rule is `migrated` or `unsupported`.

## Runtime cutover (Commit 3)

`resolveConfiguration` validates with Constraints only (no ConfigurationRule execution).

- `validateSelection` — distinct codes: unknown_choice, unknown_value, value_wrong_choice, missing_required, violated_constraint
- `deriveAvailability` — replacement semantics; returned as `availabilityJson`
