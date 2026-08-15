# Suite functionality ownership

Canonical map of **who owns which capability** across the product suite — not UI chrome metrics.

Visual / design-system tracking: [`suite-ui-ownership.md`](./suite-ui-ownership.md), [`suite-ui-standards.md`](./suite-ui-standards.md).

```text
admin.cubecompro.com     apps/admin       Platform ops & tenant control
backoffice.cubecompro.com apps/backoffice  Merchant catalog & product authoring
3d.cubecompro.com         apps/editor      3D studio & configurator authoring
api                       apps/api         Nest GraphQL + REST + Prisma (source of truth)
```

**Client contract for suite apps:** `@repo/product-graph` (operations, bootstrap, embed protocol, document URLs, **kernel Selection contract**).  
**Kernel contract doc:** [`product-kernel-contract.md`](./product-kernel-contract.md).  
**Runtime / storefront:** `@repo/configurator-core` + `apps/customizer` (out of suite chrome; listed for boundary only).  
**Chrome only (no domain actions):** `@repo/ui`.

Status vocabulary in this file:

| Status | Meaning |
| --- | --- |
| **live** | UI + API (+ DB where needed) wired end-to-end |
| **partial** | Real path exists; demo fallback, local-only, or missing write path |
| **stub** | UI present; no real backend (or toast-only) |
| **absent** | No module / no intentional surface yet |
| **debt** | Regression or unfinished wiring — see [Chrome wiring debt](#chrome-wiring-debt-shell) |

---

## Ownership spine

```text
Auth / User / Membership
  → Organization + Plan + Entitlements + Audit
    → Project
      → Product + ProductGraphVersion (attributes, rules, variants, models, targets, effects)
      → Library (folders, materials, textures, objects) + Documents (file stream)
        → Resolve + SavedConfiguration  (runtime / customizer)
Leads (funnel) — platform growth
PlatformSetting — API exists; admin UI unused
```

**DB creation / migrations:** `apps/api` owns Prisma schema + migrate. Suite UIs never invent parallel persistence. New domain → Prisma model (+ Nest module) first, then `@repo/product-graph` ops, then consuming app.

---

## apps/api — source of truth

Surface: GraphQL `/graphql`, REST `documents/*`, health. Prisma: `apps/api/prisma/schema.prisma`.

| Module | Status | Owns (models / concerns) |
| --- | --- | --- |
| `auth` | live | login, session/me, profile, myProjects |
| `organization` | live | Organization, Membership, Role, Permission |
| `entitlements` | live | Plan, PlanEntitlement, overrides, usage counters, audit, resolved access |
| `project` | live | Project CRUD/list |
| `product` | live | Product + full graph version authoring |
| `library` | live | LibraryFolder, Material/Texture/Object/Media assets (+ GLB parse) |
| `documents` | live | REST stream + metadata for object/material files |
| `resolve` | live | Resolved configuration for runtime |
| `saved-configuration` | live | Customer saved configs |
| `leads` | live | LeadFunnelStatus (+ sheet sync) |
| `platform` | live (API) | PlatformSetting get/upsert — **admin UI not consuming** |
| Jobs / billing / feature-flags / integrations hub | **absent** | No Nest modules; admin pages are stubs |

### Prisma model groups

| Group | Models |
| --- | --- |
| Platform tenancy | Plan, PlanEntitlement, Organization, OrganizationEntitlement, OrganizationOverride, UsageCounter, AuditEvent |
| Identity | User, OrganizationMembership, Role, Permission, RolePermission |
| Catalog | Project, Product, ProductGraphVersion, ProductAttribute, AttributeValue, ConfigurationRule, ProductModel, ModelTarget, VisualEffect, ProductVariant, VariantSelection |
| Library | LibraryFolder, MediaAsset, MaterialAsset, TextureAsset, ObjectAsset |
| Runtime | SavedConfiguration |
| Growth / ops | LeadFunnelStatus, PlatformSetting |

---

## apps/admin — platform operations

| Capability | Status | Notes |
| --- | --- | --- |
| Auth (login / logout / session) | live | |
| Organizations list / inspect / create | partial | API via tenant loaders; falls back to sample orgs when empty |
| Org suspend / trial / plan / overrides | live | → GraphQL entitlements |
| Org detail (plan, entitlements, members, usage, overrides) | live | |
| Users | live | |
| Plans CRUD | live | |
| Entitlements catalog | live | |
| Leads / funnel | live | API + sheet sync |
| Audit log | live | |
| ⌘K navigate | live | click path; shortcut legends display-only |
| Dashboard KPIs | stub | hardcoded |
| Usage & telemetry | stub | static rows |
| Processing jobs | stub | static; **no API jobs module** |
| Integrations | stub | static connectors |
| Feature flags | stub | static |
| Platform settings UI | stub | API `PlatformSetting` unused |
| Billing (Stripe) | stub / absent | demo row only |
| Support elevate session | stub | toast-only |
| Help `?` | stub | |

**Owns:** tenant lifecycle, plans, entitlements, audit, leads.  
**Does not own:** product graph authoring, library assets, 3D documents.

---

## apps/backoffice — merchant catalog

| Capability | Status | Notes |
| --- | --- | --- |
| Auth (login / register / forgot) | live | |
| Projects list / create / switch | partial | GraphQL live; switcher `href` debt — see Class C |
| Project dashboard | partial | product counts; light chrome |
| Products list / detail / create / edit | live | actions → product-graph |
| Product graph tabs (options / rules / variants / 3D) | live | |
| Catalog UI filter / select / inspect | partial | real rows or demo seed; **bulk publish/archive/delete = local + toast** |
| Embed → editor studio | live | `EDITOR_EMBED` protocol |
| Library (materials / textures / objects) | partial | GraphQL + documents; demo when empty |
| Components page | partial | large client UI; treat carefully |
| Account profile / orgs / members / roles | live | |
| Commerce (mappings / inventory / pricing) | stub | placeholders |
| Experience rules | stub | |
| Workflow | stub | |
| Categories | stub | |
| Settings (cms / api / commerce / microservice) | stub | |
| TopBar Help / Notifications / Org | stub | dead buttons + fake badge |

**Owns:** project-scoped catalog, graph authoring entry, library UX, account/org membership for merchants.  
**Does not own:** platform plans/billing, Nest schema, raw document binary storage (API does).

---

## apps/editor — 3D studio

| Capability | Status | Notes |
| --- | --- | --- |
| Routes standalone + `/:project/:product/:model` | live | |
| Local document / tool / workspace state | live | Zustand `editor-store` |
| Load graph + assets (bootstrap) | live | when embed auth present |
| Embed auth + Close `postMessage` | live | |
| Workspace rail / panel collapse / gizmos | live | |
| Save / Save-as / Export | debt / stub | TopChrome toast-only; reconnect to API/export |
| Preview / Undo / Redo | stub | |
| Camera / zoom / pan affordances | stub | status toasts |
| Panel `+` / `•••` | stub | |
| Standalone account / sign-out | partial | identity only |

**Owns:** canvas authoring UX, tool modes, embed contract consumer.  
**Does not own:** product metadata CRUD (backoffice), file persistence APIs (api/documents), entitlements.

---

## Shared packages (domain)

| Package | Owns | Consumers |
| --- | --- | --- |
| `@repo/product-graph` | Suite API client, types, bootstrap, materials helpers, document URLs, embed protocol | admin, backoffice, editor |
| `@repo/graphql` | Legacy/codegen parallel — prefer product-graph for suite | avoid new suite use |
| `@repo/configurator-core` | Runtime resolve/validate/pricing adapters | customizer / storefront |
| `@repo/customizer-ui` | Storefront customizer chrome | `apps/customizer` |
| `@repo/ui` | Suite shell + primitives only | all suite apps |

---

## Cross-cutting rules

1. **New capability** → decide owner app + whether API/Prisma already has a model. If not, API first.  
2. **No app-local fake DB** for suite-critical writes (orgs, products, graph, library). Demo seeds OK for empty states only.  
3. **Admin stubs** (jobs, flags, integrations, billing) stay stubs until a Nest module + Prisma shape exist — do not invent admin-only persistence.  
4. **Backoffice placeholders** (commerce, workflow, settings) same rule.  
5. **Editor save** must persist through API/document/graph paths — not status-bar toasts.  
6. Promote UI to `@repo/ui` only when generic; domain actions stay in apps.

---

## Chrome wiring debt (shell)

Separate from domain capability. Fix when the shell feels “static” after UI convergence.

| Class | Meaning | Action |
| --- | --- | --- |
| **C** | Worked before migration; broken now | Restore first |
| **A** | Affordance present; unfinished | Wire or remove |
| **B** | Always stub | Strip later |
| **D** | Working | Defer |

### Class C

| Behavior | Owner | Fix |
| --- | --- | --- |
| Project switch → `/projects` | Backoffice | `WorkspaceSwitcher` `href` |
| Sign out when collapsed | `@repo/ui` | Compact `AccountFooter` keeps `signOutAction` |
| Org / account footer links | Backoffice | Restore `accountHref` / org destinations |
| Editor Save / Save-as / Export | Editor | Reconnect export + save modal / API |

### Class A (shell-adjacent)

Help/Notifications/Org TopBar · Account ▾ with no menu · Admin cluster switcher decorative · Editor standalone sign-out · shared collapse `localStorage` key bleed · palette shortcut legends · Products bulk local-only.

### Class B

Editor Preview/Undo/Redo · viewport toasts · panel `+`/`•••` · Admin Help `?`.

### Class D (shell)

Nav links · mobile drawer · expanded sign-out · ⌘K click navigate · editor Close/embed/workspaces/gizmos · Orgs + Products non-bulk flows that hit API.

---

## Suggested priority (product, not polish)

1. **Class C chrome** — shell feels alive again  
2. **Editor save/export → API** — closes the biggest authoring hole on a live load path  
3. **Backoffice bulk catalog → API** — stop local-only mutate  
4. **Admin ops stubs** — only after Nest modules (jobs / flags / billing) exist  
5. **BO commerce / workflow / settings** — only with real API ownership  

---

## How to update

When shipping a capability:

1. Set status on the owning app row (`stub` → `partial` → `live`).  
2. If new persistence: note Prisma models + Nest module under **apps/api**.  
3. Move chrome debt rows C/A/B → D (or delete if affordance removed).  
4. Leave button/tag counts in `suite-ui-ownership.md`.
