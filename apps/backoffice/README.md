# Backoffice

Next.js App Router admin for Cube product management (CubeCom Pro).

## Design system

- Docs site: [`apps/docs`](../docs) — `yarn workspace docs dev` → http://localhost:3000
- Design principles: `/design-principles`
- Markdown: [`docs/design-system.md`](../../docs/design-system.md)
- Agent rule: [`.cursor/rules/cubecom-design-system.mdc`](../../.cursor/rules/cubecom-design-system.mdc)

## Develop

```bash
yarn workspace backoffice dev
```

Runs on [http://localhost:3002](http://localhost:3002).

## Environment

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_PRODUCT_GRAPH_URL` | **Preferred** — Nest CubeCom API (`http://localhost:3005`). Enables login / projects / library against the new backend. |
| `NEXT_PUBLIC_3DDD_SERVER_PATH` | Legacy GraphQL API base URL (used when CubeCom URL is unset) |
| `NEXT_PUBLIC_3DDD_LOGIN_PATH` | Legacy auth path (default `/register`) |
| `NEXT_PUBLIC_IMAGE_URL` | Media CDN base URL |

### Connect to local CubeCom API

```bash
# terminal 1
yarn db:up && yarn db:migrate && yarn db:seed
yarn workspace api dev

# terminal 2
cp apps/backoffice/.env.example apps/backoffice/.env.local
yarn workspace backoffice dev
```

Login: `owner@demo.cubecom.dev` / `demo1234`

Unset `NEXT_PUBLIC_PRODUCT_GRAPH_URL` to fall back to the legacy 3DDD server.