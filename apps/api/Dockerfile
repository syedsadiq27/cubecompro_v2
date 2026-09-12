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
  && node -e "\
const path = require('path');\
const core = require.resolve('@nestjs/core', { paths: ['/app/apps/api'] });\
const apollo = require.resolve('@nestjs/apollo', { paths: ['/app/apps/api'] });\
const config = require.resolve('@nestjs/config', { paths: ['/app/apps/api'] });\
const root = path.join('/app', 'node_modules', '@nestjs');\
if (!core.startsWith(root) || !apollo.startsWith(root) || !config.startsWith(root)) {\
  throw new Error(\
    'Nest packages are not hoisted to /app/node_modules/@nestjs. ' +\
    'Fix package.json resolutions / lockfile. ' +\
    JSON.stringify({ core, apollo, config })\
  );\
}\
console.log('[docker] hoisted @nestjs tree ok');\
"

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
COPY --from=build /app/apps/api/dist ./dist
COPY --from=build /app/apps/api/prisma ./prisma
COPY --from=build /app/apps/api/prisma.config.ts ./prisma.config.ts
COPY --from=build /app/apps/api/package.json ./package.json
COPY apps/api/docker-entrypoint.sh ./docker-entrypoint.sh

RUN chmod +x ./docker-entrypoint.sh \
  && test -x /app/node_modules/.bin/prisma \
  && test -f ./dist/main.js \
  && test -f ./dist/prepare-environment.js \
  && node -e "\
const path = require('path');\
const core = require.resolve('@nestjs/core');\
const apollo = require.resolve('@nestjs/apollo');\
const config = require.resolve('@nestjs/config');\
const root = path.join('/app', 'node_modules', '@nestjs');\
if (!core.startsWith(root) || !apollo.startsWith(root) || !config.startsWith(root)) {\
  throw new Error(JSON.stringify({ core, apollo, config }));\
}\
console.log('[docker] runtime @nestjs ok');\
"

EXPOSE 8080
ENTRYPOINT ["./docker-entrypoint.sh"]
