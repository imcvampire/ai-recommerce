FROM node:24-alpine as base
RUN corepack enable && corepack prepare pnpm --activate

FROM base AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

FROM base
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod
COPY --from=builder /app/build ./build
CMD ["pnpm", "start"]
