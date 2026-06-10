---
name: Express 5 + Drizzle quirks
description: Non-obvious gotchas when writing Express 5 routes with Drizzle in this monorepo.
---

# Express 5 + Drizzle quirks

- **Path params are typed `string | string[]`** in Express 5's types. Passing `req.params.id` directly to Drizzle `eq(col, ...)` fails typecheck (TS2769). Coerce: `const id = String(req.params.id)`.
  **Why:** Express 5 widened the param type; Drizzle's `eq` expects `string | SQLWrapper`.

- **Query-param validation:** Orval emits query schemas with `zod.coerce` (e.g. `zod.coerce.number()`), so `Schema.safeParse(req.query)` coerces string query values correctly and rejects invalid ones (NaN, bad enum) → return 400. Prefer this over manual parsing.

- **`drizzle-kit push` (and `push-force`) require a TTY** for constraint/column changes; in the agent shell they fail with "Interactive prompts require a TTY terminal". Workaround: add UNIQUE/constraints via direct SQL (`executeSql` / ALTER TABLE). Plain additive table/column pushes (no prompts) work fine non-interactively.
