import { buildDemoChairBundle } from './demo-chair-glb';
import { createHash } from 'node:crypto';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { config as loadEnv } from 'dotenv';
import {
  AttributeType,
  EntitlementKind,
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

  const starter = await prisma.plan.upsert({
    where: { key: 'starter' },
    create: { key: 'starter', name: 'Starter' },
    update: { name: 'Starter' },
  });
  const pro = await prisma.plan.upsert({
    where: { key: 'pro' },
    create: {
      key: 'pro',
      name: 'Pro',
      parentPlanId: starter.id,
    },
    update: { name: 'Pro', parentPlanId: starter.id },
  });

  const starterCaps = [
    'backoffice.products',
    '3d.editor',
    'api.access',
  ] as const;
  const starterLimits: Record<string, string> = {
    'limits.products': '10',
    'limits.models': '5',
    'limits.storage.gb': '2',
    'limits.users': '3',
    'limits.projects': '2',
    'limits.ai.generations.monthly': '0',
  };
  const proCaps = [
    '3d.publish',
    '2d.editor',
    'ai.generate',
    'backoffice.analytics',
  ] as const;
  const proLimits: Record<string, string> = {
    'limits.products': '100',
    'limits.models': '50',
    'limits.storage.gb': '20',
    'limits.users': '25',
    'limits.projects': '20',
    'limits.ai.generations.monthly': '500',
  };

  async function putPlanRows(
    planId: string,
    caps: readonly string[],
    limits: Record<string, string>
  ) {
    for (const key of caps) {
      await prisma.planEntitlement.upsert({
        where: { planId_key: { planId, key } },
        create: {
          planId,
          key,
          kind: EntitlementKind.CAPABILITY,
          value: 'true',
        },
        update: { kind: EntitlementKind.CAPABILITY, value: 'true' },
      });
    }
    for (const [key, value] of Object.entries(limits)) {
      await prisma.planEntitlement.upsert({
        where: { planId_key: { planId, key } },
        create: { planId, key, kind: EntitlementKind.LIMIT, value },
        update: { kind: EntitlementKind.LIMIT, value },
      });
    }
  }

  await putPlanRows(starter.id, starterCaps, starterLimits);
  await putPlanRows(pro.id, proCaps, proLimits);

  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 9);

  const organization = await prisma.organization.upsert({
    where: { slug: 'demo' },
    create: {
      name: 'Acme Corp',
      slug: 'demo',
      planId: pro.id,
      status: 'ACTIVE',
    },
    update: {
      name: 'Acme Corp',
      planId: pro.id,
      status: 'ACTIVE',
      trialEndsAt: null,
    },
  });

  await prisma.organization.upsert({
    where: { slug: 'nike-demo' },
    create: {
      name: 'Nike Demo',
      slug: 'nike-demo',
      planId: starter.id,
      status: 'TRIAL',
      trialEndsAt,
    },
    update: {
      name: 'Nike Demo',
      planId: starter.id,
      status: 'TRIAL',
      trialEndsAt,
    },
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
      name: 'Studio Chair',
      sortOrder: 0,
    },
    update: { name: 'Studio Chair' },
  });

  const objectsFolder = await prisma.libraryFolder.upsert({
    where: { id: 'seed_objects_folder' },
    create: {
      id: 'seed_objects_folder',
      organizationId: organization.id,
      projectId: project.id,
      name: 'Furniture',
      sortOrder: 1,
    },
    update: { name: 'Furniture' },
  });

  const beigeDoc = await putJson(
    `${organization.id}/${project.id}/materials/beige-fabric.json`,
    {
      shaderModel: 'PBR',
      baseColor: '#d4c4a8',
      roughness: 0.85,
      metallic: 0,
    }
  );
  const walnutDoc = await putJson(
    `${organization.id}/${project.id}/materials/walnut-wood.json`,
    {
      shaderModel: 'PBR',
      baseColor: '#8A6040',
      roughness: 0.55,
      metallic: 0,
    }
  );
  const oakDoc = await putJson(
    `${organization.id}/${project.id}/materials/oak-wood.json`,
    {
      shaderModel: 'PBR',
      baseColor: '#C29B62',
      roughness: 0.6,
      metallic: 0,
    }
  );
  const blackDoc = await putJson(
    `${organization.id}/${project.id}/materials/fabric-black.json`,
    {
      shaderModel: 'PBR',
      baseColor: '#111111',
      roughness: 0.75,
      metallic: 0,
    }
  );

  async function upsertMaterial(input: {
    code: string;
    name: string;
    documentUri: string;
    documentSha256: string;
  }) {
    const existing = await prisma.materialAsset.findFirst({
      where: { projectId: project.id, code: input.code },
    });
    if (existing) {
      return prisma.materialAsset.update({
        where: { id: existing.id },
        data: {
          folderId: materialsFolder.id,
          name: input.name,
          documentUri: input.documentUri,
          documentSha256: input.documentSha256,
        },
      });
    }
    return prisma.materialAsset.create({
      data: {
        organizationId: organization.id,
        projectId: project.id,
        folderId: materialsFolder.id,
        name: input.name,
        code: input.code,
        documentUri: input.documentUri,
        documentSha256: input.documentSha256,
      },
    });
  }

  await upsertMaterial({
    code: 'FABRIC-BEIGE',
    name: 'Beige Fabric',
    documentUri: beigeDoc.uri,
    documentSha256: beigeDoc.sha256,
  });
  const walnutMaterial = await upsertMaterial({
    code: 'WOOD-WALNUT',
    name: 'Walnut Wood',
    documentUri: walnutDoc.uri,
    documentSha256: walnutDoc.sha256,
  });
  const oakMaterial = await upsertMaterial({
    code: 'WOOD-OAK',
    name: 'Oak Wood',
    documentUri: oakDoc.uri,
    documentSha256: oakDoc.sha256,
  });
  const blackMaterial = await upsertMaterial({
    code: 'FABRIC-BLACK',
    name: 'Fabric Black',
    documentUri: blackDoc.uri,
    documentSha256: blackDoc.sha256,
  });

  const { bytes: chairGlb, metadata: chairParsed } = await buildDemoChairBundle();
  const chairMeta = await putBytes(
    `${organization.id}/${project.id}/objects/chair-demo.glb`,
    chairGlb
  );
  const chairParsedMeta = await putJson(
    `${organization.id}/${project.id}/objects/chair-demo/metadata/v1.json`,
    chairParsed
  );

  let chairAsset = await prisma.objectAsset.findFirst({
    where: { projectId: project.id, code: 'CHAIR-DEMO' },
  });
  if (chairAsset) {
    chairAsset = await prisma.objectAsset.update({
      where: { id: chairAsset.id },
      data: {
        folderId: materialsFolder.id,
        name: 'Demo Chair',
        fileUri: chairMeta.uri,
        fileSha256: chairMeta.sha256,
        format: 'glb',
        sizeBytes: chairGlb.length,
        purpose: 'MODEL',
        status: 'READY',
        parsedMetadataUri: chairParsedMeta.uri,
        parsedMetadataSha256: chairParsedMeta.sha256,
        metadataVersion: chairParsed.metadataVersion,
        nodeCount: chairParsed.stats.nodeCount,
        meshCount: chairParsed.stats.meshCount,
        materialCount: chairParsed.stats.materialCount,
        animationCount: chairParsed.stats.animationCount,
      },
    });
  } else {
    chairAsset = await prisma.objectAsset.create({
      data: {
        organizationId: organization.id,
        projectId: project.id,
        folderId: materialsFolder.id,
        name: 'Demo Chair',
        code: 'CHAIR-DEMO',
        fileUri: chairMeta.uri,
        fileSha256: chairMeta.sha256,
        format: 'glb',
        sizeBytes: chairGlb.length,
        purpose: 'MODEL',
        status: 'READY',
        parsedMetadataUri: chairParsedMeta.uri,
        parsedMetadataSha256: chairParsedMeta.sha256,
        metadataVersion: chairParsed.metadataVersion,
        nodeCount: chairParsed.stats.nodeCount,
        meshCount: chairParsed.stats.meshCount,
        materialCount: chairParsed.stats.materialCount,
        animationCount: chairParsed.stats.animationCount,
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
      data: { activeRevisionId: null },
    });
    await prisma.productRevision.deleteMany({
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

  const version = await prisma.productRevision.create({
    data: {
      organizationId: organization.id,
      productId: product.id,
      version: 1,
      status: GraphVersionStatus.DRAFT,
    },
  });

  const color = await prisma.choice.create({
    data: {
      productRevisionId: version.id,
      key: 'color',
      name: 'Color',
      type: AttributeType.SELECT,
      required: true,
      sortOrder: 0,
    },
  });
  const size = await prisma.choice.create({
    data: {
      productRevisionId: version.id,
      key: 'size',
      name: 'Size',
      type: AttributeType.SELECT,
      required: true,
      sortOrder: 1,
    },
  });
  const frame = await prisma.choice.create({
    data: {
      productRevisionId: version.id,
      key: 'frame',
      name: 'Frame',
      type: AttributeType.SELECT,
      required: true,
      sortOrder: 2,
    },
  });
  const material = await prisma.choice.create({
    data: {
      productRevisionId: version.id,
      key: 'material',
      name: 'Material',
      type: AttributeType.SELECT,
      required: false,
      sortOrder: 3,
    },
  });

  const colorBlack = await prisma.choiceValue.create({
    data: { choiceId: color.id, key: 'black', name: 'Black', sortOrder: 0 },
  });
  const colorWhite = await prisma.choiceValue.create({
    data: { choiceId: color.id, key: 'white', name: 'White', sortOrder: 1 },
  });
  const sizeL = await prisma.choiceValue.create({
    data: { choiceId: size.id, key: 'l', name: 'L', sortOrder: 0 },
  });
  const sizeXl = await prisma.choiceValue.create({
    data: { choiceId: size.id, key: 'xl', name: 'XL', sortOrder: 1 },
  });
  const frameWalnut = await prisma.choiceValue.create({
    data: {
      choiceId: frame.id,
      key: 'walnut',
      name: 'Walnut',
      sortOrder: 0,
    },
  });
  const frameOak = await prisma.choiceValue.create({
    data: { choiceId: frame.id, key: 'oak', name: 'Oak', sortOrder: 1 },
  });
  const materialLeather = await prisma.choiceValue.create({
    data: {
      choiceId: material.id,
      key: 'leather',
      name: 'Leather',
      sortOrder: 0,
    },
  });
  void sizeL;
  void materialLeather;

  await prisma.configurationRule.create({
    data: {
      productRevisionId: version.id,
      condition: { all: [{ attr: 'material', eq: 'leather' }] },
      effect: { forbid: { attr: 'color', eq: 'white' } },
    },
  });

  const productModel = await prisma.productModel.create({
    data: {
      productRevisionId: version.id,
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
  const legsTarget = await prisma.modelTarget.create({
    data: {
      productModelId: productModel.id,
      key: 'legs',
      targetType: 'MATERIAL',
      nodePath: 'Chair/Legs',
      materialSlot: 'legs',
    },
  });
  const leftArmTarget = await prisma.modelTarget.create({
    data: {
      productModelId: productModel.id,
      key: 'left_arm',
      targetType: 'MATERIAL',
      nodePath: 'Chair/LeftArm',
      materialSlot: 'left_arm',
    },
  });
  const rightArmTarget = await prisma.modelTarget.create({
    data: {
      productModelId: productModel.id,
      key: 'right_arm',
      targetType: 'MATERIAL',
      nodePath: 'Chair/RightArm',
      materialSlot: 'right_arm',
    },
  });
  const seatTarget = await prisma.modelTarget.create({
    data: {
      productModelId: productModel.id,
      key: 'seat',
      targetType: 'MATERIAL',
      nodePath: 'Chair/Seat',
      materialSlot: 'seat',
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

  const woodTargets = [
    frameTarget,
    legsTarget,
    leftArmTarget,
    rightArmTarget,
  ];
  for (const target of woodTargets) {
    await prisma.visualEffect.create({
      data: {
        choiceValueId: frameWalnut.id,
        modelTargetId: target.id,
        operation: VisualOperation.SET_MATERIAL,
        value: { materialAssetId: walnutMaterial.id },
      },
    });
    await prisma.visualEffect.create({
      data: {
        choiceValueId: frameOak.id,
        modelTargetId: target.id,
        operation: VisualOperation.SET_MATERIAL,
        value: { materialAssetId: oakMaterial.id },
      },
    });
  }

  const whiteDoc = await putJson(
    `${organization.id}/${project.id}/materials/fabric-white.json`,
    {
      shaderModel: 'PBR',
      baseColor: '#F4F4F5',
      roughness: 0.75,
      metallic: 0,
    }
  );
  const whiteMaterial = await upsertMaterial({
    code: 'FABRIC-WHITE',
    name: 'Fabric White',
    documentUri: whiteDoc.uri,
    documentSha256: whiteDoc.sha256,
  });

  await prisma.visualEffect.create({
    data: {
      choiceValueId: colorBlack.id,
      modelTargetId: seatTarget.id,
      operation: VisualOperation.SET_MATERIAL,
      value: { materialAssetId: blackMaterial.id },
    },
  });
  await prisma.visualEffect.create({
    data: {
      choiceValueId: colorWhite.id,
      modelTargetId: seatTarget.id,
      operation: VisualOperation.SET_MATERIAL,
      value: { materialAssetId: whiteMaterial.id },
    },
  });

  const variant = await prisma.productVariant.create({
    data: {
      productRevisionId: version.id,
      provider: 'generic',
      externalId: 'SKU-BLK-XL-WAL',
      sku: 'SKU-BLK-XL-WAL',
    },
  });

  await prisma.variantSelection.createMany({
    data: [
      {
        variantId: variant.id,
        choiceId: color.id,
        choiceValueId: colorBlack.id,
      },
      {
        variantId: variant.id,
        choiceId: size.id,
        choiceValueId: sizeXl.id,
      },
      {
        variantId: variant.id,
        choiceId: frame.id,
        choiceValueId: frameWalnut.id,
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

  const published = await prisma.productRevision.update({
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
      activeRevisionId: published.id,
      status: ProductStatus.ACTIVE,
    },
  });

  const apiUrl = process.env.API_PUBLIC_URL ?? 'http://localhost:3005';
  const platformDefaults: Array<{ app: string; key: string; value: string }> = [
    { app: 'api', key: 'publicUrl', value: apiUrl },
    { app: 'backoffice', key: 'publicUrl', value: 'http://localhost:3002' },
    { app: 'backoffice', key: 'apiUrl', value: apiUrl },
    { app: 'editor', key: 'publicUrl', value: 'http://localhost:3003' },
    { app: 'editor', key: 'apiUrl', value: apiUrl },
    { app: 'customizer', key: 'publicUrl', value: 'http://localhost:3001' },
    { app: 'customizer', key: 'apiUrl', value: apiUrl },
    { app: 'customizer', key: 'defaultProjectId', value: project.id },
  ];
  for (const row of platformDefaults) {
    await prisma.platformSetting.upsert({
      where: { app_key: { app: row.app, key: row.key } },
      create: row,
      update: {},
    });
  }

  console.log('Seed complete');
  console.log(
    JSON.stringify(
      {
        organizationId: organization.id,
        projectId: project.id,
        productId: product.id,
        productRevisionId: published.id,
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
