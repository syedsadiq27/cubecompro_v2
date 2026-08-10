# @repo/graphql

Shared GraphQL contract for Cube apps.

## Layout

- `schema/` — checked-in SDL (refresh with `yarn introspect` when you have a project token)
- `operations/` — domain `.graphql` documents
- `fragments/` — shared selections
- `generated/` — GraphQL Code Generator client preset output
- `src/client/` — typed fetch helper + endpoint resolution (`auth` / `global` / `project`)

## Scripts

```bash
yarn workspace @repo/graphql codegen
yarn workspace @repo/graphql build
GRAPHQL_INTROSPECT_TOKEN=... yarn workspace @repo/graphql introspect
```

## Usage

```ts
import { createGraphQlClient } from '@repo/graphql';
import { LoginMutationDocument } from '@repo/graphql/generated';

const client = createGraphQlClient({ serverPath, loginPath, projectId, getToken });
await client.auth(LoginMutationDocument, { email, password });
```
