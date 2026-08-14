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
      documentUrl
    }
  }
`;

export const CREATE_MATERIAL_ASSET_MUTATION = `
  mutation CreateMaterialAsset($input: CreateMaterialAssetInput!) {
    createMaterialAsset(input: $input) {
      id
      name
      code
      documentUrl
    }
  }
`;

export const UPDATE_MATERIAL_ASSET_MUTATION = `
  mutation UpdateMaterialAsset($input: UpdateMaterialAssetInput!) {
    updateMaterialAsset(input: $input) {
      id
      name
      code
      documentUrl
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
      format
      sizeBytes
      purpose
      status
      metadataVersion
      nodeCount
      meshCount
      materialCount
      animationCount
      metadataUrl
    }
  }
`;

export const OBJECT_ASSET_QUERY = `
  query ObjectAsset($id: String!) {
    objectAsset(id: $id) {
      id
      name
      code
      fileUri
      fileUrl
      format
      sizeBytes
      purpose
      status
      metadataVersion
      nodeCount
      meshCount
      materialCount
      animationCount
      metadataUrl
    }
  }
`;

export const CREATE_OBJECT_ASSET_MUTATION = `
  mutation CreateObjectAsset($input: CreateObjectAssetInput!) {
    createObjectAsset(input: $input) {
      id
      name
      code
      status
      metadataUrl
      nodeCount
      meshCount
      materialCount
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

export const TENANTS_QUERY = `
  query Tenants {
    tenants {
      id
      name
      slug
      status
      trialEndsAt
      memberCount
      planId
      planName
      planKey
    }
  }
`;

export const TENANT_USERS_QUERY = `
  query TenantUsers {
    tenantUsers {
      id
      userId
      email
      name
      roleName
      organizationId
      organizationName
      planName
    }
  }
`;

export const PLANS_QUERY = `
  query Plans {
    plans {
      id
      key
      name
      parentPlanId
      parentName
      entitlements {
        id
        key
        kind
        value
      }
    }
  }
`;

export const ENTITLEMENT_CATALOG_QUERY = `
  query EntitlementCatalog {
    entitlementCatalog {
      applications { id label gate }
      capabilities { key shortKey label application }
      limits { key shortKey label application unit }
    }
  }
`;

export const RESOLVED_ACCESS_QUERY = `
  query ResolvedAccess($organizationId: String!) {
    resolvedAccess(organizationId: $organizationId) {
      organizationId
      organizationName
      slug
      status
      trialEndsAt
      planId
      planName
      planKey
      parentPlanName
      capabilities {
        key
        shortKey
        application
        kind
        value
        baseValue
        enabled
        source
        label
      }
      limits {
        key
        shortKey
        application
        kind
        value
        baseValue
        enabled
        limit
        used
        source
        label
      }
      applications {
        id
        label
        gate
        enabled
        source
      }
      overrides {
        id
        key
        kind
        value
      }
      members {
        id
        userId
        email
        name
        roleName
      }
    }
  }
`;

export const AUDIT_EVENTS_QUERY = `
  query AuditEvents($organizationId: String) {
    auditEvents(organizationId: $organizationId) {
      id
      actorEmail
      action
      organizationId
      targetType
      targetId
      summary
      metadata
      createdAt
    }
  }
`;

export const CAN_QUERY = `
  query Can($organizationId: String!, $key: String!) {
    can(organizationId: $organizationId, key: $key)
  }
`;

export const ASSIGN_PLAN_MUTATION = `
  mutation AssignPlan($organizationId: String!, $planId: String!) {
    assignPlan(organizationId: $organizationId, planId: $planId) {
      organizationId
      planName
    }
  }
`;

export const SET_TENANT_STATUS_MUTATION = `
  mutation SetTenantStatus(
    $organizationId: String!
    $status: OrganizationStatus!
    $trialEndsAt: DateTime
  ) {
    setTenantStatus(
      organizationId: $organizationId
      status: $status
      trialEndsAt: $trialEndsAt
    ) {
      organizationId
      status
    }
  }
`;

export const UPSERT_OVERRIDE_MUTATION = `
  mutation UpsertOverride($input: UpsertOverrideInput!) {
    upsertOverride(input: $input) {
      organizationId
    }
  }
`;

export const DELETE_OVERRIDE_MUTATION = `
  mutation DeleteOverride($organizationId: String!, $key: String!) {
    deleteOverride(organizationId: $organizationId, key: $key) {
      organizationId
    }
  }
`;

export const CREATE_TENANT_MUTATION = `
  mutation CreateTenant($input: CreateTenantInput!) {
    createTenant(input: $input) {
      organizationId
    }
  }
`;

export const UPDATE_TENANT_MUTATION = `
  mutation UpdateTenant($organizationId: String!, $input: UpdateTenantInput!) {
    updateTenant(organizationId: $organizationId, input: $input) {
      organizationId
    }
  }
`;

export const CREATE_PLAN_MUTATION = `
  mutation CreatePlan($input: CreatePlanInput!) {
    createPlan(input: $input) {
      id
    }
  }
`;

export const UPDATE_PLAN_MUTATION = `
  mutation UpdatePlan($planId: String!, $input: UpdatePlanInput!) {
    updatePlan(planId: $planId, input: $input) {
      id
    }
  }
`;

export const LEAD_FUNNEL_STATUSES_QUERY = `
  query LeadFunnelStatuses {
    leadFunnelStatuses {
      id
      email
      submittedAt
      status
    }
  }
`;

export const SET_LEAD_FUNNEL_STATUS_MUTATION = `
  mutation SetLeadFunnelStatus(
    $email: String!
    $submittedAt: String!
    $status: String!
  ) {
    setLeadFunnelStatus(
      email: $email
      submittedAt: $submittedAt
      status: $status
    ) {
      id
      email
      submittedAt
      status
    }
  }
`;

export const PLATFORM_SETTINGS_QUERY = `
  query PlatformSettings($app: String) {
    platformSettings(app: $app) {
      id
      app
      key
      value
      updatedAt
    }
  }
`;

export const UPSERT_PLATFORM_SETTINGS_MUTATION = `
  mutation UpsertPlatformSettings($input: [UpsertPlatformSettingInput!]!) {
    upsertPlatformSettings(input: $input) {
      id
      app
      key
      value
      updatedAt
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
