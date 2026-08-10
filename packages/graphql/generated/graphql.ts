/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: string; output: string; }
  JSON: { input: unknown; output: unknown; }
  Upload: { input: File; output: File; }
};

export type AuthPayload = {
  token: Scalars['String']['output'];
  user: User;
};

export type Category = {
  createdAt?: Maybe<Scalars['Date']['output']>;
  createdby?: Maybe<User>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type ClientApi = {
  client_key?: Maybe<Scalars['String']['output']>;
  client_secret_key?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  projectid?: Maybe<Scalars['ID']['output']>;
};

export type CmsConfig = {
  cmsconfigid?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type CmsData = {
  id?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Comment = {
  comId?: Maybe<Scalars['ID']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
};

export type CommerceConfig = {
  apiurl?: Maybe<Scalars['String']['output']>;
  clientid?: Maybe<Scalars['String']['output']>;
  clientsecert?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  platform?: Maybe<Scalars['String']['output']>;
  redirecturl?: Maybe<Scalars['String']['output']>;
  storeid?: Maybe<Scalars['String']['output']>;
};

export type Model = {
  ProductId?: Maybe<Scalars['ID']['output']>;
  ProductStatus?: Maybe<Status>;
  active?: Maybe<Scalars['Boolean']['output']>;
  config?: Maybe<Scalars['JSON']['output']>;
  configtoken?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  sku?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type ModelVariant = {
  configuration?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  media?: Maybe<ProductMedia>;
  varientCode?: Maybe<Scalars['String']['output']>;
  varientName?: Maybe<Scalars['String']['output']>;
};

export type Mutation = {
  SoftDeleteImportedModel?: Maybe<Scalars['Boolean']['output']>;
  SoftDeleteProductById?: Maybe<Scalars['Boolean']['output']>;
  UpdateCategoryById?: Maybe<Scalars['Boolean']['output']>;
  UpdateProductById?: Maybe<Scalars['Boolean']['output']>;
  UpdateProjectById?: Maybe<Scalars['Boolean']['output']>;
  UpdateSubCategoryById?: Maybe<Scalars['Boolean']['output']>;
  addCategory?: Maybe<Scalars['Boolean']['output']>;
  addCommerceConfig?: Maybe<Scalars['Boolean']['output']>;
  addObject?: Maybe<Scalars['Boolean']['output']>;
  addProduct?: Maybe<Scalars['Boolean']['output']>;
  addProject?: Maybe<Scalars['Boolean']['output']>;
  addSubCategory?: Maybe<Scalars['Boolean']['output']>;
  addUsergroup?: Maybe<Scalars['Boolean']['output']>;
  addcmsconfig?: Maybe<Scalars['Boolean']['output']>;
  addtexture?: Maybe<Scalars['Boolean']['output']>;
  deleteCategoryById?: Maybe<Scalars['Boolean']['output']>;
  deleteCommerceConfigByPId?: Maybe<Scalars['Boolean']['output']>;
  deleteObjectById?: Maybe<Scalars['Boolean']['output']>;
  deleteProductById?: Maybe<Scalars['Boolean']['output']>;
  deleteProjectById?: Maybe<Scalars['Boolean']['output']>;
  deleteSubCategoryById?: Maybe<Scalars['Boolean']['output']>;
  deleteTextureById?: Maybe<Scalars['Boolean']['output']>;
  deleteUserById?: Maybe<Scalars['Boolean']['output']>;
  deleteUserFromUserGroupById?: Maybe<Scalars['Boolean']['output']>;
  deleteUsergroupById?: Maybe<Scalars['Boolean']['output']>;
  deletecmsconfigByprojectId?: Maybe<Scalars['Boolean']['output']>;
  forgotPassword?: Maybe<Scalars['Boolean']['output']>;
  inviteUser?: Maybe<UserGroup>;
  login?: Maybe<AuthPayload>;
  registerProject?: Maybe<ProjectToken>;
  registerProjectwithCMS?: Maybe<ProjectTokenWithCms>;
  registerUser?: Maybe<AuthPayload>;
  updateCommerceConfigById?: Maybe<Scalars['Boolean']['output']>;
  updatePassword?: Maybe<Scalars['Boolean']['output']>;
  updateUserProfile?: Maybe<Scalars['Boolean']['output']>;
  updateWorkflowById?: Maybe<Scalars['Boolean']['output']>;
  updatecmsconfigById?: Maybe<Scalars['Boolean']['output']>;
  verifyToken?: Maybe<Scalars['Boolean']['output']>;
};


export type MutationSoftDeleteImportedModelArgs = {
  projectId: Scalars['ID']['input'];
};


export type MutationSoftDeleteProductByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateCategoryByIdArgs = {
  createdBy?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateProductByIdArgs = {
  Category?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  Department?: InputMaybe<Scalars['String']['input']>;
  Description?: InputMaybe<Scalars['String']['input']>;
  Manufacture?: InputMaybe<Scalars['String']['input']>;
  Name?: InputMaybe<Scalars['String']['input']>;
  StatusId?: InputMaybe<Scalars['Int']['input']>;
  active: Scalars['Boolean']['input'];
  code?: InputMaybe<Scalars['String']['input']>;
  files?: InputMaybe<Array<Scalars['Upload']['input']>>;
  id: Scalars['ID']['input'];
  projectId: Scalars['Int']['input'];
  property?: InputMaybe<Array<InputMaybe<PropertyUpdateInput>>>;
  subCategory?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  userId: Scalars['Int']['input'];
};


export type MutationUpdateProjectByIdArgs = {
  active: Scalars['Boolean']['input'];
  expireDate?: InputMaybe<Scalars['Date']['input']>;
  id: Scalars['ID']['input'];
  inProduction?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
};


export type MutationUpdateSubCategoryByIdArgs = {
  createdBy?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationAddCategoryArgs = {
  createdBy?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  productId?: InputMaybe<Scalars['ID']['input']>;
  projectId: Scalars['ID']['input'];
};


export type MutationAddCommerceConfigArgs = {
  apiurl: Scalars['String']['input'];
  clientid: Scalars['String']['input'];
  clientsecert: Scalars['String']['input'];
  platform: Scalars['String']['input'];
  projectId: Scalars['Int']['input'];
  redirecturl: Scalars['String']['input'];
  storeid: Scalars['String']['input'];
};


export type MutationAddObjectArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  image?: InputMaybe<Scalars['Upload']['input']>;
  ismeshable?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  productId?: InputMaybe<Scalars['ID']['input']>;
  projectId: Scalars['ID']['input'];
};


export type MutationAddProductArgs = {
  Category: Array<InputMaybe<Scalars['Int']['input']>>;
  Department?: InputMaybe<Scalars['String']['input']>;
  Description: Scalars['String']['input'];
  Manufacture?: InputMaybe<Scalars['String']['input']>;
  Name: Scalars['String']['input'];
  StatusId: Scalars['Int']['input'];
  active: Scalars['Boolean']['input'];
  camera?: InputMaybe<Scalars['JSON']['input']>;
  code: Scalars['String']['input'];
  files: Array<Scalars['Upload']['input']>;
  light?: InputMaybe<Scalars['JSON']['input']>;
  projectId: Scalars['Int']['input'];
  property: Array<PropertyInput>;
  rendererSetting?: InputMaybe<Scalars['JSON']['input']>;
  subCategory?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  textureId?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  userId: Scalars['Int']['input'];
};


export type MutationAddProjectArgs = {
  active: Scalars['Boolean']['input'];
  inProduction?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  userId: Scalars['Int']['input'];
};


export type MutationAddSubCategoryArgs = {
  categoryId: Scalars['ID']['input'];
  createdBy?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};


export type MutationAddUsergroupArgs = {
  name: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};


export type MutationAddcmsconfigArgs = {
  cmsconfigid: Scalars['String']['input'];
  name: Scalars['String']['input'];
  projectId: Scalars['Int']['input'];
};


export type MutationAddtextureArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  createdby?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  image: Scalars['Upload']['input'];
  name: Scalars['String']['input'];
  productId?: InputMaybe<Scalars['ID']['input']>;
  projectId: Scalars['ID']['input'];
  thumbnail?: InputMaybe<Scalars['Upload']['input']>;
};


export type MutationDeleteCategoryByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteCommerceConfigByPIdArgs = {
  projectId: Scalars['ID']['input'];
};


export type MutationDeleteObjectByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProductByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteProjectByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteSubCategoryByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteTextureByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteUserFromUserGroupByIdArgs = {
  userId: Scalars['ID']['input'];
  usergroupId: Scalars['ID']['input'];
};


export type MutationDeleteUsergroupByIdArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeletecmsconfigByprojectIdArgs = {
  projectId: Scalars['ID']['input'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String']['input'];
};


export type MutationInviteUserArgs = {
  email: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  organizationId: Scalars['ID']['input'];
  userGroupId: Scalars['ID']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRegisterProjectArgs = {
  ProductId: Scalars['ID']['input'];
};


export type MutationRegisterProjectwithCmsArgs = {
  ProductId: Scalars['ID']['input'];
};


export type MutationRegisterUserArgs = {
  active: Scalars['Boolean']['input'];
  authorization?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  password: Scalars['String']['input'];
  role: Scalars['String']['input'];
};


export type MutationUpdateCommerceConfigByIdArgs = {
  apiurl: Scalars['String']['input'];
  clientid: Scalars['String']['input'];
  clientsecert: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  platform: Scalars['String']['input'];
  projectId?: InputMaybe<Scalars['Int']['input']>;
  redirecturl: Scalars['String']['input'];
  storeid: Scalars['String']['input'];
};


export type MutationUpdatePasswordArgs = {
  authorization: Scalars['String']['input'];
  confirmPassword: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationUpdateUserProfileArgs = {
  firstname?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  lastname?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateWorkflowByIdArgs = {
  assignedTo: Scalars['Int']['input'];
  comments?: InputMaybe<Scalars['JSON']['input']>;
  eta?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['Int']['input'];
  priority?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['Int']['input'];
  projectId: Scalars['ID']['input'];
  statusId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
};


export type MutationUpdatecmsconfigByIdArgs = {
  cmsconfigid: Scalars['String']['input'];
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
};


export type MutationVerifyTokenArgs = {
  authorization: Scalars['String']['input'];
};

export type Object = {
  ProductMedium?: Maybe<ProductMedia>;
  code?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  ismeshable?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type Organization = {
  Users?: Maybe<Array<User>>;
  active?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  projects?: Maybe<Array<Project>>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
  usergroups?: Maybe<Array<UserGroup>>;
};

export type Permission = {
  active?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type Product = {
  Categories?: Maybe<Array<Category>>;
  Department?: Maybe<Scalars['String']['output']>;
  Description?: Maybe<Scalars['String']['output']>;
  Manufacture?: Maybe<Scalars['String']['output']>;
  Name?: Maybe<Scalars['String']['output']>;
  ProductMedia?: Maybe<Array<ProductMedia>>;
  ProductStatus?: Maybe<Status>;
  Properties?: Maybe<Array<Property>>;
  active?: Maybe<Scalars['Boolean']['output']>;
  arDetails?: Maybe<Scalars['JSON']['output']>;
  camera?: Maybe<Scalars['JSON']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  enableAr?: Maybe<Scalars['Boolean']['output']>;
  environmentmap?: Maybe<Scalars['JSON']['output']>;
  files?: Maybe<Scalars['JSON']['output']>;
  id: Scalars['ID']['output'];
  leadtime?: Maybe<Scalars['Int']['output']>;
  light?: Maybe<Scalars['JSON']['output']>;
  modelCount?: Maybe<Scalars['Int']['output']>;
  models?: Maybe<Array<Model>>;
  orbitalsetting?: Maybe<Scalars['JSON']['output']>;
  rendererSetting?: Maybe<Scalars['JSON']['output']>;
  subCategories?: Maybe<Array<SubCategory>>;
  workflow?: Maybe<Workflow>;
};

export type ProductMedia = {
  Image_Alternate_Name?: Maybe<Scalars['String']['output']>;
  Image_URL?: Maybe<Scalars['String']['output']>;
  altText?: Maybe<Scalars['String']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  downloadURL?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['ID']['output']>;
  mediaFormat?: Maybe<Scalars['String']['output']>;
  updatedAt?: Maybe<Scalars['Date']['output']>;
};

export type Project = {
  active?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  expireDate?: Maybe<Scalars['Date']['output']>;
  id: Scalars['ID']['output'];
  inProduction?: Maybe<Scalars['Boolean']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Organization>;
};

export type ProjectToken = {
  token: Scalars['String']['output'];
};

export type ProjectTokenWithCms = {
  cmsData?: Maybe<CmsData>;
  token: Scalars['String']['output'];
};

export type Property = {
  PropertyValues?: Maybe<Array<PropertyValue>>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type PropertyValue = {
  Active?: Maybe<Scalars['Boolean']['output']>;
  ProductMedium?: Maybe<ProductMedia>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  objects?: Maybe<Array<Object>>;
};

export type Query = {
  allUsers?: Maybe<Array<User>>;
  getAllPermissions?: Maybe<Array<Permission>>;
  getCategory?: Maybe<Array<Category>>;
  getCategoryByProjectId?: Maybe<Array<Category>>;
  getModelBySku?: Maybe<Model>;
  getObject?: Maybe<Array<Object>>;
  getObjectByProjectId?: Maybe<Array<Object>>;
  getOrganization?: Maybe<Array<Organization>>;
  getOrganizationByUserId?: Maybe<Array<Organization>>;
  getPermissionsByProjectId?: Maybe<Array<Permission>>;
  getPermissionsByProjectIdAndUsergroupId?: Maybe<Array<Permission>>;
  getProductDetail?: Maybe<Product>;
  getProductDetails?: Maybe<Array<Product>>;
  getProject?: Maybe<Array<Project>>;
  getProjectByuserID?: Maybe<Array<Project>>;
  getStatusDetail?: Maybe<Status>;
  getStatusDetails?: Maybe<Array<Status>>;
  getSubCategoryByCategoriesId?: Maybe<Array<SubCategory>>;
  getTextureByProductID?: Maybe<Array<Texture>>;
  getTextureByProjectId?: Maybe<Array<Texture>>;
  getThreedUserList?: Maybe<Array<User>>;
  getUserByOrganizationId?: Maybe<Array<User>>;
  getUsergroup?: Maybe<Array<UserGroup>>;
  getUsergroupByGroupName?: Maybe<UserGroup>;
  getUsergroupByOrganizationId?: Maybe<Array<UserGroup>>;
  getUsersByUserGroupId?: Maybe<Array<User>>;
  getVarientByModelId?: Maybe<Array<ModelVariant>>;
  getWorkflow?: Maybe<Workflow>;
  getWorkflowByProductId?: Maybe<Array<Workflow>>;
  getWorkflows?: Maybe<Array<Workflow>>;
  getclientapiByID?: Maybe<ClientApi>;
  getcmsconfigByprojectID?: Maybe<Array<CmsConfig>>;
  getcommerceconfigByPID?: Maybe<Array<CommerceConfig>>;
  gettexture?: Maybe<Array<Texture>>;
  me?: Maybe<User>;
  searchUsersByEmail?: Maybe<Array<User>>;
  userProfile?: Maybe<UserProfile>;
};


export type QueryGetCategoryByProjectIdArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryGetModelBySkuArgs = {
  sku: Scalars['String']['input'];
};


export type QueryGetObjectByProjectIdArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryGetOrganizationByUserIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetPermissionsByProjectIdArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryGetPermissionsByProjectIdAndUsergroupIdArgs = {
  projectId: Scalars['ID']['input'];
  usergroupId: Scalars['ID']['input'];
};


export type QueryGetProductDetailArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetProductDetailsArgs = {
  status: Array<Scalars['ID']['input']>;
};


export type QueryGetProjectByuserIdArgs = {
  userId: Scalars['ID']['input'];
};


export type QueryGetStatusDetailArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetSubCategoryByCategoriesIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetTextureByProductIdArgs = {
  ProductId: Scalars['ID']['input'];
};


export type QueryGetTextureByProjectIdArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryGetUserByOrganizationIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUsergroupByGroupNameArgs = {
  name: Scalars['String']['input'];
};


export type QueryGetUsergroupByOrganizationIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetUsersByUserGroupIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetVarientByModelIdArgs = {
  modelId: Scalars['Int']['input'];
};


export type QueryGetWorkflowArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetWorkflowByProductIdArgs = {
  ProductId: Scalars['ID']['input'];
};


export type QueryGetclientapiByIdArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGetcmsconfigByprojectIdArgs = {
  projectId: Scalars['ID']['input'];
};


export type QueryGetcommerceconfigByPidArgs = {
  projectId: Scalars['ID']['input'];
};


export type QuerySearchUsersByEmailArgs = {
  email: Scalars['String']['input'];
};


export type QueryUserProfileArgs = {
  id: Scalars['Int']['input'];
};

export type Status = {
  Status_Name?: Maybe<Scalars['String']['output']>;
  Status_Type?: Maybe<Scalars['String']['output']>;
  colour?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
};

export type SubCategory = {
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
};

export type Texture = {
  ProductMedium?: Maybe<ProductMedia>;
  code?: Maybe<Scalars['String']['output']>;
  createdby?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name?: Maybe<Scalars['String']['output']>;
  thumbnails?: Maybe<Array<ProductMedia>>;
};

export type User = {
  active?: Maybe<Scalars['Boolean']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstname?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastname?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Organization>;
  organizations?: Maybe<Array<Organization>>;
  projects?: Maybe<Array<Project>>;
  role?: Maybe<Scalars['String']['output']>;
};

export type UserGroup = {
  id: Scalars['ID']['output'];
  members?: Maybe<Array<UserGroupMember>>;
  name?: Maybe<Scalars['String']['output']>;
  organization?: Maybe<Organization>;
  organizationId?: Maybe<Scalars['ID']['output']>;
};

export type UserGroupMember = {
  user?: Maybe<User>;
  userId?: Maybe<Scalars['ID']['output']>;
  usergroupId?: Maybe<Scalars['ID']['output']>;
};

export type UserProfile = {
  active?: Maybe<Scalars['Boolean']['output']>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  firstname?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastname?: Maybe<Scalars['String']['output']>;
  organizations?: Maybe<Array<Organization>>;
  projects?: Maybe<Array<Project>>;
  role?: Maybe<Scalars['String']['output']>;
};

export type Workflow = {
  assignedTo?: Maybe<User>;
  comments?: Maybe<Array<Comment>>;
  createdAt?: Maybe<Scalars['Date']['output']>;
  eta?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  priority?: Maybe<Scalars['String']['output']>;
  product?: Maybe<Product>;
  requestedBy?: Maybe<User>;
  workflowStatus?: Maybe<Status>;
};

export type PropertyInput = {
  PropertyValues?: InputMaybe<Array<PropertyValueInput>>;
  name: Scalars['String']['input'];
};

export type PropertyUpdateInput = {
  PropertyValues?: InputMaybe<Array<InputMaybe<PropertyValueUpdateInput>>>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type PropertyValueInput = {
  Active?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};

export type PropertyValueUpdateInput = {
  Active?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['ID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type ObjectFieldsFragment = { id: string, name?: string | null, code?: string | null, ismeshable?: boolean | null, ProductMedium?: { id?: string | null, Image_URL?: string | null, Image_Alternate_Name?: string | null, downloadURL?: string | null, altText?: string | null, mediaFormat?: string | null, createdAt?: string | null, updatedAt?: string | null } | null };

export type ProductMediaFieldsFragment = { id?: string | null, Image_URL?: string | null, Image_Alternate_Name?: string | null, downloadURL?: string | null, altText?: string | null, mediaFormat?: string | null, createdAt?: string | null, updatedAt?: string | null };

export type TextureFieldsFragment = { id: string, name?: string | null, code?: string | null, description?: string | null, createdby?: string | null, thumbnails?: Array<{ id?: string | null, Image_URL?: string | null, Image_Alternate_Name?: string | null, downloadURL?: string | null, altText?: string | null, mediaFormat?: string | null, createdAt?: string | null, updatedAt?: string | null }> | null, ProductMedium?: { id?: string | null, Image_URL?: string | null, Image_Alternate_Name?: string | null, downloadURL?: string | null, altText?: string | null, mediaFormat?: string | null, createdAt?: string | null, updatedAt?: string | null } | null };

export type GetProjectTexturesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectTexturesQuery = { gettexture?: Array<{ id: string, name?: string | null, code?: string | null, description?: string | null, ProductMedium?: { Image_URL?: string | null } | null }> | null };

export type GetProjectObjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectObjectsQuery = { getObject?: Array<{ id: string, name?: string | null, code?: string | null, ProductMedium?: { Image_URL?: string | null } | null }> | null };

export type DeleteTextureMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteTextureMutation = { deleteTextureById?: boolean | null };

export type DeleteObjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteObjectMutation = { deleteObjectById?: boolean | null };

export type LoginMutationMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutationMutation = { login?: { token: string, user: { id: string, firstname?: string | null, lastname?: string | null, role?: string | null, email?: string | null } } | null };

export type RegisterUserMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
  firstname: Scalars['String']['input'];
  lastname: Scalars['String']['input'];
  role: Scalars['String']['input'];
  active: Scalars['Boolean']['input'];
  authorization?: InputMaybe<Scalars['String']['input']>;
}>;


export type RegisterUserMutation = { registerUser?: { token: string, user: { id: string, firstname?: string | null, lastname?: string | null, role?: string | null, email?: string | null } } | null };

export type ForgotPasswordMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type ForgotPasswordMutation = { forgotPassword?: boolean | null };

export type UpdatePasswordMutationVariables = Exact<{
  password: Scalars['String']['input'];
  confirmPassword: Scalars['String']['input'];
  authorization: Scalars['String']['input'];
}>;


export type UpdatePasswordMutation = { updatePassword?: boolean | null };

export type GetCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCategoriesQuery = { getCategory?: Array<{ id: string, name?: string | null }> | null };

export type GetCategoriesByProjectIdQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type GetCategoriesByProjectIdQuery = { getCategoryByProjectId?: Array<{ id: string, name?: string | null, description?: string | null, createdAt?: string | null, createdby?: { id: string, firstname?: string | null, lastname?: string | null } | null }> | null };

export type GetSubCategoriesByCategoryIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetSubCategoriesByCategoryIdQuery = { getSubCategoryByCategoriesId?: Array<{ id: string, name?: string | null, description?: string | null }> | null };

export type AddCategoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
  projectId: Scalars['ID']['input'];
  productId?: InputMaybe<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  createdBy?: InputMaybe<Scalars['ID']['input']>;
}>;


export type AddCategoryMutation = { addCategory?: boolean | null };

export type UpdateCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  createdBy?: InputMaybe<Scalars['ID']['input']>;
}>;


export type UpdateCategoryMutation = { UpdateCategoryById?: boolean | null };

export type DeleteCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteCategoryMutation = { deleteCategoryById?: boolean | null };

export type AddSubCategoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  createdBy?: InputMaybe<Scalars['ID']['input']>;
  categoryId: Scalars['ID']['input'];
}>;


export type AddSubCategoryMutation = { addSubCategory?: boolean | null };

export type UpdateSubCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  createdBy?: InputMaybe<Scalars['ID']['input']>;
}>;


export type UpdateSubCategoryMutation = { UpdateSubCategoryById?: boolean | null };

export type DeleteSubCategoryMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteSubCategoryMutation = { deleteSubCategoryById?: boolean | null };

export type GetModelBySkuQueryVariables = Exact<{
  sku: Scalars['String']['input'];
}>;


export type GetModelBySkuQuery = { getModelBySku?: { id: string, name?: string | null, sku?: string | null, ProductId?: string | null, config?: unknown | null } | null };

export type GetVariantsByModelIdQueryVariables = Exact<{
  modelId: Scalars['Int']['input'];
}>;


export type GetVariantsByModelIdQuery = { getVarientByModelId?: Array<{ id: string, varientCode?: string | null, varientName?: string | null, configuration?: unknown | null, media?: { id?: string | null, Image_URL?: string | null } | null }> | null };

export type GetProductsQueryVariables = Exact<{
  status: Array<Scalars['ID']['input']> | Scalars['ID']['input'];
}>;


export type GetProductsQuery = { getProductDetails?: Array<{ id: string, Name?: string | null, code?: string | null, Description?: string | null, enableAr?: boolean | null, arDetails?: unknown | null, ProductStatus?: { id: string, Status_Name?: string | null, colour?: string | null } | null, Categories?: Array<{ id: string, name?: string | null }> | null, subCategories?: Array<{ id: string, name?: string | null }> | null, ProductMedia?: Array<{ id?: string | null, Image_URL?: string | null, downloadURL?: string | null, altText?: string | null }> | null, models?: Array<{ id: string, name?: string | null, ProductStatus?: { id: string, Status_Name?: string | null } | null }> | null, workflow?: { workflowStatus?: { id: string, Status_Name?: string | null } | null } | null }> | null };

export type GetProductDetailQueryVariables = Exact<{
  prodId: Scalars['ID']['input'];
}>;


export type GetProductDetailQuery = { getProductDetail?: { id: string, Name?: string | null, Description?: string | null, Department?: string | null, Manufacture?: string | null, code?: string | null, camera?: unknown | null, light?: unknown | null, rendererSetting?: unknown | null, modelCount?: number | null, environmentmap?: unknown | null, orbitalsetting?: unknown | null, ProductStatus?: { id: string, Status_Name?: string | null, colour?: string | null } | null, models?: Array<{ id: string, name?: string | null, ProductStatus?: { id: string, Status_Name?: string | null } | null }> | null, Categories?: Array<{ id: string, name?: string | null }> | null, subCategories?: Array<{ id: string, name?: string | null }> | null, ProductMedia?: Array<{ id?: string | null, Image_URL?: string | null, altText?: string | null, downloadURL?: string | null }> | null, Properties?: Array<{ id: string, name?: string | null, PropertyValues?: Array<{ id: string, name?: string | null, Active?: boolean | null, ProductMedium?: { id?: string | null, Image_URL?: string | null, altText?: string | null, downloadURL?: string | null } | null }> | null }> | null } | null };

export type GetCustomizerProductDetailQueryVariables = Exact<{
  productId: Scalars['ID']['input'];
}>;


export type GetCustomizerProductDetailQuery = { getProductDetail?: { id: string, Name?: string | null, code?: string | null, camera?: unknown | null, Properties?: Array<{ id: string, name?: string | null, PropertyValues?: Array<{ id: string, name?: string | null, objects?: Array<{ id: string, name?: string | null, code?: string | null, ProductMedium?: { Image_URL?: string | null } | null }> | null }> | null }> | null } | null, getTextureByProductID?: Array<{ id: string, name?: string | null, code?: string | null, description?: string | null, ProductMedium?: { Image_URL?: string | null } | null }> | null };

export type GetStatusDetailsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStatusDetailsQuery = { getStatusDetails?: Array<{ id: string, Status_Name?: string | null, Status_Type?: string | null }> | null };

export type SoftDeleteProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type SoftDeleteProductMutation = { SoftDeleteProductById?: boolean | null };

export type DeleteProductMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProductMutation = { deleteProductById?: boolean | null };

export type UpdateProductMetadataMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  Name?: InputMaybe<Scalars['String']['input']>;
  Description?: InputMaybe<Scalars['String']['input']>;
  Category?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>> | InputMaybe<Scalars['Int']['input']>>;
  StatusId?: InputMaybe<Scalars['Int']['input']>;
  active: Scalars['Boolean']['input'];
  Department?: InputMaybe<Scalars['String']['input']>;
  Manufacture?: InputMaybe<Scalars['String']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  projectId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
  subCategory?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>> | InputMaybe<Scalars['Int']['input']>>;
}>;


export type UpdateProductMetadataMutation = { UpdateProductById?: boolean | null };

export type RegisterProjectMutationVariables = Exact<{
  ProductId: Scalars['ID']['input'];
}>;


export type RegisterProjectMutation = { registerProject?: { token: string } | null };

export type RegisterProjectWithCmsMutationVariables = Exact<{
  ProductId: Scalars['ID']['input'];
}>;


export type RegisterProjectWithCmsMutation = { registerProjectwithCMS?: { token: string, cmsData?: { id?: number | null, name?: string | null } | null } | null };

export type GetProjectsByUserIdQueryVariables = Exact<{
  userId: Scalars['ID']['input'];
}>;


export type GetProjectsByUserIdQuery = { getProjectByuserID?: Array<{ id: string, name?: string | null, active?: boolean | null, expireDate?: string | null, inProduction?: boolean | null, createdAt?: string | null, organization?: { id: string, name?: string | null } | null }> | null };

export type GetProjectsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProjectsQuery = { getProject?: Array<{ id: string, name?: string | null, active?: boolean | null }> | null };

export type AddProjectMutationVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  active: Scalars['Boolean']['input'];
  inProduction?: InputMaybe<Scalars['Boolean']['input']>;
  userId: Scalars['Int']['input'];
}>;


export type AddProjectMutation = { addProject?: boolean | null };

export type UpdateProjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  active: Scalars['Boolean']['input'];
  organizationId: Scalars['ID']['input'];
  expireDate?: InputMaybe<Scalars['Date']['input']>;
  inProduction?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateProjectMutation = { UpdateProjectById?: boolean | null };

export type DeleteProjectMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteProjectMutation = { deleteProjectById?: boolean | null };

export type GetCmsConfigQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type GetCmsConfigQuery = { getcmsconfigByprojectID?: Array<{ id: string, name?: string | null, cmsconfigid?: string | null }> | null };

export type GetCommerceConfigQueryVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type GetCommerceConfigQuery = { getcommerceconfigByPID?: Array<{ id: string, platform?: string | null, apiurl?: string | null, storeid?: string | null, clientid?: string | null, clientsecert?: string | null, redirecturl?: string | null }> | null };

export type GetClientApiQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetClientApiQuery = { getclientapiByID?: { id: string, client_secret_key?: string | null, projectid?: string | null, client_key?: string | null } | null };

export type AddCmsConfigMutationVariables = Exact<{
  name: Scalars['String']['input'];
  cmsconfigid: Scalars['String']['input'];
  projectId: Scalars['Int']['input'];
}>;


export type AddCmsConfigMutation = { addcmsconfig?: boolean | null };

export type UpdateCmsConfigMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  cmsconfigid: Scalars['String']['input'];
}>;


export type UpdateCmsConfigMutation = { updatecmsconfigById?: boolean | null };

export type DeleteCmsConfigMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type DeleteCmsConfigMutation = { deletecmsconfigByprojectId?: boolean | null };

export type AddCommerceConfigMutationVariables = Exact<{
  platform: Scalars['String']['input'];
  apiurl: Scalars['String']['input'];
  storeid: Scalars['String']['input'];
  clientid: Scalars['String']['input'];
  clientsecert: Scalars['String']['input'];
  projectId: Scalars['Int']['input'];
  redirecturl: Scalars['String']['input'];
}>;


export type AddCommerceConfigMutation = { addCommerceConfig?: boolean | null };

export type UpdateCommerceConfigMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  platform: Scalars['String']['input'];
  apiurl: Scalars['String']['input'];
  storeid: Scalars['String']['input'];
  clientid: Scalars['String']['input'];
  clientsecert: Scalars['String']['input'];
  redirecturl: Scalars['String']['input'];
  projectId?: InputMaybe<Scalars['Int']['input']>;
}>;


export type UpdateCommerceConfigMutation = { updateCommerceConfigById?: boolean | null };

export type DeleteCommerceConfigMutationVariables = Exact<{
  projectId: Scalars['ID']['input'];
}>;


export type DeleteCommerceConfigMutation = { deleteCommerceConfigByPId?: boolean | null };

export type GetOrganizationsByUserIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetOrganizationsByUserIdQuery = { getOrganizationByUserId?: Array<{ id: string, name?: string | null, active?: boolean | null, createdAt?: string | null, updatedAt?: string | null, usergroups?: Array<{ id: string, name?: string | null }> | null }> | null };

export type GetUserGroupsByOrganizationIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUserGroupsByOrganizationIdQuery = { getUsergroupByOrganizationId?: Array<{ id: string, name?: string | null, organizationId?: string | null, members?: Array<{ userId?: string | null, usergroupId?: string | null }> | null }> | null };

export type GetUsersByUserGroupIdQueryVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type GetUsersByUserGroupIdQuery = { getUsersByUserGroupId?: Array<{ id: string, email?: string | null, firstname?: string | null, lastname?: string | null, role?: string | null }> | null };

export type GetUserProfileQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetUserProfileQuery = { userProfile?: { id: string, createdAt?: string | null, firstname?: string | null, lastname?: string | null, active?: boolean | null, email?: string | null, role?: string | null, projects?: Array<{ id: string, name?: string | null, active?: boolean | null, inProduction?: boolean | null, createdAt?: string | null }> | null, organizations?: Array<{ id: string, name?: string | null, active?: boolean | null, createdAt?: string | null, updatedAt?: string | null }> | null } | null };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { allUsers?: Array<{ id: string, email?: string | null, firstname?: string | null, lastname?: string | null, role?: string | null }> | null };

export type SearchUsersByEmailQueryVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type SearchUsersByEmailQuery = { searchUsersByEmail?: Array<{ id: string, email?: string | null, firstname?: string | null, lastname?: string | null, role?: string | null }> | null };

export type AddUserGroupMutationVariables = Exact<{
  organizationId: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  userId: Scalars['ID']['input'];
}>;


export type AddUserGroupMutation = { addUsergroup?: boolean | null };

export type DeleteUserGroupMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteUserGroupMutation = { deleteUsergroupById?: boolean | null };

export type InviteUserMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  email: Scalars['String']['input'];
  organizationId: Scalars['ID']['input'];
  userGroupId: Scalars['ID']['input'];
}>;


export type InviteUserMutation = { inviteUser?: { id: string, name?: string | null, organizationId?: string | null, members?: Array<{ userId?: string | null, usergroupId?: string | null, user?: { id: string, firstname?: string | null } | null }> | null } | null };

export type RemoveUserFromGroupMutationVariables = Exact<{
  userId: Scalars['ID']['input'];
  usergroupId: Scalars['ID']['input'];
}>;


export type RemoveUserFromGroupMutation = { deleteUserFromUserGroupById?: boolean | null };

export type UpdateUserProfileMutationVariables = Exact<{
  id: Scalars['ID']['input'];
  firstname?: InputMaybe<Scalars['String']['input']>;
  lastname?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
}>;


export type UpdateUserProfileMutation = { updateUserProfile?: boolean | null };

export type GetWorkflowsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetWorkflowsQuery = { getWorkflows?: Array<{ id: string, eta?: number | null, priority?: string | null, createdAt?: string | null, workflowStatus?: { id: string, Status_Name?: string | null, Status_Type?: string | null, colour?: string | null } | null, assignedTo?: { id: string, email?: string | null, firstname?: string | null, lastname?: string | null, role?: string | null } | null, requestedBy?: { id: string, email?: string | null, firstname?: string | null, lastname?: string | null, role?: string | null } | null, product?: { id: string, Name?: string | null, ProductMedia?: Array<{ Image_URL?: string | null, downloadURL?: string | null, altText?: string | null }> | null } | null, comments?: Array<{ id?: string | null, text?: string | null, createdAt?: string | null, user?: { id: string, firstname?: string | null, lastname?: string | null } | null }> | null }> | null };

export type GetWorkflowByIdQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetWorkflowByIdQuery = { getWorkflow?: { id: string, eta?: number | null, priority?: string | null, createdAt?: string | null, workflowStatus?: { id: string, Status_Name?: string | null, Status_Type?: string | null } | null, assignedTo?: { id: string, email?: string | null, firstname?: string | null, lastname?: string | null, role?: string | null } | null, requestedBy?: { id: string, email?: string | null, firstname?: string | null, lastname?: string | null, role?: string | null } | null, product?: { id: string, Name?: string | null, Description?: string | null, code?: string | null, leadtime?: number | null, Department?: string | null, Manufacture?: string | null, active?: boolean | null, modelCount?: number | null, ProductMedia?: Array<{ Image_URL?: string | null, downloadURL?: string | null, altText?: string | null }> | null } | null, comments?: Array<{ id?: string | null, text?: string | null, createdAt?: string | null, user?: { id: string, firstname?: string | null, lastname?: string | null } | null }> | null } | null };

export type UpdateWorkflowMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  statusId: Scalars['Int']['input'];
  userId: Scalars['Int']['input'];
  assignedTo: Scalars['Int']['input'];
  eta?: InputMaybe<Scalars['Int']['input']>;
  comments?: InputMaybe<Scalars['JSON']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  productId: Scalars['Int']['input'];
  projectId: Scalars['ID']['input'];
}>;


export type UpdateWorkflowMutation = { updateWorkflowById?: boolean | null };

export const ProductMediaFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductMediaFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductMedia"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Image_URL"}},{"kind":"Field","name":{"kind":"Name","value":"Image_Alternate_Name"}},{"kind":"Field","name":{"kind":"Name","value":"downloadURL"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"mediaFormat"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ProductMediaFieldsFragment, unknown>;
export const ObjectFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ObjectFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Object"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"ismeshable"}},{"kind":"Field","name":{"kind":"Name","value":"ProductMedium"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductMediaFields"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductMediaFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductMedia"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Image_URL"}},{"kind":"Field","name":{"kind":"Name","value":"Image_Alternate_Name"}},{"kind":"Field","name":{"kind":"Name","value":"downloadURL"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"mediaFormat"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<ObjectFieldsFragment, unknown>;
export const TextureFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"TextureFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Texture"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"thumbnails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductMediaFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ProductMedium"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"FragmentSpread","name":{"kind":"Name","value":"ProductMediaFields"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdby"}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ProductMediaFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"ProductMedia"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Image_URL"}},{"kind":"Field","name":{"kind":"Name","value":"Image_Alternate_Name"}},{"kind":"Field","name":{"kind":"Name","value":"downloadURL"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"mediaFormat"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]} as unknown as DocumentNode<TextureFieldsFragment, unknown>;
export const GetProjectTexturesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectTextures"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gettexture"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"ProductMedium"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Image_URL"}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectTexturesQuery, GetProjectTexturesQueryVariables>;
export const GetProjectObjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectObjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getObject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"ProductMedium"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Image_URL"}}]}}]}}]}}]} as unknown as DocumentNode<GetProjectObjectsQuery, GetProjectObjectsQueryVariables>;
export const DeleteTextureDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteTexture"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteTextureById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteTextureMutation, DeleteTextureMutationVariables>;
export const DeleteObjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteObject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteObjectById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteObjectMutation, DeleteObjectMutationVariables>;
export const LoginMutationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"LoginMutation"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<LoginMutationMutation, LoginMutationMutationVariables>;
export const RegisterUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authorization"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"firstname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}},{"kind":"Argument","name":{"kind":"Name","value":"authorization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authorization"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"email"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterUserMutation, RegisterUserMutationVariables>;
export const ForgotPasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ForgotPassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"forgotPassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}]}]}}]} as unknown as DocumentNode<ForgotPasswordMutation, ForgotPasswordMutationVariables>;
export const UpdatePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdatePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"password"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"confirmPassword"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"authorization"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"password"},"value":{"kind":"Variable","name":{"kind":"Name","value":"password"}}},{"kind":"Argument","name":{"kind":"Name","value":"confirmPassword"},"value":{"kind":"Variable","name":{"kind":"Name","value":"confirmPassword"}}},{"kind":"Argument","name":{"kind":"Name","value":"authorization"},"value":{"kind":"Variable","name":{"kind":"Name","value":"authorization"}}}]}]}}]} as unknown as DocumentNode<UpdatePasswordMutation, UpdatePasswordMutationVariables>;
export const GetCategoriesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCategory"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]} as unknown as DocumentNode<GetCategoriesQuery, GetCategoriesQueryVariables>;
export const GetCategoriesByProjectIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCategoriesByProjectId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getCategoryByProjectId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"createdby"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetCategoriesByProjectIdQuery, GetCategoriesByProjectIdQueryVariables>;
export const GetSubCategoriesByCategoryIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetSubCategoriesByCategoryId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getSubCategoryByCategoriesId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetSubCategoriesByCategoryIdQuery, GetSubCategoriesByCategoryIdQueryVariables>;
export const AddCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdBy"}}}]}]}}]} as unknown as DocumentNode<AddCategoryMutation, AddCategoryMutationVariables>;
export const UpdateCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UpdateCategoryById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdBy"}}}]}]}}]} as unknown as DocumentNode<UpdateCategoryMutation, UpdateCategoryMutationVariables>;
export const DeleteCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCategoryById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteCategoryMutation, DeleteCategoryMutationVariables>;
export const AddSubCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddSubCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addSubCategory"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdBy"}}},{"kind":"Argument","name":{"kind":"Name","value":"categoryId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"categoryId"}}}]}]}}]} as unknown as DocumentNode<AddSubCategoryMutation, AddSubCategoryMutationVariables>;
export const UpdateSubCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateSubCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createdBy"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UpdateSubCategoryById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"description"}}},{"kind":"Argument","name":{"kind":"Name","value":"createdBy"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createdBy"}}}]}]}}]} as unknown as DocumentNode<UpdateSubCategoryMutation, UpdateSubCategoryMutationVariables>;
export const DeleteSubCategoryDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteSubCategory"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteSubCategoryById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteSubCategoryMutation, DeleteSubCategoryMutationVariables>;
export const GetModelBySkuDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetModelBySku"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"sku"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getModelBySku"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"sku"},"value":{"kind":"Variable","name":{"kind":"Name","value":"sku"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"sku"}},{"kind":"Field","name":{"kind":"Name","value":"ProductId"}},{"kind":"Field","name":{"kind":"Name","value":"config"}}]}}]}}]} as unknown as DocumentNode<GetModelBySkuQuery, GetModelBySkuQueryVariables>;
export const GetVariantsByModelIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetVariantsByModelId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getVarientByModelId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"modelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"varientCode"}},{"kind":"Field","name":{"kind":"Name","value":"varientName"}},{"kind":"Field","name":{"kind":"Name","value":"configuration"}},{"kind":"Field","name":{"kind":"Name","value":"media"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Image_URL"}}]}}]}}]}}]} as unknown as DocumentNode<GetVariantsByModelIdQuery, GetVariantsByModelIdQueryVariables>;
export const GetProductsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProducts"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProductDetails"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"Description"}},{"kind":"Field","name":{"kind":"Name","value":"enableAr"}},{"kind":"Field","name":{"kind":"Name","value":"arDetails"}},{"kind":"Field","name":{"kind":"Name","value":"ProductStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Status_Name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ProductMedia"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Image_URL"}},{"kind":"Field","name":{"kind":"Name","value":"downloadURL"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}}]}},{"kind":"Field","name":{"kind":"Name","value":"models"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ProductStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Status_Name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"workflow"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"workflowStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Status_Name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProductsQuery, GetProductsQueryVariables>;
export const GetProductDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProductDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"prodId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProductDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"prodId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"Description"}},{"kind":"Field","name":{"kind":"Name","value":"ProductStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Status_Name"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Department"}},{"kind":"Field","name":{"kind":"Name","value":"Manufacture"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"camera"}},{"kind":"Field","name":{"kind":"Name","value":"light"}},{"kind":"Field","name":{"kind":"Name","value":"rendererSetting"}},{"kind":"Field","name":{"kind":"Name","value":"modelCount"}},{"kind":"Field","name":{"kind":"Name","value":"environmentmap"}},{"kind":"Field","name":{"kind":"Name","value":"orbitalsetting"}},{"kind":"Field","name":{"kind":"Name","value":"models"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"ProductStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Status_Name"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"Categories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"subCategories"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"ProductMedia"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Image_URL"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"downloadURL"}}]}},{"kind":"Field","name":{"kind":"Name","value":"Properties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"PropertyValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"Active"}},{"kind":"Field","name":{"kind":"Name","value":"ProductMedium"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Image_URL"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}},{"kind":"Field","name":{"kind":"Name","value":"downloadURL"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetProductDetailQuery, GetProductDetailQueryVariables>;
export const GetCustomizerProductDetailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCustomizerProductDetail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProductDetail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"camera"}},{"kind":"Field","name":{"kind":"Name","value":"Properties"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"PropertyValues"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"objects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"ProductMedium"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Image_URL"}}]}}]}}]}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"getTextureByProductID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ProductId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"ProductMedium"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Image_URL"}}]}}]}}]}}]} as unknown as DocumentNode<GetCustomizerProductDetailQuery, GetCustomizerProductDetailQueryVariables>;
export const GetStatusDetailsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetStatusDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getStatusDetails"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Status_Name"}},{"kind":"Field","name":{"kind":"Name","value":"Status_Type"}}]}}]}}]} as unknown as DocumentNode<GetStatusDetailsQuery, GetStatusDetailsQueryVariables>;
export const SoftDeleteProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"SoftDeleteProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"SoftDeleteProductById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<SoftDeleteProductMutation, SoftDeleteProductMutationVariables>;
export const DeleteProductDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProduct"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProductById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteProductMutation, DeleteProductMutationVariables>;
export const UpdateProductMetadataDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProductMetadata"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"Name"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"Description"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"Category"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"StatusId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"Department"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"Manufacture"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"code"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"subCategory"}},"type":{"kind":"ListType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UpdateProductById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"Name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"Name"}}},{"kind":"Argument","name":{"kind":"Name","value":"Description"},"value":{"kind":"Variable","name":{"kind":"Name","value":"Description"}}},{"kind":"Argument","name":{"kind":"Name","value":"Category"},"value":{"kind":"Variable","name":{"kind":"Name","value":"Category"}}},{"kind":"Argument","name":{"kind":"Name","value":"StatusId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"StatusId"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}},{"kind":"Argument","name":{"kind":"Name","value":"Department"},"value":{"kind":"Variable","name":{"kind":"Name","value":"Department"}}},{"kind":"Argument","name":{"kind":"Name","value":"Manufacture"},"value":{"kind":"Variable","name":{"kind":"Name","value":"Manufacture"}}},{"kind":"Argument","name":{"kind":"Name","value":"code"},"value":{"kind":"Variable","name":{"kind":"Name","value":"code"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"subCategory"},"value":{"kind":"Variable","name":{"kind":"Name","value":"subCategory"}}}]}]}}]} as unknown as DocumentNode<UpdateProductMetadataMutation, UpdateProductMetadataMutationVariables>;
export const RegisterProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ProductId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ProductId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ProductId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}}]}}]}}]} as unknown as DocumentNode<RegisterProjectMutation, RegisterProjectMutationVariables>;
export const RegisterProjectWithCmsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RegisterProjectWithCms"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"ProductId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"registerProjectwithCMS"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"ProductId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"ProductId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"cmsData"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<RegisterProjectWithCmsMutation, RegisterProjectWithCmsMutationVariables>;
export const GetProjectsByUserIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjectsByUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProjectByuserID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"expireDate"}},{"kind":"Field","name":{"kind":"Name","value":"organization"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}},{"kind":"Field","name":{"kind":"Name","value":"inProduction"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetProjectsByUserIdQuery, GetProjectsByUserIdQueryVariables>;
export const GetProjectsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetProjects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getProject"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}}]}}]}}]} as unknown as DocumentNode<GetProjectsQuery, GetProjectsQueryVariables>;
export const AddProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inProduction"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addProject"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"inProduction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inProduction"}}}]}]}}]} as unknown as DocumentNode<AddProjectMutation, AddProjectMutationVariables>;
export const UpdateProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"active"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"expireDate"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Date"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"inProduction"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UpdateProjectById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"active"},"value":{"kind":"Variable","name":{"kind":"Name","value":"active"}}},{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"expireDate"},"value":{"kind":"Variable","name":{"kind":"Name","value":"expireDate"}}},{"kind":"Argument","name":{"kind":"Name","value":"inProduction"},"value":{"kind":"Variable","name":{"kind":"Name","value":"inProduction"}}}]}]}}]} as unknown as DocumentNode<UpdateProjectMutation, UpdateProjectMutationVariables>;
export const DeleteProjectDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteProject"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteProjectById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteProjectMutation, DeleteProjectMutationVariables>;
export const GetCmsConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCmsConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getcmsconfigByprojectID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"cmsconfigid"}}]}}]}}]} as unknown as DocumentNode<GetCmsConfigQuery, GetCmsConfigQueryVariables>;
export const GetCommerceConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetCommerceConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getcommerceconfigByPID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"platform"}},{"kind":"Field","name":{"kind":"Name","value":"apiurl"}},{"kind":"Field","name":{"kind":"Name","value":"storeid"}},{"kind":"Field","name":{"kind":"Name","value":"clientid"}},{"kind":"Field","name":{"kind":"Name","value":"clientsecert"}},{"kind":"Field","name":{"kind":"Name","value":"redirecturl"}}]}}]}}]} as unknown as DocumentNode<GetCommerceConfigQuery, GetCommerceConfigQueryVariables>;
export const GetClientApiDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetClientApi"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getclientapiByID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"client_secret_key"}},{"kind":"Field","name":{"kind":"Name","value":"projectid"}},{"kind":"Field","name":{"kind":"Name","value":"client_key"}}]}}]}}]} as unknown as DocumentNode<GetClientApiQuery, GetClientApiQueryVariables>;
export const AddCmsConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddCmsConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cmsconfigid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addcmsconfig"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"cmsconfigid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cmsconfigid"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}]}]}}]} as unknown as DocumentNode<AddCmsConfigMutation, AddCmsConfigMutationVariables>;
export const UpdateCmsConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCmsConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"cmsconfigid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updatecmsconfigById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"cmsconfigid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"cmsconfigid"}}}]}]}}]} as unknown as DocumentNode<UpdateCmsConfigMutation, UpdateCmsConfigMutationVariables>;
export const DeleteCmsConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCmsConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deletecmsconfigByprojectId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}]}]}}]} as unknown as DocumentNode<DeleteCmsConfigMutation, DeleteCmsConfigMutationVariables>;
export const AddCommerceConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddCommerceConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"platform"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"apiurl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientsecert"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirecturl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addCommerceConfig"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"platform"},"value":{"kind":"Variable","name":{"kind":"Name","value":"platform"}}},{"kind":"Argument","name":{"kind":"Name","value":"apiurl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"apiurl"}}},{"kind":"Argument","name":{"kind":"Name","value":"storeid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeid"}}},{"kind":"Argument","name":{"kind":"Name","value":"clientid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientid"}}},{"kind":"Argument","name":{"kind":"Name","value":"clientsecert"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientsecert"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}},{"kind":"Argument","name":{"kind":"Name","value":"redirecturl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirecturl"}}}]}]}}]} as unknown as DocumentNode<AddCommerceConfigMutation, AddCommerceConfigMutationVariables>;
export const UpdateCommerceConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateCommerceConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"platform"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"apiurl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storeid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientid"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"clientsecert"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"redirecturl"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateCommerceConfigById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"platform"},"value":{"kind":"Variable","name":{"kind":"Name","value":"platform"}}},{"kind":"Argument","name":{"kind":"Name","value":"apiurl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"apiurl"}}},{"kind":"Argument","name":{"kind":"Name","value":"storeid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storeid"}}},{"kind":"Argument","name":{"kind":"Name","value":"clientid"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientid"}}},{"kind":"Argument","name":{"kind":"Name","value":"clientsecert"},"value":{"kind":"Variable","name":{"kind":"Name","value":"clientsecert"}}},{"kind":"Argument","name":{"kind":"Name","value":"redirecturl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"redirecturl"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}]}]}}]} as unknown as DocumentNode<UpdateCommerceConfigMutation, UpdateCommerceConfigMutationVariables>;
export const DeleteCommerceConfigDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteCommerceConfig"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteCommerceConfigByPId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}]}]}}]} as unknown as DocumentNode<DeleteCommerceConfigMutation, DeleteCommerceConfigMutationVariables>;
export const GetOrganizationsByUserIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetOrganizationsByUserId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOrganizationByUserId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"usergroups"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<GetOrganizationsByUserIdQuery, GetOrganizationsByUserIdQueryVariables>;
export const GetUserGroupsByOrganizationIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserGroupsByOrganizationId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsergroupByOrganizationId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"usergroupId"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserGroupsByOrganizationIdQuery, GetUserGroupsByOrganizationIdQueryVariables>;
export const GetUsersByUserGroupIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUsersByUserGroupId"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getUsersByUserGroupId"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetUsersByUserGroupIdQuery, GetUsersByUserGroupIdQueryVariables>;
export const GetUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"projects"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"inProduction"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"organizations"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]}}]} as unknown as DocumentNode<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const GetAllUsersDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allUsers"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const SearchUsersByEmailDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"SearchUsersByEmail"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"searchUsersByEmail"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<SearchUsersByEmailQuery, SearchUsersByEmailQueryVariables>;
export const AddUserGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddUserGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"name"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addUsergroup"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"name"},"value":{"kind":"Variable","name":{"kind":"Name","value":"name"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}]}]}}]} as unknown as DocumentNode<AddUserGroupMutation, AddUserGroupMutationVariables>;
export const DeleteUserGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteUserGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUsergroupById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}]}]}}]} as unknown as DocumentNode<DeleteUserGroupMutation, DeleteUserGroupMutationVariables>;
export const InviteUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"InviteUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"email"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userGroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"inviteUser"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"email"},"value":{"kind":"Variable","name":{"kind":"Name","value":"email"}}},{"kind":"Argument","name":{"kind":"Name","value":"organizationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"organizationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userGroupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userGroupId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"organizationId"}},{"kind":"Field","name":{"kind":"Name","value":"members"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"usergroupId"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}}]}}]}}]}}]}}]} as unknown as DocumentNode<InviteUserMutation, InviteUserMutationVariables>;
export const RemoveUserFromGroupDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RemoveUserFromGroup"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"usergroupId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteUserFromUserGroupById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"usergroupId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"usergroupId"}}}]}]}}]} as unknown as DocumentNode<RemoveUserFromGroupMutation, RemoveUserFromGroupMutationVariables>;
export const UpdateUserProfileDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateUserProfile"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"role"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateUserProfile"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"firstname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"firstname"}}},{"kind":"Argument","name":{"kind":"Name","value":"lastname"},"value":{"kind":"Variable","name":{"kind":"Name","value":"lastname"}}},{"kind":"Argument","name":{"kind":"Name","value":"role"},"value":{"kind":"Variable","name":{"kind":"Name","value":"role"}}}]}]}}]} as unknown as DocumentNode<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;
export const GetWorkflowsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorkflows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWorkflows"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eta"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"workflowStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Status_Name"}},{"kind":"Field","name":{"kind":"Name","value":"Status_Type"}},{"kind":"Field","name":{"kind":"Name","value":"colour"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requestedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"ProductMedia"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Image_URL"}},{"kind":"Field","name":{"kind":"Name","value":"downloadURL"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetWorkflowsQuery, GetWorkflowsQueryVariables>;
export const GetWorkflowByIdDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetWorkflowById"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getWorkflow"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"eta"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"workflowStatus"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Status_Name"}},{"kind":"Field","name":{"kind":"Name","value":"Status_Type"}}]}},{"kind":"Field","name":{"kind":"Name","value":"assignedTo"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"requestedBy"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"email"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}},{"kind":"Field","name":{"kind":"Name","value":"product"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"Name"}},{"kind":"Field","name":{"kind":"Name","value":"Description"}},{"kind":"Field","name":{"kind":"Name","value":"code"}},{"kind":"Field","name":{"kind":"Name","value":"leadtime"}},{"kind":"Field","name":{"kind":"Name","value":"Department"}},{"kind":"Field","name":{"kind":"Name","value":"Manufacture"}},{"kind":"Field","name":{"kind":"Name","value":"active"}},{"kind":"Field","name":{"kind":"Name","value":"modelCount"}},{"kind":"Field","name":{"kind":"Name","value":"ProductMedia"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"Image_URL"}},{"kind":"Field","name":{"kind":"Name","value":"downloadURL"}},{"kind":"Field","name":{"kind":"Name","value":"altText"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"comments"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"firstname"}},{"kind":"Field","name":{"kind":"Name","value":"lastname"}}]}}]}}]}}]}}]} as unknown as DocumentNode<GetWorkflowByIdQuery, GetWorkflowByIdQueryVariables>;
export const UpdateWorkflowDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateWorkflow"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"statusId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"assignedTo"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"eta"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"comments"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"JSON"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"priority"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"productId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateWorkflowById"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"statusId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"statusId"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}},{"kind":"Argument","name":{"kind":"Name","value":"assignedTo"},"value":{"kind":"Variable","name":{"kind":"Name","value":"assignedTo"}}},{"kind":"Argument","name":{"kind":"Name","value":"comments"},"value":{"kind":"Variable","name":{"kind":"Name","value":"comments"}}},{"kind":"Argument","name":{"kind":"Name","value":"eta"},"value":{"kind":"Variable","name":{"kind":"Name","value":"eta"}}},{"kind":"Argument","name":{"kind":"Name","value":"priority"},"value":{"kind":"Variable","name":{"kind":"Name","value":"priority"}}},{"kind":"Argument","name":{"kind":"Name","value":"productId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"productId"}}},{"kind":"Argument","name":{"kind":"Name","value":"projectId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"projectId"}}}]}]}}]} as unknown as DocumentNode<UpdateWorkflowMutation, UpdateWorkflowMutationVariables>;