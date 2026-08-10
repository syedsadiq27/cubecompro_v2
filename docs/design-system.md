# CubeCom Pro Design System

**Brand framing:** The Digital Product Stage.

CubeCom takes a physical product and makes it configurable, visual, and commerce-ready. The signature is not engineering chrome — it is the **product floating on a highly controlled digital stage**.

**Target feel:** Apple’s product confidence + commercetools’ commerce authority + CubeCom’s 3D/configuration subject matter.  
**Not:** developer-tool aesthetics, CAD motifs, or generic premium SaaS themes.

---

## Brand recognition (four things only)

```text
1. Mineral-white digital stage
2. Physical product as hero
3. Violet spatial plane / light
4. Very large, tight black typography
```

Everything else is subordinate. Ordinary UI stays disciplined: white, black, neutral gray, excellent typography.

---

## Explicitly remove

Do **not** use these as brand motifs:

- Technical grids as a global / decorative motif
- Square nodes / connection dots everywhere
- Diagonal cut / chamfer geometry as signature
- Excessive mono / sci-fi metadata (`SYS.DOCS`, `00,00`, `GRID_32`)
- Dark cyber sidebars / neon panels
- Violet filled nav pills or violet selection rails as the “brand”
- Generic diamond / cyber cube glyphs as the logo

Those make CubeCom feel like a generated developer platform.

---

## Cube Stage (signature surface)

Define once. Use for every major product/visual surface.

```css
--stage-bg: #f2f1ed;
--stage-ink: #101010;
--stage-violet: #5f57f7;
--stage-violet-light: #a69fff;
--stage-shadow:
  0 24px 48px rgba(16, 16, 16, 0.08),
  0 8px 16px rgba(16, 16, 16, 0.04);
```

Every Cube Stage gets:

- Very light mineral background (`--stage-bg`)
- Large negative space
- Product centered at generous scale
- Extremely soft grounded shadow
- Subtle violet illumination from one consistent direction (soft spatial plane / glow)
- **No** visible grid
- **No** decorative cards around the object

### Where the Stage appears

| Surface | Treatment |
| --- | --- |
| Marketing heroes | Full Cube Stage compositions |
| 3D Studio | Full Stage canvas |
| Customizer | Stage canvas |
| Logo editor | Stage canvas |
| Backoffice product thumbs | Mini Stage |
| Docs major pages | Simplified Stage illustration / cover |
| Empty / loading / onboarding | Stage + soft violet plane |

Working admin UI (tables, forms, filters) stays neutral white — **not** staged.

---

## Cube Plane (signature spatial object)

One translucent violet plane / halo behind or intersecting the configured product — soft 3D violet surface, not cubes everywhere.

Use behind: product heroes, selected 3D objects, empty configurator, docs covers, onboarding, marketing transitions, loading.

If someone sees a physical product on mineral white with that violet spatial plane, it should read as CubeCom.

---

## Cube Violet role

**Not:** purple = selected nav (generic SaaS).

**Yes:** Cube Violet = **spatial transformation**.

Use violet when something is being configured, transformed, selected on the physical product, or resolved.

Normal navigation: black / gray only.

---

## Wordmark

Simple and strong:

```text
cubecom
```

or

```text
CUBECOM
```

`PRO` is a product tier / sub-brand — not half of the visual identity.

Prefer a custom wordmark where one letter (e.g. the **O**) carries the dimensional idea. Avoid cyber icon + `CUBECOM PRO` stacked lockups as the primary mark.

---

## Typography

```css
--font-display: "Inter Tight", sans-serif;
--font-ui: "Inter", sans-serif;
--font-mono: "Geist Mono", monospace; /* technical values only */
```

**Rule:** Headlines are tight, compact, and black. Supporting text is quiet and spacious.

| Role | Size | Line | Weight | Tracking |
| --- | --- | --- | --- | --- |
| Hero | 56px | 0.96 | 700 | -0.045em |
| Page H1 | 32px | 1.05 | 650 | -0.03em |
| Section H2 | 21px | 1.15 | 600 | -0.02em |
| Card title | 16px | 1.25 | 600 | -0.015em |
| Body | 14px | 1.55 | 400 | `#555` |
| Metadata | 12px | 1.4 | 450 | 0 |
| Nav | 13px | 1.4 | 450 | 0 |
| Section labels | 10px | 1.2 | 600 | +0.08em uppercase |

- Tight display treatment only for major statements (hero / page H1) — not every section
- Body measure ≈ 45–55ch (`max-width: 34rem`)
- Within section ≈ 32px; between major sections ≈ 56–72px
- Active nav uses violet cue, not bold
- Wordmark is a fixed lockup; mono only for technical IDs

---

## UI chrome (subordinate)

```text
white / mineral surfaces
black typography + primary actions
neutral gray structure
excellent typography
minimal borders
generous whitespace
```

| Element | Radius |
| --- | --- |
| Controls / inputs | 6–8px |
| Panels / cards | 8–12px |

Shadows rare; Stage grounded shadow only under products.

---

## Shared product shells

| App | Brand moment | Chrome |
| --- | --- | --- |
| Backoffice | Product thumbs on mini Stage | Neutral admin |
| 3D Studio | Full Stage canvas | Minimal black tools |
| Customizer | Stage canvas | Minimal chrome |
| Logo editor | Stage canvas | Minimal chrome |
| Docs | Stage covers on major pages | Clean editorial nav |
| Marketing | Huge Stage compositions | Editorial type |

---

## Page skeleton (still apply)

```text
Page title                     Primary action
Short description

Optional summary / metrics

Search / filters / controls

Primary workspace
```

Shell: sidebar / header / filters fixed when needed; workspace scrolls. One primary action (black). Density follows task frequency.

---

## Domain language

```text
Product → Configuration → Resolution → Commerce → Channel → Publish
```

---

## Color tokens

```css
:root {
  --stage-bg: #f2f1ed;
  --stage-ink: #101010;
  --stage-violet: #5f57f7;
  --stage-violet-light: #a69fff;

  --ink: #101010;
  --canvas: #f2f1ed;
  --surface: #f7f6f3;
  --surface-pure: #ffffff;

  --line: #e4e3de;
  --text-secondary: #5c5c59;
  --text-muted: #8a8a84;

  --success: #167a5b;
  --warning: #a76712;
  --danger: #c44848;
  --info: #3d68c9;
}
```

---

## Empty / errors

Human, specific, actionable — not “No data found” / “Something went wrong.”

---

## Implementation

- Living docs: `apps/docs` → `/design-principles`
- Stage utilities: `apps/docs` CSS (`.cube-stage`, `.cube-plane`)
- Wordmark: `CubeWordmark`
- Cursor rule: `.cursor/rules/cubecom-design-system.mdc`

**Rebrand the UI around the Stage. Do not iterate by adding decorative developer motifs.**
