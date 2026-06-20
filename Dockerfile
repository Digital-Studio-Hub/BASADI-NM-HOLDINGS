# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS builder

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH
WORKDIR /app

RUN corepack enable

COPY . .

# Vite config requires these env vars at build time.
ENV NODE_ENV=production
ENV PORT=8080
ENV BASE_PATH=/

RUN pnpm install --frozen-lockfile
RUN pnpm --filter @workspace/modern-muse build
RUN pnpm --filter @workspace/api-server build

FROM node:22-bookworm-slim AS runner

ENV NODE_ENV=production
ENV PORT=8080
ENV WEB_DIST_DIR=/app/artifacts/modern-muse/dist/public
WORKDIR /app

RUN corepack enable

COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/.npmrc ./
COPY --from=builder /app/artifacts/api-server/package.json ./artifacts/api-server/package.json
COPY --from=builder /app/lib/api-zod/package.json ./lib/api-zod/package.json
COPY --from=builder /app/lib/db/package.json ./lib/db/package.json
RUN pnpm install --frozen-lockfile --prod --filter @workspace/api-server...

COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist
COPY --from=builder /app/artifacts/modern-muse/dist/public ./artifacts/modern-muse/dist/public

EXPOSE 8080
CMD ["node", "--enable-source-maps", "artifacts/api-server/dist/index.mjs"]
