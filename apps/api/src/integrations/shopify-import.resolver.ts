import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ImportShopifyProductInput,
  ImportShopifyProductResultModel,
  IntegrationConnectionModel,
  UpsertShopifyConnectionInput,
} from '../graphql/models';
import { ShopifyImportService } from './shopify-import.service';

@Resolver()
export class ShopifyImportResolver {
  constructor(private readonly shopify: ShopifyImportService) {}

  @Mutation(() => IntegrationConnectionModel)
  async upsertShopifyConnection(
    @Args('input') input: UpsertShopifyConnectionInput
  ) {
    const connection = await this.shopify.upsertConnection(input);
    return mapConnection(connection);
  }

  @Query(() => [IntegrationConnectionModel])
  async shopifyConnections(
    @Args('organizationId') organizationId: string
  ) {
    const rows = await this.shopify.listConnections(organizationId);
    return rows.map(mapConnection);
  }

  @Mutation(() => ImportShopifyProductResultModel)
  importShopifyProduct(@Args('input') input: ImportShopifyProductInput) {
    return this.shopify.importProduct(input);
  }
}

function mapConnection(connection: {
  id: string;
  organizationId: string;
  provider: string;
  externalAccountId: string;
  accessToken: string;
  apiVersion: string;
}): IntegrationConnectionModel {
  return {
    id: connection.id,
    organizationId: connection.organizationId,
    provider: connection.provider,
    externalAccountId: connection.externalAccountId,
    apiVersion: connection.apiVersion,
    hasAccessToken: connection.accessToken.length > 0,
  };
}
