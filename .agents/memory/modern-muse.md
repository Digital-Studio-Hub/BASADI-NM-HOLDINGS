---
name: Modern Muse storefront
description: Conventions and architecture for the Modern Muse fashion e-commerce artifact.
---

# Modern Muse storefront

Premium women's fashion e-commerce for Basadi NM Holdings (South Africa). Contract-first pnpm monorepo.

- **Contract-first flow:** edit `lib/api-spec/openapi.yaml` → run `pnpm --filter @workspace/api-spec run codegen` → consume generated `@workspace/api-zod` (validate I/O) and `@workspace/api-client-react` hooks. Never hand-write API types.
- **Filtering/collections are in-memory, not SQL.** Routes load all products then filter/sort in JS (catalog is small). Collection membership is *derived* (`artifacts/api-server/src/lib/catalog.ts > matchesCollection`) from product flags (isNewArrival/isBestSeller/isTrending) and category — there is NO collection↔product join table. If you add a collection slug, update `matchesCollection`.
- **Cart & wishlist are client-side only** (localStorage via React contexts). Do not add backend endpoints for them.
- **Re-seed with** `pnpm --filter @workspace/scripts run seed-catalog` (deletes then re-inserts all catalog tables). Product image paths are absolute `/products/*.webp` served from the web artifact's `public/`.

**User preference (hard rule):** no emojis anywhere in the UI — use lucide-react icons. Prices in ZAR, no decimals (`R549`).
