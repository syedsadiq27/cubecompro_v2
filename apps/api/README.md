# CubeCom API

NestJS + GraphQL + Prisma backend for the CubeCom product graph.

## Contract (v1)

```text
Organization → Project → Product → ProductGraphVersion → ConfigurationState → ResolvedConfiguration { threeD, commerce }
```

`ProductGraphVersion` owns configuration: attributes/values, rules, product models/targets, visual effects, and optional commerce variants.

`ConfigurationState` is runtime-only. `SavedConfiguration` persists only on save/share/cart and always stores `productGraphVersionId`.

Published versions are immutable. Publish writes a frozen `graphUri` / `graphSha256` snapshot and sets `Product.activeGraphVersionId`.

Large JSON documents live in the document store (local `.data/documents` now; GCS later).

## Resolve milestone

```text
Color=Black, Size=XL, Frame=Walnut
  → valid=true
  threeD: target frame→walnut, body→black
  commerce: SKU-BLK-XL-WAL
```

Rule DSL (JSON):

```json
{ "all": [{ "attr": "material", "eq": "leather" }] }
{ "forbid": { "attr": "color", "eq": "white" } }
```

Failing example from seed: `material=leather` + `color=white`.

Visual ops: `SET_MATERIAL` | `SET_VISIBILITY` | `SET_MODEL`. Commerce: exact `VariantSelection` match only (no pricing/inventory/adapters).

## Setup

```bash
yarn db:up
yarn db:migrate

cd apps/api
cp .env.example .env
yarn dev
```

Or from root after `.env` exists under `apps/api`:

```bash
yarn db:up && yarn db:migrate && yarn workspace api dev
```

- `yarn db:migrate` — `prisma migrate deploy`
- `yarn db:migrate:dev` — `prisma migrate dev`
- `yarn db:seed` — demo org / showroom / CHAIR-01 graph (published v1)

GraphQL: [http://localhost:3005/graphql](http://localhost:3005/graphql)

Login: `owner@demo.cubecom.dev` / `demo1234`

Infra lives in the monorepo root `docker-compose.yml`:

| Service | URL / port |
| --- | --- |
| Postgres | `localhost:5433` |
| Redis | `localhost:6379` |
| pgAdmin | [http://localhost:5050](http://localhost:5050) — `admin@cubecom.dev` / `admin` |

## Milestone path

1. `createOrganization` / `createProject` / `createProduct`
2. Draft CRUD: attributes, values, rules, models, bindings, visual effects, variants
3. `publishGraphVersion`
4. `resolveConfiguration`
5. `saveConfiguration` (optional durable boundary)
