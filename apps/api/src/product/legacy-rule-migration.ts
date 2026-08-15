export type LegacyClause = { attr: string; eq: unknown };

export type LegacyCondition =
  | { all: LegacyClause[] }
  | { any: LegacyClause[] }
  | LegacyClause;

export type LegacyEffect =
  | { require: LegacyClause }
  | { forbid: LegacyClause }
  | Record<string, unknown>;

export type LegacyRuleJson = {
  id: string;
  productRevisionId: string;
  productId?: string;
  condition: unknown;
  effect: unknown;
};

export type ChoiceValueLookup = {
  attributeKey: string;
  valueKey: string;
  choiceValueId: string;
  attributeId: string;
};

export type MigratableConstraint = {
  productRevisionId: string;
  choiceValueIds: string[];
  signatureTerms: string[];
};

export type RuleMigrationResult =
  | {
      status: 'migrated';
      ruleId: string;
      productRevisionId: string;
      productId?: string;
      constraint: MigratableConstraint;
    }
  | {
      status: 'unsupported';
      ruleId: string;
      productRevisionId: string;
      productId?: string;
      reason: string;
    }
  | {
      status: 'failed';
      ruleId: string;
      productRevisionId: string;
      productId?: string;
      reason: string;
    };

export type RuleMigrationReport = {
  total: number;
  migrated: number;
  unsupported: number;
  failed: number;
  results: RuleMigrationResult[];
};

function isClause(value: unknown): value is LegacyClause {
  return (
    typeof value === 'object' &&
    value !== null &&
    'attr' in value &&
    'eq' in value &&
    typeof (value as LegacyClause).attr === 'string'
  );
}

function conditionClauses(condition: unknown): LegacyClause[] | null {
  if (isClause(condition)) return [condition];
  if (
    typeof condition === 'object' &&
    condition !== null &&
    'all' in condition &&
    Array.isArray((condition as { all: unknown }).all)
  ) {
    const all = (condition as { all: unknown[] }).all;
    if (all.length === 0) return null;
    if (!all.every(isClause)) return null;
    return all;
  }
  return null;
}

function forbidClause(effect: unknown): LegacyClause | null {
  if (
    typeof effect === 'object' &&
    effect !== null &&
    'forbid' in effect &&
    isClause((effect as { forbid: unknown }).forbid) &&
    Object.keys(effect).length === 1
  ) {
    return (effect as { forbid: LegacyClause }).forbid;
  }
  return null;
}

function resolveClause(
  clause: LegacyClause,
  values: ChoiceValueLookup[]
): ChoiceValueLookup | null {
  const key = String(clause.eq);
  return (
    values.find(
      (value) => value.attributeKey === clause.attr && value.valueKey === key
    ) ?? null
  );
}

/**
 * Map a legacy ConfigurationRule to Constraint terms when the shape is the
 * recognized forbid pattern. Does not invent semantics for require/any/other.
 */
export function mapLegacyRuleToConstraint(
  rule: LegacyRuleJson,
  values: ChoiceValueLookup[]
): RuleMigrationResult {
  const base = {
    ruleId: rule.id,
    productRevisionId: rule.productRevisionId,
    productId: rule.productId,
  };

  try {
    if (forbidClause(rule.effect) == null) {
      if (
        typeof rule.effect === 'object' &&
        rule.effect !== null &&
        'require' in rule.effect
      ) {
        return {
          ...base,
          status: 'unsupported',
          reason: 'effect.require cannot be expressed as a mutual-exclusion Constraint',
        };
      }
      return {
        ...base,
        status: 'unsupported',
        reason: 'effect is not a single forbid clause',
      };
    }

    if (
      typeof rule.condition === 'object' &&
      rule.condition !== null &&
      'any' in rule.condition
    ) {
      return {
        ...base,
        status: 'unsupported',
        reason: 'condition.any is not supported by Constraint migration',
      };
    }

    const clauses = conditionClauses(rule.condition);
    if (!clauses) {
      return {
        ...base,
        status: 'unsupported',
        reason: 'condition is not a clause or all[] of clauses',
      };
    }

    const forbid = forbidClause(rule.effect);
    if (!forbid) {
      return {
        ...base,
        status: 'unsupported',
        reason: 'effect is not a single forbid clause',
      };
    }

    const termClauses = [...clauses, forbid];
    const resolved: ChoiceValueLookup[] = [];
    for (const clause of termClauses) {
      const value = resolveClause(clause, values);
      if (!value) {
        return {
          ...base,
          status: 'failed',
          reason: `Could not resolve ${clause.attr}=${String(clause.eq)} on revision`,
        };
      }
      resolved.push(value);
    }

    const choiceIds = new Set(resolved.map((value) => value.attributeId));
    if (choiceIds.size !== resolved.length) {
      return {
        ...base,
        status: 'unsupported',
        reason: 'mapped terms include more than one value for the same Choice',
      };
    }

    if (resolved.length < 2) {
      return {
        ...base,
        status: 'unsupported',
        reason: 'mapped constraint would have fewer than 2 terms',
      };
    }

    return {
      ...base,
      status: 'migrated',
      constraint: {
        productRevisionId: rule.productRevisionId,
        choiceValueIds: resolved.map((value) => value.choiceValueId),
        signatureTerms: resolved
          .map((value) => `${value.attributeKey}=${value.valueKey}`)
          .sort(),
      },
    };
  } catch (error) {
    return {
      ...base,
      status: 'failed',
      reason: error instanceof Error ? error.message : 'Unknown migration error',
    };
  }
}

export function buildMigrationReport(
  results: RuleMigrationResult[]
): RuleMigrationReport {
  return {
    total: results.length,
    migrated: results.filter((result) => result.status === 'migrated').length,
    unsupported: results.filter((result) => result.status === 'unsupported')
      .length,
    failed: results.filter((result) => result.status === 'failed').length,
    results,
  };
}

/**
 * Cutover gate: every relevant rule is migrated or explicitly unsupported.
 * Failed resolutions block the gate.
 */
export function migrationGatePasses(report: RuleMigrationReport): boolean {
  return report.failed === 0 && report.total === report.migrated + report.unsupported;
}
