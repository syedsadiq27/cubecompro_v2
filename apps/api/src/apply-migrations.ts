import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { PrismaClient } from '@prisma/client';

function flag(value: string | undefined) {
  const v = value?.trim().toLowerCase();
  if (!v) return 'off';
  if (v === 'force') return 'force';
  if (v === '1' || v === 'true' || v === 'yes') return 'on';
  return 'off';
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
  const seedJs = join(root, 'prisma', 'seed.js');
  if (existsSync(seedJs)) {
    execFileSync(process.execPath, [seedJs], {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    });
    return;
  }
  runPrisma(root, ['db', 'seed']);
}

export async function applyMigrations() {
  if (!process.env.DATABASE_URL) {
    console.warn('DATABASE_URL not set — skipping prisma migrate / seed');
    return;
  }

  const root = join(__dirname, '..');

  try {
    runPrisma(root, ['migrate', 'deploy']);
  } catch (error) {
    console.error('prisma migrate deploy failed', error);
    return;
  }

  const seed = flag(process.env.SEED);
  if (seed === 'off') return;

  if (seed === 'on') {
    const prisma = new PrismaClient();
    try {
      const existing = await prisma.user.findUnique({
        where: { email: 'owner@demo.cubecom.dev' },
      });
      if (existing) {
        console.log('SEED skipped — demo user already exists (SEED=force to rerun)');
        return;
      }
    } catch (error) {
      console.error('SEED precheck failed', error);
    } finally {
      await prisma.$disconnect();
    }
  }

  try {
    runSeed(root);
  } catch (error) {
    console.error('prisma db seed failed', error);
  }
}
