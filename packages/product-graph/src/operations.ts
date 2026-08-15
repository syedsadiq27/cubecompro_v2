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
      currentRevisionId
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

export const CREATE_OBJECT_ASSET_REVISION_MUTATION = `
  mutation CreateObjectAssetRevision($input: CreateObjectAssetRevisionInput!) {
    createObjectAssetRevision(input: $input) {
      id
      objectAssetId
      version
      contentHash
      format
      sizeBytes
      frozenAt
      documentUrl
    }
  }
`;

export const UPDATE_OBJECT_ASSET_STATUS_MUTATION = `
  mutation UpdateObjectAssetStatus($input: UpdateObjectAssetStatusInput!) {
    updateObjectAssetStatus(input: $input) {
      id
      name
      status
      currentRevisionId
    }
  }
`;

export const OBJECT_ASSET_REVISIONS_QUERY = `
  query ObjectAssetRevisions($objectAssetId: String!) {
    objectAssetRevisions(objectAssetId: $objectAssetId) {
      id
      objectAssetId
      version
      contentHash
      format
      sizeBytes
      frozenAt
      documentUrl
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
      activeRevisionId
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
      activeRevisionId
    }
  }
`;

export const PRODUCT_REVISIONS_QUERY = `
  query ProductRevisions($productId: String!) {
    productRevisions(productId: $productId) {
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
      activeRevisionId
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
      activeRevisionId
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = `
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;

export const PUBLISH_PRODUCT_REVISION_MUTATION = `
  mutation PublishProductRevision($id: String!) {
    publishProductRevision(id: $id) {
      id
      version
      status
      publishedAt
    }
  }
`;

export const CREATE_DRAFT_PRODUCT_REVISION_MUTATION = `
  mutation CreateDraftProductRevision(
    $productId: String!
    $sourceProductRevisionId: String
  ) {
    createDraftProductRevision(
      productId: $productId
      sourceProductRevisionId: $sourceProductRevisionId
    ) {
      id
      version
      status
    }
  }
`;

export const DISCARD_DRAFT_PRODUCT_REVISION_MUTATION = `
  mutation DiscardDraftProductRevision($productId: String!) {
    discardDraftProductRevision(productId: $productId)
  }
`;

export const PRODUCT_REVISION_DETAIL_QUERY = `
  query ProductRevisionDetail($id: String!) {
    productRevisionDetail(id: $id) {
      id
      productId
      version
      status
      graphUri
      publishedAt
      choices {
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
      constraints {
        id
        productRevisionId
        terms {
          constraintId
          choiceValueId
          choiceKey
          choiceValueKey
        }
      }
      models {
        id
        key
        name
        assetId
        objectAssetRevisionId
        linkedAssets {
          id
          role
          key
          assetRevisionId
        }
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
        choiceValueId
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
          choiceId
          choiceValueId
        }
      }
      commerceMappingSets {
        id
        provider
        identityChoices {
          choiceId
          choiceKey
          sortOrder
        }
        mappings {
          id
          identitySignature
          externalType
          externalId
          sku
          terms {
            choiceValueId
            choiceKey
            choiceValueKey
          }
        }
        domainJson
      }
    }
  }
`;

export const CREATE_CHOICE_MUTATION = `
  mutation CreateChoice($input: CreateChoiceInput!) {
    createChoice(input: $input) {
      id
      key
      name
      type
    }
  }
`;

export const SET_CHOICE_DEFAULT_MUTATION = `
  mutation SetChoiceDefault($input: SetChoiceDefaultInput!) {
    setChoiceDefault(input: $input) {
      id
      defaultValueId
    }
  }
`;

export const CREATE_CONSTRAINT_MUTATION = `
  mutation CreateConstraint($input: CreateConstraintInput!) {
    createConstraint(input: $input) {
      id
      productRevisionId
      terms {
        constraintId
        choiceValueId
        choiceKey
        choiceValueKey
      }
    }
  }
`;

export const DELETE_CONSTRAINT_MUTATION = `
  mutation DeleteConstraint($id: String!) {
    deleteConstraint(id: $id)
  }
`;

export const CONSTRAINTS_BY_REVISION_QUERY = `
  query ConstraintsByRevision($productRevisionId: String!) {
    constraintsByRevision(productRevisionId: $productRevisionId) {
      id
      productRevisionId
      terms {
        constraintId
        choiceValueId
        choiceKey
        choiceValueKey
      }
    }
  }
`;

export const DELETE_CHOICE_VALUE_MUTATION = `
  mutation DeleteChoiceValue($id: String!) {
    deleteChoiceValue(id: $id)
  }
`;

export const CREATE_CHOICE_VALUE_MUTATION = `
  mutation CreateChoiceValue($input: CreateChoiceValueInput!) {
    createChoiceValue(input: $input) {
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
      productRevisionId
      assetId
      objectAssetRevisionId
      key
      name
    }
  }
`;

export const UPDATE_PRODUCT_MODEL_REVISION_MUTATION = `
  mutation UpdateProductModelRevision($input: UpdateProductModelRevisionInput!) {
    updateProductModelRevision(input: $input) {
      id
      productRevisionId
      assetId
      objectAssetRevisionId
      key
      name
    }
  }
`;

export const CREATE_PRODUCT_MODEL_LINKED_ASSET_MUTATION = `
  mutation CreateProductModelLinkedAsset($input: CreateProductModelLinkedAssetInput!) {
    createProductModelLinkedAsset(input: $input) {
      id
      productModelId
      role
      key
      assetRevisionId
    }
  }
`;

export const UPDATE_PRODUCT_MODEL_LINKED_ASSET_MUTATION = `
  mutation UpdateProductModelLinkedAsset($input: UpdateProductModelLinkedAssetInput!) {
    updateProductModelLinkedAsset(input: $input) {
      id
      productModelId
      role
      key
      assetRevisionId
    }
  }
`;

export const DELETE_PRODUCT_MODEL_LINKED_ASSET_MUTATION = `
  mutation DeleteProductModelLinkedAsset($id: String!) {
    deleteProductModelLinkedAsset(id: $id)
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

export const UPDATE_VISUAL_EFFECT_MUTATION = `
  mutation UpdateVisualEffect($input: UpdateVisualEffectInput!) {
    updateVisualEffect(input: $input) {
      id
      valueJson
      operation
    }
  }
`;

export const DELETE_VISUAL_EFFECT_MUTATION = `
  mutation DeleteVisualEffect($id: String!) {
    deleteVisualEffect(id: $id)
  }
`;

export const REPLACE_COMMERCE_MAPPING_SET_MUTATION = `
  mutation ReplaceCommerceMappingSet($input: ReplaceCommerceMappingSetInput!) {
    replaceCommerceMappingSet(input: $input) {
      id
      productRevisionId
      provider
      identityChoices {
        choiceId
        choiceKey
        sortOrder
      }
      mappings {
        id
        identitySignature
        externalType
        externalId
        sku
        terms {
          choiceValueId
          choiceKey
          choiceValueKey
        }
      }
      domainJson
    }
  }
`;

export const COMMERCE_MAPPING_SETS_BY_REVISION_QUERY = `
  query CommerceMappingSetsByRevision($productRevisionId: String!) {
    commerceMappingSetsByRevision(productRevisionId: $productRevisionId) {
      id
      productRevisionId
      provider
      identityChoices {
        choiceId
        choiceKey
        sortOrder
      }
      mappings {
        id
        identitySignature
        externalType
        externalId
        sku
        terms {
          choiceValueId
          choiceKey
          choiceValueKey
        }
      }
      domainJson
    }
  }
`;

export const DELETE_COMMERCE_MAPPING_SET_MUTATION = `
  mutation DeleteCommerceMappingSet($id: String!) {
    deleteCommerceMappingSet(id: $id)
  }
`;

export const RESOLVE_COMMERCE_QUERY = `
  query ResolveCommerce($input: ResolveCommerceInput!) {
    resolveCommerce(input: $input) {
      status
      provider
      externalReference {
        type
        id
        sku
      }
      identitySignature
      identityJson
    }
  }
`;

export const SHOPIFY_CONNECTIONS_QUERY = `
  query ShopifyConnections($organizationId: String!) {
    shopifyConnections(organizationId: $organizationId) {
      id
      organizationId
      provider
      externalAccountId
      displayName
      apiVersion
      hasAccessToken
    }
  }
`;

export const START_SHOPIFY_OAUTH_MUTATION = `
  mutation StartShopifyOAuth($input: ShopifyOAuthStartInput!) {
    startShopifyOAuth(input: $input) {
      authorizeUrl
    }
  }
`;

export const DISCONNECT_SHOPIFY_MUTATION = `
  mutation DisconnectShopify($input: DisconnectShopifyInput!) {
    disconnectShopify(input: $input)
  }
`;

export const SHOPIFY_CATALOG_PRODUCTS_QUERY = `
  query ShopifyCatalogProducts(
    $organizationId: String!
    $query: String
    $integrationConnectionId: String
  ) {
    shopifyCatalogProducts(
      organizationId: $organizationId
      query: $query
      integrationConnectionId: $integrationConnectionId
    ) {
      id
      title
      handle
      status
      options
      variantCount
    }
  }
`;

export const PREVIEW_SHOPIFY_PRODUCT_IMPORT_QUERY = `
  query PreviewShopifyProductImport($input: PreviewShopifyImportInput!) {
    previewShopifyProductImport(input: $input) {
      connectionId
      shop
      productName
      identityChoiceKeys
      identityChoiceNames
      mappedCount
      unmappedCount
      reviewJson
    }
  }
`;

export const IMPORT_SHOPIFY_PRODUCT_MUTATION = `
  mutation ImportShopifyProduct($input: ImportShopifyProductInput!) {
    importShopifyProduct(input: $input) {
      productId
      productRevisionId
      integrationConnectionId
      externalProductId
      identityChoiceKeys
      mappingCount
      commerceMappingSetId
    }
  }
`;

export const PRODUCT_SHOPIFY_COMMERCE_QUERY = `
  query ProductShopifyCommerce($productId: String!, $organizationId: String!) {
    productShopifyCommerce(
      productId: $productId
      organizationId: $organizationId
    ) {
      shop
      displayName
      externalProductId
      identityChoiceKeys
      identityChoiceNames
      mappedCount
      unmappedCount
      rows {
        label
        status
        sku
        externalId
      }
    }
  }
`;

export const SHOPIFY_IMPORT_PROOF_QUERY = `
  query ShopifyImportProof($productId: String!, $organizationId: String!) {
    shopifyImportProof(productId: $productId, organizationId: $organizationId) {
      productId
      productRevisionId
      productName
      choices {
        key
        name
        values {
          key
          name
        }
      }
      identityChoiceNames
      mappingCount
      constraintCount
      resolutions {
        label
        status
        externalId
        sku
      }
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


/** @deprecated Use PRODUCT_REVISIONS_QUERY */
export const PRODUCT_GRAPH_VERSIONS_QUERY = PRODUCT_REVISIONS_QUERY;
/** @deprecated Use PUBLISH_PRODUCT_REVISION_MUTATION */
export const PUBLISH_GRAPH_VERSION_MUTATION = PUBLISH_PRODUCT_REVISION_MUTATION;
/** @deprecated Use CREATE_DRAFT_PRODUCT_REVISION_MUTATION */
export const CREATE_DRAFT_GRAPH_VERSION_MUTATION = CREATE_DRAFT_PRODUCT_REVISION_MUTATION;
/** @deprecated Use DISCARD_DRAFT_PRODUCT_REVISION_MUTATION */
export const DISCARD_DRAFT_GRAPH_VERSION_MUTATION = DISCARD_DRAFT_PRODUCT_REVISION_MUTATION;
/** @deprecated Use PRODUCT_REVISION_DETAIL_QUERY */
export const PRODUCT_GRAPH_VERSION_DETAIL_QUERY = PRODUCT_REVISION_DETAIL_QUERY;
/** @deprecated Use CREATE_CHOICE_MUTATION */
export const CREATE_PRODUCT_ATTRIBUTE_MUTATION = CREATE_CHOICE_MUTATION;
/** @deprecated Use SET_CHOICE_DEFAULT_MUTATION */
export const SET_PRODUCT_ATTRIBUTE_DEFAULT_MUTATION = SET_CHOICE_DEFAULT_MUTATION;
/** @deprecated Use DELETE_CHOICE_VALUE_MUTATION */
export const DELETE_ATTRIBUTE_VALUE_MUTATION = DELETE_CHOICE_VALUE_MUTATION;
/** @deprecated Use CREATE_CHOICE_VALUE_MUTATION */
export const CREATE_ATTRIBUTE_VALUE_MUTATION = CREATE_CHOICE_VALUE_MUTATION;
