# CubeCom Pro Docs (`docs.cubecompro.com`)

Genuine developer docs — not suite/Backoffice UI.

```text
Next.js
+ Fumadocs Core / UI / MDX
+ @repo/docs-ui (domain MDX only)
+ Scalar → /api/rest
+ GraphiQL → /api/graphql
```

Do **not** import `@repo/ui` or suite chrome. `@repo/fonts` (Instrument Sans) is fine. Fumadocs owns layout, theme, search, TOC, and MDX chrome.

## Develop

```bash
yarn workspace @repo/docs-ui build
yarn workspace docs dev
```

Content: `content/docs/**/*.mdx`  
OpenAPI: `public/openapi.yaml`
