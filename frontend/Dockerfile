# ── Stage 1: Dependencies ──
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Ensure we have package.json and lockfile
COPY package*.json ./
RUN npm ci

# ── Stage 2: Development / Builder ──
FROM node:20-alpine AS base
WORKDIR /app

# Copy dependencies and source
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment
ENV NEXT_TELEMETRY_DISABLED=1
EXPOSE 3000

# Default to dev server (can be overridden in docker-compose for prod builds later)
CMD ["npm", "run", "dev"]