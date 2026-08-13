import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AttributeType,
  GraphVersionStatus,
  ProductStatus,
  VisualOperation,
  type Prisma,
} from '@prisma/client';
import { DocumentStoreService } from '../documents/document-store.service';
import { PrismaService } from '../prisma/prisma.service';

const graphDetailInclude = {
  attributes: {
    include: { values: { orderBy: { sortOrder: 'asc' as const } } },
    orderBy: { sortOrder: 'asc' as const },
  },
  rules: true,
  models: { include: { targets: true } },
  variants: { include: { selections: true } },
} satisfies Prisma.ProductGraphVersionInclude;

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documents: DocumentStoreService
  ) {}

  async create(input: {
    organizationId: string;
    projectId: string;
    name: string;
    key: string;
    description?: string;
  }) {
    const project = await this.prisma.project.findFirst({
      where: {
        id: input.projectId,
        organizationId: input.organizationId,
      },
    });
    if (!project) {
      throw new NotFoundException('Project not found in organization');
    }

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          organizationId: input.organizationId,
          projectId: input.projectId,
          name: input.name,
          key: input.key,
          description: input.description,
          status: ProductStatus.DRAFT,
        },
      });

      await tx.productGraphVersion.create({
        data: {
          organizationId: input.organizationId,
          productId: product.id,
          version: 1,
          status: GraphVersionStatus.DRAFT,
        },
      });

      return product;
    });
  }

  async getById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return product;
  }

  listByProject(projectId: string) {
    return this.prisma.product.findMany({
      where: { projectId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(input: {
    id: string;
    name?: string;
    key?: string;
    description?: string;
    status?: ProductStatus;
  }) {
    await this.getById(input.id);
    return this.prisma.product.update({
      where: { id: input.id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.key !== undefined ? { key: input.key } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      },
    });
  }

  async delete(id: string) {
    await this.getById(id);
    await this.prisma.product.update({
      where: { id },
      data: { activeGraphVersionId: null },
    });
    await this.prisma.product.delete({ where: { id } });
    return true;
  }

  async discardDraftGraphVersion(productId: string) {
    await this.getById(productId);
    const draft = await this.prisma.productGraphVersion.findFirst({
      where: { productId, status: GraphVersionStatus.DRAFT },
    });
    if (!draft) {
      throw new NotFoundException('No draft configuration to discard');
    }

    const product = await this.getById(productId);
    if (product.activeGraphVersionId === draft.id) {
      await this.prisma.product.update({
        where: { id: productId },
        data: { activeGraphVersionId: null },
      });
    }

    await this.prisma.productGraphVersion.delete({ where: { id: draft.id } });
    return true;
  }

  async createDraftGraphVersion(
    productId: string,
    sourceGraphVersionId?: string
  ) {
    const product = await this.getById(productId);

    const existingDraft = await this.prisma.productGraphVersion.findFirst({
      where: { productId, status: GraphVersionStatus.DRAFT },
    });

    if (existingDraft) {
      const attributeCount = await this.prisma.productAttribute.count({
        where: { graphVersionId: existingDraft.id },
      });
      if (attributeCount > 0 && !sourceGraphVersionId) {
        return existingDraft;
      }
      if (attributeCount > 0 && sourceGraphVersionId) {
        throw new BadRequestException(
          'Discard the current draft before creating a new draft from a version'
        );
      }
    }

    let source =
      sourceGraphVersionId != null
        ? await this.prisma.productGraphVersion.findFirst({
            where: { id: sourceGraphVersionId, productId },
            include: graphDetailInclude,
          })
        : null;

    if (sourceGraphVersionId && !source) {
      throw new NotFoundException('Source graph version not found for product');
    }

    if (!source) {
      source =
        (product.activeGraphVersionId
          ? await this.prisma.productGraphVersion.findUnique({
              where: { id: product.activeGraphVersionId },
              include: graphDetailInclude,
            })
          : null) ??
        (await this.prisma.productGraphVersion.findFirst({
          where: { productId, status: GraphVersionStatus.PUBLISHED },
          orderBy: { version: 'desc' },
          include: graphDetailInclude,
        }));
    }

    if (source?.status === GraphVersionStatus.DRAFT) {
      throw new BadRequestException(
        'Cannot create a draft from another draft version'
      );
    }

    const sourceEffects = source
      ? await this.prisma.visualEffect.findMany({
          where: {
            attributeValue: {
              attribute: { graphVersionId: source.id },
            },
          },
        })
      : [];

    const count = await this.prisma.productGraphVersion.count({
      where: { productId },
    });

    return this.prisma.$transaction(async (tx) => {
      const draft =
        existingDraft ??
        (await tx.productGraphVersion.create({
          data: {
            organizationId: product.organizationId,
            productId,
            version: count + 1,
            status: GraphVersionStatus.DRAFT,
          },
        }));

      if (!source) {
        return draft;
      }

      const attributeIdMap = new Map<string, string>();
      const valueIdMap = new Map<string, string>();
      const targetIdMap = new Map<string, string>();

      for (const attribute of source.attributes) {
        const created = await tx.productAttribute.create({
          data: {
            graphVersionId: draft.id,
            key: attribute.key,
            name: attribute.name,
            type: attribute.type,
            required: attribute.required,
            sortOrder: attribute.sortOrder,
          },
        });
        attributeIdMap.set(attribute.id, created.id);

        for (const value of attribute.values) {
          const createdValue = await tx.attributeValue.create({
            data: {
              attributeId: created.id,
              key: value.key,
              name: value.name,
              sortOrder: value.sortOrder,
              metadata: value.metadata ?? undefined,
            },
          });
          valueIdMap.set(value.id, createdValue.id);
        }

        if (attribute.defaultValueId) {
          const mappedDefault = valueIdMap.get(attribute.defaultValueId);
          if (mappedDefault) {
            await tx.productAttribute.update({
              where: { id: created.id },
              data: { defaultValueId: mappedDefault },
            });
          }
        }
      }

      for (const rule of source.rules) {
        await tx.configurationRule.create({
          data: {
            graphVersionId: draft.id,
            condition: rule.condition as Prisma.InputJsonValue,
            effect: rule.effect as Prisma.InputJsonValue,
          },
        });
      }

      for (const model of source.models) {
        const createdModel = await tx.productModel.create({
          data: {
            graphVersionId: draft.id,
            assetId: model.assetId,
            key: model.key,
            name: model.name,
          },
        });

        for (const target of model.targets) {
          const createdTarget = await tx.modelTarget.create({
            data: {
              productModelId: createdModel.id,
              key: target.key,
              targetType: target.targetType,
              nodePath: target.nodePath,
              materialSlot: target.materialSlot,
              metadata: target.metadata ?? undefined,
            },
          });
          targetIdMap.set(target.id, createdTarget.id);
        }
      }

      for (const effect of sourceEffects) {
        const attributeValueId = valueIdMap.get(effect.attributeValueId);
        const modelTargetId = targetIdMap.get(effect.modelTargetId);
        if (!attributeValueId || !modelTargetId) continue;
        await tx.visualEffect.create({
          data: {
            attributeValueId,
            modelTargetId,
            operation: effect.operation,
            value: effect.value as Prisma.InputJsonValue,
          },
        });
      }

      for (const variant of source.variants) {
        const createdVariant = await tx.productVariant.create({
          data: {
            graphVersionId: draft.id,
            provider: variant.provider,
            externalId: variant.externalId,
            sku: variant.sku,
          },
        });

        for (const selection of variant.selections) {
          const attributeId = attributeIdMap.get(selection.attributeId);
          const attributeValueId = valueIdMap.get(selection.attributeValueId);
          if (!attributeId || !attributeValueId) continue;
          await tx.variantSelection.create({
            data: {
              variantId: createdVariant.id,
              attributeId,
              attributeValueId,
            },
          });
        }
      }

      return draft;
    });
  }

  async getGraphVersion(id: string) {
    const version = await this.prisma.productGraphVersion.findUnique({
      where: { id },
    });
    if (!version) {
      throw new NotFoundException(`Graph version ${id} not found`);
    }
    return version;
  }

  async getActiveOrVersion(productId: string, graphVersionId?: string) {
    if (graphVersionId) {
      const version = await this.prisma.productGraphVersion.findFirst({
        where: { id: graphVersionId, productId },
      });
      if (!version) {
        throw new NotFoundException('Graph version not found for product');
      }
      return version;
    }

    const product = await this.getById(productId);
    if (!product.activeGraphVersionId) {
      throw new NotFoundException('Product has no active published graph');
    }
    return this.getGraphVersion(product.activeGraphVersionId);
  }

  async getGraphVersionDetail(id: string) {
    const version = await this.prisma.productGraphVersion.findUnique({
      where: { id },
      include: graphDetailInclude,
    });
    if (!version) {
      throw new NotFoundException(`Graph version ${id} not found`);
    }

    const visualEffects = await this.prisma.visualEffect.findMany({
      where: {
        attributeValue: {
          attribute: { graphVersionId: id },
        },
      },
    });

    return { ...version, visualEffects };
  }

  private async assertDraft(graphVersionId: string) {
    const version = await this.getGraphVersion(graphVersionId);
    if (version.status !== GraphVersionStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT graph versions are editable');
    }
    return version;
  }

  async createAttribute(input: {
    graphVersionId: string;
    key: string;
    name: string;
    type: AttributeType;
    required?: boolean;
    sortOrder?: number;
  }) {
    await this.assertDraft(input.graphVersionId);
    return this.prisma.productAttribute.create({
      data: {
        graphVersionId: input.graphVersionId,
        key: input.key,
        name: input.name,
        type: input.type,
        required: input.required ?? true,
        sortOrder: input.sortOrder ?? 0,
      },
    });
  }

  async createAttributeValue(input: {
    attributeId: string;
    key: string;
    name: string;
    sortOrder?: number;
    metadataJson?: string;
  }) {
    const attribute = await this.prisma.productAttribute.findUnique({
      where: { id: input.attributeId },
    });
    if (!attribute) {
      throw new NotFoundException('Attribute not found');
    }
    await this.assertDraft(attribute.graphVersionId);

    let metadata: Prisma.InputJsonValue | undefined;
    if (input.metadataJson) {
      try {
        metadata = JSON.parse(input.metadataJson) as Prisma.InputJsonValue;
      } catch {
        throw new BadRequestException('metadataJson must be valid JSON');
      }
    }

    return this.prisma.attributeValue.create({
      data: {
        attributeId: input.attributeId,
        key: input.key,
        name: input.name,
        sortOrder: input.sortOrder ?? 0,
        metadata,
      },
    });
  }

  async createRule(input: {
    graphVersionId: string;
    conditionJson: string;
    effectJson: string;
  }) {
    await this.assertDraft(input.graphVersionId);
    let condition: Prisma.InputJsonValue;
    let effect: Prisma.InputJsonValue;
    try {
      condition = JSON.parse(input.conditionJson) as Prisma.InputJsonValue;
      effect = JSON.parse(input.effectJson) as Prisma.InputJsonValue;
    } catch {
      throw new BadRequestException(
        'conditionJson and effectJson must be valid JSON'
      );
    }
    return this.prisma.configurationRule.create({
      data: {
        graphVersionId: input.graphVersionId,
        condition,
        effect,
      },
    });
  }

  async createProductModel(input: {
    graphVersionId: string;
    assetId: string;
    key: string;
    name: string;
  }) {
    await this.assertDraft(input.graphVersionId);
    const asset = await this.prisma.objectAsset.findUnique({
      where: { id: input.assetId },
    });
    if (!asset) {
      throw new NotFoundException('Object asset not found');
    }
    return this.prisma.productModel.create({
      data: {
        graphVersionId: input.graphVersionId,
        assetId: input.assetId,
        key: input.key,
        name: input.name,
      },
    });
  }

  async createModelTarget(input: {
    productModelId: string;
    key: string;
    targetType: string;
    nodePath?: string;
    materialSlot?: string;
  }) {
    const model = await this.prisma.productModel.findUnique({
      where: { id: input.productModelId },
    });
    if (!model) {
      throw new NotFoundException('Product model not found');
    }
    await this.assertDraft(model.graphVersionId);
    return this.prisma.modelTarget.create({
      data: {
        productModelId: input.productModelId,
        key: input.key,
        targetType: input.targetType,
        nodePath: input.nodePath,
        materialSlot: input.materialSlot,
      },
    });
  }

  async createVisualEffect(input: {
    attributeValueId: string;
    modelTargetId: string;
    operation: VisualOperation;
    valueJson: string;
  }) {
    const value = await this.prisma.attributeValue.findUnique({
      where: { id: input.attributeValueId },
      include: { attribute: true },
    });
    if (!value) {
      throw new NotFoundException('Attribute value not found');
    }
    await this.assertDraft(value.attribute.graphVersionId);

    const target = await this.prisma.modelTarget.findUnique({
      where: { id: input.modelTargetId },
      include: { productModel: true },
    });
    if (!target) {
      throw new NotFoundException('Model target not found');
    }
    if (target.productModel.graphVersionId !== value.attribute.graphVersionId) {
      throw new BadRequestException(
        'Attribute value and target must share a graph version'
      );
    }

    let parsed: Prisma.InputJsonValue;
    try {
      parsed = JSON.parse(input.valueJson) as Prisma.InputJsonValue;
    } catch {
      throw new BadRequestException('valueJson must be valid JSON');
    }

    if (input.operation === VisualOperation.SET_MATERIAL) {
      const materialAssetId =
        typeof parsed === 'object' &&
        parsed !== null &&
        !Array.isArray(parsed) &&
        typeof (parsed as { materialAssetId?: unknown }).materialAssetId ===
          'string'
          ? (parsed as { materialAssetId: string }).materialAssetId.trim()
          : '';
      if (!materialAssetId) {
        throw new BadRequestException(
          'SET_MATERIAL value must be { "materialAssetId": "<id>" }'
        );
      }

      const graphVersion = await this.prisma.productGraphVersion.findUnique({
        where: { id: value.attribute.graphVersionId },
        include: { product: true },
      });
      if (!graphVersion) {
        throw new NotFoundException('Graph version not found');
      }

      const material = await this.prisma.materialAsset.findFirst({
        where: {
          id: materialAssetId,
          organizationId: graphVersion.organizationId,
          projectId: graphVersion.product.projectId,
        },
      });
      if (!material) {
        throw new BadRequestException(
          'materialAssetId must reference a material in this project'
        );
      }

      parsed = { materialAssetId };
    }

    return this.prisma.visualEffect.create({
      data: {
        attributeValueId: input.attributeValueId,
        modelTargetId: input.modelTargetId,
        operation: input.operation,
        value: parsed,
      },
    });
  }

  async createVariant(input: {
    graphVersionId: string;
    provider: string;
    externalId: string;
    sku?: string;
  }) {
    await this.assertDraft(input.graphVersionId);
    return this.prisma.productVariant.create({
      data: {
        graphVersionId: input.graphVersionId,
        provider: input.provider,
        externalId: input.externalId,
        sku: input.sku,
      },
    });
  }

  async createVariantSelection(input: {
    variantId: string;
    attributeId: string;
    attributeValueId: string;
  }) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: input.variantId },
    });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    await this.assertDraft(variant.graphVersionId);
    return this.prisma.variantSelection.create({
      data: {
        variantId: input.variantId,
        attributeId: input.attributeId,
        attributeValueId: input.attributeValueId,
      },
    });
  }

  async publishGraphVersion(id: string) {
    const detail = await this.getGraphVersionDetail(id);
    if (detail.status !== GraphVersionStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT versions can be published');
    }

    const snapshot = {
      productId: detail.productId,
      version: detail.version,
      attributes: detail.attributes.map((attribute) => ({
        id: attribute.id,
        key: attribute.key,
        name: attribute.name,
        type: attribute.type,
        required: attribute.required,
        sortOrder: attribute.sortOrder,
        defaultValueId: attribute.defaultValueId,
        values: attribute.values.map((value) => ({
          id: value.id,
          key: value.key,
          name: value.name,
          sortOrder: value.sortOrder,
          metadata: value.metadata,
        })),
      })),
      rules: detail.rules.map((rule) => ({
        id: rule.id,
        condition: rule.condition,
        effect: rule.effect,
      })),
      models: detail.models.map((model) => ({
        id: model.id,
        assetId: model.assetId,
        key: model.key,
        name: model.name,
        targets: model.targets.map((target) => ({
          id: target.id,
          key: target.key,
          targetType: target.targetType,
          nodePath: target.nodePath,
          materialSlot: target.materialSlot,
          metadata: target.metadata,
        })),
      })),
      visualEffects: detail.visualEffects.map((effect) => ({
        id: effect.id,
        attributeValueId: effect.attributeValueId,
        modelTargetId: effect.modelTargetId,
        operation: effect.operation,
        value: effect.value,
      })),
      variants: detail.variants.map((variant) => ({
        id: variant.id,
        provider: variant.provider,
        externalId: variant.externalId,
        sku: variant.sku,
        selections: variant.selections.map((selection) => ({
          id: selection.id,
          attributeId: selection.attributeId,
          attributeValueId: selection.attributeValueId,
        })),
      })),
    };

    const product = await this.getById(detail.productId);
    const stored = await this.documents.putJson(
      `${product.organizationId}/${product.projectId}/products/${product.id}/graph/v${detail.version}.json`,
      snapshot
    );

    return this.prisma.$transaction(async (tx) => {
      await tx.productGraphVersion.updateMany({
        where: {
          productId: detail.productId,
          status: GraphVersionStatus.PUBLISHED,
          id: { not: id },
        },
        data: { status: GraphVersionStatus.ARCHIVED },
      });

      const published = await tx.productGraphVersion.update({
        where: { id },
        data: {
          status: GraphVersionStatus.PUBLISHED,
          publishedAt: new Date(),
          graphUri: stored.uri,
          graphSha256: stored.sha256,
        },
      });

      await tx.product.update({
        where: { id: detail.productId },
        data: {
          activeGraphVersionId: published.id,
          status: ProductStatus.ACTIVE,
        },
      });

      return published;
    });
  }

  listGraphVersions(productId: string) {
    return this.prisma.productGraphVersion.findMany({
      where: { productId },
      orderBy: { version: 'asc' },
    });
  }
}
