# Suite UI standards

Minimal global visual standard for Admin, Backoffice, and Editor.

Source of truth: `@repo/ui` + `packages/tailwind-config`. Apps compose; they do not redefine.

Constants: `packages/ui/src/lib/suite.ts` (`SUITE`).

### Tailwind sourcing (required)

Suite apps must import both:

1. `@repo/ui/styles.css` — prefixed (`ui:`) primitives (Button, Input, …)
2. App `globals.css` with `@source "../../../packages/ui/src"` — unprefixed suite compositions (`SuiteShell`, `DataTable`, `PageHeader`, `Inspector*`, …)

Without `@source`, shell/table/inspector layout utilities never compile and the UI looks unstyled.

---

## Layout

| Token | Value | Use |
| --- | --- | --- |
| Sidebar width | **220px** (collapsed **64px** icon rail) | `Sidebar` / hamburger toggle; editor rail always 64px |
| Product badge | mono uppercase chip | `product="admin\|backoffice\|editor"` / `SidebarProductBadge` |
| Top chrome height | **48px** (`h-12`) | shared `TopBar` (`start` / `end` slots) — brand lives in sidebar, not top bar |
| Account footer | avatar (+ name when expanded) | `AccountFooter`; editor uses `compact` |
| Page horizontal padding | **24px** (`px-6`) | `PageHeader`, `ListWorkspace`, body |
| Page header vertical padding | **16px** (`py-4`) | `PageHeader` |
| Inspector width | **330px** (sm+ **350px**) | `InspectorPanel` / `InspectorWorkspace` |
| Inspector | `border-l`, full-height dock, sticky column | never decorative violet |
| Content background | `--surface-pure` on ops fill pages; `--canvas` for page wash | |
| Section rhythm | **16–20px** between bands | header → metrics → chrome → table |

Editor stays canvas-first; inspector/top chrome still use these widths/heights.

---

## Spacing scale

| Role | Tailwind | px |
| --- | --- | --- |
| control gap | `gap-2` | 8 |
| section gap | `gap-4` | 16 |
| page band gap | `gap-5` / `py-5` | 20 |
| form field stack | `gap-1.5` label→control | 6 |
| table row | `h-14` cells | 56 |
| card/panel pad | `p-3.5`–`p-4` | 14–16 |
| inspector pad | `p-4` | 16 |

Do not invent parallel spacing recipes in apps.

---

## Typography

| Role | Spec |
| --- | --- |
| Page title | 20–22px, bold, tight tracking, `--ink` |
| Page description | 12–13px, `--text-secondary` |
| Section title | 12px mono bold uppercase muted **or** 14px semibold ink |
| Label | 12px medium `--ink` (`Field`) |
| Body | 13px `--ink` / `--text-secondary` |
| Metadata | 10–11px mono or sans, `--text-muted` |
| IDs / numbers | mono 10–12px |

Font family: Instrument Sans via `@repo/fonts` / app layouts.

---

## Controls

| Control | Height | Radius | Border | Focus |
| --- | --- | --- | --- | --- |
| Input / Select | **36px** (`h-9`) | **7px** | `--line` | `--brand` border |
| Textarea | min 96px | 7px | `--line` | `--brand` |
| Button sm | **32px** (`h-8`) | 7px | per variant | brand/ink outline |
| Button md | **36px** (`h-9`) | 7px | | |
| Button lg | **44px** (`h-11`) | 7px | | |
| IconButton | 32×32 (sm) / 36×36 (md) | 7px | ghost/secondary | |
| Checkbox | 16×16 | 4px | `--line` | brand outline |
| Disabled | opacity 40–50%, no pointer | | | |

Selected / active / synchronized / focus accent: **violet** `--brand` (`#665CFF`) — never decorative.

---

## Surfaces

| Surface | Background | Border |
| --- | --- | --- |
| Canvas wash | `--canvas` | — |
| Panel / table / inspector / modal / toolbar | `--surface-pure` | `--line` |
| Selected row | canvas/60 + **2px violet inset** | DataTable selected |
| Soft panel | `--surface` | `--line` |

---

## Semantic color

| Color | Meaning |
| --- | --- |
| Violet `#665CFF` | selected, active, synchronized, focus |
| Emerald | healthy / success / Active |
| Amber | warning / Trial / attention |
| Red | failure / destructive / Suspended |
| Neutral | everything else |

---

## Missing primitives (justified)

- `IconButton` — repeated icon-only density controls
- `Radio` / `RadioGroup` — template / plan pickers
- `Separator` — toolbar / inspector dividers

`Stack` / `Grid` already exist — reuse; do not add layout frameworks.

---

## App rules

- **Admin / Backoffice:** compose `SuiteShell`, `PageHeader`, `PageWorkspace`, `DataTable`, `Inspector*`, shared controls. No local height/radius/sidebar forks.
- **Editor:** keep canvas-first density; align top chrome height, inspector width, buttons/inputs/badges/focus to this doc.
- Stop after this pass. No new convergence architecture phase.
