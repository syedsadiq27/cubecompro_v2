# Monorepo Agent Rules — CubeCom

You are working inside a production monorepo.

Your default behavior must be:

1. understand the existing package boundaries
2. reuse shared packages first
3. preserve visual and architectural consistency
4. avoid app-local duplication
5. make the smallest coherent change

Do not treat each app as an isolated project.

This file is the **canonical** agent rule source. Agent-specific formats should mirror it:

- Cursor: `.cursor/rules/monorepo.mdc`
- VS Code / Copilot: `.github/copilot-instructions.md`
- App-local `AGENTS.md` files may add deeper rules; they must not contradict this file

---

## 1. Monorepo-first mindset

Before implementing anything, inspect the repository structure and identify:

- existing shared packages
- existing UI primitives
- shared Tailwind/theme configuration
- shared font package
- shared GraphQL/schema/types
- shared utilities
- shared config/build packages
- app-specific code

Do not create a new local implementation before checking whether the capability already exists in `packages/*`.

Preferred ownership model:

```text
packages/
  ui/                  shared UI primitives
  tailwind-config/     shared design tokens / Tailwind setup
  fonts/               shared font assets + licenses
  graphql/             shared GraphQL schema/types/contracts
  product-graph/       product configuration graph domain
  configurator-core/   configurator runtime/core logic
  customizer-ui/       shared customizer UI building blocks
  color-config/        color configuration
  colorways/           colorway utilities
  eslint-config/       shared ESLint config
  typescript-config/   shared TS config

apps/
  landing/             public marketing
  backoffice/          management workflows
  editor/              3D / product authoring
  admin/               admin orchestration UI
  docs/                documentation
  api/                 backend / API
  customizer/          storefront customizer app
```

Apps compose shared packages.
Apps should not become parallel design systems or duplicate shared contracts.

---

## 2. Shared package rule

If functionality or styling is reusable across more than one app, prefer placing it in a shared package.

Before adding any of the following locally, check shared packages first:

- Button, Input, Select, Textarea, Checkbox, Switch, Badge
- Card, Surface, Section, Container, Frame
- Heading, Typography, Eyebrow, Lede
- Stack, Grid, List, ListItem, DescriptionList
- PageHero, FAQ, Compare, DividedList
- form primitives, loading states, empty states
- spacing tokens, colors, radii, typography tokens, fonts
- GraphQL types, schemas, API contracts, utility helpers

Do not copy and paste shared Tailwind class recipes into apps if a shared primitive already exists.

---

## 3. Reuse before creation

Before creating a new component or utility:

1. Search `packages/ui`
2. Search relevant shared packages
3. Search for an existing pattern in sibling apps
4. Reuse or extend if semantically appropriate
5. Only create something new when no suitable abstraction exists

Do not create:

- `LandingButton`
- `AdminCard`
- `EditorHeading`
- app-local spacing scales
- app-local color systems
- duplicate typography systems

unless there is a genuinely app-specific semantic need.

---

## 4. Do not over-abstract

Shared packages are for reusable primitives and contracts.

Keep page/product-specific compositions local.

Examples that should usually stay inside an app:

- 3D configurator scenes
- product-specific proof sections
- mechanism diagrams
- architecture diagrams
- API request/response showcases
- landing-page compositions
- editor-specific workflows
- product-domain state visualizations

Do not move a component into `packages/ui` just because it appears once and looks reusable.

Promote to shared only when:

- it has a stable generic responsibility
- it is reused or clearly intended for reuse
- its API can be domain-neutral

---

## 5. Design system ownership

The design system must have one source of truth.

Use `packages/tailwind-config` for:

- color tokens
- spacing tokens
- radii
- shared Tailwind configuration
- theme variables

Use `packages/fonts` for:

- font files
- font metadata
- licenses

Use `packages/ui` for:

- semantic React primitives
- typed variants
- typography primitives
- layout primitives
- interaction primitives

Apps should consume these systems instead of redefining them.

Do not redefine shared colors, radii, fonts, or spacing scales in app-level globals unless the override is intentionally app-specific and documented.

---

## 6. Typography

Use the canonical typography API from `@repo/ui`.

Do not recreate heading/body styles with arbitrary Tailwind classes.

Prefer:

- `Heading`
- `Typography`
- shared type variants (`Eyebrow`, `Lede`, etc.)

Do not add parallel typography stacks.

If a new typography role is required:

- determine whether it is generic
- add a named shared variant only if it will be reused
- otherwise keep the composition local using existing primitives

---

## 7. Surface / tone system

Use shared surface vocabulary consistently.

Examples:

- `canvas`
- `surface`
- `soft`
- `ink`

Use shared text-tone behavior and inherited surface context.

Do not hardcode random dark backgrounds like `#0c0c0f` when a shared `--ink` token exists.

Do not manually reproduce dark-section text colors if surface inheritance already handles them.

---

## 8. Buttons and actions

Use the shared `Button` primitive.

Do not create button-looking links with duplicated Tailwind classes.

For navigation links that visually behave like buttons, use the shared `Button` with an appropriate polymorphic `as` / link integration.

Size must not imply a different visual system.

---

## 9. Cards / surfaces

Use `Card`, `Surface`, or existing shared panel primitives when the semantic role matches.

Do not wrap every piece of content in a card.

Editorial content should remain editorial where appropriate.

Avoid:

- arbitrary border radius
- arbitrary card padding
- arbitrary shadows
- duplicated panel recipes

---

## 10. Layout primitives

Use shared:

- `Container`
- `Section`
- `Stack`
- `Grid`
- `List` / `ListItem`
- `PageHero`

where appropriate.

Do not manually recreate `max-w-[90rem] px-5 md:px-8` in multiple apps if `Container` already exists.

Do not force page-specific diagrams into generic layout primitives if doing so harms the composition.

---

## 11. GraphQL / contracts / types

Shared GraphQL schema, fragments, generated types, domain contracts, and reusable DTOs should live in shared packages (`packages/graphql`, `packages/product-graph`, etc.).

Do not duplicate schemas between:

- landing
- backoffice
- editor
- admin
- API clients

If multiple apps consume the same product/configuration contract, it must have one canonical source.

Prefer generated types over manually duplicated interfaces where generation already exists.

---

## 12. Domain ownership

Respect app boundaries.

| Owner | Responsibility |
| --- | --- |
| API / backend | business logic, persistence, canonical domain rules, API contracts |
| Backoffice / admin | management workflows, orchestration UI |
| Editor | 3D / product authoring interactions |
| Landing | public marketing composition |
| Shared packages | reusable contracts and primitives |

Do not move domain business logic into UI packages.

---

## 13. Dependency rules

Prefer dependency flow:

```text
apps
  ↓
shared feature packages
  ↓
ui / utils / contracts / config
```

Avoid circular dependencies.

Shared packages must not depend on app code.

`packages/ui` must not import from:

- `apps/landing`
- `apps/backoffice`
- `apps/editor`
- other app folders

An app may depend on a package.
A package must never depend on an app.

---

## 14. Imports

Prefer package imports:

```ts
import { Button, Card, Section } from '@repo/ui';
```

over deep relative cross-package paths.

Avoid:

```ts
../../../../packages/ui/src/...
```

If a package exists, expose the required API through its public entry point.

Do not bypass package boundaries to reach implementation files unless the repository explicitly permits it.

---

## 15. Fonts

Consume fonts through `@repo/fonts`.

Do not load font files from brittle relative paths into another package.

Keep font binaries, licenses, and metadata inside the fonts package.

Typography styling remains owned by the shared UI / design-system layer.

---

## 16. Tailwind

Tailwind is an implementation tool, not the design-system API.

Local Tailwind is appropriate for:

- unique composition
- one-off diagrams
- responsive page-specific arrangements

Do not use local Tailwind to recreate an existing shared primitive.

Before writing a long repeated class string, ask: “Should this be an existing shared primitive or variant?”

Do not create shared files that are merely bags of duplicated Tailwind class strings when a semantic component is the better abstraction.

---

## 17. Visual consistency

When touching public-facing UI, preserve:

- shared typography hierarchy
- section rhythm
- container width
- surface tones
- radius system
- Button language
- violet accent behavior

Do not redesign neighboring sections unrelated to the task.

If an existing visual looks bad or off-brand:

- remove it
- preserve its intended media slot
- use a blank placeholder if needed

Do not compensate for a missing visual by inventing fake HTML/CSS artwork.

---

## 18. Responsive rules

Every UI change must consider:

- 390px mobile
- tablet
- laptop
- large desktop

Ensure:

- no horizontal overflow
- grid children use `min-width: 0` when necessary
- text wraps intentionally
- shared components behave consistently
- unique diagrams have explicit mobile behavior

Do not assume desktop wrapping will automatically produce a good mobile composition.

---

## 19. Accessibility

Shared primitives should carry accessibility behavior whenever possible.

Check:

- semantic element choice
- keyboard navigation
- focus states
- labels
- aria attributes
- button vs link semantics
- alt text
- accordion expanded state
- contrast

Do not solve accessibility independently in every app when it belongs in the shared primitive.

---

## 20. Performance

Avoid duplicating heavy dependencies across apps unnecessarily.

For marketing:

- optimize images
- lazy load heavy visuals
- keep 3D / runtime bundles off pages that do not need them

Shared packages should remain tree-shakeable where possible.

Do not import a large feature through a barrel export if that causes unnecessary client bundles.

---

## 21. Build / source consistency

Do not assume generated `dist` is current.

When editing shared packages:

- ensure consumers use the intended source/build workflow
- rebuild package output when required (`yarn workspace @repo/ui build`, etc.)
- run typecheck/build after changes

Do not leave apps consuming stale compiled package output.

---

## 22. Error handling

Do not hide errors to make builds pass.

Avoid:

- adding new `ignoreBuildErrors`
- suppressing TypeScript errors
- blanket `any`
- disabling lint rules without reason

Fix the actual issue or explicitly document a pre-existing failure.

---

## 23. Migration behavior

When refactoring existing code:

1. Preserve rendered behavior first.
2. Introduce/reuse shared primitive.
3. Migrate call sites.
4. Verify parity.
5. Remove obsolete local implementation.
6. Run typecheck/build.

Do not perform redesign and architectural migration in the same change unless explicitly requested.

---

## 24. Before editing

Before making changes, answer internally:

- Which app owns this behavior?
- Is there already a shared primitive/package?
- Is this generic or domain-specific?
- Will another app need it?
- Am I duplicating a token, type, component, or contract?
- Does this change create a new design dialect?
- Can I achieve the task by extending an existing primitive?

---

## 25. After editing

Verify:

- no unnecessary duplication
- imports respect package boundaries
- shared logic is in the correct package
- no app-specific code leaked into shared packages
- typecheck/lint/build status
- responsive behavior where applicable
- no unintended visual regression

Report:

- files changed
- shared packages reused
- any new shared APIs added
- validation performed
- known/pre-existing failures

---

## Solutions pages (landing)

Canonical layout language for `/solutions` and the four solution surfaces is frozen in `.cursor/rules/solutions-page.mdc`.

Skeleton: Hero → Problem → Full-width visual → Dark mechanism → Capabilities → Proof → Outcomes → Bridge + FAQ → Final CTA.

Do not restructure those pages. Keep blank `FullWidthVisual` / `MediaSlot` placeholders when assets are missing — no fake HTML art. Proof type is page-specific (option graph / live 3D / runtime pipeline / API contract).

---

## Industry pages (landing)

Furniture and Apparel industry pages follow `.cursor/rules/industry-pages.mdc`.

Skeleton: Hero → Industry problem → Full-width configurator proof → Dark mechanism → Capabilities → Outcomes → Bridge + FAQ → Final CTA.

One live configurator proof mid-page; static hero visual; reduce SEO card stacks.

---

## Integration pages (landing)

Shopify and commercetools pages follow `.cursor/rules/integration-pages.mdc`.

Skeleton: Hero + ownership split → Problem → Full-width visual → Dark mechanism → Capabilities → Proof → Outcomes → Bridge + FAQ → Final CTA.

Keep early-access / intended-pattern language. Do not imply a mature App Store or marketplace connector.

---

## About page (landing)

`/about` is frozen in `.cursor/rules/about-page.mdc`.

Editorial credibility page: thesis-first, brief Introfinity ownership, candid early status. Do not restructure. Founder note only if explicitly requested later.

---

## Backoffice UI (pass 1 + grammar + Pass 2)

- **Pass 1** (identity): `.cursor/rules/backoffice-ui.mdc`
- **Grammar**: `.cursor/rules/backoffice-page-grammar.mdc`
- **Pass 2** (shared `bo` primitives + Products reference): `.cursor/rules/backoffice-shared-chrome.mdc` — compose from `apps/backoffice/components/bo`; no page-local substitutes for shell/header/tabs/table/inspector patterns.
- **Next** (explicit): Product detail → Projects/Library → dashboard → workspace.

## 26. Suite Baseline & Shared Platform Architecture

The platform operates as a **single product suite / shared platform architecture**:

```text
admin.cubecompro.com       (apps/admin)       -> Platform Operations & Tenant Control
backoffice.cubecompro.com  (apps/backoffice)  -> Merchant Catalog & Product Authoring
3d.cubecompro.com          (apps/editor)      -> 3D Studio & Real-Time Configurator Authoring
```

> **Suite UI convergence is in progress. Documentation does not constitute implementation. A shared pattern is considered established only when it is implemented in `@repo/ui` and consumed by at least two suite applications.**

### Strict Suite Governance Rules:

1. **Mandatory Shared Sources**:
   - `@repo/ui`, `@repo/tailwind-config`, and `@repo/fonts` are the mandatory sources of shared visual primitives, tokens, and typography.
2. **No Local Primitive Recreation**:
   - App-local code may compose shared primitives, but MUST NOT recreate buttons, badges, tabs, inputs, cards, typography, modal shells, inspector shells, or common status patterns locally.
3. **Shared Identity, Domain-Specific Density**:
   - `admin`, `backoffice`, and `editor` share identity and visual language, but not identical composition density:
     - **Admin** = platform control, global operations, telemetry, and tenant management.
     - **Backoffice** = tenant operations, merchant catalog, products, and commerce channels.
     - **Editor** = canvas-first 3D authoring, geometry tree, PBR materials, and visual behaviors.
4. **Dark Sidebar & Top Chrome**:
   - The dark navigation sidebar (`#0E0F12`, `border-r border-white/10`) and global top chrome header (<kbd>⌘K</kbd>, cluster status, breadcrumbs) are suite-level patterns. Any visual change MUST be reviewed across all three apps.
5. **Sparse & Semantic Violet Accent**:
   - Violet (`#665CFF`) is reserved strictly for semantic states: selected, active, focused, synchronized. Never use violet decoratively.
6. **Canonical Status Vocabulary**:
   - Status indicators (`Active`, `Trial`, `Suspended`, `Running`, `Completed`, `Failed`) and semantic dot colors (`emerald`, `amber`, `red`, `blue`) are canonical across all apps.
7. **Contextual Inspector Standard**:
   - Contextual right inspectors must reuse standard dimensions (`330px`–`350px`) and tab behaviors (`Overview`, `Limits`, `Entitlements`, `Activity`), while content remains app-specific.
8. **Cohesive Cross-App Navigation**:
   - Moving between `admin`, `backoffice`, and `editor` must feel like moving between integrated surfaces of one product, not opening unrelated tools.
9. **Shared Architecture Does Not Mean Identical Composition**:
   - A component belongs in `@repo/ui` ONLY if it is genuinely generic across the suite. Domain-specific compositions, state visualizations, and authoring workflows must remain app-local.

---

## Golden rule

**Reuse shared packages by default.**

If the monorepo already has a primitive, token, type, schema, utility, or contract that fits the task, use it.

If the current shared API is almost sufficient, extend it carefully rather than creating a parallel app-local implementation.

Apps should compose the platform.

They should not recreate it.

