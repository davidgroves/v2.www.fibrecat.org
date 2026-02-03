# Stage 1: Builder
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (creates bun.lockb if missing; use committed bun.lockb for reproducibility)
RUN bun install

# Copy source code
COPY . .

# Debug: verify albums.json is present in build context
RUN ls -la src/data/albums.json && head -c 200 src/data/albums.json

# Skip fetch-albums in Docker (uses Playwright/Chromium; not supported in Alpine).
# Use committed src/data/albums.json instead.
ENV SKIP_FETCH_ALBUMS=1

# Build the application
RUN bun run build

# Production dependencies only (Bun doesn't have prune; reinstall without dev)
RUN rm -rf node_modules && bun install --production

# Stage 2: Runtime
FROM oven/bun:1-alpine AS runtime
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 bunjs && adduser --system --uid 1001 astro

# Copy production dependencies and built app from builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./

# Set ownership
RUN chown -R astro:bunjs /app

USER astro

EXPOSE 4321
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4321/ || exit 1

# Run the Astro Node adapter server with Bun
CMD ["bun", "run", "./dist/server/entry.mjs"]
