# Suite UI ownership metrics

Empirical counts for admin / backoffice / editor. Update when finishing a capability pass.

Do **not** claim convergence from prose alone — refresh these numbers.

**Standards:** [`docs/suite-ui-standards.md`](./suite-ui-standards.md) — layout, spacing, typography, controls, surfaces, semantic color. Constants: `SUITE` in `@repo/ui`.

Extend `@repo/ui` only when a real consumer needs missing behavior. Do not open another convergence architecture phase.

## Remaining debt order (capability, not architecture)

1. ~~Shared Toast~~ ✅
2. ~~Admin raw forms / tables / buttons~~ ✅ (shell chrome leftovers only)
3. ~~Backoffice B-class workflows (create / auth / workspace tabs)~~ ✅
4. ~~Editor dead-kit cleanup~~ ✅
5. ~~Suite UI standardization pass~~ ✅ (2026-08-15) — standards doc + control/focus/radius alignment + IconButton / Radio / Separator; chrome widths aligned (sidebar 220, inspector 330–350, top bar h-12)
6. ~~Suite chrome parity~~ ✅ (2026-08-15) — collapsible dark sidebar, product badges (`admin` / `backoffice` / `editor`), shared `TopBar` layout, editor auth footer

**Status: ready to stop.** No further convergence architecture phase. Remaining work is domain features only.

## Suite list-page composition (2026-08-15)

Shared **page grammar** (not more visual primitives) lives in `@repo/ui`:

| Composition | Role |
| --- | --- |
| `PageWorkspace` | fill-page shell, surface tone, main column + inspector slot |
| `ListWorkspace` | views / toolbar / bulk chrome band (`px-6`, border rhythm) |
| `PageWorkspaceBody` | padded scroll body or `flush` table region |
| `InspectorWorkspace` | canonical 330–350px inspector (`InspectorPanel`) |
| `MetricsStrip` + `MetricCard` | optional KPI band; does not redefine list grammar |

**Migrated reference surfaces:** Admin Organizations + Backoffice Products.

Backoffice `PageFrame` / `ListChrome` / `PageBody` are thin aliases of the shared compositions.

Canonical list stack:

```text
PageWorkspace inspector={<InspectorWorkspace>}
  PageHeader
  MetricsStrip?          ← admin orgs only
  ListWorkspace          ← views + toolbar (+ bulk)
  PageWorkspaceBody flush
    DataTable variant="fill"
```

**Inspector docking:** docked inspectors must participate in the flex row (shrink main column). Drawer positioning is CSS (`[data-ui-inspector-drawer]`) below `lg` only — never `absolute` + `lg:static` Tailwind pairs, which can fail to generate and leave a full-width table void beside a floating inspector.

## Suite shell chrome (2026-08-15)

Admin must **not** invent parallel sidebar / top bar / app-frame chrome. Shared ownership:

| API | Role |
| --- | --- |
| `SuiteShell` | App frame: mobile nav, sidebar slot, top bar slot, fill-page main |
| `TopBar` | Global top chrome (`start` / `end` clusters) |
| `Sidebar` / `SidebarNav` / `SidebarSection` / `SidebarItem` | Dark `#0E0F12` rail |
| `WorkspaceSwitcher` | Scope / cluster / project switcher row |
| `AccountFooter` | Account identity + sign out |

Apps pass **domain** nav trees and top-bar actions only. Backoffice `BackofficeShell` / `Sidebar*` are thin wrappers over these.

### DataTable + RSC note

1. **Do not** build the compound API as `Object.assign(Table, { Root: Table })` — circular self-reference breaks Turbopack and can make unrelated `@repo/ui` exports (e.g. `PageHeader`) resolve as `undefined`.
2. `DataTable` is a **callable** root (`<DataTable>`) plus compound statics (`DataTable.Root`, …). Do **not** use `Object.assign(Table, { Root: Table })` (circular).
3. **Admin Server Components** must not import client suite UI from the `@repo/ui` barrel directly — Turbopack can yield `Element type is invalid … got: undefined`. Import via `apps/admin/components/suite-ui.tsx` (`'use client'` re-export) or a dedicated client view.
4. Named exports (`DataTableRoot`, …) remain available when needed.

## Snapshot — 2026-08-15 (post Backoffice B-class pass)

| Metric | Admin | Backoffice | Editor |
| --- | ---: | ---: | ---: |
| `<button` | **7** | **89** | **55** |
| `<input` | **2** | **16** | **11** |
| `<select` | **0** | **14** | **6** |
| `<textarea` | 0 | **1** | 0 |
| `<table` | **0** | **3** | 0 |

| Shared concept | Local visual forks |
| --- | --- |
| DataTable | 0 (`@repo/ui` only) |
| ConfirmDialog | 0 |
| FilterBar | 0 |
| InspectorPanel | 0 |
| PageHeader visual | 0 (bo wrapper composes shared) |
| StatusBadge visual | 0 (bo mapper only) |
| Panel | 0 |
| Toast | 0 (`@repo/ui` only) |
| PageWorkspace / ListWorkspace | 0 (bo aliases only) |
| SuiteShell / Sidebar / TopBar | 0 (`@repo/ui`; admin + backoffice compose) |

### Prior — post Toast + admin forms + editor dead-kit

| Metric | Admin | Backoffice | Editor |
| --- | ---: | ---: | ---: |
| `<button` | 7 | 106 | 55 |
| `<input` | 2 | 50 | 11 |
| `<select` | 0 | 20 | 6 |
| `<textarea` | 0 | 3 | 0 |
| `<table` | 0 | 8 | 0 |

## Backoffice B-class pass (2026-08-15) — target files only

Scope: `create-product-form`, `options-tab`, `rules-tab`, `variants-tab`, `product-overview`, `three-d-tab`, `commerce-tab`, `auth-form`.

No shell / navigation / pagination / overflow-menu architecture changes. No new local primitive forks. No `@repo/ui` extension required (existing Button / Field / Input / Select / Textarea / Checkbox / Panel / DataTable / ConfirmDialog covered the gap).

### Before → After (raw native tags)

| File | button | input | select | textarea | table |
| --- | ---: | ---: | ---: | ---: | ---: |
| create-product-form | 1→**0** | 8→**1** | 3→**0** | 1→**0** | 0→0 |
| options-tab | 7→**5** | 10→**0** | 1→**0** | 0→0 | 1→**0** |
| rules-tab | 7→**4** | 9→**0** | 1→**0** | 0→0 | 1→**0** |
| variants-tab | 4→**2** | 3→**0** | 1→**0** | 0→0 | 1→**0** |
| product-overview | 5→**2** | 2→**0** | 0→0 | 1→**0** | 0→0 |
| three-d-tab | 9→**5** | 0→0 | 0→0 | 0→0 | 0→0 |
| commerce-tab | 4→**3** | 0→0 | 0→0 | 0→0 | 2→**0** |
| auth-form | 2→**1** | 3→**0** | 0→0 | 0→0 | 0→0 |
| **TOTAL** | **39→22** | **35→1** | **6→0** | **2→0** | **5→0** |

### Remaining raw controls (justified A / domain)

| Location | Raw | Justification |
| --- | --- | --- |
| create-product-form | 1× `<input type="radio">` | No shared Radio; template picker domain control |
| auth-form | 1× password visibility `<button>` | Icon-only density toggle inside Input adornment |
| options / rules / variants / three-d / commerce | inspector/modal close + “More” icon buttons | Icon-only density; overflow stays local A |
| product-overview | modal close + gallery thumb selectors | Icon/media selection density |
| three-d-tab | canvas overlay toggles (reset / wireframe / fullscreen) | Viewport chrome, not form primitives |
| commerce-tab | copy Commerce ID icon button | Icon-only clipboard control |

**Stay A (out of scope):** `bo/shell`, pagination, filter ornaments, overflow menu chrome.

**Demo-only:** `bo/forms/form-controls.tsx`.

**C (only if a real consumer needs it later):** Pagination primitive, Menu/menuitem, Radio group, denser DataTable authoring variant.

## How to refresh

```bash
for app in admin backoffice editor; do
  echo "--- $app ---"
  for tag in button input select textarea table; do
    echo -n "$tag: "
    rg -c "<$tag" "apps/$app" --glob '*.{ts,tsx}' | awk -F: '{s+=$2} END {print s+0}'
  done
done
```
