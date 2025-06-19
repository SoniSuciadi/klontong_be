FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./
COPY prisma ./prisma

# Install dependencies termasuk devDependencies
RUN npm install

# Generate Prisma Client
RUN npx prisma generate

# Build aplikasi
COPY . .
RUN npm run build

# Fase produksi
FROM node:18-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/generated ./generated
COPY --from=builder /usr/src/app/prisma ./prisma

# Hanya untuk memastikan Prisma Client bisa diakses
RUN ls -la ./generated/prisma

EXPOSE 3000
CMD ["node", "dist/main"]