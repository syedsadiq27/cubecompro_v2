import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { LegacyRuleMigrationService } from './legacy-rule-migration.service';

async function main() {
  const dryRun = process.argv.includes('--dry-run');
  const revisionArg = process.argv.find((arg) =>
    arg.startsWith('--revision=')
  );
  const productRevisionId = revisionArg?.slice('--revision='.length);

  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });
  const migration = app.get(LegacyRuleMigrationService);
  const report = await migration.migrateAll({ dryRun, productRevisionId });
  const gate = await migration.assessGate(productRevisionId);

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify(
      {
        dryRun,
        productRevisionId: productRevisionId ?? null,
        report: {
          total: report.total,
          migrated: report.migrated,
          unsupported: report.unsupported,
          failed: report.failed,
          results: report.results,
        },
        gatePasses: gate.passes,
      },
      null,
      2
    )
  );

  await app.close();
  if (!gate.passes) {
    process.exitCode = 2;
  }
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
