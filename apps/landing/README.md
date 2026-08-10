# CubeCom Pro Landing

Marketing site for CubeCom Pro — **The Digital Product Stage**.

## Dev

```bash
yarn workspace landing dev
```

Runs on [http://localhost:3004](http://localhost:3004) (docs stays on `3000`).

## Structure

1. Stage hero + live sofa proof
2. Why brands use Stage
3. How it works (product graph)
4. Surfaces (Backoffice, 3D Editor, Logo Editor, AI, SDK)
5. Pricing
6. FAQ
7. CubeCom session

## SEO

- Metadata, Open Graph, Twitter cards, robots, sitemap
- JSON-LD on homepage + keyword pages
- Keyword routes: `/3d-product-configurator`, `/product-configurator`, `/headless-product-configurator`, `/product-configuration-api`, `/integrations/*`, `/industries/*`
- `public/llms.txt` for agents

## Demo

Sofa on Stage: [/demo](http://localhost:3004/demo).

## Env (optional)

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_FORM_ACTION_URL` | Contact form submit endpoint |
| `NEXT_PUBLIC_GOOGLE_FORM_ENTRY_*` | Google Form entry field IDs |

Without a Google Form URL, contact falls back to `mailto:hello@cubecompro.com`.
