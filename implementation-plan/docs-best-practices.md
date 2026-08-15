# CubeCom Pro Documentation Content Architecture

This document records the documentation-content approach for `apps/docs/content/docs/`.

Canonical agent rules live in:

- `AGENTS.md`, section **Documentation Content Architecture**
- `.cursor/rules/docs-content.mdc`

Product and domain intent lives in `CUBECOMPRO_CONTEXT.md`. Repository implementation remains the source of truth for current behavior.

## Precedence

```text
Product/domain truth
  ↓
Implemented product behavior
  ↓
Documentation information architecture
  ↓
Documentation content/style rules
```

The product design system does not govern documentation content. Stage, suite chrome, violet, typography, and other UI styling concerns are outside the scope of MDX content work.

## Current information architecture

```text
Get started
Backoffice
3D Editor
Customizer
Developers
Concepts
API
Integrations
Resources
```

Each section has one owner:

| Section | Owns |
| --- | --- |
| Get started | Platform orientation and cross-surface workflows |
| Backoffice | Product operator tasks and publishing |
| 3D Editor | Visual authoring tasks and preview |
| Customizer | Shopper/runtime behavior |
| Developers | Architecture, authentication, integration guidance |
| Concepts | Authoritative public domain semantics |
| API | Exact public contracts and transport details |
| Integrations | Provider-specific behavior and maturity |
| Resources | Changelog, limits, and operational troubleshooting |

Do not restore the retired `/use`, `/build`, or `/guides` trees. Consolidate duplicate concepts instead of maintaining parallel generations.

## Content priorities

In order:

1. Product and domain correctness.
2. Verified current behavior.
3. Operator decisions and downstream consequences.
4. Stable public terminology.
5. Complete, navigable API contracts.
6. Coverage across Backoffice, Editor, and Customizer.
7. Explicit current, planned, and open capability status.
8. Removal of stale, contradictory, and duplicate content.

The goal is not more pages. The goal is authoritative pages.

## Evidence standard

Before documenting a capability, trace enough of the repository to establish the public contract:

```text
export
schema
resolver/service
runtime
product UI
```

Not every claim requires every layer, but a package name, enum, mock, TODO, or brainstorm is never sufficient evidence by itself.

Use these labels where ambiguity would otherwise remain:

- **Current** — implemented and verified.
- **Planned** — intended but not currently available as a complete public capability.
- **Open question** — product or behavior decision is unresolved.

## Public terminology

Use product language in operator-facing pages. Keep schema class names in API reference and exact developer examples.

| Public term | API/internal example |
| --- | --- |
| Revision status | `GraphVersionStatus` |
| Active revision | `activeRevisionId` |
| Asset revision | `ObjectAssetRevision` |
| Scene target | `ModelTargetModel` |
| Linked asset | `ProductModelLinkedAssetModel` |
| Resolved visual state | `Resolved3DStateModel` |
| Resolved commerce state | `ResolvedCommerceStateModel` |

When both are necessary, explain the public concept first and identify its API name second.

## Operator-manual standard

For meaningful Backoffice, Editor, and Customizer tasks, cover:

```text
What it does
When to use it
Prerequisites
The operator decision
What changes
Downstream effects
Runtime behavior
Publish/revision implications
Verify
Common mistakes
```

Depth means helping someone make and verify a decision after weeks of product use. It does not mean padding a page with introductory prose.

## Runtime semantics

Keep these states distinct:

```text
complete
valid
available
resolved
renderable
commerce-mapped
cart-ready
```

Do not document automatic defaults, automatic invalid-selection repair, SDKs, callbacks, embed protocols, commerce synchronization, or editor operations unless current implementation proves them.

## API reference

The API section must let a developer understand public fields without reading repository source.

For every public field, expose where applicable:

```text
name
type
nullability / required
meaning
example
accepted values / constraints
default
related concept
```

Treat every `*Json` field as a hidden schema. Document its parsed shape and null/missing behavior. Prefer generating reference material from GraphQL/OpenAPI sources so handwritten documentation does not drift.

## Maintenance checks

Before considering a documentation pass complete:

- verify claims against current implementation;
- add observable **Verify** steps to operational tasks;
- audit internal links;
- keep `meta.json` navigation aligned with files;
- remove stale or duplicate pages after repairing inbound links;
- run MDX/type checks and the Docs production build;
- report planned/open behavior explicitly.
