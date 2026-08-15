import { BadRequestException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import {
  ConfigurationStateInput,
  ResolvedConfigurationModel,
} from '../graphql/models';
import { ResolveService } from './resolve.service';

@Resolver()
export class ResolveResolver {
  constructor(private readonly resolveService: ResolveService) {}

  @Query(() => ResolvedConfigurationModel, {
    name: 'resolveConfiguration',
  })
  async resolveConfiguration(
    @Args('input') input: ConfigurationStateInput
  ): Promise<ResolvedConfigurationModel> {
    let selections: Record<string, unknown>;
    try {
      selections = JSON.parse(input.selectionsJson) as Record<string, unknown>;
    } catch {
      throw new BadRequestException('selectionsJson must be valid JSON');
    }

    const resolved = await this.resolveService.resolve({
      productId: input.productId,
      graphVersionId: input.graphVersionId,
      selections,
    });

    return {
      valid: resolved.valid,
      violations: resolved.violations,
      selectionsJson: JSON.stringify(resolved.selections),
      availabilityJson: resolved.availability
        ? JSON.stringify(resolved.availability)
        : null,
      threeD: {
        modelId: resolved.threeD.modelId,
        effects: resolved.threeD.effects.map((effect) => ({
          targetKey: effect.targetKey,
          targetType: effect.targetType,
          nodePath: effect.nodePath,
          operation: effect.operation,
          valueJson: JSON.stringify(effect.value),
          materialAssetId: effect.materialAssetId ?? null,
          documentUrl: effect.documentUrl ?? null,
        })),
      },
      commerce: {
        provider: resolved.commerce.provider,
        productReference: resolved.commerce.productReference,
        variantReference: resolved.commerce.variantReference,
        sku: resolved.commerce.sku,
        cartPayloadJson: resolved.commerce.cartPayload
          ? JSON.stringify(resolved.commerce.cartPayload)
          : null,
      },
      graphVersionId: resolved.graphVersionId,
      graphVersion: resolved.graphVersion,
    };
  }
}
