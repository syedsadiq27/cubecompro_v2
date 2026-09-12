FROM node:22-bookworm-slim AS pruner
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g turbo@2.10.9

COPY . .
RUN turbo prune api --docker

FROM node:22-bookworm-slim AS build
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare yarn@1.22.22 --activate

COPY --from=pruner /app/out/json/ .
RUN --mount=type=cache,target=/root/.cache/yarn \
  yarn install --frozen-lockfile --network-timeout 600000

COPY --from=pruner /app/out/full/ .
RUN yarn turbo build --filter=api \
  && node -e "console.log('[docker] @nestjs/config', require.resolve('@nestjs/config', { paths: ['/app', '/app/apps/api'] }))"

FROM node:22-bookworm-slim AS production
WORKDIR /app/apps/api

RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV PORT=8080

COPY --from=build /app/package.json /app/package.json
COPY --from=build /app/node_modules /app/node_modules
COPY --from=build /app/packages /app/packages
COPY --from=build /app/apps/api ./
COPY apps/api/docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh \
  && test -x /app/node_modules/.bin/prisma \
  && test -f ./dist/main.js \
  && test -f ./dist/prepare-environment.js \
  && node -e "require('@nestjs/config')"

EXPOSE 8080
ENTRYPOINT ["./docker-entrypoint.sh"]
