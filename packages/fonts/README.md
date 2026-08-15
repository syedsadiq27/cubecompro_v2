# `@repo/fonts`

Shared font assets and licenses for the monorepo.

## Ownership

| Package | Owns |
| --- | --- |
| `@repo/fonts` | Font files, licenses, shared face metadata |
| `@repo/tailwind-config` | Font-family tokens / CSS variables |
| `@repo/ui` | Typography primitives and heading styles |
| `apps/*` | Instantiates `next/font/local` and applies CSS variables |

## Families

### Instrument Sans

Source layout (as shipped):

```text
src/instrument-sans/
  LICENSE.txt
  webfonts/InstrumentSans[wdth,wght].woff2
  webfonts/InstrumentSans-Italic[wdth,wght].woff2
  otf/ ttf/ variable/ …
```

Exported face config points at the variable webfonts.

## App usage (Next.js)

`next/font/local` requires **literal** `src` / `variable` / `weight` values. Keep the files in this package; instantiate in the app with a relative path:

```ts
import localFont from 'next/font/local';

export const instrumentSans = localFont({
  src: [
    {
      path: '../../../packages/fonts/src/instrument-sans/webfonts/InstrumentSans[wdth,wght].woff2',
      style: 'normal',
    },
    {
      path: '../../../packages/fonts/src/instrument-sans/webfonts/InstrumentSans-Italic[wdth,wght].woff2',
      style: 'italic',
    },
  ],
  variable: '--font-instrument',
  weight: '400 700',
  display: 'swap',
});
```

`@repo/fonts` still owns the binary assets, licenses, and shared metadata (`instrumentSans` in `src/index.ts`) for non-Next tooling.
