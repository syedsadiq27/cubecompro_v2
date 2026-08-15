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
  ObjectAssetPurpose,
  ObjectAssetStatus,
  ProductStatus,
  VisualOperation,
} from '@prisma/client';

registerEnumType(GraphVersionStatus, { name: 'GraphVersionStatus' });
registerEnumType(ProductStatus, { name: 'ProductStatus' });
registerEnumType(AttributeType, { name: 'AttributeType' });
registerEnumType(VisualOperation, { name: 'VisualOperation' });
registerEnumType(ObjectAssetPurpose, { name: 'ObjectAssetPurpose' });
registerEnumType(ObjectAssetStatus, { name: 'ObjectAssetStatus' });

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
  activeRevisionId?: string | null;
}

@ObjectType()
export class ProductRevisionModel {
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
export class ChoiceValueModel {
  @Field(() => ID)
  id: string;

  @Field()
  choiceId: string;

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
export class ChoiceModel {
  @Field(() => ID)
  id: string;

  @Field()
  productRevisionId: string;

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

  @Field(() => [ChoiceValueModel], { nullable: true })
  values?: ChoiceValueModel[];
}

@ObjectType()
export class ConfigurationRuleModel {
  @Field(() => ID)
  id: string;

  @Field()
  productRevisionId: string;

  @Field()
  conditionJson: string;

  @Field()
  effectJson: string;
}

@ObjectType()
export class ConstraintTermModel {
  @Field()
  constraintId: string;

  @Field()
  choiceValueId: string;

  @Field(() => String, { nullable: true })
  choiceKey?: string | null;

  @Field(() => String, { nullable: true })
  choiceValueKey?: string | null;
}

@ObjectType()
export class ConstraintModel {
  @Field(() => ID)
  id: string;

  @Field()
  productRevisionId: string;

  @Field(() => [ConstraintTermModel])
  terms: ConstraintTermModel[];
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
  productRevisionId: string;

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
  choiceValueId: string;

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
  choiceId: string;

  @Field()
  choiceValueId: string;
}

@ObjectType()
export class ProductVariantModel {
  @Field(() => ID)
  id: string;

  @Field()
  productRevisionId: string;

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
export class CommerceIdentityChoiceModel {
  @Field()
  mappingSetId: string;

  @Field()
  choiceId: string;

  @Field()
  choiceKey: string;

  @Field()
  sortOrder: number;
}

@ObjectType()
export class CommerceMappingTermModel {
  @Field()
  mappingId: string;

  @Field()
  choiceValueId: string;

  @Field()
  choiceKey: string;

  @Field()
  choiceValueKey: string;
}

@ObjectType()
export class CommerceMappingModel {
  @Field(() => ID)
  id: string;

  @Field()
  mappingSetId: string;

  @Field()
  identitySignature: string;

  @Field()
  externalType: string;

  @Field()
  externalId: string;

  @Field(() => String, { nullable: true })
  sku?: string | null;

  @Field(() => [CommerceMappingTermModel])
  terms: CommerceMappingTermModel[];
}

@ObjectType()
export class CommerceMappingSetModel {
  @Field(() => ID)
  id: string;

  @Field()
  productRevisionId: string;

  @Field()
  provider: string;

  @Field(() => String, { nullable: true })
  integrationConnectionId?: string | null;

  @Field(() => [CommerceIdentityChoiceModel])
  identityChoices: CommerceIdentityChoiceModel[];

  @Field(() => [CommerceMappingModel])
  mappings: CommerceMappingModel[];

  @Field()
  domainJson: string;
}

@ObjectType()
export class ProductRevisionDetailModel extends ProductRevisionModel {
  @Field(() => [ChoiceModel])
  choices: ChoiceModel[];

  @Field(() => [ConfigurationRuleModel])
  rules: ConfigurationRuleModel[];

  @Field(() => [ConstraintModel])
  constraints: ConstraintModel[];

  @Field(() => [ProductModelAssetModel])
  models: ProductModelAssetModel[];

  @Field(() => [VisualEffectModel])
  visualEffects: VisualEffectModel[];

  @Field(() => [ProductVariantModel])
  variants: ProductVariantModel[];

  @Field(() => [CommerceMappingSetModel])
  commerceMappingSets: CommerceMappingSetModel[];
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

  @Field(() => String, { nullable: true })
  documentUrl?: string | null;
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

  @Field(() => String, { nullable: true })
  format?: string | null;

  @Field(() => Number, { nullable: true })
  sizeBytes?: number | null;

  @Field(() => ObjectAssetPurpose)
  purpose: ObjectAssetPurpose;

  @Field(() => ObjectAssetStatus)
  status: ObjectAssetStatus;

  @Field(() => String, { nullable: true })
  parsedMetadataUri?: string | null;

  @Field(() => String, { nullable: true })
  parsedMetadataSha256?: string | null;

  @Field()
  metadataVersion: number;

  @Field(() => Number, { nullable: true })
  nodeCount?: number | null;

  @Field(() => Number, { nullable: true })
  meshCount?: number | null;

  @Field(() => Number, { nullable: true })
  materialCount?: number | null;

  @Field(() => Number, { nullable: true })
  animationCount?: number | null;

  @Field(() => String, { nullable: true })
  metadataUrl?: string | null;
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

  @Field(() => String, { nullable: true })
  materialAssetId?: string | null;

  @Field(() => String, { nullable: true })
  documentUrl?: string | null;
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

  @Field(() => String, { nullable: true })
  availabilityJson?: string | null;

  @Field(() => Resolved3DStateModel)
  threeD: Resolved3DStateModel;

  @Field(() => ResolvedCommerceStateModel)
  commerce: ResolvedCommerceStateModel;

  @Field()
  productRevisionId: string;

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
  productRevisionId: string;

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
export class CreateChoiceInput {
  @Field()
  productRevisionId: string;

  @Field()
  key: string;

  @Field()
  name: string;

  @Field(() => AttributeType, {
    nullable: true,
    description: 'Kernel authoring accepts SELECT only; defaults to SELECT.',
  })
  type?: AttributeType;

  @Field(() => Boolean, { nullable: true })
  required?: boolean;

  @Field(() => Number, { nullable: true })
  sortOrder?: number;
}

@InputType()
export class SetChoiceDefaultInput {
  @Field()
  choiceId: string;

  @Field(() => ID, { nullable: true })
  defaultValueId?: string | null;
}

@InputType()
export class CreateConstraintInput {
  @Field()
  productRevisionId: string;

  @Field(() => [String])
  choiceValueIds: string[];
}

@InputType()
export class CreateChoiceValueInput {
  @Field()
  choiceId: string;

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
  productRevisionId: string;

  @Field()
  conditionJson: string;

  @Field()
  effectJson: string;
}

@InputType()
export class CreateProductModelInput {
  @Field()
  productRevisionId: string;

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
  choiceValueId: string;

  @Field()
  modelTargetId: string;

  @Field(() => VisualOperation)
  operation: VisualOperation;

  @Field()
  valueJson: string;
}

@InputType()
export class UpdateVisualEffectInput {
  @Field()
  id: string;

  @Field(() => VisualOperation, { nullable: true })
  operation?: VisualOperation;

  @Field(() => String, { nullable: true })
  valueJson?: string;
}

@InputType()
export class CreateProductVariantInput {
  @Field()
  productRevisionId: string;

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
  choiceId: string;

  @Field()
  choiceValueId: string;
}

@InputType()
export class ReplaceCommerceMappingInput {
  @Field(() => [String])
  choiceValueIds: string[];

  @Field()
  externalId: string;

  @Field(() => String, { nullable: true })
  sku?: string;
}

@InputType()
export class ReplaceCommerceMappingSetInput {
  @Field()
  productRevisionId: string;

  @Field()
  provider: string;

  @Field(() => [String])
  identityChoiceIds: string[];

  @Field(() => [ReplaceCommerceMappingInput])
  mappings: ReplaceCommerceMappingInput[];

  @Field(() => String, { nullable: true })
  integrationConnectionId?: string;
}

@InputType()
export class UpsertShopifyConnectionInput {
  @Field()
  organizationId: string;

  @Field()
  shop: string;

  @Field()
  accessToken: string;

  @Field(() => String, { nullable: true })
  apiVersion?: string;
}

@InputType()
export class ImportShopifyProductInput {
  @Field()
  integrationConnectionId: string;

  @Field()
  projectId: string;

  @Field()
  shopifyProductId: string;

  @Field(() => String, { nullable: true })
  productJson?: string;
}

@ObjectType()
export class IntegrationConnectionModel {
  @Field(() => ID)
  id: string;

  @Field()
  organizationId: string;

  @Field()
  provider: string;

  @Field()
  externalAccountId: string;

  @Field()
  apiVersion: string;

  @Field()
  hasAccessToken: boolean;
}

@ObjectType()
export class ImportShopifyProductResultModel {
  @Field()
  productId: string;

  @Field()
  productRevisionId: string;

  @Field()
  integrationConnectionId: string;

  @Field()
  externalProductId: string;

  @Field(() => [String])
  identityChoiceKeys: string[];

  @Field()
  mappingCount: number;

  @Field()
  commerceMappingSetId: string;
}

@InputType()
export class ResolveCommerceInput {
  @Field()
  productRevisionId: string;

  @Field()
  provider: string;

  @Field()
  selectionJson: string;

  @Field(() => String, { nullable: true })
  integrationConnectionId?: string;
}

@ObjectType()
export class CommerceExternalReferenceModel {
  @Field()
  type: string;

  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  sku?: string | null;
}

@ObjectType()
export class CommerceResolutionModel {
  @Field()
  status: string;

  @Field(() => String, { nullable: true })
  provider?: string | null;

  @Field(() => CommerceExternalReferenceModel, { nullable: true })
  externalReference?: CommerceExternalReferenceModel | null;

  @Field()
  identitySignature: string;

  @Field()
  identityJson: string;
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
export class UpdateMaterialAssetInput {
  @Field()
  id: string;

  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  code?: string;

  @Field(() => String, { nullable: true })
  documentJson?: string;
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

  @Field(() => ObjectAssetPurpose, { nullable: true })
  purpose?: ObjectAssetPurpose;
}

@InputType()
export class ConfigurationStateInput {
  @Field()
  productId: string;

  @Field(() => String, { nullable: true })
  productRevisionId?: string;

  @Field(() => String)
  selectionsJson: string;
}

@InputType()
export class SaveConfigurationInput {
  @Field()
  productId: string;

  @Field()
  productRevisionId: string;

  @Field(() => String)
  selectionsJson: string;

  @Field(() => String, { nullable: true })
  metadataJson?: string;
}
