import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  AttributeValueModel,
  ConfigurationRuleModel,
  CreateAttributeValueInput,
  CreateConfigurationRuleInput,
  CreateModelTargetInput,
  CreateProductAttributeInput,
  CreateProductInput,
  CreateProductModelInput,
  CreateProductVariantInput,
  CreateVariantSelectionInput,
  CreateVisualEffectInput,
  ModelTargetModel,
  ProductAttributeModel,
  ProductGraphVersionDetailModel,
  ProductGraphVersionModel,
  ProductModel,
  ProductModelAssetModel,
  ProductVariantModel,
  UpdateProductInput,
  VariantSelectionModel,
  VisualEffectModel,
} from '../graphql/models';
import { ProductService } from './product.service';

@Resolver(() => ProductModel)
export class ProductResolver {
  constructor(private readonly products: ProductService) {}

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

  @Mutation(() => ProductGraphVersionModel)
  createDraftGraphVersion(
    @Args('productId') productId: string,
    @Args('sourceGraphVersionId', { nullable: true })
    sourceGraphVersionId?: string
  ) {
    return this.products.createDraftGraphVersion(
      productId,
      sourceGraphVersionId
    );
  }

  @Mutation(() => Boolean)
  discardDraftGraphVersion(@Args('productId') productId: string) {
    return this.products.discardDraftGraphVersion(productId);
  }

  @Query(() => ProductGraphVersionModel)
  productGraphVersion(@Args('id') id: string) {
    return this.products.getGraphVersion(id);
  }

  @Query(() => [ProductGraphVersionModel])
  productGraphVersions(@Args('productId') productId: string) {
    return this.products.listGraphVersions(productId);
  }

  @Query(() => ProductGraphVersionDetailModel)
  async productGraphVersionDetail(
    @Args('id') id: string
  ): Promise<ProductGraphVersionDetailModel> {
    const detail = await this.products.getGraphVersionDetail(id);
    return mapVersionDetail(detail);
  }

  @Mutation(() => ProductGraphVersionModel)
  publishGraphVersion(@Args('id') id: string) {
    return this.products.publishGraphVersion(id);
  }

  @Mutation(() => ProductAttributeModel)
  createProductAttribute(@Args('input') input: CreateProductAttributeInput) {
    return this.products.createAttribute(input);
  }

  @Mutation(() => AttributeValueModel)
  async createAttributeValue(@Args('input') input: CreateAttributeValueInput) {
    const value = await this.products.createAttributeValue(input);
    return {
      ...value,
      metadataJson: value.metadata ? JSON.stringify(value.metadata) : null,
    };
  }

  @Mutation(() => ConfigurationRuleModel)
  async createConfigurationRule(
    @Args('input') input: CreateConfigurationRuleInput
  ) {
    const rule = await this.products.createRule(input);
    return {
      id: rule.id,
      graphVersionId: rule.graphVersionId,
      conditionJson: JSON.stringify(rule.condition),
      effectJson: JSON.stringify(rule.effect),
    };
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

  @Mutation(() => ProductVariantModel)
  createProductVariant(@Args('input') input: CreateProductVariantInput) {
    return this.products.createVariant(input);
  }

  @Mutation(() => VariantSelectionModel)
  createVariantSelection(@Args('input') input: CreateVariantSelectionInput) {
    return this.products.createVariantSelection(input);
  }
}

function mapVersionDetail(
  detail: Awaited<ReturnType<ProductService['getGraphVersionDetail']>>
): ProductGraphVersionDetailModel {
  return {
    id: detail.id,
    productId: detail.productId,
    organizationId: detail.organizationId,
    version: detail.version,
    status: detail.status,
    graphUri: detail.graphUri,
    graphSha256: detail.graphSha256,
    publishedAt: detail.publishedAt,
    attributes: detail.attributes.map((attribute) => ({
      ...attribute,
      values: attribute.values.map((value) => ({
        ...value,
        metadataJson: value.metadata ? JSON.stringify(value.metadata) : null,
      })),
    })),
    rules: detail.rules.map((rule) => ({
      id: rule.id,
      graphVersionId: rule.graphVersionId,
      conditionJson: JSON.stringify(rule.condition),
      effectJson: JSON.stringify(rule.effect),
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
  };
}
