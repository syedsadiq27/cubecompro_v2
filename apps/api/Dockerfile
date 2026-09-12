ARG NODE_VERSION=22-bookworm-slim
ARG TURBO_VERSION=2.10.9
ARG YARN_VERSION=1.22.22

FROM node:${NODE_VERSION} AS pruner
ARG TURBO_VERSION
WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g turbo@${TURBO_VERSION}

COPY . .
RUN turbo prune api --docker

FROM node:${NODE_VERSION} AS base
RUN apt-get update \
  && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
WORKDIR /app

FROM base AS build
ARG YARN_VERSION
RUN corepack enable && corepack prepare yarn@${YARN_VERSION} --activate

COPY --from=pruner /app/out/json/ .
RUN --mount=type=cache,target=/root/.cache/yarn \
  yarn install --frozen-lockfile --network-timeout 600000

COPY --from=pruner /app/out/full/ .
RUN yarn turbo build --filter=api \
  && node apps/api/scripts/verify-nest-resolution.js /app/apps/api

FROM base AS prod-deps
ARG YARN_VERSION
RUN corepack enable && corepack prepare yarn@${YARN_VERSION} --activate

COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/full/apps/api/scripts/verify-nest-resolution.js /tmp/verify-nest-resolution.js
RUN --mount=type=cache,target=/root/.cache/yarn \
  yarn install \
    --frozen-lockfile \
    --production=true \
    --network-timeout 600000 \
  && node /tmp/verify-nest-resolution.js /app/apps/api

FROM base AS production
ENV NODE_ENV=production
ENV PORT=8080

WORKDIR /app/apps/api

COPY --from=prod-deps /app/node_modules /app/node_modules
COPY --from=build /app/node_modules/.prisma /app/node_modules/.prisma
COPY --from=build /app/node_modules/@prisma/client /app/node_modules/@prisma/client
COPY --from=build /app/packages /app/packages
COPY --chown=node:node --from=build /app/apps/api/dist ./dist
COPY --chown=node:node --from=build /app/apps/api/prisma ./prisma
COPY --chown=node:node --from=build /app/apps/api/prisma.config.ts ./prisma.config.ts
COPY --chown=node:node --from=build /app/apps/api/package.json ./package.json
COPY --chown=node:node apps/api/docker-entrypoint.sh ./docker-entrypoint.sh

COPY --from=build /app/apps/api/scripts/verify-nest-resolution.js /tmp/verify-nest-resolution.js
RUN chmod +x ./docker-entrypoint.sh \
  && chown node:node /app/apps/api \
  && test -x /app/node_modules/.bin/prisma \
  && test -f ./dist/main.js \
  && test -f ./dist/prepare-environment.js \
  && node /tmp/verify-nest-resolution.js /app/apps/api \
  && rm /tmp/verify-nest-resolution.js

USER node

EXPOSE 8080
ENTRYPOINT ["./docker-entrypoint.sh"]
