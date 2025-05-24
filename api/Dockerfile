# ----------------------
# Etapa de build
# ----------------------
FROM node:18-alpine AS builder
WORKDIR /usr/src/app

# Instalar compiladores y pnpm
RUN apk add --no-cache build-base python3 \
 && corepack enable \
 && corepack prepare pnpm@latest --activate

# Copiar package.json y pnpm-lock.yaml
COPY api/package.json api/pnpm-lock.yaml ./

# Instalar dependencias (lockfile de pnpm)
RUN pnpm install

# Generar Prisma Client
COPY api/prisma ./prisma
RUN pnpm exec prisma generate

# Copiar el resto del código y compilar
COPY api/tsconfig*.json ./
COPY api/src ./src
RUN pnpm exec tsc

# ----------------------
# Etapa de runtime
# ----------------------
FROM node:18-alpine AS runner
WORKDIR /usr/src/app

# Instalar pnpm
RUN corepack enable \
 && corepack prepare pnpm@latest --activate

# Copiar package.json y lockfile para dependencias de producción
COPY api/package.json api/pnpm-lock.yaml ./

# Instalar solo prod deps
RUN pnpm install --prod
RUN pnpm install --frozen-lockfile

# Copiar esquema de Prisma y generar el cliente
COPY api/prisma ./prisma
RUN pnpm exec prisma generate

# Copiar artefactos del builder
COPY --from=builder /usr/src/app/dist ./dist

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["sh", "-c", "pnpm exec prisma migrate deploy && node dist/main.js"]
