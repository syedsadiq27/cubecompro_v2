import { BadRequestException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  ChoiceModel,
  ChoiceValueModel,
  CommerceMappingSetModel,
  CommerceResolutionModel,
  ConfigurationRuleModel,
  ConstraintModel,
  CreateChoiceInput,
  CreateChoiceValueInput,
  CreateConfigurationRuleInput,
  CreateConstraintInput,
  CreateModelTargetInput,
  CreateProductInput,
  CreateProductModelInput,
  CreateProductVariantInput,
  CreateVariantSelectionInput,
  CreateVisualEffectInput,
  UpdateVisualEffectInput,
  ModelTargetModel,
  ProductModel,
  ProductModelAssetModel,
  ProductRevisionDetailModel,
  ProductRevisionModel,
  ProductVariantModel,
  ReplaceCommerceMappingSetInput,
  ResolveCommerceInput,
  SetChoiceDefaultInput,
  UpdateProductInput,
  VariantSelectionModel,
  VisualEffectModel,
} from '../graphql/models';
import { CommerceMappingService } from './commerce-mapping.service';
import { ConstraintService } from './constraint.service';
import { ProductService } from './product.service';

@Resolver(() => ProductModel)
export class ProductResolver {
  constructor(
    private readonly products: ProductService,
    private readonly constraints: ConstraintService,
    private readonly commerceMappings: CommerceMappingService
  ) {}

  @Mutation(() => ProductModel)
  createProduct(@Args('input') input: CreateProductInput) {
    return this.products.create(input);
  }

  @Mutation(() => ProductModel)
  updateProduct(@Args('input') input: UpdateProductInput) {
    return this.products.update(input);
  }

  @Mutation(() => Boolean)
  deleteProduct(@Args('id') id: string) {
    return this.products.delete(id);
  }

  @Query(() => ProductModel)
  product(@Args('id') id: string) {
    return this.products.getById(id);
  }

  @Query(() => [ProductModel])
  productsByProject(@Args('projectId') projectId: string) {
    return this.products.listByProject(projectId);
  }

  @Mutation(() => ProductRevisionModel)
  createDraftProductRevision(
    @Args('productId') productId: string,
    @Args('sourceProductRevisionId', { nullable: true })
    sourceProductRevisionId?: string
  ) {
    return this.products.createDraftGraphVersion(
      productId,
      sourceProductRevisionId
    );
  }

  @Mutation(() => Boolean)
  discardDraftProductRevision(@Args('productId') productId: string) {
    return this.products.discardDraftGraphVersion(productId);
  }

  @Query(() => ProductRevisionModel)
  productRevision(@Args('id') id: string) {
    return this.products.getGraphVersion(id);
  }

  @Query(() => [ProductRevisionModel])
  productRevisions(@Args('productId') productId: string) {
    return this.products.listGraphVersions(productId);
  }

  @Query(() => ProductRevisionDetailModel)
  async productRevisionDetail(@Args('id') id: string) {
    const detail = await this.products.getGraphVersionDetail(id);
    const commerceMappingSets = await Promise.all(
      detail.commerceMappingSets.map(async (set) => {
        const domain = await this.commerceMappings.normalizePersisted(set);
        return mapCommerceMappingSet(set, domain);
      })
    );
    return mapVersionDetail(detail, commerceMappingSets);
  }

  @Mutation(() => ProductRevisionModel)
  publishProductRevision(@Args('id') id: string) {
    return this.products.publishGraphVersion(id);
  }

  @Mutation(() => ChoiceModel)
  createChoice(@Args('input') input: CreateChoiceInput) {
    return this.products.createAttribute(input);
  }

  @Mutation(() => ChoiceModel)
  setChoiceDefault(@Args('input') input: SetChoiceDefaultInput) {
    return this.products.setAttributeDefaultValue({
      choiceId: input.choiceId,
      defaultValueId: input.defaultValueId ?? null,
    });
  }

  @Mutation(() => ChoiceValueModel)
  async createChoiceValue(@Args('input') input: CreateChoiceValueInput) {
    const value = await this.products.createAttributeValue(input);
    return {
      ...value,
      metadataJson: value.metadata ? JSON.stringify(value.metadata) : null,
    };
  }

  @Mutation(() => Boolean)
  deleteChoiceValue(@Args('id') id: string) {
    return this.products.deleteAttributeValue(id);
  }

  @Query(() => [ConstraintModel])
  constraintsByRevision(@Args('productRevisionId') productRevisionId: string) {
    return this.constraints.listConstraints(productRevisionId).then(mapConstraints);
  }

  @Mutation(() => ConstraintModel)
  async createConstraint(@Args('input') input: CreateConstraintInput) {
    const constraint = await this.constraints.createConstraint(input);
    return mapConstraint(constraint);
  }

  @Mutation(() => Boolean)
  deleteConstraint(@Args('id') id: string) {
    return this.constraints.deleteConstraint(id);
  }

  @Query(() => [CommerceMappingSetModel])
  async commerceMappingSetsByRevision(
    @Args('productRevisionId') productRevisionId: string
  ) {
    const sets = await this.commerceMappings.listByRevision(productRevisionId);
    return Promise.all(
      sets.map(async (set) => {
        const domain = await this.commerceMappings.normalizePersisted(set);
        return mapCommerceMappingSet(set, domain);
      })
    );
  }

  @Query(() => CommerceMappingSetModel)
  async commerceMappingSet(
    @Args('productRevisionId') productRevisionId: string,
    @Args('provider') provider: string
  ) {
    const set = await this.commerceMappings.getByRevisionProvider(
      productRevisionId,
      provider
    );
    const domain = await this.commerceMappings.normalizePersisted(set);
    return mapCommerceMappingSet(set, domain);
  }

  @Mutation(() => CommerceMappingSetModel)
  async replaceCommerceMappingSet(
    @Args('input') input: ReplaceCommerceMappingSetInput
  ) {
    const set = await this.commerceMappings.replaceMappingSet(input);
    const domain = await this.commerceMappings.normalizePersisted(set);
    return mapCommerceMappingSet(set, domain);
  }

  @Mutation(() => Boolean)
  deleteCommerceMappingSet(@Args('id') id: string) {
    return this.commerceMappings.deleteMappingSet(id);
  }

  @Query(() => CommerceResolutionModel)
  async resolveCommerce(@Args('input') input: ResolveCommerceInput) {
    let selection: Record<string, string>;
    try {
      const parsed = JSON.parse(input.selectionJson) as unknown;
      if (
        !parsed ||
        typeof parsed !== 'object' ||
        Array.isArray(parsed)
      ) {
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

    const result = await this.commerceMappings.resolveSelection({
      productRevisionId: input.productRevisionId,
      provider: input.provider,
      selection,
      integrationConnectionId: input.integrationConnectionId,
    });

    if (result.resolution.status === 'RESOLVED') {
      return {
        status: result.resolution.status,
        provider: result.resolution.provider,
        externalReference: result.resolution.externalReference,
        identitySignature: result.identitySignature,
        identityJson: JSON.stringify(result.identity),
      };
    }

    return {
      status: result.resolution.status,
      provider: null,
      externalReference: null,
      identitySignature: result.identitySignature,
      identityJson: JSON.stringify(result.identity),
    };
  }

  @Mutation(() => ConfigurationRuleModel)
  createConfigurationRule(
    @Args('input') input: CreateConfigurationRuleInput
  ): Promise<never> {
    return this.products.createRule(input);
  }

  @Mutation(() => ProductModelAssetModel)
  createProductModel(@Args('input') input: CreateProductModelInput) {
    return this.products.createProductModel(input);
  }

  @Mutation(() => ModelTargetModel)
  createModelTarget(@Args('input') input: CreateModelTargetInput) {
    return this.products.createModelTarget(input);
  }

  @Mutation(() => VisualEffectModel)
  async createVisualEffect(@Args('input') input: CreateVisualEffectInput) {
    const effect = await this.products.createVisualEffect(input);
    return {
      ...effect,
      valueJson: JSON.stringify(effect.value),
    };
  }

  @Mutation(() => VisualEffectModel)
  async updateVisualEffect(@Args('input') input: UpdateVisualEffectInput) {
    const effect = await this.products.updateVisualEffect(input);
    return {
      ...effect,
      valueJson: JSON.stringify(effect.value),
    };
  }

  @Mutation(() => Boolean)
  deleteVisualEffect(@Args('id') id: string) {
    return this.products.deleteVisualEffect(id);
  }

  @Mutation(() => ProductVariantModel)
  createProductVariant(@Args('input') input: CreateProductVariantInput) {
    return this.products.createVariant(input);
  }

  @Mutation(() => VariantSelectionModel)
  createVariantSelection(@Args('input') input: CreateVariantSelectionInput) {
    return this.products.createVariantSelection(input);
  }
}

function mapConstraint(
  constraint: Awaited<ReturnType<ConstraintService['createConstraint']>>
): ConstraintModel {
  return {
    id: constraint.id,
    productRevisionId: constraint.productRevisionId,
    terms: constraint.terms.map((term) => ({
      constraintId: term.constraintId,
      choiceValueId: term.choiceValueId,
      choiceKey:
        'choiceValue' in term && term.choiceValue?.choice
          ? term.choiceValue.choice.key
          : null,
      choiceValueKey:
        'choiceValue' in term && term.choiceValue
          ? term.choiceValue.key
          : null,
    })),
  };
}

function mapConstraints(
  constraints: Awaited<ReturnType<ConstraintService['listConstraints']>>
): ConstraintModel[] {
  return constraints.map(mapConstraint);
}

function mapCommerceMappingSet(
  set: Awaited<ReturnType<CommerceMappingService['listByRevision']>>[number],
  domain: Awaited<ReturnType<CommerceMappingService['normalizePersisted']>>
): CommerceMappingSetModel {
  return {
    id: set.id,
    productRevisionId: set.productRevisionId,
    provider: set.provider,
    integrationConnectionId: set.integrationConnectionId,
    identityChoices: set.identityChoices.map((entry) => ({
      mappingSetId: entry.mappingSetId,
      choiceId: entry.choiceId,
      choiceKey: entry.choice.key,
      sortOrder: entry.sortOrder,
    })),
    mappings: set.mappings.map((mapping) => ({
      id: mapping.id,
      mappingSetId: mapping.mappingSetId,
      identitySignature: mapping.identitySignature,
      externalType: mapping.externalType,
      externalId: mapping.externalId,
      sku: mapping.sku,
      terms: mapping.terms.map((term) => ({
        mappingId: term.mappingId,
        choiceValueId: term.choiceValueId,
        choiceKey: term.choiceValue.choice.key,
        choiceValueKey: term.choiceValue.key,
      })),
    })),
    domainJson: JSON.stringify(domain),
  };
}

function mapVersionDetail(
  detail: Awaited<ReturnType<ProductService['getGraphVersionDetail']>>,
  commerceMappingSets: CommerceMappingSetModel[]
): ProductRevisionDetailModel {
  return {
    id: detail.id,
    productId: detail.productId,
    organizationId: detail.organizationId,
    version: detail.version,
    status: detail.status,
    graphUri: detail.graphUri,
    graphSha256: detail.graphSha256,
    publishedAt: detail.publishedAt,
    choices: detail.choices.map((choice) => ({
      ...choice,
      values: choice.values.map((value) => ({
        ...value,
        metadataJson: value.metadata ? JSON.stringify(value.metadata) : null,
      })),
    })),
    rules: detail.rules.map((rule) => ({
      id: rule.id,
      productRevisionId: rule.productRevisionId,
      conditionJson: JSON.stringify(rule.condition),
      effectJson: JSON.stringify(rule.effect),
    })),
    constraints: detail.constraints.map((constraint) => ({
      id: constraint.id,
      productRevisionId: constraint.productRevisionId,
      terms: constraint.terms.map((term) => ({
        constraintId: term.constraintId,
        choiceValueId: term.choiceValueId,
        choiceKey: term.choiceValue?.choice?.key ?? null,
        choiceValueKey: term.choiceValue?.key ?? null,
      })),
    })),
    models: detail.models.map((model) => ({
      ...model,
      targets: model.targets,
    })),
    visualEffects: detail.visualEffects.map((effect) => ({
      ...effect,
      valueJson: JSON.stringify(effect.value),
    })),
    variants: detail.variants.map((variant) => ({
      ...variant,
      selections: variant.selections,
    })),
    commerceMappingSets,
  };
}
