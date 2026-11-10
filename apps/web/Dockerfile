# Multi-stage production Dockerfile for GATEWISE AI Web Portal & APK Download Centre
# Node 20 Alpine Linux with Next.js Standalone build

FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Stage 1: Install dependencies with pnpm
FROM base AS deps
RUN corepack enable && corepack prepare pnpm@11.22.0 --activate
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
COPY apps/web/package.json ./apps/web/
COPY packages/design-tokens/package.json* ./packages/design-tokens/
COPY packages/api-contracts/package.json* ./packages/api-contracts/
RUN pnpm install --frozen-lockfile

# Stage 2: Build Next.js application
FROM base AS builder
RUN corepack enable && corepack prepare pnpm@11.22.0 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/web/node_modules ./apps/web/node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN pnpm --filter @gatewise/design-tokens build 2>/dev/null || true
RUN pnpm --filter @gatewise/api-contracts build 2>/dev/null || true
RUN pnpm --filter @gatewise/web build

# Stage 3: Hardened Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy static assets and compiled output
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/.next ./apps/web/.next
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder --chown=nextjs:nodejs /app/apps/web/package.json ./apps/web/package.json

USER nextjs

EXPOSE 3000

HEALTHCHECK --interval=20s --timeout=5s --start-period=10s --retries=3 \
    CMD wget -qO- http://localhost:3000/ || exit 1

WORKDIR /app/apps/web
CMD ["node_modules/.bin/next", "start", "-p", "3000"]
