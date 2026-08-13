Yes. Here is the full CubeCom model I would lock now across database, backend, backoffice, 3D editor, storage, and runtime.

The core rule remains:

```text
Organization
→ Project
→ Product
→ ProductGraphVersion
→ ConfigurationState
→ ResolvedConfiguration
```

Everything else is either authoring, reusable assets, or a projection of that configuration into 3D, decoration, commerce, SDK/embed, or analytics.

The platform should behave like one system even if the subsystems are technically separate.

```text
                         BACKOFFICE
                             │
                             ▼
                         PRODUCT
                             │
                    ProductGraphVersion
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
     Attributes            Rules           Configuration
         │                                       │
         └───────────────────┬───────────────────┘
                             ▼
                          Resolver
                             │
             ┌───────────────┼────────────────┐
             ▼               ▼                ▼
            3D          Decorations        Commerce
             │               │                │
             └───────────────┼────────────────┘
                             ▼
                     Experience Runtime
                             │
                  SDK / Embed / Storefront
```

## 1. Tenancy

Tenant is `Organization`.

```text
Organization
├── Members
├── Roles / Permissions
├── Entitlements
├── Projects
└── Library
```

Database:

```ts
Organization {
  id
  name
  key
  status
  createdAt
  updatedAt
}

Project {
  id
  organizationId
  name
  key
  status
}

OrganizationMembership {
  organizationId
  userId
  roleId
}

Role
Permission
RolePermission
OrganizationEntitlement
```

Every tenant-owned entity should either have `organizationId` directly or be unambiguously reachable through an organization-owned parent.

Do not allow cross-org asset or product references accidentally.

RBAC answers:

```text
Can this actor perform this action?
```

Entitlements answer:

```text
Does this organization have this capability?
```

Keep them separate.

Example entitlements:

```text
maxProjects
maxUsers
publicEmbedEnabled
materialsEnabled
decorationsEnabled
commerceAdapters[]
analyticsEnabled
```

Billing can come later.

---

# 2. Product

`Product` is the stable business identity.

```ts
Product {
  id
  organizationId
  projectId

  key
  name
  description?
  status

  activeGraphVersionId?

  createdAt
  updatedAt
}
```

Do not put all configuration logic directly on `Product`.

Instead:

```text
Product
  ↓
ProductGraphVersion
```

`ProductGraphVersion` is the actual configurable definition.

```ts
ProductGraphVersion {
  id
  productId

  version
  status // DRAFT | PUBLISHED | ARCHIVED

  graphUri?
  graphSha256?

  createdAt
  publishedAt?
}
```

Draft versions are relational and editable.

Published versions are immutable.

Publishing should:

```text
draft relational graph
→ validate
→ serialize canonical graph JSON
→ calculate sha256
→ upload snapshot to GCS
→ mark version PUBLISHED
→ set Product.activeGraphVersionId
```

That gives you reproducibility.

A configuration created against v3 should never silently resolve against v7.

---

# 3. Attributes and values

The product graph defines what can be configured.

Use:

```text
ProductAttribute
AttributeValue
```

rather than `Property`.

Example:

```text
Studio Chair

Attributes
├── Color
│   ├── Black
│   └── White
├── Size
│   ├── L
│   └── XL
├── Frame
│   ├── Walnut
│   └── Oak
└── Backrest
    ├── Yes
    └── No
```

Database:

```ts
ProductAttribute {
  id
  graphVersionId

  key
  name

  type
  required
  sortOrder

  defaultValueId?
  metadata?
}
```

Types:

```text
SELECT
MULTI_SELECT
BOOLEAN
NUMBER
TEXT
```

`AttributeValue` is only necessary for enumerable types.

```ts
AttributeValue {
  id
  attributeId

  key
  name

  sortOrder
  metadata?
}
```

So:

```text
Size = XL
```

uses an `AttributeValue`.

But:

```text
Width = 140
Engraving = "Sadiq"
Quantity = 4
Armrest = true
```

can be typed scalar values directly in configuration state.

---

# 4. Configuration state

`ConfigurationState` is not a database entity.

It is a runtime value object.

```ts
ConfigurationState {
  productId
  graphVersionId

  selections: {
    color: "black",
    size: "xl",
    frame: "walnut",
    backrest: "yes",
    width: 140
  }
}
```

The central rule:

```text
runtime state
→ resolve freely
→ persist only at meaningful boundaries
```

Do not write to Postgres on every click.

---

# 5. Rules

Rules belong to the product graph.

Examples:

```text
Material = Leather
→ Color cannot be White
```

```text
Size = XL
→ Frame must be Large
```

```text
Backrest = Premium AND Size = XL
→ Premium XL backrest component required
```

Database:

```ts
ConfigurationRule {
  id
  graphVersionId

  name?
  condition
  effect
  priority?
  enabled
}
```

For v1, JSON DSL is fine.

Conceptually:

```json
{
  "when": {
    "all": [
      { "eq": ["material", "leather"] }
    ]
  },
  "then": {
    "forbid": {
      "attribute": "color",
      "value": "white"
    }
  }
}
```

But merchants should never primarily edit raw JSON.

Backoffice renders:

```text
When
Material is Leather

Then
Color cannot be White
```

JSON is execution format, not merchant UX.

---

# 6. Resolver

The resolver is the heart of CubeCom.

Input:

```text
ProductGraphVersion
+
ConfigurationState
```

Output:

```ts
ResolvedConfiguration {
  valid
  violations

  selections

  threeD
  decorations
  commerce
}
```

Flow:

```text
ConfigurationState
       ↓
Normalize defaults
       ↓
Validate types
       ↓
Evaluate rules
       ↓
Resolve visual effects
       ↓
Resolve decoration state
       ↓
Resolve commerce
       ↓
ResolvedConfiguration
```

This should remain provider-agnostic.

---

# 7. Library

Library is reusable organization-owned content.

It is not product configuration.

```text
Organization
└── Library
    ├── 3D
    ├── Appearance
    ├── Decoration
    ├── Scene
    └── Media
```

Recommended asset taxonomy:

```text
OBJECT
MATERIAL
TEXTURE
COLOR
IMAGE
VECTOR
FONT
ENVIRONMENT
VIDEO
ANIMATION
```

Do not create 40 database types.

Use one common asset identity:

```ts
LibraryAsset {
  id
  organizationId
  folderId?

  type
  key
  name

  status

  thumbnailUri?
  metadata?

  createdAt
  updatedAt
}
```

Folders:

```ts
LibraryFolder {
  id
  organizationId
  parentId?

  name
  sortOrder
}
```

Then typed detail tables.

---

# 8. 3D objects

A 3D object is a reusable GLB/GLTF asset.

```ts
ObjectAsset {
  assetId

  objectUri
  format

  sha256
  sizeBytes

  parsedMetadataUri?

  nodeCount?
  meshCount?
  materialCount?
  animationCount?

  purpose // MODEL | COMPONENT
}
```

Examples:

```text
Studio Chair.glb
Premium Headrest.glb
Caster Set.glb
Armrest.glb
```

`MODEL` = primary/full model.

`COMPONENT` = reusable piece.

No separate database concept is strictly necessary for components.

---

# 9. GLB parsing

On upload:

```text
Upload
→ GCS
→ parse GLB
→ extract hierarchy
→ extract meshes
→ extract material slots
→ extract animations
→ generate metadata
→ generate thumbnail
→ mark asset READY
```

Parsed structure might contain:

```json
{
  "nodes": [
    {
      "name": "Backrest_001",
      "path": "Chair/Backrest_001",
      "type": "mesh",
      "materialSlots": [0]
    }
  ]
}
```

You can store the large parsed metadata JSON in GCS:

```text
gs://.../objects/{assetId}/metadata/v1.json
```

Postgres stores:

```text
metadataUri
metadataVersion
metadataSha256
```

The database should not become a dump of arbitrary model JSON.

---

# 10. Textures

Textures are reusable image assets.

```ts
TextureAsset {
  assetId

  imageUri
  sha256

  width
  height

  colorSpace?
  defaultUsage?
}
```

Suggested usage:

```text
BASE_COLOR
NORMAL
ROUGHNESS
METALLIC
AO
HEIGHT
EMISSIVE
OPACITY
```

But don't permanently bind a texture to one role.

A texture can be reused.

Actual usage belongs to the material.

---

# 11. Materials

Materials should absolutely be first-class Library assets.

```ts
MaterialAsset {
  assetId

  shaderModel // PBR

  baseColor?
  baseColorTextureId?

  normalTextureId?
  roughnessTextureId?
  metallicTextureId?
  aoTextureId?
  emissiveTextureId?
  opacityTextureId?

  roughness?
  metallic?
  opacity?

  doubleSided?
  metadata?
}
```

Example:

```text
Walnut Wood

Base color       #8A6040
Base map         walnut-albedo
Normal map       walnut-normal
Roughness map    walnut-roughness
Roughness        0.55
```

Material editor belongs inside 3D Studio / Library material editor.

Product page should consume materials, not author PBR details.

---

# 12. Colors

Colors can be reusable Library assets too.

```ts
ColorAsset {
  assetId

  value // #111111
  alpha?
  colorSpace?
}
```

Example:

```text
Jet Black
#111111
```

Why first-class?

Because the same organization may reuse brand colors across:

```text
3D materials
Decoration
Product option swatches
Image generation
Artwork
Marketing previews
```

---

# 13. Other Library assets

Decoration:

```text
IMAGE
VECTOR
FONT
```

Examples:

```text
logo.png
logo.svg
Montserrat.ttf
```

Scene:

```text
ENVIRONMENT
```

Example:

```text
studio-soft.hdr
warehouse.exr
```

Media:

```text
IMAGE
VIDEO
```

Animation:

```text
ANIMATION
```

This can be either embedded in an object asset or reusable external animation data later.

---

# 14. GCS storage convention

I would use organization-scoped paths.

Example:

```text
gs://{env}-cubecom-assets/
  organizations/
    {organizationId}/
      library/
        objects/
          {assetId}/
            source/model.glb
            metadata/v1.json
            thumbnails/preview.webp

        textures/
          {assetId}/
            source/texture.png
            thumbnails/preview.webp

        materials/
          {assetId}/
            material/v1.json

        environments/
          {assetId}/
            source/studio.hdr

        artwork/
          {assetId}/
            source/logo.svg

      projects/
        {projectId}/
          products/
            {productId}/
              graph/
                v1/graph.json
                v2/graph.json

              configurations/
                {savedConfigurationId}/state.json
```

The exact folder names are less important than these constraints:

```text
env isolated
org isolated
assets immutable/versionable
DB stores URI + version + sha256
```

Do not derive authorization from bucket path alone.

Postgres is authority for ownership.

---

# 15. Product model

A product references Library object assets through `ProductModel`.

```ts
ProductModel {
  id
  graphVersionId

  assetId

  key
  name

  role // PRIMARY | COMPONENT
  sortOrder
}
```

A chair might have:

```text
Primary Chair
→ ObjectAsset StudioChair.glb
```

Optional:

```text
Premium Headrest
→ ObjectAsset Headrest.glb
```

---

# 16. Semantic model targets

Do not bind product attributes directly to raw GLTF node names.

Create semantic targets.

Example raw model:

```text
Chair
├── Seat_04
├── Backrest_001
├── Frame_L
└── Armrest_A
```

CubeCom targets:

```text
seat
backrest
frame
armrest
frame.material
body.material
```

Database:

```ts
ModelTarget {
  id
  productModelId

  key
  name

  targetType
  nodePath?
  materialSlot?
  metadata?
}
```

Target types:

```text
MESH
VISIBILITY
MATERIAL_SLOT
TRANSFORM
COMPONENT
MORPH
```

This protects your product graph from asset changes.

If an artist changes:

```text
Backrest_001
→ Chair_Backrest_v12
```

you only remap the semantic target.

Product rules remain intact.

---

# 17. Visual effects

Visual effects define how configuration affects 3D.

Important:

```text
one attribute value
→ many effects
```

Example:

```text
Backrest = Premium
→ show premiumBackrest
→ hide standardBackrest
→ set premiumBackrest material
→ show support bracket
```

Model:

```ts
VisualEffect {
  id
  graphVersionId

  triggerType
  triggerReference

  targetId
  operation

  value
  priority?
}
```

Operations initially:

```text
SET_VISIBILITY
SET_MATERIAL
SET_MODEL
SET_TRANSFORM
```

Later:

```text
SET_TEXTURE
SET_MORPH
PLAY_ANIMATION
ATTACH_COMPONENT
```

Example:

```text
Backrest = No
→ target backrest
→ SET_VISIBILITY false
```

---

# 18. 3D Studio responsibility

This is important.

Do not make 3D Studio another backoffice.

3D Studio owns:

```text
model inspection
scene hierarchy
mesh selection
transforms
materials
textures
material slots
semantic targets
visual effects
camera
environment
3D preview
```

Product page owns:

```text
attributes
values
business rules
commerce
product identity
publishing
```

Studio consumes attributes so it can map them visually.

Example Studio workflow:

```text
Select Backrest mesh
→ Create semantic target "backrest"
→ Attribute Backrest
→ Value No
→ Action Hide
→ Target backrest
→ Preview
```

That is the killer path.

---

# 19. 3D Studio UI

I would structure Studio:

```text
┌───────────────┬─────────────────────────┬───────────────────┐
│ Scene         │                         │ Inspector         │
│               │                         │                   │
│ Primary Chair │       3D VIEWPORT       │ Selected:        │
│ ├ Backrest    │                         │ Backrest          │
│ ├ Seat        │                         │                   │
│ ├ Frame       │                         │ Transform         │
│ └ Arms        │                         │ Material          │
│               │                         │ Target            │
│ Materials     │                         │ Behaviors         │
└───────────────┴─────────────────────────┴───────────────────┘
```

When `Backrest` is selected:

```text
BACKREST

Model
Backrest_001

Material
Walnut

Semantic target
backrest

Configuration behaviors

Backrest = Yes
→ Show

Backrest = No
→ Hide

+ Add behavior
```

Do not show Commerce, Pricing, Rules, Decorations as generic inspector sections.

---

# 20. Product page

Product page is the merchant control center.

Example:

```text
Studio Chair
CHAIR-01

[ General ] [ Options ] [ 3D ] [ Decorations ] [ Commerce ] [ Rules ]
```

Overview:

```text
Options
4 attributes · 7 values

3D
1 model · 3 semantic targets · 5 mappings

Decorations
2 regions · 1 method

Commerce
commercetools · 8 variants

Published
v4
```

The merchant mental model is:

```text
Create product
→ define configuration
→ prepare 3D
→ map visual behavior
→ commerce
→ preview
→ publish
```

Do not expose graph IDs and internal DSL unless in debug/developer mode.

---

# 21. Product Options UI

Merchant sees:

```text
OPTIONS

Color                         Required
● Black
○ White
+ Add value

Size                          Required
L
XL

Frame                         Required
Walnut
Oak

Backrest                      Required
Yes
No
```

Not:

```text
Color (color · SELECT · required)
```

That belongs in developer/admin details.

---

# 22. Product 3D tab

Do not duplicate Studio.

Make it a summary/launch surface.

```text
3D EXPERIENCE

Primary model
Studio Chair.glb

18 meshes
4 material slots
3 semantic targets
5 configuration mappings

Ready ✓

[ Open 3D Studio ]
```

Also show mapping summary:

```text
Frame
2 mappings

Backrest
2 mappings

Color
2 mappings
```

Editing happens in Studio.

---

# 23. Commerce

Commerce remains a projection.

```text
ConfigurationState
→ CommerceResolver
→ ResolvedCommerceState
```

Do not make commerce variants define CubeCom configuration.

Model optional provider variants:

```ts
ProductVariant {
  id
  graphVersionId

  provider
  externalProductId?
  externalVariantId?
  sku?
}
```

Mapping:

```ts
VariantSelection {
  variantId
  attributeId
  attributeValueId
}
```

Example:

```text
Color=Black
Size=XL
Frame=Walnut

→ variant SKU CH-BLK-XL-WAL
```

But variants are optional.

For complex products:

```text
ConfigurationState
→ provider adapter
→ dynamically resolved reference
```

`ResolvedCommerceState`:

```ts
ResolvedCommerceState {
  provider

  productReference?
  variantReference?
  sku?

  price?
  currency?

  inventory?

  cartPayload?
}
```

Provider adapters:

```text
commercetools
Shopify
BigCommerce
Custom
```

The adapter understands the provider.

The core doesn't.

---

# 24. Decorations

Decorations should not become a parallel product model.

If shopper configuration contains:

```text
Decoration Location = Front
Decoration Method = Embroidery
Artwork = Logo
```

those selections participate in the same `ConfigurationState`.

Decoration-specific data can live in its own domain:

```text
DecorationRegion
DecorationMethod
DecorationBinding
ArtworkPlacement
```

But it consumes:

```text
ProductGraphVersion
ConfigurationState
Library Assets
```

Same platform, not another isolated system.

---

# 25. Saved configurations

Persist only at meaningful boundaries:

```text
Save
Share
Add to cart
Quote
Order handoff
```

Model:

```ts
SavedConfiguration {
  id

  organizationId
  projectId
  productId
  graphVersionId

  stateUri
  stateSha256

  createdAt
  expiresAt?

  metadata?
}
```

Storage:

```text
GCS:
.../configurations/{id}/state.json
```

DB:

```text
uri
sha256
graphVersionId
ownership
timestamps
```

Public URL:

```text
/config/{savedConfigurationId}
```

Never serialize a giant configuration into the URL.

---

# 26. Public embed/security

Two credential planes.

Management:

```text
backoffice
3D Studio
admin API
```

Uses authenticated users / service credentials.

Public experience:

```text
SDK
embed
storefront
```

Uses project-scoped publishable keys or signed experience tokens.

Scopes might be:

```text
read:published-product
resolve
read:asset
save:configuration
```

Never expose management secrets in browser code.

---

# 27. Backend modules

Nest modular monolith:

```text
apps/api

AuthModule
OrganizationModule
ProjectModule
ProductModule
ProductGraphModule
ConfigurationModule
ResolverModule

LibraryModule
AssetProcessingModule
MaterialModule

ThreeDModule
DecorationModule

CommerceModule
CommerceAdapterModule

EmbedModule
SavedConfigurationModule

PublishModule
```

Don't split into microservices yet.

You can later extract heavy workers.

---

# 28. Background processing

Some operations should be async:

```text
GLB parsing
thumbnail generation
image processing
vector analysis
video processing
environment conversion
potential mesh optimization
```

Architecture:

```text
Nest API
  ↓
Job queue
  ↓
Worker
  ↓
GCS + Postgres update
```

Redis can be introduced when you actually add a queue/cache requirement.

Don't add it simply because architecture diagrams usually contain Redis.

---

# 29. Database vs GCS

This boundary should be strict.

Use PostgreSQL for:

```text
identity
relationships
ownership
metadata
permissions
statuses
attributes
values
rules
model targets
visual effect mappings
commerce mappings
versions
references
```

Use GCS for:

```text
GLB/GLTF
textures
images
vectors
fonts
HDR/EXR
videos
published graph JSON
saved configuration JSON
parsed GLB metadata
generated previews
thumbnails
large scene/config blobs
```

Simple heuristic:

```text
Needs relational query / integrity?
→ Postgres

Large immutable/blob/document?
→ GCS
```

Do not use Postgres JSONB as your object store.

Small structured JSON fields for DSLs/metadata are fine.

---

# 30. Draft vs publish

This needs to be consistent everywhere.

Draft:

```text
relational
editable
mutable
```

Published:

```text
validated
canonical snapshot
immutable
content-addressed
```

Flow:

```text
Draft v5
↓
validate references
validate target nodes
validate required attributes
validate rules
validate visual mappings
validate commerce mappings
↓
serialize
↓
sha256
↓
GCS
↓
PUBLISHED v5
```

Then:

```text
Edit configuration
→ create Draft v6
```

Never mutate published v5.

---

# 31. Publish validation

Before publish, verify at minimum:

```text
required attributes have defaults or valid selection behavior
attribute keys unique
attribute values valid
rules reference existing attributes/values
product models exist
GCS assets exist
semantic targets reference valid model nodes
visual effects reference valid targets
material assets exist
commerce mappings don't reference deleted values
variant mappings don't conflict
no cross-org references
```

Warnings can include:

```text
unmapped visual attribute
unused asset
unmapped commerce combination
missing thumbnail
```

---

# 32. Backoffice navigation

I would converge toward:

```text
CATALOG
Products
Categories

LIBRARY
Assets
Materials
Colors
Textures
Environments

COMMERCE
Connections
Mappings
Pricing

EXPERIENCE
3D
Decorations
SDK / Embed

OPERATIONS
Analytics

PLATFORM
Integrations
Settings
```

But don't duplicate product-specific authoring in global navigation.

Global Library manages reusable assets.

Product screens manage how those assets apply to one product.

---

# 33. End-to-end chair example

Merchant creates:

```text
Studio Chair
```

Adds attributes:

```text
Color
→ Black
→ White

Frame
→ Walnut
→ Oak

Backrest
→ Yes
→ No

Size
→ L
→ XL
```

Uploads to Library:

```text
StudioChair.glb
Walnut Material
Oak Material
Black Fabric Material
White Fabric Material
```

GLB is parsed:

```text
Chair
├── Backrest_001
├── Frame_001
├── Seat_001
└── Arms
```

Merchant opens 3D Studio.

Creates targets:

```text
backrest
→ Backrest_001

frame.material
→ Frame_001 material slot 0

body.material
→ Seat_001 material slot 0
```

Creates visual effects:

```text
Backrest = Yes
→ SHOW backrest

Backrest = No
→ HIDE backrest

Frame = Walnut
→ SET_MATERIAL frame.material = Walnut

Frame = Oak
→ SET_MATERIAL frame.material = Oak

Color = Black
→ SET_MATERIAL body.material = Black Fabric

Color = White
→ SET_MATERIAL body.material = White Fabric
```

Commerce maps:

```text
Black + L + Walnut
→ CH-BLK-L-WAL

Black + XL + Walnut
→ CH-BLK-XL-WAL
```

Runtime shopper selects:

```text
Color = Black
Frame = Walnut
Backrest = No
Size = XL
```

Resolver produces:

```text
valid = true

3D
→ body.material = Black Fabric
→ frame.material = Walnut
→ backrest.visible = false

commerce
→ SKU CH-BLK-XL-WAL
→ price
→ inventory
→ cart payload
```

Shopper clicks share:

```text
ConfigurationState
→ SavedConfiguration
→ state.json in GCS
→ /config/{id}
```

That is the entire platform loop.

---

The conceptual boundary I would freeze is this:

```text
LIBRARY
defines reusable things

PRODUCT GRAPH
defines what the product can become

3D STUDIO
defines how configuration changes appearance/geometry

DECORATIONS
defines how personalization applies

COMMERCE
defines how configuration becomes sellable

RESOLVER
combines them

BACKOFFICE
makes the whole relationship visible

SDK / EMBED
delivers the resolved experience
```

If you protect those ownership boundaries, CubeCom can keep adding capabilities without turning back into a collection of federated tools.
