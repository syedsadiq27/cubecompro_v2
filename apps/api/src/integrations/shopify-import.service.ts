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
  buildShopifyImportReview,
  planShopifyProductImport,
  resolveCommerce,
  sameShopifyResourceId,
  type ShopifyImportReview,
  type ShopifyProductDto,
} from '@repo/product-graph';
import { PrismaService } from '../prisma/prisma.service';
import { CommerceMappingService } from '../product/commerce-mapping.service';
import { ProductService } from '../product/product.service';
import { ShopifyAdminClient } from './shopify-admin.client';
import {
  buildShopifyAuthorizeUrl,
  exchangeShopifyAccessToken,
  getShopifyAppConfig,
  normalizeShopDomain,
  verifyOAuthState,
} from './shopify-oauth';

const PROVIDER_SHOPIFY = 'shopify';

@Injectable()
export class ShopifyImportService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly commerceMappings: CommerceMappingService,
    private readonly products: ProductService
  ) {}

  async listConnections(organizationId: string) {
    return this.prisma.integrationConnection.findMany({
      where: { organizationId, provider: PROVIDER_SHOPIFY },
      orderBy: { externalAccountId: 'asc' },
    });
  }

  async getConnectionForOrg(organizationId: string) {
    const connections = await this.listConnections(organizationId);
    return connections[0] ?? null;
  }

  startOAuth(input: {
    organizationId: string;
    projectId: string;
    shop: string;
  }) {
    try {
      return {
        authorizeUrl: buildShopifyAuthorizeUrl(input),
      };
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to start Shopify OAuth'
      );
    }
  }

  async completeOAuth(input: { code: string; shop: string; state: string }) {
    let parsed;
    try {
      parsed = verifyOAuthState(input.state);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid OAuth state'
      );
    }

    const shop = normalizeShopDomain(input.shop);
    if (shop !== normalizeShopDomain(parsed.shop)) {
      throw new BadRequestException('OAuth shop mismatch');
    }

    let accessToken: string;
    try {
      accessToken = await exchangeShopifyAccessToken({
        shop,
        code: input.code,
      });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Token exchange failed'
      );
    }

    const client = new ShopifyAdminClient(shop, accessToken);
    let displayName = shop;
    try {
      const shopInfo = await client.getShop();
      displayName = shopInfo.name || shop;
    } catch {
      /* shop name is optional enrichment */
    }

    const { apiVersion, backofficeUrl } = getShopifyAppConfig();
    const connection = await this.prisma.integrationConnection.upsert({
      where: {
        organizationId_provider_externalAccountId: {
          organizationId: parsed.organizationId,
          provider: PROVIDER_SHOPIFY,
          externalAccountId: shop,
        },
      },
      create: {
        organizationId: parsed.organizationId,
        provider: PROVIDER_SHOPIFY,
        externalAccountId: shop,
        displayName,
        accessToken,
        apiVersion,
      },
      update: {
        accessToken,
        displayName,
        apiVersion,
      },
    });

    return {
      connection,
      redirectTo: `${backofficeUrl}/${parsed.projectId}/integrations/shopify?connected=1`,
    };
  }

  async disconnect(input: {
    organizationId: string;
    integrationConnectionId: string;
  }) {
    const connection = await this.prisma.integrationConnection.findFirst({
      where: {
        id: input.integrationConnectionId,
        organizationId: input.organizationId,
        provider: PROVIDER_SHOPIFY,
      },
    });
    if (!connection) {
      throw new NotFoundException('Shopify connection not found');
    }
    await this.prisma.integrationConnection.delete({
      where: { id: connection.id },
    });
    return true;
  }

  async listCatalogProducts(input: {
    organizationId: string;
    integrationConnectionId?: string;
    query?: string;
  }) {
    const connection = await this.requireConnection(
      input.organizationId,
      input.integrationConnectionId
    );
    const client = new ShopifyAdminClient(
      connection.externalAccountId,
      connection.accessToken,
      connection.apiVersion
    );
    try {
      return await client.listProducts({ query: input.query, first: 25 });
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Failed to list Shopify products'
      );
    }
  }

  async previewImport(input: {
    organizationId: string;
    integrationConnectionId?: string;
    shopifyProductId: string;
  }): Promise<{
    connectionId: string;
    shop: string;
    review: ShopifyImportReview;
    reviewJson: string;
    identityChoiceNames: string[];
  }> {
    const connection = await this.requireConnection(
      input.organizationId,
      input.integrationConnectionId
    );
    const dto = await this.fetchProductDto(connection, input.shopifyProductId);
    let plan;
    try {
      plan = planShopifyProductImport(dto);
    } catch (error) {
      throw new BadRequestException(
        error instanceof ShopifyImportError || error instanceof Error
          ? error.message
          : 'Import preview failed'
      );
    }
    const review = buildShopifyImportReview(plan);
    return {
      connectionId: connection.id,
      shop: connection.externalAccountId,
      review,
      reviewJson: JSON.stringify(review),
      identityChoiceNames: review.plan.choices.map((choice) => choice.name),
    };
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

    const requestedId = String(input.shopifyProductId).trim();
    const existingImports = await this.prisma.productProviderImport.findMany({
      where: { integrationConnectionId: connection.id },
      select: { id: true, productId: true, externalProductId: true },
    });
    const existingImport = existingImports.find((row) =>
      sameShopifyResourceId(row.externalProductId, requestedId)
    );
    if (existingImport) {
      const existingProduct = await this.prisma.product.findUnique({
        where: { id: existingImport.productId },
        select: { id: true, status: true },
      });

      if (
        !existingProduct ||
        existingProduct.status === ProductStatus.ARCHIVED
      ) {
        if (existingProduct) {
          await this.products.delete(existingProduct.id);
        } else {
          await this.prisma.productProviderImport.delete({
            where: { id: existingImport.id },
          });
        }
      } else {
        throw new BadRequestException(
          `Shopify product ${input.shopifyProductId} was already imported as CubeCom product ${existingImport.productId}. Archive or permanently delete that product before re-importing.`
        );
      }
    }

    let dto: ShopifyProductDto;
    if (input.productJson?.trim()) {
      try {
        dto = JSON.parse(input.productJson) as ShopifyProductDto;
      } catch {
        throw new BadRequestException('productJson must be valid JSON');
      }
    } else {
      dto = await this.fetchProductDto(connection, input.shopifyProductId);
    }

    if (!sameShopifyResourceId(dto.id, requestedId)) {
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

    const keyConflict = await this.prisma.product.findUnique({
      where: {
        projectId_key: {
          projectId: project.id,
          key: plan.productKey,
        },
      },
      select: { id: true, status: true },
    });
    if (keyConflict) {
      if (keyConflict.status === ProductStatus.ARCHIVED) {
        await this.products.delete(keyConflict.id);
      } else {
        throw new BadRequestException(
          `Product key "${plan.productKey}" is already used by CubeCom product ${keyConflict.id}. Archive or permanently delete that product before re-importing.`
        );
      }
    }

    const created = await this.prisma.$transaction(async (tx) => {
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
          valueIdByChoiceValue.set(`${choice.key}\0${value.key}`, value.id);
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
        plan,
      };
    });

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
  }

  async getProductCommerceShopifyView(input: {
    productId: string;
    organizationId: string;
  }) {
    const productImport = await this.prisma.productProviderImport.findUnique({
      where: { productId: input.productId },
      include: { integrationConnection: true },
    });
    if (!productImport) {
      return null;
    }
    if (
      productImport.integrationConnection.organizationId !==
      input.organizationId
    ) {
      throw new NotFoundException('Shopify import not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: input.productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const revisionId =
      product.activeRevisionId ??
      (
        await this.prisma.productRevision.findFirst({
          where: { productId: product.id },
          orderBy: { version: 'desc' },
        })
      )?.id;

    if (!revisionId) {
      return null;
    }

    const detail = await this.prisma.productRevision.findUnique({
      where: { id: revisionId },
      include: {
        choices: { include: { values: true }, orderBy: { sortOrder: 'asc' } },
        commerceMappingSets: {
          where: {
            provider: PROVIDER_SHOPIFY,
            integrationConnectionId: productImport.integrationConnectionId,
          },
          include: {
            identityChoices: {
              include: { choice: true },
              orderBy: { sortOrder: 'asc' },
            },
            mappings: {
              include: {
                terms: {
                  include: {
                    choiceValue: { include: { choice: true } },
                  },
                },
              },
            },
          },
        },
      },
    });
    if (!detail) return null;

    const mappingSet = detail.commerceMappingSets[0];
    if (!mappingSet) {
      return {
        connection: productImport.integrationConnection,
        externalProductId: productImport.externalProductId,
        identityChoiceKeys: [] as string[],
        identityChoiceNames: [] as string[],
        rows: [] as Array<{
          label: string;
          status: string;
          sku?: string | null;
          externalId?: string | null;
        }>,
        mappedCount: 0,
        unmappedCount: 0,
      };
    }

    const domain = await this.commerceMappings.normalizePersisted(mappingSet);
    const planLike = {
      externalProductId: productImport.externalProductId,
      productKey: product.key,
      productName: product.name,
      choices: detail.choices
        .filter((choice) => domain.identityChoiceKeys.includes(choice.key))
        .map((choice) => ({
          key: choice.key,
          name: choice.name,
          values: choice.values
            .slice()
            .sort((a, b) => a.sortOrder - b.sortOrder)
            .map((value) => ({
              key: value.key,
              name: value.name,
            })),
        })),
      identityChoiceKeys: domain.identityChoiceKeys,
      mappings: domain.mappings.map((mapping) => ({
        terms: Object.entries(mapping.identity)
          .filter(([, value]) => value != null)
          .map(([choiceKey, valueKey]) => ({
            choiceKey,
            valueKey: valueKey as string,
          })),
        externalId: mapping.externalReference.id,
        sku: mapping.externalReference.sku,
      })),
    };

    const review = buildShopifyImportReview(planLike);
    return {
      connection: productImport.integrationConnection,
      externalProductId: productImport.externalProductId,
      identityChoiceKeys: domain.identityChoiceKeys,
      identityChoiceNames: planLike.choices.map((choice) => choice.name),
      rows: review.rows.map((row) => ({
        label: row.label,
        status: row.status,
        sku: row.sku ?? null,
        externalId: row.externalId ?? null,
      })),
      mappedCount: review.mappedCount,
      unmappedCount: review.unmappedCount,
    };
  }

  async getImportProof(input: { productId: string; organizationId: string }) {
    const view = await this.getProductCommerceShopifyView(input);
    if (!view) {
      throw new NotFoundException('Shopify import proof not found');
    }

    const product = await this.prisma.product.findUnique({
      where: { id: input.productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const revision =
      (product.activeRevisionId
        ? await this.prisma.productRevision.findUnique({
            where: { id: product.activeRevisionId },
          })
        : null) ??
      (await this.prisma.productRevision.findFirst({
        where: { productId: product.id },
        orderBy: { version: 'desc' },
      }));
    if (!revision) {
      throw new NotFoundException('Product revision not found');
    }

    const choices = await this.prisma.choice.findMany({
      where: { productRevisionId: revision.id },
      include: { values: { orderBy: { sortOrder: 'asc' } } },
      orderBy: { sortOrder: 'asc' },
    });

    const constraintCount = await this.prisma.constraint.count({
      where: { productRevisionId: revision.id },
    });

    const mappingSetRow = await this.prisma.commerceMappingSet.findFirst({
      where: {
        productRevisionId: revision.id,
        provider: PROVIDER_SHOPIFY,
      },
      include: {
        identityChoices: {
          include: { choice: true },
          orderBy: { sortOrder: 'asc' },
        },
        mappings: {
          include: {
            terms: {
              include: {
                choiceValue: { include: { choice: true } },
              },
            },
          },
        },
      },
    });

    const domain = mappingSetRow
      ? await this.commerceMappings.normalizePersisted(mappingSetRow)
      : null;

    const planLike = {
      externalProductId: view.externalProductId,
      productKey: product.key,
      productName: product.name,
      choices: choices
        .filter((choice) =>
          domain ? domain.identityChoiceKeys.includes(choice.key) : true
        )
        .map((choice) => ({
          key: choice.key,
          name: choice.name,
          values: choice.values.map((value) => ({
            key: value.key,
            name: value.name,
          })),
        })),
      identityChoiceKeys: domain?.identityChoiceKeys ?? [],
      mappings:
        domain?.mappings.map((mapping) => ({
          terms: Object.entries(mapping.identity)
            .filter(([, value]) => value != null)
            .map(([choiceKey, valueKey]) => ({
              choiceKey,
              valueKey: valueKey as string,
            })),
          externalId: mapping.externalReference.id,
          sku: mapping.externalReference.sku,
        })) ?? [],
    };

    const review = buildShopifyImportReview(planLike);
    const resolutions = review.rows.map((row) => {
      if (!domain) {
        return {
          label: row.label,
          status: row.status === 'mapped' ? 'RESOLVED' : 'UNMAPPED',
          externalId: row.externalId ?? null,
          sku: row.sku ?? null,
        };
      }
      const selection = Object.fromEntries(
        row.terms.map((term) => [term.choiceKey, term.valueKey])
      );
      const resolved = resolveCommerce({
        selection,
        mappingSet: domain,
      });
      return {
        label: row.label,
        status: resolved.status,
        externalId:
          resolved.status === 'RESOLVED'
            ? (resolved.externalReference?.id ?? null)
            : null,
        sku:
          resolved.status === 'RESOLVED'
            ? (resolved.externalReference?.sku ?? null)
            : null,
      };
    });

    return {
      productId: product.id,
      productRevisionId: revision.id,
      productName: product.name,
      choices: choices.map((choice) => ({
        key: choice.key,
        name: choice.name,
        values: choice.values.map((value) => ({
          key: value.key,
          name: value.name,
        })),
      })),
      identityChoiceNames: (mappingSetRow?.identityChoices ?? []).map(
        (entry) => entry.choice.name
      ),
      mappingCount: mappingSetRow?.mappings.length ?? 0,
      constraintCount,
      resolutions,
    };
  }

  private async requireConnection(
    organizationId: string,
    integrationConnectionId?: string
  ) {
    const connection = integrationConnectionId
      ? await this.prisma.integrationConnection.findFirst({
          where: {
            id: integrationConnectionId,
            organizationId,
            provider: PROVIDER_SHOPIFY,
          },
        })
      : await this.getConnectionForOrg(organizationId);
    if (!connection) {
      throw new NotFoundException('Connect Shopify before continuing');
    }
    return connection;
  }

  private async fetchProductDto(
    connection: { externalAccountId: string; accessToken: string; apiVersion: string },
    shopifyProductId: string
  ): Promise<ShopifyProductDto> {
    const client = new ShopifyAdminClient(
      connection.externalAccountId,
      connection.accessToken,
      connection.apiVersion
    );
    try {
      return await client.getProduct(shopifyProductId);
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Shopify product fetch failed'
      );
    }
  }
}
