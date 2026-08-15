# Instrument Sans — CubeCom roles

Variable axes (corrected):

| Axis | Tag | Range | Notes |
| --- | --- | --- | --- |
| Width | `wdth` | 75–100 | Condensed → normal |
| Weight | `wght` | 400–700 | Regular → Bold |
| Italic | italic face | — | Separate italic variable file |

Do not treat this as one flat face. CubeCom uses three branded roles (tokens live in `@repo/ui`):

| Role | Tokens | Features |
| --- | --- | --- |
| Display | `--cube-display-wght: 640`, `--cube-display-wdth: 86` | `ss01 ss02 ss05 ss07` |
| Heading | `--cube-heading-wght: 590`, `--cube-heading-wdth: 92` | same selective sets |
| Body | `--cube-body-wght: 430`, `--cube-body-wdth: 100` | `liga pnum` only |

Hero intensifies display (`wght` 650 / `wdth` 84). Tagline stays calmer (`500` / `96`).

Commerce / SKU / price UI can use `.ui-type-data` (`tnum`, `ss10`, `ss12`).

Canonical webfonts:

- `webfonts/InstrumentSans[wdth,wght].woff2`
- `webfonts/InstrumentSans-Italic[wdth,wght].woff2`

Keep `LICENSE.txt` with this folder.
