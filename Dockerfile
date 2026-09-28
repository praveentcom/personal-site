# syntax=docker/dockerfile:1
FROM node:24-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
RUN apk add --no-cache libc6-compat && corepack enable pnpm
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY patches ./patches
RUN --mount=type=cache,id=praveen-website-pnpm,target=/pnpm/store \
    --mount=type=secret,id=GITHUB_PACKAGES_TOKEN,env=GITHUB_PACKAGES_TOKEN,required=true \
    --mount=type=secret,id=HUGEICONS_LICENSE_KEY,env=HUGEICONS_LICENSE_KEY,required=true \
    --mount=type=secret,id=HEROUI_AUTH_TOKEN,env=HEROUI_AUTH_TOKEN,required=true \
    set -eu; \
    umask 077; \
    npmrc="$(mktemp)"; \
    trap 'rm -f "$npmrc"' EXIT; \
    printf '//npm.pkg.github.com/:_authToken=%s\n//npm.hugeicons.com/:_authToken=%s\n' \
      "$GITHUB_PACKAGES_TOKEN" "$HUGEICONS_LICENSE_KEY" > "$npmrc"; \
    NPM_CONFIG_USERCONFIG="$npmrc" pnpm install --frozen-lockfile --store-dir /pnpm/store --config.blockExoticSubdeps=false

FROM dependencies AS builder
ARG SOURCE_COMMIT
COPY . .
RUN --mount=type=secret,id=SENTRY_AUTH_TOKEN,env=SENTRY_AUTH_TOKEN \
    --mount=type=secret,id=SENTRY_ORG,env=SENTRY_ORG \
    --mount=type=secret,id=SENTRY_PRAVEEN_WEBSITE_DSN,env=SENTRY_PRAVEEN_WEBSITE_DSN \
    --mount=type=secret,id=NEXT_PUBLIC_BASE_URL,env=NEXT_PUBLIC_BASE_URL \
    --mount=type=secret,id=NEXT_PUBLIC_ALLOW_ROBOTS,env=NEXT_PUBLIC_ALLOW_ROBOTS \
    --mount=type=secret,id=NEXT_PUBLIC_TOWBAR_ANALYTICS,env=NEXT_PUBLIC_TOWBAR_ANALYTICS \
    --mount=type=secret,id=SENTRY_ALLOW_MISSING,env=SENTRY_ALLOW_MISSING \
    SENTRY_RELEASE="praveen-website@${SOURCE_COMMIT:-$(node -p 'crypto.randomUUID()')}" pnpm build

FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
RUN addgroup --system --gid 1001 nodejs && adduser --system --uid 1001 --ingroup nodejs nextjs
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/content ./content
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
