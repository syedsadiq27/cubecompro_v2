import 'dotenv/config';
import { defineConfig } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
    seed:
      process.env.NODE_ENV === 'production'
        ? 'node dist/seed/prisma/seed.js'
        : 'ts-node --compiler-options {"module":"CommonJS"} prisma/seed.ts',
  },
  engine: 'classic',
  datasource: {
    url:
      process.env.DATABASE_URL ??
      'postgresql://build:build@127.0.0.1:5432/build',
  },
});
