import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  DisconnectShopifyInput,
  ImportShopifyProductInput,
  ImportShopifyProductResultModel,
  IntegrationConnectionModel,
  PreviewShopifyImportInput,
  ShopifyCatalogProductModel,
  ShopifyImportPreviewModel,
  ShopifyImportProofModel,
  ShopifyOAuthStartInput,
  ShopifyOAuthStartModel,
  ShopifyProductCommerceModel,
  ShopifyProductCommerceRowModel,
} from '../graphql/models';
import { ShopifyImportService } from './shopify-import.service';

@Resolver()
export class ShopifyImportResolver {
  constructor(private readonly shopify: ShopifyImportService) {}

  @Mutation(() => ShopifyOAuthStartModel)
  startShopifyOAuth(@Args('input') input: ShopifyOAuthStartInput) {
    return this.shopify.startOAuth(input);
  }

  @Query(() => [IntegrationConnectionModel])
  async shopifyConnections(
    @Args('organizationId') organizationId: string
  ) {
    const rows = await this.shopify.listConnections(organizationId);
    return rows.map(mapConnection);
  }

  @Mutation(() => Boolean)
  disconnectShopify(@Args('input') input: DisconnectShopifyInput) {
    return this.shopify.disconnect(input);
  }

  @Query(() => [ShopifyCatalogProductModel])
  async shopifyCatalogProducts(
    @Args('organizationId') organizationId: string,
    @Args('query', { nullable: true }) query?: string,
    @Args('integrationConnectionId', { nullable: true })
    integrationConnectionId?: string
  ) {
    return this.shopify.listCatalogProducts({
      organizationId,
      query,
      integrationConnectionId,
    });
  }

  @Query(() => ShopifyImportPreviewModel)
  async previewShopifyProductImport(
    @Args('input') input: PreviewShopifyImportInput
  ) {
    const preview = await this.shopify.previewImport(input);
    return {
      connectionId: preview.connectionId,
      shop: preview.shop,
      reviewJson: preview.reviewJson,
      productName: preview.review.plan.productName,
      identityChoiceKeys: preview.review.plan.identityChoiceKeys,
      identityChoiceNames: preview.identityChoiceNames,
      mappedCount: preview.review.mappedCount,
      unmappedCount: preview.review.unmappedCount,
    };
  }

  @Mutation(() => ImportShopifyProductResultModel)
  importShopifyProduct(@Args('input') input: ImportShopifyProductInput) {
    return this.shopify.importProduct(input);
  }

  @Query(() => ShopifyProductCommerceModel, { nullable: true })
  async productShopifyCommerce(
    @Args('productId') productId: string,
    @Args('organizationId') organizationId: string
  ) {
    const view = await this.shopify.getProductCommerceShopifyView({
      productId,
      organizationId,
    });
    if (!view) return null;
    return {
      shop: view.connection.externalAccountId,
      displayName: view.connection.displayName,
      externalProductId: view.externalProductId,
      identityChoiceKeys: view.identityChoiceKeys,
      identityChoiceNames: view.identityChoiceNames,
      mappedCount: view.mappedCount,
      unmappedCount: view.unmappedCount,
      rows: view.rows as ShopifyProductCommerceRowModel[],
    };
  }

  @Query(() => ShopifyImportProofModel)
  shopifyImportProof(
    @Args('productId') productId: string,
    @Args('organizationId') organizationId: string
  ) {
    return this.shopify.getImportProof({ productId, organizationId });
  }
}

function mapConnection(connection: {
  id: string;
  organizationId: string;
  provider: string;
  externalAccountId: string;
  displayName?: string | null;
  accessToken: string;
  apiVersion: string;
}): IntegrationConnectionModel {
  return {
    id: connection.id,
    organizationId: connection.organizationId,
    provider: connection.provider,
    externalAccountId: connection.externalAccountId,
    displayName: connection.displayName ?? connection.externalAccountId,
    apiVersion: connection.apiVersion,
    hasAccessToken: connection.accessToken.length > 0,
  };
}
