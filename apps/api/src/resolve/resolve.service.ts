import { Injectable } from '@nestjs/common';
import {
  AttributeType,
  GraphVersionStatus,
  VisualOperation,
  type ChoiceValue,
  type Choice,
} from '@prisma/client';
import {
  deriveVisualState,
  isReplaceComponentValue,
  type VisualAssetBinding,
} from '@repo/product-graph';
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
  productRevisionId?: string;
  selections: Record<string, unknown>;
};

export type ResolvedConfiguration = {
  valid: boolean;
  violations: string[];
  selections: Record<string, unknown>;
  availability?: Record<string, Record<string, boolean>>;
  threeD: {
    modelId: string | null;
    rootObjectAssetRevisionId: string | null;
    activeObjectAssetRevisionIds: string[];
    effects: Array<{
      targetKey: string;
      targetType: string;
      nodePath: string | null;
      operation: VisualOperation;
      value: unknown;
      materialAssetId?: string | null;
      objectAssetRevisionId?: string | null;
      linkedAssetKey?: string | null;
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
  productRevisionId: string;
  graphVersion: number;
};

@Injectable()
export class ResolveService {
  constructor(private readonly products: ProductService) {}

  async resolve(state: ConfigurationState): Promise<ResolvedConfiguration> {
    const versionMeta = await this.products.getActiveOrVersion(
      state.productId,
      state.productRevisionId
    );

    if (
      !state.productRevisionId &&
      versionMeta.status !== GraphVersionStatus.PUBLISHED
    ) {
      return emptyUnresolved(
        versionMeta.id,
        versionMeta.version,
        state.selections,
        ['Active product revision is not published']
      );
    }

    const detail = await this.products.getGraphVersionDetail(versionMeta.id);
    const choicesData = detail.choices;
    const { selection, choices, constraints, legacyViolations } =
      buildKernelInputs(state.selections, choicesData, detail.constraints);

    const validation = validateSelection(selection, choices, constraints);
    const violations = [
      ...legacyViolations,
      ...formatValidationIssues(validation.issues),
    ];
    const normalized: Record<string, unknown> = { ...selection };
    const availability = deriveAvailability(selection, choices, constraints);
    const valid = violations.length === 0;

    const primaryModel = detail.models[0] ?? null;
    const selectionRecord: Record<string, string> = {};
    for (const [key, value] of Object.entries(selection)) {
      if (typeof value === 'string') selectionRecord[key] = value;
    }

    const bindings: VisualAssetBinding[] = [];
    const choiceValueById = new Map(
      choicesData.flatMap((choice) =>
        choice.values.map(
          (value) =>
            [
              value.id,
              { choiceKey: choice.key, choiceValueKey: value.key },
            ] as const
        )
      )
    );
    const targetById = new Map(
      detail.models.flatMap((model) =>
        model.targets.map((target) => [target.id, target] as const)
      )
    );

    for (const effect of detail.visualEffects) {
      if (effect.operation !== VisualOperation.REPLACE_COMPONENT) continue;
      if (!isReplaceComponentValue(effect.value)) continue;
      const replaceValue = effect.value;
      const target = targetById.get(effect.modelTargetId);
      const choiceValue = choiceValueById.get(effect.choiceValueId);
      if (!target || !choiceValue) continue;
      bindings.push({
        choiceKey: choiceValue.choiceKey,
        choiceValueKey: choiceValue.choiceValueKey,
        targetKey: target.key,
        operation: 'REPLACE_COMPONENT',
        linkedAssetKey: replaceValue.linkedAssetKey,
        expectedRole: 'OBJECT',
      });
    }

    const visualState = primaryModel
      ? deriveVisualState({
          rootObjectAssetRevisionId: primaryModel.objectAssetRevisionId,
          linkedAssets: primaryModel.linkedAssets.map((link) => ({
            id: link.id,
            role: link.role as
              | 'OBJECT'
              | 'MATERIAL'
              | 'TEXTURE'
              | 'ENVIRONMENT'
              | 'SHADER'
              | 'ANIMATION',
            key: link.key,
            assetRevisionId: link.assetRevisionId,
          })),
          selection: selectionRecord,
          bindings,
        })
      : null;

    const threeD = {
      modelId: primaryModel?.id ?? null,
      rootObjectAssetRevisionId:
        visualState?.rootObjectAssetRevisionId ??
        primaryModel?.objectAssetRevisionId ??
        null,
      activeObjectAssetRevisionIds:
        visualState?.activeAssets.objectAssetRevisionIds ??
        (primaryModel ? [primaryModel.objectAssetRevisionId] : []),
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
      for (const attribute of choicesData) {
        if (attribute.type !== AttributeType.SELECT) {
          continue;
        }
        const selected = selection[attribute.key];
        if (typeof selected === 'string') {
          const value = attribute.values.find((entry) => entry.key === selected);
          if (value) selectedValueIds.add(value.id);
        }
      }

      for (const effect of detail.visualEffects) {
        if (!selectedValueIds.has(effect.choiceValueId)) continue;
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
            objectAssetRevisionId: null,
            linkedAssetKey: null,
            documentUrl: publicMaterialUrl(materialAssetId),
          });
          continue;
        }

        if (effect.operation === VisualOperation.REPLACE_COMPONENT) {
          if (!isReplaceComponentValue(effect.value)) continue;
          const replaceValue = effect.value;
          const link = primaryModel?.linkedAssets.find(
            (entry) =>
              entry.role === 'OBJECT' &&
              entry.key === replaceValue.linkedAssetKey
          );
          if (!link) continue;
          threeD.effects.push({
            targetKey: target.key,
            targetType: target.targetType,
            nodePath: target.nodePath ?? null,
            operation: effect.operation,
            value: {
              linkedAssetKey: replaceValue.linkedAssetKey,
              role: 'OBJECT',
            },
            materialAssetId: null,
            objectAssetRevisionId: link.assetRevisionId,
            linkedAssetKey: replaceValue.linkedAssetKey,
            documentUrl: publicObjectRevisionUrl(link.assetRevisionId),
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
          objectAssetRevisionId: null,
          linkedAssetKey: null,
          documentUrl: null,
        });
      }

      const matched = detail.variants.find((variant) => {
        if (variant.selections.length === 0) return false;
        return variant.selections.every((variantSelection) => {
          const attribute = choicesData.find(
            (entry) => entry.id === variantSelection.choiceId
          );
          if (!attribute) return false;
          const value = attribute.values.find(
            (entry) => entry.id === variantSelection.choiceValueId
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
      productRevisionId: detail.id,
      graphVersion: detail.version,
    };
  }
}

function buildKernelInputs(
  selections: Record<string, unknown>,
  choicesData: Array<Choice & { values: ChoiceValue[] }>,
  constraints: Array<{
    id: string;
    terms: Array<{
      choiceValue?: {
        key: string;
        choice?: { key: string } | null;
      } | null;
    }>;
  }>
) {
  const legacyViolations: string[] = [];
  const choices: KernelChoice[] = choicesData
    .filter((choice) => choice.type === AttributeType.SELECT)
    .map((choice) => ({
      key: choice.key,
      required: choice.required,
      values: choice.values.map((value) => ({ key: value.key })),
    }));

  const selection: Selection = {};

  for (const [key, raw] of Object.entries(selections)) {
    const attribute = choicesData.find((entry) => entry.key === key);
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
          const choiceKey = term.choiceValue?.choice?.key;
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
  productRevisionId: string,
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
      rootObjectAssetRevisionId: null,
      activeObjectAssetRevisionIds: [],
      effects: [],
    },
    commerce: {
      provider: null,
      productReference: null,
      variantReference: null,
      sku: null,
      cartPayload: null,
    },
    productRevisionId,
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

function publicObjectRevisionUrl(objectAssetRevisionId: string): string {
  return `/documents/object-revisions/${objectAssetRevisionId}`;
}
