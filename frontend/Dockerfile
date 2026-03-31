# ── Stage 1: Dependencies ──
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# ── Stage 2: Development / Builder ──
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Deshabilitar telemetría
ENV NEXT_TELEMETRY_DISABLED=1
# Forzamos nulo el URL para que se incruste la ruta relativa y funcione el proxy
ENV NEXT_PUBLIC_API_URL=""

RUN npm run build

# ── Stage 3: Producción ──
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Solo copiamos los archivos construidos al final
COPY --from=builder /app/public ./public

# Directorio con permisos
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Las optimizaciones de imagen de Next requieren standalone output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000

# Next.js standalone package corre en server.js 
CMD ["node", "server.js"]