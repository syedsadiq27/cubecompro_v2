# CubeCom Pro Admin

Control plane for tenants. Not a second backoffice.

```text
Organizations → Plan → Entitlements → Apps
                 ↘ Overrides
```

## Run

```bash
cp apps/admin/.env.example apps/admin/.env.local
yarn workspace admin dev
```

http://localhost:3006

Login: `owner@demo.cubecom.dev` / `demo1234`

API must be up (`yarn workspace api dev`) with migrate + seed applied.

## Surfaces

- Organizations — tenants, plan, status, access, limits, overrides, resolved access
- Users — memberships across orgs
- Plans — Starter / Pro bundles
- Entitlements — canonical `can(key)` catalog
- Usage — live counts vs limits

Apps should call `can(organizationId, key)` or `resolvedAccess`. Never `if (plan === "pro")`.
