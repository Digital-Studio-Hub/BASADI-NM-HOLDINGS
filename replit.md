# Modern Muse

A premium women's fashion e-commerce storefront for Basadi NM Holdings — a South African dropshipping brand offering curated dresses, co-ord sets, handbags, jewellery, and accessories with a soft, editorial boutique aesthetic.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only; use `push-force` or direct SQL for constraints that prompt interactively)
- `pnpm --filter @workspace/scripts run seed-catalog` — (re)seed catalog: categories, collections, products, testimonials
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Frontend: React + Vite, wouter (routing), TanStack Query, Tailwind + shadcn/ui, framer-motion
- Build: esbuild (CJS bundle)

## Where things live

- **API contract (source of truth):** `lib/api-spec/openapi.yaml` → generates `@workspace/api-zod` (Zod schemas) and `@workspace/api-client-react` (React Query hooks)
- **DB schema:** `lib/db/src/schema/` (products, categories, collections, testimonials, leads), re-exported from `index.ts`
- **API routes:** `artifacts/api-server/src/routes/` (registered in `routes/index.ts`); shared catalog logic in `src/lib/catalog.ts`; error/404 middleware in `src/middlewares/errorHandler.ts`
- **Seed data:** `scripts/src/seed-catalog.ts`
- **Frontend:** `artifacts/modern-muse/src/` — pages in `pages/`, layout (Header/Footer/WhatsApp FAB) in `components/layout/` and `components/shared/`, cart/wishlist contexts in `contexts/`
- **Product images:** `artifacts/modern-muse/public/products/*.webp` (referenced by absolute `/products/...` paths in seed data)
- **Brand assets:** `artifacts/modern-muse/public/brand/` (Lekker Network logo + verified badge)

## Architecture decisions

- **Contract-first:** all API inputs/outputs validated against generated Zod schemas. GET query params use `ListProductsQueryParams.safeParse(req.query)` (Orval emits `zod.coerce` so string query values coerce correctly); invalid input → 400.
- **Product filtering/sorting is done in-memory** in the route handler (small catalog), not via SQL. Collection membership is derived (`matchesCollection` in `catalog.ts`) from product flags/category, not a join table.
- **Cart & wishlist are client-side only** (localStorage via React contexts) — no backend persistence.
- **Centralized JSON error handling:** `errorHandler` + `notFoundHandler` after routes guarantee consistent `{ error }` shape (Express default would return HTML).
- **Newsletter is idempotent:** `newsletter_subscribers.email` is UNIQUE and inserts use `onConflictDoNothing`.

## Product

- Home (hero, trust strip, categories, curated collections, new arrivals/best sellers/trending, testimonials, newsletter)
- Shop (filter by category/size/colour/price, sort) and Product Detail (size/colour select, related products, WhatsApp enquiry)
- Collections + Collection Detail, Cart, Wishlist
- About, Contact (form), FAQ, Shipping & Returns, Privacy Policy, Terms & Conditions
- Floating accessible WhatsApp FAB (wa.me/27767578783)
- Footer: 5-column grid with a "Verified Badge" column, plus a centered Lekker Network logo ("Powered by Lekker Network") in the bottom bar
- Google Analytics: G-29DH2J35CJ

## User preferences

- **No emojis anywhere in the UI** — use lucide-react icons instead.
- Prices shown in ZAR with no decimals (e.g. `R549`).
- Brand palette: Soft Ivory `#FAF8F5`, Warm Beige `#E8DCCF`, Champagne Gold `#D4B483`, Deep Charcoal `#2B2B2B`, Rose Nude `#D9A5A5`, Soft Taupe `#B8A999`.
- Fonts: Playfair Display (headings), Inter/Poppins (body), Montserrat (buttons).
- Images should be WebP, lazy-loaded, responsive, with descriptive SEO alt text.

## Gotchas

- **Express 5 path params are typed `string | string[]`** — coerce with `String(req.params.x)` before passing to Drizzle `eq()`.
- `drizzle-kit push` prompts interactively for constraint changes and fails without a TTY — add UNIQUE/constraints via direct SQL, or accept that `push-force` may still prompt.
- Do not change the OpenAPI `info.title` — it controls generated filenames.
- Run `pnpm run typecheck:libs` after changing any `lib/*` package before checking leaf artifacts.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
