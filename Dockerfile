# Stage 1: Builder
# Installs all dependencies and builds the application
FROM node:22-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies (single npm ci avoids esbuild binary mismatch in multi-platform builds)
RUN npm ci

# Copy source code
COPY . .

# Skip fetch-albums in Docker (uses Playwright/Chromium; not supported in Alpine).
# Use committed src/data/albums.json instead.
ENV SKIP_FETCH_ALBUMS=1

# Build the application
RUN npm run build

# Prune to production dependencies only (no separate deps stage = no esbuild version mismatch)
RUN npm prune --omit=dev

# Stage 2: Runtime
# Minimal image with only production dependencies and built artifacts
FROM node:22-alpine AS runtime
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 astro

# Copy production dependencies and built app from builder (already pruned)
COPY --from=builder /app/node_modules ./node_modules

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist

# Copy package.json for reference
COPY --from=builder /app/package.json ./

# Set ownership
RUN chown -R astro:nodejs /app

# Switch to non-root user
USER astro

# Expose the default Astro port
EXPOSE 4321

# Set environment variables
ENV HOST=0.0.0.0
ENV PORT=4321
ENV NODE_ENV=production

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4321/ || exit 1

# Start the server
CMD ["node", "./dist/server/entry.mjs"]
