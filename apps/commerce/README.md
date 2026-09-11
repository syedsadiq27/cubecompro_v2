# CubeComPro Commerce — Phase 2

Isolated Medusa application that powers **hosted CubeComPro Commerce** (`provider: "cubecom"`).

This PR answers one question only:

> Can `apps/commerce` run Medusa cleanly as CubeComPro’s hosted commerce engine inside the current monorepo?

## Phase 2 invariants

```text
apps/commerce
├── starts independently
├── uses published @medusajs/* packages
├── owns its DB / config / migrations / runtime
├── exposes Medusa API health
├── can run Medusa Admin (internal / dev)
└── imports nothing from @repo/product-graph or @repo/commerce-core
```

Inverse:

```text
No CubeCom app/package imports from apps/commerce
@medusajs/* only allowed in:
  apps/commerce
  packages/commerce-medusa   # Phase 3+
```

Out of scope for Phase 2: CubeCom modules, tenancy, catalog sync, `commerce-core` wiring.

Contract: [`implementation-plan/hosted-commerce-phase0.md`](../../implementation-plan/hosted-commerce-phase0.md)

## Prerequisites

- Node `>=20`
- Docker (commerce Postgres + shared Redis)

```bash
# from repo root
docker compose up -d postgres-commerce redis
```

## Setup

```bash
cp apps/commerce/.env.template apps/commerce/.env
yarn install
yarn db:commerce:up
yarn workspace commerce db:migrate
yarn workspace commerce dev
```

- API: `http://localhost:9000`
- Health: `http://localhost:9000/health` → `OK`
- Admin (dev): served by `medusa develop` (URL in CLI output)
- Production-style run after build: `yarn workspace commerce build && yarn workspace commerce start` (copies `.env` into `.medusa/server` and serves built Admin at `/app`)

Optional demo catalog:

```bash
yarn workspace commerce seed
```

## Scripts

| Script | Purpose |
| --- | --- |
| `yarn workspace commerce dev` | Medusa develop (API + Admin) |
| `yarn workspace commerce build` | Production build |
| `yarn workspace commerce start` | Run built server |
| `yarn workspace commerce db:migrate` | Run Medusa migrations |
| `yarn workspace commerce seed` | Seed demo data (optional) |

Do **not** rely on root `yarn dev` as the commerce workflow; prefer the workspace commands above so the engine stays an explicit, independent runtime.
