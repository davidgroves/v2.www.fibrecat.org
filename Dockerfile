# Stage 1: Builder
FROM oven/bun:1-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (creates bun.lockb if missing; use committed bun.lockb for reproducibility)
RUN bun install

# Copy source code
COPY . .

# Ensure albums.json is from current build context (avoids stale COPY . . cache)
COPY src/data/albums.json src/data/

# Skip fetch-albums in Docker (uses Playwright/Chromium; not supported in Alpine).
# Use committed src/data/albums.json instead.
ENV SKIP_FETCH_ALBUMS=1

# Build the application (cache mounts speed up content-only rebuilds)
RUN --mount=type=cache,target=/app/node_modules/.vite \
    --mount=type=cache,target=/app/.astro \
    bun run build

# Production dependencies only (Bun doesn't have prune; reinstall without dev)
RUN rm -rf node_modules && bun install --production

# Stage 2: Runtime
FROM oven/bun:1-alpine AS runtime
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 bunjs && adduser --system --uid 1001 astro

# Copy production dependencies and built static site from builder
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

# Serve static files
CMD ["bun", "run", "start"]
