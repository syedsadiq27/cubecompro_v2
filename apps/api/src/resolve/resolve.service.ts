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
  isSetMaterialValue,
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
import { PrismaService } from '../prisma/prisma.service';

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
    activeMaterialAssetRevisionIds: string[];
    activeTextureAssetRevisionIds: string[];
    effects: Array<{
      targetKey: string;
      targetType: string;
      nodePath: string | null;
      materialSlot?: string | null;
      operation: VisualOperation;
      value: unknown;
      materialAssetRevisionId?: string | null;
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
  constructor(
    private readonly products: ProductService,
    private readonly prisma: PrismaService
  ) {}

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

    const pendingMaterialRevisionIds = new Set<string>();
    const staticSetup: Array<
      | {
          targetKey: string;
          operation: 'REPLACE_COMPONENT';
          linkedAssetKey: string;
          expectedRole: 'OBJECT';
        }
      | {
          targetKey: string;
          operation: 'SET_MATERIAL';
          materialAssetRevisionId: string;
          materialSlot?: string;
        }
    > = [];

    for (const setup of primaryModel?.visualSetups ?? []) {
      const target = targetById.get(setup.modelTargetId);
      if (!target) continue;
      if (setup.operation === VisualOperation.REPLACE_COMPONENT) {
        if (!isReplaceComponentValue(setup.value)) continue;
        staticSetup.push({
          targetKey: target.key,
          operation: 'REPLACE_COMPONENT',
          linkedAssetKey: setup.value.linkedAssetKey,
          expectedRole: 'OBJECT',
        });
        continue;
      }
      if (setup.operation === VisualOperation.SET_MATERIAL) {
        if (!isSetMaterialValue(setup.value)) continue;
        const materialAssetRevisionId =
          setup.value.materialAssetRevisionId.trim();
        pendingMaterialRevisionIds.add(materialAssetRevisionId);
        staticSetup.push({
          targetKey: target.key,
          operation: 'SET_MATERIAL',
          materialAssetRevisionId,
          ...(target.materialSlot
            ? { materialSlot: target.materialSlot }
            : {}),
        });
      }
    }

    for (const effect of detail.visualEffects) {
      const target = targetById.get(effect.modelTargetId);
      const choiceValue = choiceValueById.get(effect.choiceValueId);
      if (!target || !choiceValue) continue;

      if (effect.operation === VisualOperation.REPLACE_COMPONENT) {
        if (!isReplaceComponentValue(effect.value)) continue;
        const replaceValue = effect.value;
        bindings.push({
          choiceKey: choiceValue.choiceKey,
          choiceValueKey: choiceValue.choiceValueKey,
          targetKey: target.key,
          operation: 'REPLACE_COMPONENT',
          linkedAssetKey: replaceValue.linkedAssetKey,
          expectedRole: 'OBJECT',
        });
        continue;
      }

      if (effect.operation === VisualOperation.SET_MATERIAL) {
        if (!isSetMaterialValue(effect.value)) continue;
        const materialAssetRevisionId =
          effect.value.materialAssetRevisionId.trim();
        pendingMaterialRevisionIds.add(materialAssetRevisionId);
        bindings.push({
          choiceKey: choiceValue.choiceKey,
          choiceValueKey: choiceValue.choiceValueKey,
          targetKey: target.key,
          ...(target.materialSlot
            ? { materialSlot: target.materialSlot }
            : {}),
          operation: 'SET_MATERIAL',
          materialAssetRevisionId,
        });
      }
    }

    const textureRevisionsByMaterialRevisionId: Record<string, string[]> = {};
    if (pendingMaterialRevisionIds.size > 0) {
      const materialRevisions =
        await this.prisma.materialAssetRevision.findMany({
          where: { id: { in: [...pendingMaterialRevisionIds] } },
          include: { textureUsages: true },
        });
      for (const revision of materialRevisions) {
        textureRevisionsByMaterialRevisionId[revision.id] =
          revision.textureUsages.map((usage) => usage.textureAssetRevisionId);
      }
    }

    let visualState = null;
    try {
      visualState = primaryModel
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
            staticSetup,
            bindings,
            textureRevisionsByMaterialRevisionId,
          })
        : null;
    } catch (error) {
      violations.push(
        error instanceof Error ? error.message : 'Visual state derivation failed'
      );
    }

    const threeD: ResolvedConfiguration['threeD'] = {
      modelId: primaryModel?.id ?? null,
      rootObjectAssetRevisionId:
        visualState?.rootObjectAssetRevisionId ??
        primaryModel?.objectAssetRevisionId ??
        null,
      activeObjectAssetRevisionIds:
        visualState?.activeAssets.objectAssetRevisionIds ??
        (primaryModel ? [primaryModel.objectAssetRevisionId] : []),
      activeMaterialAssetRevisionIds:
        visualState?.activeAssets.materialAssetRevisionIds ?? [],
      activeTextureAssetRevisionIds:
        visualState?.activeAssets.textureAssetRevisionIds ?? [],
      effects: [],
    };

    const commerce: ResolvedConfiguration['commerce'] = {
      provider: null,
      productReference: null,
      variantReference: null,
      sku: null,
      cartPayload: null,
    };

    if (valid && violations.length === 0) {
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
          if (!isSetMaterialValue(effect.value)) continue;
          const materialAssetRevisionId =
            effect.value.materialAssetRevisionId.trim();
          threeD.effects.push({
            targetKey: target.key,
            targetType: target.targetType,
            nodePath: target.nodePath ?? null,
            materialSlot: target.materialSlot ?? null,
            operation: effect.operation,
            value: { materialAssetRevisionId },
            materialAssetRevisionId,
            objectAssetRevisionId: null,
            linkedAssetKey: null,
            documentUrl: publicMaterialRevisionUrl(materialAssetRevisionId),
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
            materialSlot: target.materialSlot ?? null,
            operation: effect.operation,
            value: {
              linkedAssetKey: replaceValue.linkedAssetKey,
              role: 'OBJECT',
            },
            materialAssetRevisionId: null,
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
          materialSlot: target.materialSlot ?? null,
          operation: effect.operation,
          value: effect.value,
          materialAssetRevisionId: null,
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
      valid: valid && violations.length === 0,
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
      activeMaterialAssetRevisionIds: [],
      activeTextureAssetRevisionIds: [],
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

function publicMaterialRevisionUrl(materialAssetRevisionId: string): string {
  return `/documents/material-revisions/${materialAssetRevisionId}`;
}

function publicObjectRevisionUrl(objectAssetRevisionId: string): string {
  return `/documents/object-revisions/${objectAssetRevisionId}`;
}
