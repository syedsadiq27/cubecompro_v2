export const LOGIN_MUTATION = `
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      token
      user {
        id
        email
        name
        role
        organizationId
        organizationName
      }
    }
  }
`;

export const ME_QUERY = `
  query Me {
    me {
      id
      email
      name
      role
      organizationId
      organizationName
    }
  }
`;

export const UPDATE_PROFILE_MUTATION = `
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      id
      email
      name
      role
      organizationId
      organizationName
    }
  }
`;

export const MY_PROJECTS_QUERY = `
  query MyProjects {
    myProjects {
      id
      name
      slug
      organizationId
      organizationName
    }
  }
`;

export const ORGANIZATION_QUERY = `
  query Organization($id: String!) {
    organization(id: $id) {
      id
      name
      slug
      createdAt
    }
  }
`;

export const ORGANIZATION_MEMBERS_QUERY = `
  query OrganizationMembers($organizationId: String!) {
    organizationMembers(organizationId: $organizationId) {
      id
      userId
      email
      name
      roleName
    }
  }
`;

export const ORGANIZATION_ROLES_QUERY = `
  query OrganizationRoles($organizationId: String!) {
    organizationRoles(organizationId: $organizationId) {
      id
      organizationId
      name
    }
  }
`;

export const LIBRARY_FOLDERS_QUERY = `
  query LibraryFolders($projectId: String!, $parentId: String) {
    libraryFolders(projectId: $projectId, parentId: $parentId) {
      id
      name
      parentId
      sortOrder
    }
  }
`;

export const MATERIAL_ASSETS_QUERY = `
  query MaterialAssets($projectId: String!) {
    materialAssets(projectId: $projectId) {
      id
      name
      code
      folderId
      documentUri
    }
  }
`;

export const TEXTURE_ASSETS_QUERY = `
  query TextureAssets($projectId: String!) {
    textureAssets(projectId: $projectId) {
      id
      name
      code
      folderId
      fileUri
    }
  }
`;

export const OBJECT_ASSETS_QUERY = `
  query ObjectAssets($projectId: String!) {
    objectAssets(projectId: $projectId) {
      id
      name
      code
      folderId
      fileUri
      fileUrl
    }
  }
`;

export const CREATE_TEXTURE_ASSET_MUTATION = `
  mutation CreateTextureAsset($input: CreateTextureAssetInput!) {
    createTextureAsset(input: $input) {
      id
      name
      code
    }
  }
`;

export const CREATE_OBJECT_ASSET_MUTATION = `
  mutation CreateObjectAsset($input: CreateObjectAssetInput!) {
    createObjectAsset(input: $input) {
      id
      name
      code
    }
  }
`;

export const DELETE_TEXTURE_ASSET_MUTATION = `
  mutation DeleteTextureAsset($id: String!) {
    deleteTextureAsset(id: $id)
  }
`;

export const DELETE_OBJECT_ASSET_MUTATION = `
  mutation DeleteObjectAsset($id: String!) {
    deleteObjectAsset(id: $id)
  }
`;

export const PRODUCTS_BY_PROJECT_QUERY = `
  query ProductsByProject($projectId: String!) {
    productsByProject(projectId: $projectId) {
      id
      name
      key
      status
      projectId
      organizationId
      activeGraphVersionId
    }
  }
`;

export const PRODUCT_QUERY = `
  query Product($id: String!) {
    product(id: $id) {
      id
      name
      key
      description
      status
      projectId
      organizationId
      activeGraphVersionId
    }
  }
`;

export const PRODUCT_GRAPH_VERSIONS_QUERY = `
  query ProductGraphVersions($productId: String!) {
    productGraphVersions(productId: $productId) {
      id
      productId
      version
      status
      graphUri
      publishedAt
    }
  }
`;

export const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      key
      projectId
      organizationId
      activeGraphVersionId
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = `
  mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
      id
      name
      key
      description
      status
      projectId
      organizationId
      activeGraphVersionId
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = `
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;

export const PUBLISH_GRAPH_VERSION_MUTATION = `
  mutation PublishGraphVersion($id: String!) {
    publishGraphVersion(id: $id) {
      id
      version
      status
      publishedAt
    }
  }
`;

export const CREATE_DRAFT_GRAPH_VERSION_MUTATION = `
  mutation CreateDraftGraphVersion(
    $productId: String!
    $sourceGraphVersionId: String
  ) {
    createDraftGraphVersion(
      productId: $productId
      sourceGraphVersionId: $sourceGraphVersionId
    ) {
      id
      version
      status
    }
  }
`;

export const DISCARD_DRAFT_GRAPH_VERSION_MUTATION = `
  mutation DiscardDraftGraphVersion($productId: String!) {
    discardDraftGraphVersion(productId: $productId)
  }
`;

export const PRODUCT_GRAPH_VERSION_DETAIL_QUERY = `
  query ProductGraphVersionDetail($id: String!) {
    productGraphVersionDetail(id: $id) {
      id
      productId
      version
      status
      graphUri
      publishedAt
      attributes {
        id
        key
        name
        type
        required
        sortOrder
        values {
          id
          key
          name
          sortOrder
        }
      }
      rules {
        id
        conditionJson
        effectJson
      }
      models {
        id
        key
        name
        assetId
        targets {
          id
          key
          targetType
          nodePath
          materialSlot
        }
      }
      visualEffects {
        id
        attributeValueId
        modelTargetId
        operation
        valueJson
      }
      variants {
        id
        provider
        externalId
        sku
        selections {
          id
          attributeId
          attributeValueId
        }
      }
    }
  }
`;

export const CREATE_PRODUCT_ATTRIBUTE_MUTATION = `
  mutation CreateProductAttribute($input: CreateProductAttributeInput!) {
    createProductAttribute(input: $input) {
      id
      key
      name
      type
    }
  }
`;

export const CREATE_ATTRIBUTE_VALUE_MUTATION = `
  mutation CreateAttributeValue($input: CreateAttributeValueInput!) {
    createAttributeValue(input: $input) {
      id
      key
      name
    }
  }
`;

export const CREATE_CONFIGURATION_RULE_MUTATION = `
  mutation CreateConfigurationRule($input: CreateConfigurationRuleInput!) {
    createConfigurationRule(input: $input) {
      id
    }
  }
`;

export const CREATE_PRODUCT_MODEL_MUTATION = `
  mutation CreateProductModel($input: CreateProductModelInput!) {
    createProductModel(input: $input) {
      id
      key
      name
    }
  }
`;

export const CREATE_MODEL_TARGET_MUTATION = `
  mutation CreateModelTarget($input: CreateModelTargetInput!) {
    createModelTarget(input: $input) {
      id
      key
    }
  }
`;

export const CREATE_VISUAL_EFFECT_MUTATION = `
  mutation CreateVisualEffect($input: CreateVisualEffectInput!) {
    createVisualEffect(input: $input) {
      id
    }
  }
`;

export const CREATE_PRODUCT_VARIANT_MUTATION = `
  mutation CreateProductVariant($input: CreateProductVariantInput!) {
    createProductVariant(input: $input) {
      id
      sku
    }
  }
`;

export const CREATE_VARIANT_SELECTION_MUTATION = `
  mutation CreateVariantSelection($input: CreateVariantSelectionInput!) {
    createVariantSelection(input: $input) {
      id
    }
  }
`;
