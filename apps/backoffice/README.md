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
| `NEXT_PUBLIC_3DDD_SERVER_PATH` | GraphQL API base URL |
| `NEXT_PUBLIC_3DDD_LOGIN_PATH` | Auth GraphQL path (default `/register`) |
| `NEXT_PUBLIC_IMAGE_URL` | Media CDN base URL |

Shared GraphQL contract lives in `@repo/graphql`.
