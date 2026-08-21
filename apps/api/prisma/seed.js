"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const demo_chair_glb_1 = require("./demo-chair-glb");
const node_crypto_1 = require("node:crypto");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
const dotenv_1 = require("dotenv");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
(0, dotenv_1.config)();
const prisma = new client_1.PrismaClient();
const DEFAULT_PERMISSIONS = [
    'organization.manage',
    'project.manage',
    'product.read',
    'product.write',
    'graph.publish',
    'library.write',
    'resolve.execute',
    'configuration.save',
];
const DEFAULT_ENTITLEMENTS = {
    maxProjects: 5,
    maxUsers: 10,
    commerceAdapters: [],
    materialsEnabled: true,
    publicEmbedEnabled: true,
};
async function putJson(keyPath, payload) {
    const root = process.env.DOCUMENT_STORE_PATH ??
        (0, node_path_1.join)(process.cwd(), '.data', 'documents');
    const body = JSON.stringify(payload, null, 2);
    const sha256 = (0, node_crypto_1.createHash)('sha256').update(body).digest('hex');
    const relative = keyPath.replace(/^\/+/, '');
    const absolute = (0, node_path_1.join)(root, relative);
    await (0, promises_1.mkdir)((0, node_path_1.dirname)(absolute), { recursive: true });
    await (0, promises_1.writeFile)(absolute, body, 'utf8');
    return { uri: relative, sha256 };
}
async function putBytes(keyPath, bytes) {
    const root = process.env.DOCUMENT_STORE_PATH ??
        (0, node_path_1.join)(process.cwd(), '.data', 'documents');
    const sha256 = (0, node_crypto_1.createHash)('sha256').update(bytes).digest('hex');
    const relative = keyPath.replace(/^\/+/, '');
    const absolute = (0, node_path_1.join)(root, relative);
    await (0, promises_1.mkdir)((0, node_path_1.dirname)(absolute), { recursive: true });
    await (0, promises_1.writeFile)(absolute, bytes);
    return { uri: relative, sha256 };
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
    const beigeDoc = await putJson(`${organization.id}/${project.id}/materials/beige-fabric.json`, {
        shaderModel: 'PBR',
        baseColor: '#d4c4a8',
        roughness: 0.85,
        metallic: 0,
    });
    const walnutDoc = await putJson(`${organization.id}/${project.id}/materials/walnut-wood.json`, {
        shaderModel: 'PBR',
        baseColor: '#8A6040',
        roughness: 0.55,
        metallic: 0,
    });
    const blackDoc = await putJson(`${organization.id}/${project.id}/materials/fabric-black.json`, {
        shaderModel: 'PBR',
        baseColor: '#111111',
        roughness: 0.75,
        metallic: 0,
    });
    async function upsertMaterial(input) {
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
    const blackMaterial = await upsertMaterial({
        code: 'FABRIC-BLACK',
        name: 'Fabric Black',
        documentUri: blackDoc.uri,
        documentSha256: blackDoc.sha256,
    });
    const { bytes: chairGlb, metadata: chairParsed } = await (0, demo_chair_glb_1.buildDemoChairBundle)();
    const chairMeta = await putBytes(`${organization.id}/${project.id}/objects/chair-demo.glb`, chairGlb);
    const chairParsedMeta = await putJson(`${organization.id}/${project.id}/objects/chair-demo/metadata/v1.json`, chairParsed);
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
    }
    else {
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
                status: client_1.ProductStatus.DRAFT,
            },
        });
    }
    else {
        product = await prisma.product.create({
            data: {
                organizationId: organization.id,
                projectId: project.id,
                key: 'CHAIR-01',
                name: 'Studio Chair',
                description: 'Color / Size / Frame demo for resolve()',
                status: client_1.ProductStatus.DRAFT,
            },
        });
    }
    const version = await prisma.productGraphVersion.create({
        data: {
            organizationId: organization.id,
            productId: product.id,
            version: 1,
            status: client_1.GraphVersionStatus.DRAFT,
        },
    });
    const color = await prisma.productAttribute.create({
        data: {
            graphVersionId: version.id,
            key: 'color',
            name: 'Color',
            type: client_1.AttributeType.SELECT,
            required: true,
            sortOrder: 0,
        },
    });
    const size = await prisma.productAttribute.create({
        data: {
            graphVersionId: version.id,
            key: 'size',
            name: 'Size',
            type: client_1.AttributeType.SELECT,
            required: true,
            sortOrder: 1,
        },
    });
    const frame = await prisma.productAttribute.create({
        data: {
            graphVersionId: version.id,
            key: 'frame',
            name: 'Frame',
            type: client_1.AttributeType.SELECT,
            required: true,
            sortOrder: 2,
        },
    });
    const material = await prisma.productAttribute.create({
        data: {
            graphVersionId: version.id,
            key: 'material',
            name: 'Material',
            type: client_1.AttributeType.SELECT,
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
            operation: client_1.VisualOperation.SET_MATERIAL,
            value: { materialAssetId: walnutMaterial.id },
        },
    });
    await prisma.visualEffect.create({
        data: {
            attributeValueId: colorBlack.id,
            modelTargetId: bodyTarget.id,
            operation: client_1.VisualOperation.SET_MATERIAL,
            value: { materialAssetId: blackMaterial.id },
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
    const stored = await putJson(`${organization.id}/${project.id}/products/${product.id}/graph/v1.json`, snapshot);
    const published = await prisma.productGraphVersion.update({
        where: { id: version.id },
        data: {
            status: client_1.GraphVersionStatus.PUBLISHED,
            publishedAt: new Date(),
            graphUri: stored.uri,
            graphSha256: stored.sha256,
        },
    });
    await prisma.product.update({
        where: { id: product.id },
        data: {
            activeGraphVersionId: published.id,
            status: client_1.ProductStatus.ACTIVE,
        },
    });
    console.log('Seed complete');
    console.log(JSON.stringify({
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
    }, null, 2));
}
seed()
    .catch((error) => {
    console.error(error);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map