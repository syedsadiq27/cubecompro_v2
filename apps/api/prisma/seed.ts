import { buildDemoChairGlb } from './demo-chair-glb';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import {
  AttributeType,
  GraphVersionStatus,
  Prisma,
  PrismaClient,
  ProductStatus,
  VisualOperation,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

loadEnv();

const prisma = new PrismaClient();

const DEFAULT_PERMISSIONS = [
  'organization.manage',
  'project.manage',
  'product.read',
  'product.write',
  'graph.publish',
  'library.write',
  'resolve.execute',
  'configuration.save',
] as const;

const DEFAULT_ENTITLEMENTS: Record<string, Prisma.InputJsonValue> = {
  maxProjects: 5,
  maxUsers: 10,
  commerceAdapters: [],
  materialsEnabled: true,
  publicEmbedEnabled: true,
};

async function putJson(keyPath: string, payload: unknown) {
  const root =
    process.env.DOCUMENT_STORE_PATH ??
    join(process.cwd(), '.data', 'documents');
  const body = JSON.stringify(payload, null, 2);
  const sha256 = createHash('sha256').update(body).digest('hex');
  const absolute = join(root, keyPath.replace(/^\/+/, ''));
  await mkdir(dirname(absolute), { recursive: true });
  await writeFile(absolute, body, 'utf8');
  return { uri: `file://${absolute}`, sha256 };
}

async function putBytes(keyPath: string, bytes: Buffer) {
  const root =
    process.env.DOCUMENT_STORE_PATH ??
    join(process.cwd(), '.data', 'documents');
  const sha256 = createHash('sha256').update(bytes).digest('hex');
  const absolute = join(root, keyPath.replace(/^\/+/, ''));
  await mkdir(dirname(absolute), { recursive: true });
  await writeFile(absolute, bytes);
  return { uri: `file://${absolute}`, sha256 };
}

async function seed() {
  for (const code of DEFAULT_PERMISSIONS) {
    await prisma.permission.upsert({
      where: { code },
      create: { code },
      update: {},
    });
  }

  const organization = await prisma.organization.upsert({
    where: { slug: 'demo' },
    create: { name: 'Demo Organization', slug: 'demo' },
    update: { name: 'Demo Organization' },
  });

  for (const [key, value] of Object.entries(DEFAULT_ENTITLEMENTS)) {
    await prisma.organizationEntitlement.upsert({
      where: {
        organizationId_key: { organizationId: organization.id, key },
      },
      create: { organizationId: organization.id, key, value },
      update: { value },
    });
  }

  const permissions = await prisma.permission.findMany({
    where: { code: { in: [...DEFAULT_PERMISSIONS] } },
  });

  const ownerRole = await prisma.role.upsert({
    where: {
      organizationId_name: {
        organizationId: organization.id,
        name: 'owner',
      },
    },
    create: {
      organizationId: organization.id,
      name: 'owner',
      permissions: {
        create: permissions.map((permission) => ({
          permissionId: permission.id,
        })),
      },
    },
    update: {},
  });

  for (const permission of permissions) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: ownerRole.id,
          permissionId: permission.id,
        },
      },
      create: {
        roleId: ownerRole.id,
        permissionId: permission.id,
      },
      update: {},
    });
  }

  const user = await prisma.user.upsert({
    where: { email: 'owner@demo.cubecom.dev' },
    create: {
      email: 'owner@demo.cubecom.dev',
      name: 'Demo Owner',
      passwordHash: await bcrypt.hash('demo1234', 10),
    },
    update: {
      name: 'Demo Owner',
      passwordHash: await bcrypt.hash('demo1234', 10),
    },
  });

  await prisma.organizationMembership.upsert({
    where: {
      organizationId_userId: {
        organizationId: organization.id,
        userId: user.id,
      },
    },
    create: {
      organizationId: organization.id,
      userId: user.id,
      roleId: ownerRole.id,
    },
    update: { roleId: ownerRole.id },
  });

  const project = await prisma.project.upsert({
    where: {
      organizationId_slug: {
        organizationId: organization.id,
        slug: 'showroom',
      },
    },
    create: {
      organizationId: organization.id,
      name: 'Showroom',
      slug: 'showroom',
    },
    update: { name: 'Showroom' },
  });

  const materialsFolder = await prisma.libraryFolder.upsert({
    where: { id: 'seed_materials_folder' },
    create: {
      id: 'seed_materials_folder',
      organizationId: organization.id,
      projectId: project.id,
      name: 'Materials',
      sortOrder: 0,
    },
    update: { name: 'Materials' },
  });

  const objectsFolder = await prisma.libraryFolder.upsert({
    where: { id: 'seed_objects_folder' },
    create: {
      id: 'seed_objects_folder',
      organizationId: organization.id,
      projectId: project.id,
      name: 'Objects',
      sortOrder: 1,
    },
    update: { name: 'Objects' },
  });

  const materialDoc = await putJson(
    `${organization.id}/${project.id}/materials/beige-fabric.json`,
    {
      type: 'physical',
      color: '#d4c4a8',
      roughness: 0.85,
      metalness: 0,
    }
  );

  const existingMaterial = await prisma.materialAsset.findFirst({
    where: { projectId: project.id, code: 'FABRIC-BEIGE' },
  });
  if (existingMaterial) {
    await prisma.materialAsset.update({
      where: { id: existingMaterial.id },
      data: {
        folderId: materialsFolder.id,
        name: 'Beige Fabric',
        documentUri: materialDoc.uri,
        documentSha256: materialDoc.sha256,
      },
    });
  } else {
    await prisma.materialAsset.create({
      data: {
        organizationId: organization.id,
        projectId: project.id,
        folderId: materialsFolder.id,
        name: 'Beige Fabric',
        code: 'FABRIC-BEIGE',
        documentUri: materialDoc.uri,
        documentSha256: materialDoc.sha256,
      },
    });
  }

  const chairGlb = await buildDemoChairGlb();
  const chairMeta = await putBytes(
    `${organization.id}/${project.id}/objects/chair-demo.glb`,
    chairGlb
  );

  let chairAsset = await prisma.objectAsset.findFirst({
    where: { projectId: project.id, code: 'CHAIR-DEMO' },
  });
  if (chairAsset) {
    chairAsset = await prisma.objectAsset.update({
      where: { id: chairAsset.id },
      data: {
        folderId: objectsFolder.id,
        name: 'Demo Chair',
        fileUri: chairMeta.uri,
        fileSha256: chairMeta.sha256,
      },
    });
  } else {
    chairAsset = await prisma.objectAsset.create({
      data: {
        organizationId: organization.id,
        projectId: project.id,
        folderId: objectsFolder.id,
        name: 'Demo Chair',
        code: 'CHAIR-DEMO',
        fileUri: chairMeta.uri,
        fileSha256: chairMeta.sha256,
      },
    });
  }

  let product = await prisma.product.findUnique({
    where: {
      projectId_key: {
        projectId: project.id,
        key: 'CHAIR-01',
      },
    },
  });

  if (product) {
    await prisma.product.update({
      where: { id: product.id },
      data: { activeGraphVersionId: null },
    });
    await prisma.productGraphVersion.deleteMany({
      where: { productId: product.id },
    });
    product = await prisma.product.update({
      where: { id: product.id },
      data: {
        name: 'Studio Chair',
        description: 'Color / Size / Frame demo for resolve()',
        status: ProductStatus.DRAFT,
      },
    });
  } else {
    product = await prisma.product.create({
      data: {
        organizationId: organization.id,
        projectId: project.id,
        key: 'CHAIR-01',
        name: 'Studio Chair',
        description: 'Color / Size / Frame demo for resolve()',
        status: ProductStatus.DRAFT,
      },
    });
  }

  const version = await prisma.productGraphVersion.create({
    data: {
      organizationId: organization.id,
      productId: product.id,
      version: 1,
      status: GraphVersionStatus.DRAFT,
    },
  });

  const color = await prisma.productAttribute.create({
    data: {
      graphVersionId: version.id,
      key: 'color',
      name: 'Color',
      type: AttributeType.SELECT,
      required: true,
      sortOrder: 0,
    },
  });
  const size = await prisma.productAttribute.create({
    data: {
      graphVersionId: version.id,
      key: 'size',
      name: 'Size',
      type: AttributeType.SELECT,
      required: true,
      sortOrder: 1,
    },
  });
  const frame = await prisma.productAttribute.create({
    data: {
      graphVersionId: version.id,
      key: 'frame',
      name: 'Frame',
      type: AttributeType.SELECT,
      required: true,
      sortOrder: 2,
    },
  });
  const material = await prisma.productAttribute.create({
    data: {
      graphVersionId: version.id,
      key: 'material',
      name: 'Material',
      type: AttributeType.SELECT,
      required: false,
      sortOrder: 3,
    },
  });

  const colorBlack = await prisma.attributeValue.create({
    data: { attributeId: color.id, key: 'black', name: 'Black', sortOrder: 0 },
  });
  const colorWhite = await prisma.attributeValue.create({
    data: { attributeId: color.id, key: 'white', name: 'White', sortOrder: 1 },
  });
  const sizeL = await prisma.attributeValue.create({
    data: { attributeId: size.id, key: 'l', name: 'L', sortOrder: 0 },
  });
  const sizeXl = await prisma.attributeValue.create({
    data: { attributeId: size.id, key: 'xl', name: 'XL', sortOrder: 1 },
  });
  const frameWalnut = await prisma.attributeValue.create({
    data: {
      attributeId: frame.id,
      key: 'walnut',
      name: 'Walnut',
      sortOrder: 0,
    },
  });
  const frameOak = await prisma.attributeValue.create({
    data: { attributeId: frame.id, key: 'oak', name: 'Oak', sortOrder: 1 },
  });
  const materialLeather = await prisma.attributeValue.create({
    data: {
      attributeId: material.id,
      key: 'leather',
      name: 'Leather',
      sortOrder: 0,
    },
  });
  void colorWhite;
  void sizeL;
  void frameOak;
  void materialLeather;

  await prisma.configurationRule.create({
    data: {
      graphVersionId: version.id,
      condition: { all: [{ attr: 'material', eq: 'leather' }] },
      effect: { forbid: { attr: 'color', eq: 'white' } },
    },
  });

  const productModel = await prisma.productModel.create({
    data: {
      graphVersionId: version.id,
      assetId: chairAsset.id,
      key: 'primary',
      name: 'Primary Chair',
    },
  });

  const frameTarget = await prisma.modelTarget.create({
    data: {
      productModelId: productModel.id,
      key: 'frame',
      targetType: 'MATERIAL',
      nodePath: 'Chair/Frame',
      materialSlot: 'frame',
    },
  });
  const bodyTarget = await prisma.modelTarget.create({
    data: {
      productModelId: productModel.id,
      key: 'body',
      targetType: 'MATERIAL',
      nodePath: 'Chair/Seat',
      materialSlot: 'body',
    },
  });
  await prisma.modelTarget.create({
    data: {
      productModelId: productModel.id,
      key: 'backrest',
      targetType: 'VISIBILITY',
      nodePath: 'Chair/Backrest',
    },
  });

  await prisma.visualEffect.create({
    data: {
      attributeValueId: frameWalnut.id,
      modelTargetId: frameTarget.id,
      operation: VisualOperation.SET_MATERIAL,
      value: 'walnut',
    },
  });
  await prisma.visualEffect.create({
    data: {
      attributeValueId: colorBlack.id,
      modelTargetId: bodyTarget.id,
      operation: VisualOperation.SET_MATERIAL,
      value: 'black',
    },
  });

  const variant = await prisma.productVariant.create({
    data: {
      graphVersionId: version.id,
      provider: 'generic',
      externalId: 'SKU-BLK-XL-WAL',
      sku: 'SKU-BLK-XL-WAL',
    },
  });

  await prisma.variantSelection.createMany({
    data: [
      {
        variantId: variant.id,
        attributeId: color.id,
        attributeValueId: colorBlack.id,
      },
      {
        variantId: variant.id,
        attributeId: size.id,
        attributeValueId: sizeXl.id,
      },
      {
        variantId: variant.id,
        attributeId: frame.id,
        attributeValueId: frameWalnut.id,
      },
    ],
  });

  const snapshot = {
    productId: product.id,
    version: 1,
    note: 'seed publish snapshot',
  };
  const stored = await putJson(
    `${organization.id}/${project.id}/products/${product.id}/graph/v1.json`,
    snapshot
  );

  const published = await prisma.productGraphVersion.update({
    where: { id: version.id },
    data: {
      status: GraphVersionStatus.PUBLISHED,
      publishedAt: new Date(),
      graphUri: stored.uri,
      graphSha256: stored.sha256,
    },
  });

  await prisma.product.update({
    where: { id: product.id },
    data: {
      activeGraphVersionId: published.id,
      status: ProductStatus.ACTIVE,
    },
  });

  console.log('Seed complete');
  console.log(
    JSON.stringify(
      {
        organizationId: organization.id,
        projectId: project.id,
        productId: product.id,
        graphVersionId: published.id,
        graphVersion: published.version,
        login: {
          email: 'owner@demo.cubecom.dev',
          password: 'demo1234',
        },
        sampleResolveSelections: {
          color: 'black',
          size: 'xl',
          frame: 'walnut',
        },
        expectedCommerceSku: 'SKU-BLK-XL-WAL',
        failingRuleExample: {
          material: 'leather',
          color: 'white',
          size: 'xl',
          frame: 'walnut',
        },
      },
      null,
      2
    )
  );
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
