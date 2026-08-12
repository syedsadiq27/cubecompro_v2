import { Injectable } from '@nestjs/common';
import {
  AttributeType,
  GraphVersionStatus,
  VisualOperation,
  type AttributeValue,
  type ProductAttribute,
} from '@prisma/client';
import { ProductService } from '../product/product.service';

export type ConfigurationState = {
  productId: string;
  graphVersionId?: string;
  selections: Record<string, unknown>;
};

export type ResolvedConfiguration = {
  valid: boolean;
  violations: string[];
  selections: Record<string, unknown>;
  threeD: {
    modelId: string | null;
    effects: Array<{
      targetKey: string;
      targetType: string;
      nodePath: string | null;
      operation: VisualOperation;
      value: unknown;
    }>;
  };
  commerce: {
    provider: string | null;
    productReference: string | null;
    variantReference: string | null;
    sku: string | null;
    cartPayload: Record<string, unknown> | null;
  };
  graphVersionId: string;
  graphVersion: number;
};

type Clause = { attr: string; eq: unknown };
type Condition =
  | { all: Clause[] }
  | { any: Clause[] }
  | Clause;
type Effect =
  | { require: Clause }
  | { forbid: Clause };

@Injectable()
export class ResolveService {
  constructor(private readonly products: ProductService) {}

  async resolve(state: ConfigurationState): Promise<ResolvedConfiguration> {
    const versionMeta = await this.products.getActiveOrVersion(
      state.productId,
      state.graphVersionId
    );

    if (
      !state.graphVersionId &&
      versionMeta.status !== GraphVersionStatus.PUBLISHED
    ) {
      return emptyUnresolved(
        versionMeta.id,
        versionMeta.version,
        state.selections,
        ['Active graph version is not published']
      );
    }

    const detail = await this.products.getGraphVersionDetail(versionMeta.id);
    const attributes = detail.attributes;
    const violations: string[] = [];

    const normalized = normalizeSelections(state.selections, attributes, violations);

    for (const attribute of attributes) {
      if (
        attribute.required &&
        (normalized[attribute.key] === undefined ||
          normalized[attribute.key] === null ||
          normalized[attribute.key] === '')
      ) {
        violations.push(`Missing required attribute ${attribute.key}`);
      }
    }

    for (const rule of detail.rules) {
      const condition = rule.condition as Condition;
      const effect = rule.effect as Effect;
      if (matchesCondition(condition, normalized)) {
        applyEffect(effect, normalized, violations);
      }
    }

    const valid = violations.length === 0;

    const threeD = {
      modelId: detail.models[0]?.id ?? null,
      effects: [] as ResolvedConfiguration['threeD']['effects'],
    };

    const commerce: ResolvedConfiguration['commerce'] = {
      provider: null,
      productReference: null,
      variantReference: null,
      sku: null,
      cartPayload: null,
    };

    if (valid) {
      const selectedValueIds = new Set<string>();
      for (const attribute of attributes) {
        if (
          attribute.type !== AttributeType.SELECT &&
          attribute.type !== AttributeType.MULTI_SELECT
        ) {
          continue;
        }
        const selected = normalized[attribute.key];
        if (typeof selected === 'string') {
          const value = attribute.values.find((entry) => entry.key === selected);
          if (value) selectedValueIds.add(value.id);
        }
        if (Array.isArray(selected)) {
          for (const key of selected) {
            if (typeof key !== 'string') continue;
            const value = attribute.values.find((entry) => entry.key === key);
            if (value) selectedValueIds.add(value.id);
          }
        }
      }

      const targetById = new Map(
        detail.models.flatMap((model) =>
          model.targets.map((target) => [target.id, target] as const)
        )
      );

      for (const effect of detail.visualEffects) {
        if (!selectedValueIds.has(effect.attributeValueId)) continue;
        const target = targetById.get(effect.modelTargetId);
        if (!target) continue;
        threeD.effects.push({
          targetKey: target.key,
          targetType: target.targetType,
          nodePath: target.nodePath ?? null,
          operation: effect.operation,
          value: effect.value,
        });
      }

      const matched = detail.variants.find((variant) => {
        if (variant.selections.length === 0) return false;
        return variant.selections.every((selection) => {
          const attribute = attributes.find(
            (entry) => entry.id === selection.attributeId
          );
          if (!attribute) return false;
          const value = attribute.values.find(
            (entry) => entry.id === selection.attributeValueId
          );
          if (!value) return false;
          return normalized[attribute.key] === value.key;
        });
      });

      if (matched) {
        commerce.provider = matched.provider;
        commerce.productReference = matched.externalId;
        commerce.variantReference = matched.externalId;
        commerce.sku = matched.sku ?? matched.externalId;
        commerce.cartPayload = {
          sku: commerce.sku,
          provider: matched.provider,
          externalId: matched.externalId,
          selections: normalized,
          graphVersionId: versionMeta.id,
          graphVersion: versionMeta.version,
        };
      }
    }

    return {
      valid,
      violations,
      selections: normalized,
      threeD,
      commerce,
      graphVersionId: versionMeta.id,
      graphVersion: versionMeta.version,
    };
  }
}

function emptyUnresolved(
  graphVersionId: string,
  graphVersion: number,
  selections: Record<string, unknown>,
  violations: string[]
): ResolvedConfiguration {
  return {
    valid: false,
    violations,
    selections,
    threeD: { modelId: null, effects: [] },
    commerce: {
      provider: null,
      productReference: null,
      variantReference: null,
      sku: null,
      cartPayload: null,
    },
    graphVersionId,
    graphVersion,
  };
}

function normalizeSelections(
  selections: Record<string, unknown>,
  attributes: Array<
    ProductAttribute & { values: AttributeValue[] }
  >,
  violations: string[]
): Record<string, unknown> {
  const normalized: Record<string, unknown> = { ...selections };
  const byKey = new Map(attributes.map((attribute) => [attribute.key, attribute]));

  for (const [key, raw] of Object.entries(selections)) {
    const attribute = byKey.get(key);
    if (!attribute) {
      violations.push(`Unknown attribute ${key}`);
      continue;
    }

    if (
      attribute.type === AttributeType.SELECT ||
      attribute.type === AttributeType.MULTI_SELECT
    ) {
      if (attribute.type === AttributeType.SELECT) {
        if (typeof raw !== 'string') {
          violations.push(`Attribute ${key} expects a string value key`);
          continue;
        }
        if (!attribute.values.some((value) => value.key === raw)) {
          violations.push(`Invalid value ${String(raw)} for attribute ${key}`);
        }
      } else if (!Array.isArray(raw)) {
        violations.push(`Attribute ${key} expects an array of value keys`);
      } else {
        for (const entry of raw) {
          if (
            typeof entry !== 'string' ||
            !attribute.values.some((value) => value.key === entry)
          ) {
            violations.push(
              `Invalid value ${String(entry)} for attribute ${key}`
            );
          }
        }
      }
    } else if (attribute.type === AttributeType.BOOLEAN) {
      if (typeof raw !== 'boolean') {
        violations.push(`Attribute ${key} expects a boolean`);
      }
    } else if (attribute.type === AttributeType.NUMBER) {
      if (typeof raw !== 'number' || Number.isNaN(raw)) {
        violations.push(`Attribute ${key} expects a number`);
      }
    } else if (attribute.type === AttributeType.TEXT) {
      if (typeof raw !== 'string') {
        violations.push(`Attribute ${key} expects text`);
      }
    }
  }

  return normalized;
}

function matchesCondition(
  condition: Condition,
  selections: Record<string, unknown>
): boolean {
  if ('all' in condition) {
    return condition.all.every((clause) => matchesClause(clause, selections));
  }
  if ('any' in condition) {
    return condition.any.some((clause) => matchesClause(clause, selections));
  }
  return matchesClause(condition, selections);
}

function matchesClause(
  clause: Clause,
  selections: Record<string, unknown>
): boolean {
  return selections[clause.attr] === clause.eq;
}

function applyEffect(
  effect: Effect,
  selections: Record<string, unknown>,
  violations: string[]
) {
  if ('require' in effect) {
    const clause = effect.require;
    if (!matchesClause(clause, selections)) {
      violations.push(
        `Rule requires ${clause.attr}=${String(clause.eq)}`
      );
    }
    return;
  }
  if ('forbid' in effect) {
    const clause = effect.forbid;
    if (matchesClause(clause, selections)) {
      violations.push(
        `Rule forbids ${clause.attr}=${String(clause.eq)}`
      );
    }
  }
}
