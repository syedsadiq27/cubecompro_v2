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
- Keyword routes: `/solutions`, `/product-configurator`, `/3d-product-configurator`, `/headless-product-configurator`, `/product-configuration-api`, `/integrations/*`, `/industries/*`
- `public/llms.txt` for agents

## Demo

Sofa on Stage: [/demo](http://localhost:3004/demo).

## Env

Contact posts to a Google Form (sheet-backed). Copy `.env.example` to `.env.local`.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_FORM_ACTION_URL` | Google Form `formResponse` URL |
| `NEXT_PUBLIC_GOOGLE_FORM_ENTRY_*` | Entry field IDs for name, email, company, interest, message |

Set the same vars in Netlify (or your host) for production builds.
