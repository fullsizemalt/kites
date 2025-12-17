FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder
COPY --from=builder /app/public ./public

# Set permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy migrations (from context/builder, since they are in the repo now)
# NOTE: The build process (npm run build) might adhere to .next exclusions or changes
# Since we did COPY . . in builder, /app/drizzle should exist there.
# Let's be explicit and verify what's happening.
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/src/db/migrate.ts ./src/db/migrate.ts

# Runtime dependencies
RUN npm install -g tsx
RUN npm install drizzle-orm pg dotenv

# Copy the source so tsx can run migrate.ts
COPY --from=builder --chown=nextjs:nodejs /app/src ./src

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Custom entrypoint to run migrations then start app
CMD ["sh", "-c", "npx tsx src/db/migrate.ts && node server.js"]