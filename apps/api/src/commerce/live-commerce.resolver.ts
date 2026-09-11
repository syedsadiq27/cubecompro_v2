import { BadRequestException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  ResolveCommerceLiveInput,
  CommerceLiveResolutionModel,
} from '../graphql/models';
import { LiveCommerceService } from './live-commerce.service';

@Resolver()
export class LiveCommerceResolver {
  constructor(private readonly liveCommerce: LiveCommerceService) {}

  @Query(() => CommerceLiveResolutionModel)
  async resolveCommerceLive(
    @Args('input') input: ResolveCommerceLiveInput
  ): Promise<CommerceLiveResolutionModel> {
    let selection: Record<string, string>;
    try {
      const parsed = JSON.parse(input.selectionJson) as unknown;
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('selectionJson must be an object');
      }
      selection = {};
      for (const [key, value] of Object.entries(parsed)) {
        if (typeof value !== 'string' || value.length === 0) {
          throw new Error(
            `selection value for ${key} must be a non-empty string`
          );
        }
        selection[key] = value;
      }
    } catch (error) {
      throw new BadRequestException(
        error instanceof Error ? error.message : 'Invalid selectionJson'
      );
    }

    const result = await this.liveCommerce.resolveLive({
      productRevisionId: input.productRevisionId,
      provider: input.provider,
      organizationId: input.organizationId,
      selection,
      integrationConnectionId: input.integrationConnectionId,
      projectDefaultConnectionId: input.projectDefaultConnectionId,
    });

    const resolution =
      result.resolution.status === 'RESOLVED'
        ? {
            status: result.resolution.status,
            provider: result.resolution.provider,
            externalReference: result.resolution.externalReference,
          }
        : {
            status: result.resolution.status,
            provider: null,
            externalReference: null,
          };

    return {
      resolution: {
        status: resolution.status,
        provider: resolution.provider ?? null,
        externalReference: resolution.externalReference
          ? {
              type: resolution.externalReference.type,
              id: resolution.externalReference.id,
              sku: resolution.externalReference.sku ?? null,
            }
          : null,
        identitySignature: result.identitySignature,
        identityJson: JSON.stringify(result.identity),
      },
      connectionRef: result.connectionRef,
      evaluationValid: result.evaluation.valid,
      evaluationComplete: result.evaluation.complete,
      canPurchase: result.canPurchase,
      commerceState: result.commerceState
        ? {
            sellabilityStatus: result.commerceState.sellability.status,
            unsellableReason:
              result.commerceState.sellability.status === 'UNSELLABLE'
                ? result.commerceState.sellability.reason
                : null,
            priceAmount: result.commerceState.price?.amount ?? null,
            priceCurrencyCode: result.commerceState.price?.currencyCode ?? null,
            inventoryAvailable:
              result.commerceState.inventory?.available ?? null,
            inventoryTracked: result.commerceState.inventory?.tracked ?? null,
          }
        : null,
    };
  }
}
