import {
  Field,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import {
  AttributeType,
  GraphVersionStatus,
  ProductStatus,
  VisualOperation,
} from '@prisma/client';

registerEnumType(GraphVersionStatus, { name: 'GraphVersionStatus' });
registerEnumType(ProductStatus, { name: 'ProductStatus' });
registerEnumType(AttributeType, { name: 'AttributeType' });
registerEnumType(VisualOperation, { name: 'VisualOperation' });

@ObjectType()
export class OrganizationModel {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field()
  slug: string;

  @Field()
  createdAt: Date;
}

@ObjectType()
export class OrganizationEntitlementModel {
  @Field(() => ID)
  id: string;

  @Field()
  key: string;

  @Field(() => String)
  value: string;
}

@ObjectType()
export class ProjectModel {
  @Field(() => ID)
  id: string;

  @Field()
  organizationId: string;

  @Field()
  name: string;

  @Field()
  slug: string;
}

@ObjectType()
export class ProductModel {
  @Field(() => ID)
  id: string;

  @Field()
  organizationId: string;

  @Field()
  projectId: string;

  @Field()
  key: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => ProductStatus)
  status: ProductStatus;

  @Field(() => ID, { nullable: true })
  activeGraphVersionId?: string | null;
}

@ObjectType()
export class ProductGraphVersionModel {
  @Field(() => ID)
  id: string;

  @Field()
  productId: string;

  @Field()
  organizationId: string;

  @Field()
  version: number;

  @Field(() => GraphVersionStatus)
  status: GraphVersionStatus;

  @Field(() => String, { nullable: true })
  graphUri?: string | null;

  @Field(() => String, { nullable: true })
  graphSha256?: string | null;

  @Field(() => Date, { nullable: true })
  publishedAt?: Date | null;
}

@ObjectType()
export class AttributeValueModel {
  @Field(() => ID)
  id: string;

  @Field()
  attributeId: string;

  @Field()
  key: string;

  @Field()
  name: string;

  @Field()
  sortOrder: number;

  @Field(() => String, { nullable: true })
  metadataJson?: string | null;
}

@ObjectType()
export class ProductAttributeModel {
  @Field(() => ID)
  id: string;

  @Field()
  graphVersionId: string;

  @Field()
  key: string;

  @Field()
  name: string;

  @Field(() => AttributeType)
  type: AttributeType;

  @Field()
  required: boolean;

  @Field()
  sortOrder: number;

  @Field(() => ID, { nullable: true })
  defaultValueId?: string | null;

  @Field(() => [AttributeValueModel], { nullable: true })
  values?: AttributeValueModel[];
}

@ObjectType()
export class ConfigurationRuleModel {
  @Field(() => ID)
  id: string;

  @Field()
  graphVersionId: string;

  @Field()
  conditionJson: string;

  @Field()
  effectJson: string;
}

@ObjectType()
export class ModelTargetModel {
  @Field(() => ID)
  id: string;

  @Field()
  productModelId: string;

  @Field()
  key: string;

  @Field()
  targetType: string;

  @Field(() => String, { nullable: true })
  nodePath?: string | null;

  @Field(() => String, { nullable: true })
  materialSlot?: string | null;
}

@ObjectType()
export class ProductModelAssetModel {
  @Field(() => ID)
  id: string;

  @Field()
  graphVersionId: string;

  @Field()
  assetId: string;

  @Field()
  key: string;

  @Field()
  name: string;

  @Field(() => [ModelTargetModel], { nullable: true })
  targets?: ModelTargetModel[];
}

@ObjectType()
export class VisualEffectModel {
  @Field(() => ID)
  id: string;

  @Field()
  attributeValueId: string;

  @Field()
  modelTargetId: string;

  @Field(() => VisualOperation)
  operation: VisualOperation;

  @Field()
  valueJson: string;
}

@ObjectType()
export class VariantSelectionModel {
  @Field(() => ID)
  id: string;

  @Field()
  variantId: string;

  @Field()
  attributeId: string;

  @Field()
  attributeValueId: string;
}

@ObjectType()
export class ProductVariantModel {
  @Field(() => ID)
  id: string;

  @Field()
  graphVersionId: string;

  @Field()
  provider: string;

  @Field()
  externalId: string;

  @Field(() => String, { nullable: true })
  sku?: string | null;

  @Field(() => [VariantSelectionModel], { nullable: true })
  selections?: VariantSelectionModel[];
}

@ObjectType()
export class ProductGraphVersionDetailModel extends ProductGraphVersionModel {
  @Field(() => [ProductAttributeModel])
  attributes: ProductAttributeModel[];

  @Field(() => [ConfigurationRuleModel])
  rules: ConfigurationRuleModel[];

  @Field(() => [ProductModelAssetModel])
  models: ProductModelAssetModel[];

  @Field(() => [VisualEffectModel])
  visualEffects: VisualEffectModel[];

  @Field(() => [ProductVariantModel])
  variants: ProductVariantModel[];
}

@ObjectType()
export class LibraryFolderModel {
  @Field(() => ID)
  id: string;

  @Field()
  organizationId: string;

  @Field()
  projectId: string;

  @Field(() => ID, { nullable: true })
  parentId?: string | null;

  @Field()
  name: string;

  @Field()
  sortOrder: number;
}

@ObjectType()
export class MaterialAssetModel {
  @Field(() => ID)
  id: string;

  @Field()
  organizationId: string;

  @Field()
  projectId: string;

  @Field(() => ID, { nullable: true })
  folderId?: string | null;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  code?: string | null;

  @Field()
  documentUri: string;

  @Field()
  documentSha256: string;
}

@ObjectType()
export class TextureAssetModel {
  @Field(() => ID)
  id: string;

  @Field()
  organizationId: string;

  @Field()
  projectId: string;

  @Field(() => ID, { nullable: true })
  folderId?: string | null;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  code?: string | null;

  @Field()
  fileUri: string;

  @Field()
  fileSha256: string;
}

@ObjectType()
export class ObjectAssetModel {
  @Field(() => ID)
  id: string;

  @Field()
  organizationId: string;

  @Field()
  projectId: string;

  @Field(() => ID, { nullable: true })
  folderId?: string | null;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  code?: string | null;

  @Field()
  fileUri: string;

  @Field()
  fileSha256: string;

  @Field(() => String, { nullable: true })
  fileUrl?: string | null;
}

@ObjectType()
export class OrganizationMemberModel {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  userId: string;

  @Field()
  email: string;

  @Field(() => String, { nullable: true })
  name?: string | null;

  @Field()
  roleName: string;
}

@ObjectType()
export class RoleModel {
  @Field(() => ID)
  id: string;

  @Field()
  organizationId: string;

  @Field()
  name: string;
}

@ObjectType()
export class ResolvedVisualEffectModel {
  @Field()
  targetKey: string;

  @Field()
  targetType: string;

  @Field(() => String, { nullable: true })
  nodePath?: string | null;

  @Field(() => VisualOperation)
  operation: VisualOperation;

  @Field()
  valueJson: string;
}

@ObjectType()
export class Resolved3DStateModel {
  @Field(() => String, { nullable: true })
  modelId?: string | null;

  @Field(() => [ResolvedVisualEffectModel])
  effects: ResolvedVisualEffectModel[];
}

@ObjectType()
export class ResolvedCommerceStateModel {
  @Field(() => String, { nullable: true })
  provider?: string | null;

  @Field(() => String, { nullable: true })
  productReference?: string | null;

  @Field(() => String, { nullable: true })
  variantReference?: string | null;

  @Field(() => String, { nullable: true })
  sku?: string | null;

  @Field(() => String, { nullable: true })
  cartPayloadJson?: string | null;
}

@ObjectType()
export class ResolvedConfigurationModel {
  @Field()
  valid: boolean;

  @Field(() => [String])
  violations: string[];

  @Field()
  selectionsJson: string;

  @Field(() => Resolved3DStateModel)
  threeD: Resolved3DStateModel;

  @Field(() => ResolvedCommerceStateModel)
  commerce: ResolvedCommerceStateModel;

  @Field()
  graphVersionId: string;

  @Field()
  graphVersion: number;
}

@ObjectType()
export class SavedConfigurationModel {
  @Field(() => ID)
  id: string;

  @Field()
  organizationId: string;

  @Field()
  projectId: string;

  @Field()
  productId: string;

  @Field()
  productGraphVersionId: string;

  @Field()
  stateUri: string;

  @Field()
  stateSha256: string;

  @Field()
  createdAt: Date;

  @Field(() => Date, { nullable: true })
  expiresAt?: Date | null;
}

@InputType()
export class CreateOrganizationInput {
  @Field()
  name: string;

  @Field()
  slug: string;
}

@InputType()
export class CreateProjectInput {
  @Field()
  organizationId: string;

  @Field()
  name: string;

  @Field()
  slug: string;
}

@InputType()
export class CreateProductInput {
  @Field()
  organizationId: string;

  @Field()
  projectId: string;

  @Field()
  name: string;

  @Field()
  key: string;

  @Field(() => String, { nullable: true })
  description?: string;
}

@InputType()
export class UpdateProductInput {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  key?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => ProductStatus, { nullable: true })
  status?: ProductStatus;
}

@InputType()
export class UpdateProfileInput {
  @Field(() => String, { nullable: true })
  name?: string;
}

@InputType()
export class CreateProductAttributeInput {
  @Field()
  graphVersionId: string;

  @Field()
  key: string;

  @Field()
  name: string;

  @Field(() => AttributeType)
  type: AttributeType;

  @Field(() => Boolean, { nullable: true })
  required?: boolean;

  @Field(() => Number, { nullable: true })
  sortOrder?: number;
}

@InputType()
export class CreateAttributeValueInput {
  @Field()
  attributeId: string;

  @Field()
  key: string;

  @Field()
  name: string;

  @Field(() => Number, { nullable: true })
  sortOrder?: number;

  @Field(() => String, { nullable: true })
  metadataJson?: string;
}

@InputType()
export class CreateConfigurationRuleInput {
  @Field()
  graphVersionId: string;

  @Field()
  conditionJson: string;

  @Field()
  effectJson: string;
}

@InputType()
export class CreateProductModelInput {
  @Field()
  graphVersionId: string;

  @Field()
  assetId: string;

  @Field()
  key: string;

  @Field()
  name: string;
}

@InputType()
export class CreateModelTargetInput {
  @Field()
  productModelId: string;

  @Field()
  key: string;

  @Field()
  targetType: string;

  @Field(() => String, { nullable: true })
  nodePath?: string;

  @Field(() => String, { nullable: true })
  materialSlot?: string;
}

@InputType()
export class CreateVisualEffectInput {
  @Field()
  attributeValueId: string;

  @Field()
  modelTargetId: string;

  @Field(() => VisualOperation)
  operation: VisualOperation;

  @Field()
  valueJson: string;
}

@InputType()
export class CreateProductVariantInput {
  @Field()
  graphVersionId: string;

  @Field()
  provider: string;

  @Field()
  externalId: string;

  @Field(() => String, { nullable: true })
  sku?: string;
}

@InputType()
export class CreateVariantSelectionInput {
  @Field()
  variantId: string;

  @Field()
  attributeId: string;

  @Field()
  attributeValueId: string;
}

@InputType()
export class CreateLibraryFolderInput {
  @Field()
  organizationId: string;

  @Field()
  projectId: string;

  @Field(() => ID, { nullable: true })
  parentId?: string;

  @Field()
  name: string;
}

@InputType()
export class CreateMaterialAssetInput {
  @Field()
  organizationId: string;

  @Field()
  projectId: string;

  @Field(() => ID, { nullable: true })
  folderId?: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => String)
  documentJson: string;
}

@InputType()
export class CreateTextureAssetInput {
  @Field()
  organizationId: string;

  @Field()
  projectId: string;

  @Field(() => ID, { nullable: true })
  folderId?: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => String, { nullable: true })
  metadataJson?: string;
}

@InputType()
export class CreateObjectAssetInput {
  @Field()
  organizationId: string;

  @Field()
  projectId: string;

  @Field(() => ID, { nullable: true })
  folderId?: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => String, { nullable: true })
  metadataJson?: string;

  @Field(() => String, { nullable: true })
  fileBase64?: string;

  @Field(() => String, { nullable: true })
  fileName?: string;
}

@InputType()
export class ConfigurationStateInput {
  @Field()
  productId: string;

  @Field(() => String, { nullable: true })
  graphVersionId?: string;

  @Field(() => String)
  selectionsJson: string;
}

@InputType()
export class SaveConfigurationInput {
  @Field()
  productId: string;

  @Field()
  graphVersionId: string;

  @Field(() => String)
  selectionsJson: string;

  @Field(() => String, { nullable: true })
  metadataJson?: string;
}
