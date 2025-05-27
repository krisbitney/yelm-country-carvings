FROM oven/bun:1 AS base
WORKDIR /app

# Install dependencies into temp directories for better caching
FROM base AS install
# Install dev dependencies for building
RUN mkdir -p /temp/dev
COPY package.json bun.lock ./
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/backend/package.json ./packages/backend/
RUN cd /temp/dev && cp -r /app/* ./ && bun install --frozen-lockfile

# Install production dependencies only
RUN mkdir -p /temp/prod
COPY package.json bun.lock ./
COPY packages/frontend/package.json ./packages/frontend/
COPY packages/backend/package.json ./packages/backend/
RUN cd /temp/prod && cp -r /app/* ./ && bun install --frozen-lockfile --production

# Build and test stage
FROM base AS build
# Copy dev dependencies and source code
COPY --from=install /temp/dev/node_modules ./node_modules
COPY --from=install /temp/dev/packages/*/node_modules ./packages/
COPY packages/frontend ./packages/frontend
COPY packages/backend ./packages/backend

ENV NODE_ENV=production

# Build frontend
RUN bun run --cwd packages/frontend build

# Build backend
RUN bun run --cwd packages/backend build

# Production stage - final image
FROM oven/bun:1-slim AS release
WORKDIR /app

# Copy only production dependencies
COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=install /temp/prod/packages/*/node_modules ./packages/

# Copy built backend files
COPY --from=build /app/packages/backend/dist ./dist
COPY --from=build /app/packages/backend/package.json ./
# Copy scripts and dependent files
COPY --from=build /app/packages/backend/scripts ./scripts
COPY --from=build /app/packages/backend/schema.sql ./
COPY --from=build /app/packages/backend/tsconfig.json ./
# Copy base data and images
COPY --from=build /app/packages/backend/data ./data
# Copy src needed for scripts
RUN mkdir -p ./src ./src/utils
COPY --from=build /app/packages/backend/src/types.ts ./src
COPY --from=build /app/packages/backend/src/utils/db.ts ./src/utils

# Copy frontend build files to the location expected by the backend
COPY --from=build /app/packages/frontend/dist ./packages/frontend/dist

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Copy over images if dir is empty
# copy your build-time assets into a “side‐folder”
COPY --from=build /app/packages/backend/img /img-default
# make sure /app/img exists so the bind‐mount is happy
RUN mkdir -p /app/img /app/img/events /app/img/gallery
# copy in your entrypoint
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh
# use the entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]

# Start the application
CMD ["bun","run","start"]

