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
import {
  assertDefaultValueBelongsToAttribute,
  assertDescriptiveAttributeValueMetadata,
  assertKernelAuthoringAttributeType,
} from './kernel-authoring';
import { ConstraintService } from './constraint.service';
import { CommerceMappingService } from './commerce-mapping.service';

const graphDetailInclude = {
  choices: {
    include: { values: { orderBy: { sortOrder: 'asc' as const } } },
    orderBy: { sortOrder: 'asc' as const },
  },
  rules: true,
  constraints: {
    include: {
      terms: {
        include: {
          choiceValue: {
            include: { choice: true },
          },
        },
      },
    },
  },
  models: { include: { targets: true } },
  variants: { include: { selections: true } },
  commerceMappingSets: {
    include: {
      identityChoices: {
        include: { choice: true },
        orderBy: { sortOrder: 'asc' as const },
      },
      mappings: {
        include: {
          terms: {
            include: {
              choiceValue: { include: { choice: true } },
            },
          },
        },
        orderBy: { id: 'asc' as const },
      },
    },
    orderBy: { provider: 'asc' as const },
  },
} satisfies Prisma.ProductRevisionInclude;

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documents: DocumentStoreService,
    private readonly constraints: ConstraintService,
    private readonly commerceMappings: CommerceMappingService
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

      await tx.productRevision.create({
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
      data: { activeRevisionId: null },
    });
    await this.prisma.product.delete({ where: { id } });
    return true;
  }

  async discardDraftGraphVersion(productId: string) {
    await this.getById(productId);
    const draft = await this.prisma.productRevision.findFirst({
      where: { productId, status: GraphVersionStatus.DRAFT },
    });
    if (!draft) {
      throw new NotFoundException('No draft configuration to discard');
    }

    const product = await this.getById(productId);
    if (product.activeRevisionId === draft.id) {
      await this.prisma.product.update({
        where: { id: productId },
        data: { activeRevisionId: null },
      });
    }

    await this.prisma.productRevision.delete({ where: { id: draft.id } });
    return true;
  }

  async createDraftGraphVersion(
    productId: string,
    sourceGraphVersionId?: string
  ) {
    const product = await this.getById(productId);

    const existingDraft = await this.prisma.productRevision.findFirst({
      where: { productId, status: GraphVersionStatus.DRAFT },
    });

    if (existingDraft) {
      const attributeCount = await this.prisma.choice.count({
        where: { productRevisionId: existingDraft.id },
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
        ? await this.prisma.productRevision.findFirst({
            where: { id: sourceGraphVersionId, productId },
            include: graphDetailInclude,
          })
        : null;

    if (sourceGraphVersionId && !source) {
      throw new NotFoundException('Source product revision not found for product');
    }

    if (!source) {
      source =
        (product.activeRevisionId
          ? await this.prisma.productRevision.findUnique({
              where: { id: product.activeRevisionId },
              include: graphDetailInclude,
            })
          : null) ??
        (await this.prisma.productRevision.findFirst({
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
            choiceValue: {
              choice: { productRevisionId: source.id },
            },
          },
        })
      : [];

    const count = await this.prisma.productRevision.count({
      where: { productId },
    });

    return this.prisma.$transaction(async (tx) => {
      const draft =
        existingDraft ??
        (await tx.productRevision.create({
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

      const choiceIdMap = new Map<string, string>();
      const valueIdMap = new Map<string, string>();
      const targetIdMap = new Map<string, string>();

      for (const choice of source.choices) {
        const created = await tx.choice.create({
          data: {
            productRevisionId: draft.id,
            key: choice.key,
            name: choice.name,
            type: choice.type,
            required: choice.required,
            sortOrder: choice.sortOrder,
          },
        });
        choiceIdMap.set(choice.id, created.id);

        for (const value of choice.values) {
          const createdValue = await tx.choiceValue.create({
            data: {
              choiceId: created.id,
              key: value.key,
              name: value.name,
              sortOrder: value.sortOrder,
              metadata: value.metadata ?? undefined,
            },
          });
          valueIdMap.set(value.id, createdValue.id);
        }

        if (choice.defaultValueId) {
          const mappedDefault = valueIdMap.get(choice.defaultValueId);
          if (mappedDefault) {
            await tx.choice.update({
              where: { id: created.id },
              data: { defaultValueId: mappedDefault },
            });
          }
        }
      }

      for (const rule of source.rules) {
        await tx.configurationRule.create({
          data: {
            productRevisionId: draft.id,
            condition: rule.condition as Prisma.InputJsonValue,
            effect: rule.effect as Prisma.InputJsonValue,
          },
        });
      }

      for (const constraint of source.constraints) {
        const termValueIds = constraint.terms
          .map((term) => valueIdMap.get(term.choiceValueId))
          .filter((id): id is string => Boolean(id));
        if (termValueIds.length < 2) continue;
        await tx.constraint.create({
          data: {
            productRevisionId: draft.id,
            terms: {
              create: termValueIds.map((choiceValueId) => ({
                choiceValueId,
              })),
            },
          },
        });
      }

      for (const model of source.models) {
        const createdModel = await tx.productModel.create({
          data: {
            productRevisionId: draft.id,
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
        const choiceValueId = valueIdMap.get(effect.choiceValueId);
        const modelTargetId = targetIdMap.get(effect.modelTargetId);
        if (!choiceValueId || !modelTargetId) continue;
        await tx.visualEffect.create({
          data: {
            choiceValueId,
            modelTargetId,
            operation: effect.operation,
            value: effect.value as Prisma.InputJsonValue,
          },
        });
      }

      for (const variant of source.variants) {
        const createdVariant = await tx.productVariant.create({
          data: {
            productRevisionId: draft.id,
            provider: variant.provider,
            externalId: variant.externalId,
            sku: variant.sku,
          },
        });

        for (const selection of variant.selections) {
          const choiceId = choiceIdMap.get(selection.choiceId);
          const choiceValueId = valueIdMap.get(selection.choiceValueId);
          if (!choiceId || !choiceValueId) continue;
          await tx.variantSelection.create({
            data: {
              variantId: createdVariant.id,
              choiceId,
              choiceValueId,
            },
          });
        }
      }

      for (const mappingSet of source.commerceMappingSets) {
        const identityChoiceCreates = mappingSet.identityChoices
          .map((entry) => {
            const choiceId = choiceIdMap.get(entry.choiceId);
            if (!choiceId) return null;
            return { choiceId, sortOrder: entry.sortOrder };
          })
          .filter((entry): entry is { choiceId: string; sortOrder: number } =>
            Boolean(entry)
          );

        await tx.commerceMappingSet.create({
          data: {
            productRevisionId: draft.id,
            provider: mappingSet.provider,
            identityChoices: {
              create: identityChoiceCreates,
            },
            mappings: {
              create: mappingSet.mappings.map((mapping) => ({
                identitySignature: mapping.identitySignature,
                externalType: mapping.externalType,
                externalId: mapping.externalId,
                sku: mapping.sku,
                terms: {
                  create: mapping.terms
                    .map((term) => {
                      const choiceValueId = valueIdMap.get(term.choiceValueId);
                      return choiceValueId ? { choiceValueId } : null;
                    })
                    .filter(
                      (term): term is { choiceValueId: string } =>
                        Boolean(term)
                    ),
                },
              })),
            },
          },
        });
      }

      return draft;
    });
  }

  async getGraphVersion(id: string) {
    const version = await this.prisma.productRevision.findUnique({
      where: { id },
    });
    if (!version) {
      throw new NotFoundException(`Product revision ${id} not found`);
    }
    return version;
  }

  async getActiveOrVersion(productId: string, productRevisionId?: string) {
    if (productRevisionId) {
      const version = await this.prisma.productRevision.findFirst({
        where: { id: productRevisionId, productId },
      });
      if (!version) {
        throw new NotFoundException('Product revision not found for product');
      }
      return version;
    }

    const product = await this.getById(productId);
    if (!product.activeRevisionId) {
      throw new NotFoundException('Product has no active published revision');
    }
    return this.getGraphVersion(product.activeRevisionId);
  }

  async getGraphVersionDetail(id: string) {
    const version = await this.prisma.productRevision.findUnique({
      where: { id },
      include: graphDetailInclude,
    });
    if (!version) {
      throw new NotFoundException(`Product revision ${id} not found`);
    }

    const visualEffects = await this.prisma.visualEffect.findMany({
      where: {
        choiceValue: {
          choice: { productRevisionId: id },
        },
      },
    });

    return { ...version, visualEffects };
  }

  private async assertDraft(productRevisionId: string) {
    const version = await this.getGraphVersion(productRevisionId);
    if (version.status !== GraphVersionStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT product revisions are editable');
    }
    return version;
  }

  async createAttribute(input: {
    productRevisionId: string;
    key: string;
    name: string;
    type?: AttributeType;
    required?: boolean;
    sortOrder?: number;
  }) {
    await this.assertDraft(input.productRevisionId);
    const type = input.type ?? AttributeType.SELECT;
    assertKernelAuthoringAttributeType(type);
    return this.prisma.choice.create({
      data: {
        productRevisionId: input.productRevisionId,
        key: input.key,
        name: input.name,
        type,
        required: input.required ?? true,
        sortOrder: input.sortOrder ?? 0,
      },
    });
  }

  async createAttributeValue(input: {
    choiceId: string;
    key: string;
    name: string;
    sortOrder?: number;
    metadataJson?: string;
  }) {
    const choice = await this.prisma.choice.findUnique({
      where: { id: input.choiceId },
    });
    if (!choice) {
      throw new NotFoundException('Choice not found');
    }
    await this.assertDraft(choice.productRevisionId);

    let metadata: Prisma.InputJsonValue | undefined;
    if (input.metadataJson) {
      try {
        metadata = JSON.parse(input.metadataJson) as Prisma.InputJsonValue;
      } catch {
        throw new BadRequestException('metadataJson must be valid JSON');
      }
      assertDescriptiveAttributeValueMetadata(metadata);
    }

    return this.prisma.choiceValue.create({
      data: {
        choiceId: input.choiceId,
        key: input.key,
        name: input.name,
        sortOrder: input.sortOrder ?? 0,
        metadata,
      },
    });
  }

  async deleteAttributeValue(id: string) {
    const value = await this.prisma.choiceValue.findUnique({
      where: { id },
      include: { choice: true },
    });
    if (!value) {
      throw new NotFoundException('Choice value not found');
    }
    await this.assertDraft(value.choice.productRevisionId);
    await this.constraints.assertChoiceValueNotReferenced(id);
    await this.commerceMappings.assertChoiceValueNotReferenced(id);
    await this.prisma.choiceValue.delete({ where: { id } });
    return true;
  }

  async setAttributeDefaultValue(input: {
    choiceId: string;
    defaultValueId: string | null;
  }) {
    const choice = await this.prisma.choice.findUnique({
      where: { id: input.choiceId },
    });
    if (!choice) {
      throw new NotFoundException('Choice not found');
    }
    await this.assertDraft(choice.productRevisionId);

    if (input.defaultValueId == null) {
      return this.prisma.choice.update({
        where: { id: input.choiceId },
        data: { defaultValueId: null },
      });
    }

    const value = await this.prisma.choiceValue.findUnique({
      where: { id: input.defaultValueId },
    });
    if (!value) {
      throw new NotFoundException('Choice value not found');
    }
    assertDefaultValueBelongsToAttribute({
      attributeId: choice.id,
      valueAttributeId: value.choiceId,
      valueId: value.id,
    });

    return this.prisma.choice.update({
      where: { id: input.choiceId },
      data: { defaultValueId: value.id },
    });
  }

  async createRule(_input: {
    productRevisionId: string;
    conditionJson: string;
    effectJson: string;
  }): Promise<never> {
    throw new BadRequestException(
      'ConfigurationRule writes are blocked. Use createConstraint with ChoiceValue ids.'
    );
  }

  async createProductModel(input: {
    productRevisionId: string;
    assetId: string;
    key: string;
    name: string;
  }) {
    await this.assertDraft(input.productRevisionId);
    const asset = await this.prisma.objectAsset.findUnique({
      where: { id: input.assetId },
    });
    if (!asset) {
      throw new NotFoundException('Object asset not found');
    }
    return this.prisma.productModel.create({
      data: {
        productRevisionId: input.productRevisionId,
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
    await this.assertDraft(model.productRevisionId);
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
    choiceValueId: string;
    modelTargetId: string;
    operation: VisualOperation;
    valueJson: string;
  }) {
    const value = await this.prisma.choiceValue.findUnique({
      where: { id: input.choiceValueId },
      include: { choice: true },
    });
    if (!value) {
      throw new NotFoundException('Choice value not found');
    }
    await this.assertDraft(value.choice.productRevisionId);

    const target = await this.prisma.modelTarget.findUnique({
      where: { id: input.modelTargetId },
      include: { productModel: true },
    });
    if (!target) {
      throw new NotFoundException('Model target not found');
    }
    if (target.productModel.productRevisionId !== value.choice.productRevisionId) {
      throw new BadRequestException(
        'Choice value and target must share a product revision'
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

      const revision = await this.prisma.productRevision.findUnique({
        where: { id: value.choice.productRevisionId },
        include: { product: true },
      });
      if (!revision) {
        throw new NotFoundException('Product revision not found');
      }

      const material = await this.prisma.materialAsset.findFirst({
        where: {
          id: materialAssetId,
          organizationId: revision.organizationId,
          projectId: revision.product.projectId,
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
        choiceValueId: input.choiceValueId,
        modelTargetId: input.modelTargetId,
        operation: input.operation,
        value: parsed,
      },
    });
  }

  async updateVisualEffect(input: {
    id: string;
    operation?: VisualOperation;
    valueJson?: string;
  }) {
    const existing = await this.prisma.visualEffect.findUnique({
      where: { id: input.id },
      include: {
        choiceValue: { include: { choice: true } },
        modelTarget: { include: { productModel: { include: { productRevision: { include: { product: true } } } } } },
      },
    });
    if (!existing) {
      throw new NotFoundException('Visual effect not found');
    }
    await this.assertDraft(existing.choiceValue.choice.productRevisionId);

    const operation = input.operation ?? existing.operation;
    let parsed: Prisma.InputJsonValue =
      (existing.value as Prisma.InputJsonValue) ?? {};

    if (input.valueJson !== undefined) {
      try {
        parsed = JSON.parse(input.valueJson) as Prisma.InputJsonValue;
      } catch {
        throw new BadRequestException('valueJson must be valid JSON');
      }
    }

    if (operation === VisualOperation.SET_MATERIAL) {
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
      const revision = existing.modelTarget.productModel.productRevision;
      const material = await this.prisma.materialAsset.findFirst({
        where: {
          id: materialAssetId,
          organizationId: revision.organizationId,
          projectId: revision.product.projectId,
        },
      });
      if (!material) {
        throw new BadRequestException(
          'materialAssetId must reference a material in this project'
        );
      }
      parsed = { materialAssetId };
    }

    if (operation === VisualOperation.SET_VISIBILITY) {
      if (typeof parsed !== 'boolean') {
        throw new BadRequestException(
          'SET_VISIBILITY value must be a boolean JSON value'
        );
      }
    }

    return this.prisma.visualEffect.update({
      where: { id: input.id },
      data: {
        operation,
        value: parsed,
      },
    });
  }

  async deleteVisualEffect(id: string) {
    const existing = await this.prisma.visualEffect.findUnique({
      where: { id },
      include: {
        choiceValue: { include: { choice: true } },
      },
    });
    if (!existing) {
      throw new NotFoundException('Visual effect not found');
    }
    await this.assertDraft(existing.choiceValue.choice.productRevisionId);
    await this.prisma.visualEffect.delete({ where: { id } });
    return true;
  }

  async createVariant(input: {
    productRevisionId: string;
    provider: string;
    externalId: string;
    sku?: string;
  }) {
    await this.assertDraft(input.productRevisionId);
    return this.prisma.productVariant.create({
      data: {
        productRevisionId: input.productRevisionId,
        provider: input.provider,
        externalId: input.externalId,
        sku: input.sku,
      },
    });
  }

  async createVariantSelection(input: {
    variantId: string;
    choiceId: string;
    choiceValueId: string;
  }) {
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: input.variantId },
    });
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }
    await this.assertDraft(variant.productRevisionId);
    return this.prisma.variantSelection.create({
      data: {
        variantId: input.variantId,
        choiceId: input.choiceId,
        choiceValueId: input.choiceValueId,
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
      choices: detail.choices.map((choice) => ({
        id: choice.id,
        key: choice.key,
        name: choice.name,
        type: choice.type,
        required: choice.required,
        sortOrder: choice.sortOrder,
        defaultValueId: choice.defaultValueId,
        values: choice.values.map((value) => ({
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
      constraints: detail.constraints.map((constraint) => ({
        id: constraint.id,
        productRevisionId: constraint.productRevisionId,
        terms: constraint.terms.map((term) => ({
          choiceValueId: term.choiceValueId,
        })),
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
        choiceValueId: effect.choiceValueId,
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
          choiceId: selection.choiceId,
          choiceValueId: selection.choiceValueId,
        })),
      })),
    };

    const product = await this.getById(detail.productId);
    const stored = await this.documents.putJson(
      `${product.organizationId}/${product.projectId}/products/${product.id}/graph/v${detail.version}.json`,
      snapshot
    );

    return this.prisma.$transaction(async (tx) => {
      await tx.productRevision.updateMany({
        where: {
          productId: detail.productId,
          status: GraphVersionStatus.PUBLISHED,
          id: { not: id },
        },
        data: { status: GraphVersionStatus.ARCHIVED },
      });

      const published = await tx.productRevision.update({
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
          activeRevisionId: published.id,
          status: ProductStatus.ACTIVE,
        },
      });

      return published;
    });
  }

  listGraphVersions(productId: string) {
    return this.prisma.productRevision.findMany({
      where: { productId },
      orderBy: { version: 'asc' },
    });
  }
}
