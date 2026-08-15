import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ConstraintService } from './constraint.service';
import {
  buildMigrationReport,
  mapLegacyRuleToConstraint,
  migrationGatePasses,
  type ChoiceValueLookup,
  type RuleMigrationReport,
} from './legacy-rule-migration';

@Injectable()
export class LegacyRuleMigrationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly constraints: ConstraintService
  ) {}

  async migrateAll(options?: {
    dryRun?: boolean;
    productRevisionId?: string;
  }): Promise<RuleMigrationReport> {
    const dryRun = options?.dryRun ?? false;
    const rules = await this.prisma.configurationRule.findMany({
      where: options?.productRevisionId
        ? { productRevisionId: options.productRevisionId }
        : undefined,
      include: {
        productRevision: {
          include: {
            choices: { include: { values: true } },
            product: true,
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    const results = [];

    for (const rule of rules) {
      const values: ChoiceValueLookup[] = rule.productRevision.choices.flatMap(
        (choice) =>
          choice.values.map((value) => ({
            attributeKey: choice.key,
            valueKey: value.key,
            choiceValueId: value.id,
            attributeId: choice.id,
          }))
      );

      const mapped = mapLegacyRuleToConstraint(
        {
          id: rule.id,
          productRevisionId: rule.productRevisionId,
          productId: rule.productRevision.productId,
          condition: rule.condition,
          effect: rule.effect,
        },
        values
      );

      if (mapped.status === 'migrated' && !dryRun) {
        try {
          await this.constraints.createConstraint({
            productRevisionId: mapped.constraint.productRevisionId,
            choiceValueIds: mapped.constraint.choiceValueIds,
          });
        } catch (error) {
          const message =
            error instanceof Error ? error.message : 'Constraint create failed';
          if (message.includes('Duplicate constraint')) {
            results.push(mapped);
            continue;
          }
          results.push({
            status: 'failed' as const,
            ruleId: mapped.ruleId,
            productRevisionId: mapped.productRevisionId,
            productId: mapped.productId,
            reason: message,
          });
          continue;
        }
      }

      results.push(mapped);
    }

    return buildMigrationReport(results);
  }

  async assessGate(productRevisionId?: string) {
    const report = await this.migrateAll({
      dryRun: true,
      productRevisionId,
    });
    return {
      passes: migrationGatePasses(report),
      report,
    };
  }
}
