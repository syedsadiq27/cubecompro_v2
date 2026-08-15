import { Injectable } from '@nestjs/common';
import {
  AttributeType,
  GraphVersionStatus,
  VisualOperation,
  type AttributeValue,
  type ProductAttribute,
} from '@prisma/client';
import {
  deriveAvailability,
  formatValidationIssues,
  validateSelection,
  type KernelChoice,
  type KernelConstraint,
  type Selection,
} from '../product/kernel-runtime';
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
  availability?: Record<string, Record<string, boolean>>;
  threeD: {
    modelId: string | null;
    effects: Array<{
      targetKey: string;
      targetType: string;
      nodePath: string | null;
      operation: VisualOperation;
      value: unknown;
      materialAssetId?: string | null;
      documentUrl?: string | null;
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
    const { selection, choices, constraints, legacyViolations } =
      buildKernelInputs(state.selections, attributes, detail.constraints);

    const validation = validateSelection(selection, choices, constraints);
    const violations = [
      ...legacyViolations,
      ...formatValidationIssues(validation.issues),
    ];
    const normalized: Record<string, unknown> = { ...selection };
    const availability = deriveAvailability(selection, choices, constraints);
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
        if (attribute.type !== AttributeType.SELECT) {
          continue;
        }
        const selected = selection[attribute.key];
        if (typeof selected === 'string') {
          const value = attribute.values.find((entry) => entry.key === selected);
          if (value) selectedValueIds.add(value.id);
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

        if (effect.operation === VisualOperation.SET_MATERIAL) {
          const materialAssetId = readMaterialAssetId(effect.value);
          if (!materialAssetId) continue;
          threeD.effects.push({
            targetKey: target.key,
            targetType: target.targetType,
            nodePath: target.nodePath ?? null,
            operation: effect.operation,
            value: { materialAssetId },
            materialAssetId,
            documentUrl: publicMaterialUrl(materialAssetId),
          });
          continue;
        }

        threeD.effects.push({
          targetKey: target.key,
          targetType: target.targetType,
          nodePath: target.nodePath ?? null,
          operation: effect.operation,
          value: effect.value,
          materialAssetId: null,
          documentUrl: null,
        });
      }

      const matched = detail.variants.find((variant) => {
        if (variant.selections.length === 0) return false;
        return variant.selections.every((variantSelection) => {
          const attribute = attributes.find(
            (entry) => entry.id === variantSelection.attributeId
          );
          if (!attribute) return false;
          const value = attribute.values.find(
            (entry) => entry.id === variantSelection.attributeValueId
          );
          if (!value) return false;
          return selection[attribute.key] === value.key;
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
        };
      }
    }

    return {
      valid,
      violations,
      selections: normalized,
      availability,
      threeD,
      commerce,
      graphVersionId: detail.id,
      graphVersion: detail.version,
    };
  }
}

function buildKernelInputs(
  selections: Record<string, unknown>,
  attributes: Array<ProductAttribute & { values: AttributeValue[] }>,
  constraints: Array<{
    id: string;
    terms: Array<{
      choiceValue?: {
        key: string;
        attribute?: { key: string } | null;
      } | null;
    }>;
  }>
) {
  const legacyViolations: string[] = [];
  const choices: KernelChoice[] = attributes
    .filter((attribute) => attribute.type === AttributeType.SELECT)
    .map((attribute) => ({
      key: attribute.key,
      required: attribute.required,
      values: attribute.values.map((value) => ({ key: value.key })),
    }));

  const selection: Selection = {};

  for (const [key, raw] of Object.entries(selections)) {
    const attribute = attributes.find((entry) => entry.key === key);
    if (!attribute) {
      if (typeof raw === 'string') {
        selection[key] = raw;
      }
      continue;
    }
    if (attribute.type === AttributeType.SELECT) {
      if (typeof raw === 'string') {
        selection[key] = raw;
      } else {
        legacyViolations.push(`Attribute ${key} expects a string value key`);
      }
      continue;
    }
    legacyViolations.push(
      `Legacy attribute type ${attribute.type} is outside kernel Selection`
    );
  }

  const kernelConstraints: KernelConstraint[] = constraints.map(
    (constraint) => ({
      id: constraint.id,
      terms: constraint.terms
        .map((term) => {
          const choiceKey = term.choiceValue?.attribute?.key;
          const choiceValueKey = term.choiceValue?.key;
          if (!choiceKey || !choiceValueKey) return null;
          return { choiceKey, choiceValueKey };
        })
        .filter(
          (term): term is { choiceKey: string; choiceValueKey: string } =>
            Boolean(term)
        ),
    })
  );

  return {
    selection,
    choices,
    constraints: kernelConstraints,
    legacyViolations,
  };
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
    threeD: {
      modelId: null,
      effects: [],
    },
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

function readMaterialAssetId(value: unknown): string | null {
  if (
    typeof value === 'object' &&
    value !== null &&
    'materialAssetId' in value &&
    typeof (value as { materialAssetId: unknown }).materialAssetId === 'string'
  ) {
    return (value as { materialAssetId: string }).materialAssetId;
  }
  return null;
}

function publicMaterialUrl(materialAssetId: string): string {
  return `/documents/materials/${materialAssetId}`;
}
