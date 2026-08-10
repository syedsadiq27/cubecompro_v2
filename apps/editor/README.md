# CubeCom Pro · 3D Editor

Next.js App Router editor (port **3003**), Phase 1 shell ported from `reference/editor`.

## Develop

```bash
yarn workspace editor dev
```

Open [http://localhost:3003](http://localhost:3003).

Load a real product model:

```text
/{projectId}/{productId}/{modelId}
```

Example:

```text
http://localhost:3003/193/2155/4198
```

Query-param fallback on `/`:

```text
/?projectId=193&productId=…&modelId=…
```

The editor registers a project token, fetches product objects + model config, then Draco-loads GLTF assets from `NEXT_PUBLIC_IMAGE_URL`.

## Phase 1

- Digital Product Stage canvas host
- Imperative Three.js + Zustand (client-only)
- Orbit controls + placeholder product mesh
- Stub outline / properties panels

## Stack

- Next 16, React 19
- `three`, `zustand`
- `@repo/ui` (Stage, Wordmark)
