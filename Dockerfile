# syntax=docker/dockerfile:1

FROM node:24-alpine AS base

COPY infra/secrets/run-with-aws-secrets.mjs infra/secrets/catalog.mjs /opt/avgeek/infra/secrets/
COPY config/aws-secrets.json /opt/avgeek/config/aws-secrets.json

FROM base AS pruner
ARG APP_NAME=praveen-website
ARG TURBO_VERSION=2.9.14
WORKDIR /repo

RUN corepack enable pnpm
COPY . .
RUN pnpm dlx turbo@${TURBO_VERSION} prune ${APP_NAME} --docker

FROM base AS installer
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY --from=pruner /repo/out/json/ ./
COPY infra/scripts/install-pnpm-with-aws-secrets.sh /usr/local/bin/install-pnpm-with-aws-secrets

RUN --mount=type=cache,id=god-pnpm-store,target=/pnpm/store,sharing=locked \
  --mount=type=secret,id=GOD_BUILD_ENV_JSON,env=GOD_ENV_JSON \
  install-pnpm-with-aws-secrets

FROM installer AS builder
ARG APP_NAME=praveen-website
ARG SOURCE_COMMIT=unknown

COPY --from=pruner /repo/out/full/ ./
COPY --from=pruner /repo/config/brand-families.json ./config/brand-families.json

ENV NEXT_TELEMETRY_DISABLED=1
ENV SENTRY_RELEASE=${APP_NAME}@${SOURCE_COMMIT}

RUN --mount=type=secret,id=GOD_BUILD_ENV_JSON,env=GOD_ENV_JSON \
  node /opt/avgeek/infra/secrets/run-with-aws-secrets.mjs json --preserve-env=SENTRY_RELEASE -- pnpm --filter ${APP_NAME} build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install Coolify health check probe tooling.
RUN apk add --no-cache curl

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built artifacts from builder
# Standalone output preserves monorepo structure: standalone/apps/praveen-website/server.js
COPY --from=builder /app/apps/praveen-website/.next/standalone ./
COPY --from=builder /app/apps/praveen-website/.next/static ./apps/praveen-website/.next/static
COPY --from=builder /app/apps/praveen-website/public ./apps/praveen-website/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "apps/praveen-website/server.js"]
