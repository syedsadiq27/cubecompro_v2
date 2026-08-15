import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
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

function prismaCmd(root: string) {
  const bin = join(root, 'node_modules', '.bin', 'prisma');
  if (existsSync(bin)) {
    return { cmd: bin, prefix: [] as string[] };
  }
  return { cmd: 'npx', prefix: ['prisma'] };
}

function runPrisma(root: string, args: string[]) {
  const { cmd, prefix } = prismaCmd(root);
  execFileSync(cmd, [...prefix, ...args], {
    cwd: root,
    stdio: 'inherit',
    env: process.env,
  });
}

function runSeed(root: string) {
  const compiled = join(root, 'dist', 'seed', 'prisma', 'seed.js');
  const legacy = join(root, 'prisma', 'seed.js');
  const seedJs = existsSync(compiled)
    ? compiled
    : existsSync(legacy)
      ? legacy
      : null;
  if (seedJs) {
    execFileSync(process.execPath, [seedJs], {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    });
    return;
  }
  runPrisma(root, ['db', 'seed']);
}

async function maybeSeed(root: string) {
  const seed = flag(process.env.SEED);
  if (seed === 'off') {
    console.log('[prestart] SEED=off — skipping seed');
    return;
  }

  if (seed === 'on') {
    const prisma = new PrismaClient();
    try {
      const existing = await prisma.user.findUnique({
        where: { email: 'owner@demo.cubecom.dev' },
      });
      if (existing) {
        console.log(
          '[prestart] SEED skipped — demo user already exists (SEED=force to rerun)'
        );
        return;
      }
    } catch (error) {
      console.error('[prestart] SEED precheck failed', error);
      throw error;
    } finally {
      await prisma.$disconnect();
    }
  }

  console.log('[prestart] seeding database…');
  runSeed(root);
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

    if (!gate.passes) {
      throw new Error(
        `Kernel cutover gate failed (failed=${gate.report.failed}, total=${gate.report.total})`
      );
    }
  } finally {
    await app.close();
  }
}

/**
 * Pre-start: schema migrate → optional seed → kernel ConfigurationRule→Constraint.
 * Fail hard on migrate / gate failure so the API never boots on a broken DB.
 */
export async function prepareEnvironment(): Promise<void> {
  if (process.env.PREPARE_DONE === '1') {
    console.log('[prestart] PREPARE_DONE=1 — skipping');
    return;
  }

  if (!process.env.DATABASE_URL) {
    console.warn('[prestart] DATABASE_URL not set — skipping prepare');
    return;
  }

  const root = join(__dirname, '..');

  console.log('[prestart] prisma migrate deploy…');
  runPrisma(root, ['migrate', 'deploy']);

  await maybeSeed(root);
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
