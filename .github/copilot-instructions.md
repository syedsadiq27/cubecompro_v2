# CubeCom monorepo — Copilot / VS Code agent instructions

Canonical source of truth: [`AGENTS.md`](../AGENTS.md) at the repository root.

Follow that document in full. Summary:

- Monorepo-first: inspect `packages/*` before creating app-local implementations
- Reuse `@repo/ui`, `@repo/tailwind-config`, `@repo/fonts`, `@repo/graphql`, and related shared packages
- Apps compose shared packages; packages must never import apps
- Prefer package imports (`@repo/ui`) over deep relative paths into `packages/`
- Do not create parallel design systems, typography stacks, or duplicated tokens
- Keep domain-specific compositions in apps; promote to shared only when generic and reusable
- Rebuild shared package outputs after editing them; do not hide type/lint errors
- Make the smallest coherent change; preserve visual and architectural consistency

**Golden rule:** reuse shared packages by default. Apps compose the platform; they do not recreate it.

Landing solutions pages follow the frozen skeleton in `.cursor/rules/solutions-page.mdc` (see also root `AGENTS.md`).
