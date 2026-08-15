import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  AttributeType,
  GraphVersionStatus,
  ProductStatus,
} from '@prisma/client';
import {
  ShopifyImportError,
  planShopifyProductImport,
  type ShopifyProductDto,
} from '@repo/product-graph';
import { PrismaService } from '../prisma/prisma.service';
import { CommerceMappingService } from '../product/commerce-mapping.service';
import { ShopifyAdminClient } from './shopify-admin.client';

const PROVIDER_SHOPIFY = 'shopify';

@Injectable()
export class ShopifyImportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commerceMappings: CommerceMappingService
  ) {}

  async upsertConnection(input: {
    organizationId: string;
    shop: string;
    accessToken: string;
    apiVersion?: string;
  }) {
    const externalAccountId = normalizeShopDomain(input.shop);
    const accessToken = input.accessToken.trim();
    if (!accessToken) {
      throw new BadRequestException('accessToken is required');
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: input.organizationId },
    });
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }

    return this.prisma.integrationConnection.upsert({
      where: {
        organizationId_provider_externalAccountId: {
          organizationId: input.organizationId,
          provider: PROVIDER_SHOPIFY,
          externalAccountId,
        },
      },
      create: {
        organizationId: input.organizationId,
        provider: PROVIDER_SHOPIFY,
        externalAccountId,
        accessToken,
        apiVersion: input.apiVersion?.trim() || '2024-10',
      },
      update: {
        accessToken,
        ...(input.apiVersion?.trim()
          ? { apiVersion: input.apiVersion.trim() }
          : {}),
      },
    });
  }

  async listConnections(organizationId: string) {
    return this.prisma.integrationConnection.findMany({
      where: { organizationId, provider: PROVIDER_SHOPIFY },
      orderBy: { externalAccountId: 'asc' },
    });
  }

  async importProduct(input: {
    integrationConnectionId: string;
    projectId: string;
    shopifyProductId: string;
    productJson?: string;
  }) {
    const connection = await this.prisma.integrationConnection.findUnique({
      where: { id: input.integrationConnectionId },
    });
    if (!connection || connection.provider !== PROVIDER_SHOPIFY) {
      throw new NotFoundException('Shopify integration connection not found');
    }

    const project = await this.prisma.project.findFirst({
      where: {
        id: input.projectId,
        organizationId: connection.organizationId,
      },
    });
    if (!project) {
      throw new NotFoundException(
        'Project not found in the connection organization'
      );
    }

    const existingImport = await this.prisma.productProviderImport.findUnique({
      where: {
        integrationConnectionId_externalProductId: {
          integrationConnectionId: connection.id,
          externalProductId: String(input.shopifyProductId).trim(),
        },
      },
    });
    if (existingImport) {
      throw new BadRequestException(
        `Shopify product ${input.shopifyProductId} was already imported as CubeCom product ${existingImport.productId}. Discard/delete that product before re-importing.`
      );
    }

    let dto: ShopifyProductDto;
    if (input.productJson?.trim()) {
      try {
        dto = JSON.parse(input.productJson) as ShopifyProductDto;
      } catch {
        throw new BadRequestException('productJson must be valid JSON');
      }
    } else {
      const client = new ShopifyAdminClient(
        connection.externalAccountId,
        connection.accessToken,
        connection.apiVersion
      );
      try {
        dto = await client.getProduct(input.shopifyProductId);
      } catch (error) {
        throw new BadRequestException(
          error instanceof Error ? error.message : 'Shopify fetch failed'
        );
      }
    }

    if (String(dto.id) !== String(input.shopifyProductId).trim()) {
      throw new BadRequestException(
        'Shopify product id does not match the requested shopifyProductId'
      );
    }

    let plan;
    try {
      plan = planShopifyProductImport(dto);
    } catch (error) {
      throw new BadRequestException(
        error instanceof ShopifyImportError || error instanceof Error
          ? error.message
          : 'Shopify import plan failed'
      );
    }

    return this.prisma.$transaction(async (tx) => {
      const product = await tx.product.create({
        data: {
          organizationId: connection.organizationId,
          projectId: project.id,
          key: plan.productKey,
          name: plan.productName,
          description: `Imported from Shopify ${connection.externalAccountId} product ${plan.externalProductId}`,
          status: ProductStatus.DRAFT,
        },
      });

      const revision = await tx.productRevision.create({
        data: {
          organizationId: connection.organizationId,
          productId: product.id,
          version: 1,
          status: GraphVersionStatus.DRAFT,
        },
      });

      const choiceIdByKey = new Map<string, string>();
      const valueIdByChoiceValue = new Map<string, string>();

      for (let i = 0; i < plan.choices.length; i++) {
        const choicePlan = plan.choices[i]!;
        const choice = await tx.choice.create({
          data: {
            productRevisionId: revision.id,
            key: choicePlan.key,
            name: choicePlan.name,
            type: AttributeType.SELECT,
            required: true,
            sortOrder: i,
          },
        });
        choiceIdByKey.set(choice.key, choice.id);
        for (let j = 0; j < choicePlan.values.length; j++) {
          const valuePlan = choicePlan.values[j]!;
          const value = await tx.choiceValue.create({
            data: {
              choiceId: choice.id,
              key: valuePlan.key,
              name: valuePlan.name,
              sortOrder: j,
            },
          });
          valueIdByChoiceValue.set(
            `${choice.key}\0${value.key}`,
            value.id
          );
        }
      }

      await tx.productProviderImport.create({
        data: {
          productId: product.id,
          integrationConnectionId: connection.id,
          externalProductId: plan.externalProductId,
        },
      });

      return {
        product,
        revision,
        connection,
        plan,
        identityChoiceIds: plan.identityChoiceKeys.map(
          (key) => choiceIdByKey.get(key)!
        ),
        mappingInputs: plan.mappings.map((mapping) => ({
          externalId: mapping.externalId,
          sku: mapping.sku,
          choiceValueIds: mapping.terms.map((term) => {
            const id = valueIdByChoiceValue.get(
              `${term.choiceKey}\0${term.valueKey}`
            );
            if (!id) {
              throw new BadRequestException(
                `Missing ChoiceValue for ${term.choiceKey}=${term.valueKey}`
              );
            }
            return id;
          }),
        })),
      };
    }).then(async (created) => {
      const mappingSet = await this.commerceMappings.replaceMappingSet({
        productRevisionId: created.revision.id,
        provider: PROVIDER_SHOPIFY,
        integrationConnectionId: connection.id,
        identityChoiceIds: created.identityChoiceIds,
        mappings: created.mappingInputs,
      });

      return {
        productId: created.product.id,
        productRevisionId: created.revision.id,
        integrationConnectionId: connection.id,
        externalProductId: created.plan.externalProductId,
        identityChoiceKeys: created.plan.identityChoiceKeys,
        mappingCount: created.plan.mappings.length,
        commerceMappingSetId: mappingSet.id,
      };
    });
  }
}

function normalizeShopDomain(shop: string): string {
  const trimmed = shop.trim().toLowerCase();
  if (!trimmed) {
    throw new BadRequestException('shop is required');
  }
  return trimmed.includes('.') ? trimmed : `${trimmed}.myshopify.com`;
}
