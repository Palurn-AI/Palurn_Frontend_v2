# Palurn

pnpm workspace for the Palurn web apps. Each app is React 19.3.1, TypeScript, and Vite.

## Apps

| App | Package | Dev URL |
| --- | --- | --- |
| Palurn Landing Page | `@palurn/landing` | http://localhost:5173 |
| Palurn Company | `@palurn/company` | http://localhost:5174 |
| Palurn Employee | `@palurn/employee` | http://localhost:5175 |
| Palurn Admin | `@palurn/admin` | http://localhost:5176 |

Shared UI lives in `packages/ui` and is imported as `@palurn/ui`.

## Requirements

- Node.js 20.19+ or 22.12+
- pnpm 11.1.2 (`corepack enable`, then `corepack prepare pnpm@11.1.2 --activate`)

## Scripts

```bash
pnpm install
pnpm dev              # all four apps
pnpm dev:landing      # one app
pnpm dev:company
pnpm dev:employee
pnpm dev:admin
pnpm typecheck
pnpm lint
pnpm build
```

React, Vite, and TypeScript versions are pinned in the `catalog` section of `pnpm-workspace.yaml`, so every app stays on the same release.
