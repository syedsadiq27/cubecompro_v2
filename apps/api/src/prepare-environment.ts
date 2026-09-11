import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { NestFactory } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import { AppModule } from './app.module';
import { LegacyRuleMigrationService } from './product/legacy-rule-migration.service';

function flag(value: string | undefined) {
  const v = value?.trim().toLowerCase();
  if (!v) return 'off';
  if (v === 'force') return 'force';
  if (v === '1' || v === 'true' || v === 'yes' || v === 'on') return 'on';
  return 'off';
}

function kernelMigrateMode(): 'off' | 'on' {
  const raw = process.env.KERNEL_MIGRATE_RULES;
  if (raw === undefined || raw.trim() === '') return 'on';
  return flag(raw) === 'off' ? 'off' : 'on';
}

function resolveAppRoot(): string {
  return join(__dirname, '..');
}

function resolveWorkspaceRoot(appRoot: string): string {
  let current = appRoot;
  for (let i = 0; i < 5; i++) {
    if (existsSync(join(current, 'node_modules', '.bin', 'prisma'))) {
      return current;
    }
    const parent = dirname(current);
    if (
      existsSync(join(parent, 'node_modules', '.bin', 'prisma')) ||
      existsSync(join(parent, 'packages'))
    ) {
      return parent;
    }
    if (parent === current) break;
    current = parent;
  }
  return appRoot;
}

function prismaCmd(workspaceRoot: string) {
  const bin = join(workspaceRoot, 'node_modules', '.bin', 'prisma');
  if (existsSync(bin)) {
    return { cmd: bin, prefix: [] as string[] };
  }
  throw new Error(
    `Prisma CLI not found at ${bin}. Ensure production image copies workspace node_modules.`
  );
}

function runPrisma(appRoot: string, workspaceRoot: string, args: string[]) {
  const { cmd, prefix } = prismaCmd(workspaceRoot);
  execFileSync(cmd, [...prefix, ...args], {
    cwd: appRoot,
    stdio: 'inherit',
    env: process.env,
  });
}

function runSeed(appRoot: string) {
  const compiled = join(appRoot, 'dist', 'seed', 'prisma', 'seed.js');
  const legacy = join(appRoot, 'prisma', 'seed.js');
  const seedJs = existsSync(compiled)
    ? compiled
    : existsSync(legacy)
      ? legacy
      : null;
  if (!seedJs) {
    throw new Error(
      `Seed script not found (looked for ${compiled} and ${legacy})`
    );
  }
  execFileSync(process.execPath, [seedJs], {
    cwd: appRoot,
    stdio: 'inherit',
    env: process.env,
  });
}

async function maybeSeed(appRoot: string) {
  const prisma = new PrismaClient();
  try {
    const existing = await prisma.user.findUnique({
      where: { email: 'owner@demo.cubecom.dev' },
    });
    if (existing) {
      console.log('[prestart] seed skipped — demo data already present');
      return;
    }
  } catch (error) {
    console.error('[prestart] seed precheck failed', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }

  console.log('[prestart] seeding database…');
  try {
    runSeed(appRoot);
  } catch (error) {
    const client = new PrismaClient();
    try {
      const existing = await client.user.findUnique({
        where: { email: 'owner@demo.cubecom.dev' },
      });
      if (existing) {
        console.warn(
          '[prestart] seed raced or partially applied — continuing with existing demo data'
        );
        return;
      }
    } finally {
      await client.$disconnect();
    }
    throw error;
  }
}

async function migrateLegacyRules() {
  if (kernelMigrateMode() === 'off') {
    console.log('[prestart] KERNEL_MIGRATE_RULES=off — skipping rule migration');
    return;
  }

  console.log(
    '[prestart] migrating legacy ConfigurationRules → Constraints…'
  );

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  try {
    const migration = app.get(LegacyRuleMigrationService);
    const report = await migration.migrateAll({ dryRun: false });
    const gate = await migration.assessGate();

    console.log(
      '[prestart] kernel rule migration',
      JSON.stringify({
        dryRun: false,
        total: report.total,
        migrated: report.migrated,
        unsupported: report.unsupported,
        failed: report.failed,
        gatePasses: gate.passes,
      })
    );

    if (report.failed > 0 || !gate.passes) {
      throw new Error(
        `Kernel cutover gate failed (failed=${report.failed}, total=${report.total}, gatePasses=${gate.passes})`
      );
    }
  } finally {
    await app.close();
  }
}

/**
 * Pre-start: schema migrate → demo seed (skip if already seeded) →
 * kernel ConfigurationRule→Constraint. Fail hard on migrate / gate failure
 * so the API never boots on a broken DB.
 */
export async function prepareEnvironment(): Promise<void> {
  if (process.env.PREPARE_DONE === '1') {
    console.log('[prestart] PREPARE_DONE=1 — skipping');
    return;
  }

  if (!process.env.DATABASE_URL) {
    throw new Error(
      '[prestart] DATABASE_URL is required (set Cloud Run env / Secret Manager)'
    );
  }

  const appRoot = resolveAppRoot();
  const workspaceRoot = resolveWorkspaceRoot(appRoot);
  console.log('[prestart] appRoot=', appRoot, 'workspaceRoot=', workspaceRoot);

  console.log('[prestart] prisma migrate deploy…');
  runPrisma(appRoot, workspaceRoot, ['migrate', 'deploy']);

  await maybeSeed(appRoot);
  await migrateLegacyRules();

  console.log('[prestart] environment ready');
}

async function main() {
  try {
    await prepareEnvironment();
  } catch (error) {
    console.error('[prestart] failed', error);
    process.exit(1);
  }
}

if (require.main === module) {
  void main();
}
