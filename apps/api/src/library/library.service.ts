import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ObjectAssetPurpose,
  ObjectAssetStatus,
  ProductStatus,
} from '@prisma/client';
import { DocumentStoreService } from '../documents/document-store.service';
import { EntitlementService } from '../entitlements/entitlement.service';
import { PrismaService } from '../prisma/prisma.service';
import { parseGlbMetadata } from './parse-glb';

@Injectable()
export class LibraryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documents: DocumentStoreService,
    private readonly entitlements: EntitlementService
  ) {}

  private async assertProject(organizationId: string, projectId: string) {
    const project = await this.prisma.project.findFirst({
      where: { id: projectId, organizationId },
    });
    if (!project) {
      throw new NotFoundException('Project not found in organization');
    }
    return project;
  }

  async createFolder(input: {
    organizationId: string;
    projectId: string;
    parentId?: string;
    name: string;
  }) {
    await this.assertProject(input.organizationId, input.projectId);
    if (input.parentId) {
      const parent = await this.prisma.libraryFolder.findFirst({
        where: {
          id: input.parentId,
          organizationId: input.organizationId,
          projectId: input.projectId,
        },
      });
      if (!parent) {
        throw new NotFoundException('Parent folder not found in project');
      }
    }

    return this.prisma.libraryFolder.create({
      data: {
        organizationId: input.organizationId,
        projectId: input.projectId,
        parentId: input.parentId,
        name: input.name,
      },
    });
  }

  listFolders(projectId: string, parentId?: string | null) {
    return this.prisma.libraryFolder.findMany({
      where: {
        projectId,
        parentId: parentId === undefined ? undefined : parentId,
      },
      orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    });
  }

  listMaterials(projectId: string) {
    return this.prisma.materialAsset
      .findMany({
        where: { projectId },
        orderBy: { name: 'asc' },
      })
      .then((assets) =>
        assets.map((asset) => ({
          ...asset,
          documentUrl: this.publicMaterialUrl(asset.id),
        }))
      );
  }

  async createMaterial(input: {
    organizationId: string;
    projectId: string;
    folderId?: string;
    name: string;
    code?: string;
    documentJson: string;
  }) {
    await this.assertProject(input.organizationId, input.projectId);
    const allowed = await this.entitlements.can(
      input.organizationId,
      '3d.editor'
    );
    if (!allowed) {
      throw new ForbiddenException('Missing capability 3d.editor');
    }

    let document: unknown;
    try {
      document = JSON.parse(input.documentJson);
    } catch {
      throw new BadRequestException('documentJson must be valid JSON');
    }
    document = normalizeMaterialDocument(document);

    const idHint = cryptoRandom();
    const stored = await this.documents.putJson(
      `${input.organizationId}/${input.projectId}/materials/${idHint}.json`,
      document
    );

    const created = await this.prisma.materialAsset.create({
      data: {
        organizationId: input.organizationId,
        projectId: input.projectId,
        folderId: input.folderId,
        name: input.name,
        code: input.code,
        documentUri: stored.uri,
        documentSha256: stored.sha256,
      },
    });
    return {
      ...created,
      documentUrl: this.publicMaterialUrl(created.id),
    };
  }

  async updateMaterial(input: {
    id: string;
    name?: string;
    code?: string;
    documentJson?: string;
  }) {
    const existing = await this.prisma.materialAsset.findUnique({
      where: { id: input.id },
    });
    if (!existing) {
      throw new NotFoundException('Material asset not found');
    }

    const data: {
      name?: string;
      code?: string | null;
      documentUri?: string;
      documentSha256?: string;
    } = {};

    if (input.name !== undefined) {
      const name = input.name.trim();
      if (!name) throw new BadRequestException('Name is required');
      data.name = name;
    }
    if (input.code !== undefined) {
      data.code = input.code.trim() || null;
    }
    if (input.documentJson !== undefined) {
      let document: unknown;
      try {
        document = JSON.parse(input.documentJson);
      } catch {
        throw new BadRequestException('documentJson must be valid JSON');
      }
      document = normalizeMaterialDocument(document);
      const stored = await this.documents.putJson(
        `${existing.organizationId}/${existing.projectId}/materials/${existing.id}.json`,
        document
      );
      data.documentUri = stored.uri;
      data.documentSha256 = stored.sha256;
    }

    const updated = await this.prisma.materialAsset.update({
      where: { id: existing.id },
      data,
    });
    return {
      ...updated,
      documentUrl: this.publicMaterialUrl(updated.id),
    };
  }

  listTextures(projectId: string) {
    return this.prisma.textureAsset.findMany({
      where: { projectId },
      orderBy: { name: 'asc' },
    });
  }

  async createTexture(input: {
    organizationId: string;
    projectId: string;
    folderId?: string;
    name: string;
    code?: string;
    metadataJson?: string;
  }) {
    await this.assertProject(input.organizationId, input.projectId);
    const metadata = parseOptionalJson(input.metadataJson, {
      kind: 'texture',
      name: input.name,
    });
    const idHint = cryptoRandom();
    const stored = await this.documents.putJson(
      `${input.organizationId}/${input.projectId}/textures/${idHint}.json`,
      metadata
    );

    return this.prisma.textureAsset.create({
      data: {
        organizationId: input.organizationId,
        projectId: input.projectId,
        folderId: input.folderId,
        name: input.name,
        code: input.code,
        fileUri: stored.uri,
        fileSha256: stored.sha256,
      },
    });
  }

  private toObjectAssetModel(asset: {
    id: string;
    organizationId: string;
    projectId: string;
    folderId: string | null;
    name: string;
    code: string | null;
    fileUri: string;
    fileSha256: string;
    format: string | null;
    sizeBytes: number | null;
    purpose: ObjectAssetPurpose;
    status: ObjectAssetStatus;
    parsedMetadataUri: string | null;
    parsedMetadataSha256: string | null;
    metadataVersion: number;
    nodeCount: number | null;
    meshCount: number | null;
    materialCount: number | null;
    animationCount: number | null;
    currentRevisionId?: string | null;
  }) {
    return {
      ...asset,
      fileUrl: this.publicObjectUrl(asset.id),
      metadataUrl: asset.parsedMetadataUri
        ? this.publicObjectMetadataUrl(asset.id)
        : null,
      currentRevisionId: asset.currentRevisionId ?? null,
    };
  }

  private toRevisionModel(revision: {
    id: string;
    objectAssetId: string;
    version: number;
    runtimeArtifactUri: string;
    contentHash: string;
    frozenAt: Date;
    format: string | null;
    sizeBytes: number | null;
  }) {
    return {
      ...revision,
      documentUrl: this.publicObjectRevisionUrl(revision.id),
    };
  }

  private publicObjectUrl(id: string) {
    const base =
      process.env.API_PUBLIC_URL ??
      process.env.NEXT_PUBLIC_PRODUCT_GRAPH_URL ??
      'http://localhost:3005';
    return `${base.replace(/\/$/, '')}/documents/objects/${id}`;
  }

  private publicObjectRevisionUrl(id: string) {
    const base =
      process.env.API_PUBLIC_URL ??
      process.env.NEXT_PUBLIC_PRODUCT_GRAPH_URL ??
      'http://localhost:3005';
    return `${base.replace(/\/$/, '')}/documents/object-revisions/${id}`;
  }

  private publicObjectMetadataUrl(id: string) {
    return `${this.publicObjectUrl(id)}/metadata`;
  }

  private publicMaterialUrl(id: string) {
    const base =
      process.env.API_PUBLIC_URL ??
      process.env.NEXT_PUBLIC_PRODUCT_GRAPH_URL ??
      'http://localhost:3005';
    return `${base.replace(/\/$/, '')}/documents/materials/${id}`;
  }

  listObjects(projectId: string) {
    return this.prisma.objectAsset
      .findMany({
        where: { projectId },
        orderBy: { name: 'asc' },
        include: {
          revisions: { orderBy: { version: 'desc' }, take: 1 },
        },
      })
      .then((assets) =>
        assets.map((asset) =>
          this.toObjectAssetModel({
            ...asset,
            currentRevisionId: asset.revisions[0]?.id ?? null,
          })
        )
      );
  }

  async getObject(id: string) {
    const asset = await this.prisma.objectAsset.findUnique({
      where: { id },
      include: {
        revisions: { orderBy: { version: 'desc' }, take: 1 },
      },
    });
    if (!asset) {
      throw new NotFoundException('Object asset not found');
    }
    return this.toObjectAssetModel({
      ...asset,
      currentRevisionId: asset.revisions[0]?.id ?? null,
    });
  }

  listObjectRevisions(objectAssetId: string) {
    return this.prisma.objectAssetRevision
      .findMany({
        where: { objectAssetId },
        orderBy: { version: 'asc' },
      })
      .then((revisions) => revisions.map((r) => this.toRevisionModel(r)));
  }

  async createObject(input: {
    organizationId: string;
    projectId: string;
    folderId?: string;
    name: string;
    code?: string;
    metadataJson?: string;
    fileBase64?: string;
    fileName?: string;
    purpose?: ObjectAssetPurpose;
  }) {
    await this.assertProject(input.organizationId, input.projectId);
    const purpose = input.purpose ?? ObjectAssetPurpose.MODEL;

    if (!input.fileBase64) {
      const metadata = parseOptionalJson(input.metadataJson, {
        kind: 'object',
        name: input.name,
      });
      const stored = await this.documents.putImmutableBytes(
        Buffer.from(JSON.stringify(metadata), 'utf8'),
        'json'
      );
      const asset = await this.prisma.objectAsset.create({
        data: {
          organizationId: input.organizationId,
          projectId: input.projectId,
          folderId: input.folderId,
          name: input.name,
          code: input.code,
          fileUri: stored.uri,
          fileSha256: stored.sha256,
          format: 'json',
          purpose,
          status: ObjectAssetStatus.READY,
          revisions: {
            create: {
              version: 1,
              runtimeArtifactUri: stored.uri,
              contentHash: stored.sha256,
              format: 'json',
              sizeBytes: Buffer.byteLength(JSON.stringify(metadata), 'utf8'),
            },
          },
        },
        include: { revisions: true },
      });
      return this.toObjectAssetModel({
        ...asset,
        currentRevisionId: asset.revisions[0]?.id ?? null,
      });
    }

    const bytes = Buffer.from(input.fileBase64, 'base64');
    const format = input.fileName?.toLowerCase().endsWith('.gltf')
      ? 'gltf'
      : 'glb';
    const stored = await this.documents.putImmutableBytes(bytes, format);

    let status: ObjectAssetStatus = ObjectAssetStatus.READY;
    let parsedMetadataUri: string | undefined;
    let parsedMetadataSha256: string | undefined;
    let metadataVersion = 1;
    let nodeCount: number | undefined;
    let meshCount: number | undefined;
    let materialCount: number | undefined;
    let animationCount: number | undefined;

    try {
      const parsed = await parseGlbMetadata(bytes, {
        assetName: input.name,
        format,
      });
      const metaStored = await this.documents.putJson(
        `assets/sha256/${stored.sha256}.metadata.v1.json`,
        parsed
      );
      parsedMetadataUri = metaStored.uri;
      parsedMetadataSha256 = metaStored.sha256;
      metadataVersion = parsed.metadataVersion;
      nodeCount = parsed.stats.nodeCount;
      meshCount = parsed.stats.meshCount;
      materialCount = parsed.stats.materialCount;
      animationCount = parsed.stats.animationCount;
    } catch {
      status = ObjectAssetStatus.FAILED;
    }

    const asset = await this.prisma.objectAsset.create({
      data: {
        organizationId: input.organizationId,
        projectId: input.projectId,
        folderId: input.folderId,
        name: input.name,
        code: input.code,
        fileUri: stored.uri,
        fileSha256: stored.sha256,
        format,
        sizeBytes: bytes.length,
        purpose,
        status,
        parsedMetadataUri,
        parsedMetadataSha256,
        metadataVersion,
        nodeCount,
        meshCount,
        materialCount,
        animationCount,
        revisions: {
          create: {
            version: 1,
            runtimeArtifactUri: stored.uri,
            contentHash: stored.sha256,
            format,
            sizeBytes: bytes.length,
            parsedMetadataUri,
            parsedMetadataSha256,
            metadataVersion,
          },
        },
      },
      include: { revisions: true },
    });
    return this.toObjectAssetModel({
      ...asset,
      currentRevisionId: asset.revisions[0]?.id ?? null,
    });
  }

  async createObjectRevision(input: {
    objectAssetId: string;
    fileBase64: string;
    fileName?: string;
  }) {
    const asset = await this.prisma.objectAsset.findUnique({
      where: { id: input.objectAssetId },
    });
    if (!asset) {
      throw new NotFoundException('Object asset not found');
    }

    const bytes = Buffer.from(input.fileBase64, 'base64');
    const format = input.fileName?.toLowerCase().endsWith('.gltf')
      ? 'gltf'
      : 'glb';
    const stored = await this.documents.putImmutableBytes(bytes, format);

    const latest = await this.prisma.objectAssetRevision.findFirst({
      where: { objectAssetId: asset.id },
      orderBy: { version: 'desc' },
    });
    const nextVersion = (latest?.version ?? 0) + 1;

    let parsedMetadataUri: string | undefined;
    let parsedMetadataSha256: string | undefined;
    let metadataVersion: number | undefined;
    let status: ObjectAssetStatus = ObjectAssetStatus.READY;
    let nodeCount: number | undefined;
    let meshCount: number | undefined;
    let materialCount: number | undefined;
    let animationCount: number | undefined;

    try {
      const parsed = await parseGlbMetadata(bytes, {
        assetName: asset.name,
        format,
      });
      const metaStored = await this.documents.putJson(
        `assets/sha256/${stored.sha256}.metadata.v1.json`,
        parsed
      );
      parsedMetadataUri = metaStored.uri;
      parsedMetadataSha256 = metaStored.sha256;
      metadataVersion = parsed.metadataVersion;
      nodeCount = parsed.stats.nodeCount;
      meshCount = parsed.stats.meshCount;
      materialCount = parsed.stats.materialCount;
      animationCount = parsed.stats.animationCount;
    } catch {
      status = ObjectAssetStatus.FAILED;
    }

    const [revision] = await this.prisma.$transaction([
      this.prisma.objectAssetRevision.create({
        data: {
          objectAssetId: asset.id,
          version: nextVersion,
          runtimeArtifactUri: stored.uri,
          contentHash: stored.sha256,
          format,
          sizeBytes: bytes.length,
          parsedMetadataUri,
          parsedMetadataSha256,
          metadataVersion,
        },
      }),
      this.prisma.objectAsset.update({
        where: { id: asset.id },
        data: {
          fileUri: stored.uri,
          fileSha256: stored.sha256,
          format,
          sizeBytes: bytes.length,
          status,
          parsedMetadataUri,
          parsedMetadataSha256,
          metadataVersion,
          nodeCount,
          meshCount,
          materialCount,
          animationCount,
        },
      }),
    ]);

    return this.toRevisionModel(revision);
  }

  async deleteTexture(id: string) {
    const asset = await this.prisma.textureAsset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundException('Texture asset not found');
    }
    await this.prisma.textureAsset.delete({ where: { id } });
    return true;
  }

  async deleteObject(id: string) {
    const asset = await this.prisma.objectAsset.findUnique({ where: { id } });
    if (!asset) {
      throw new NotFoundException('Object asset not found');
    }
    await this.prisma.objectAsset.delete({ where: { id } });
    return true;
  }

  async updateObjectStatus(input: {
    id: string;
    status: ObjectAssetStatus;
  }) {
    const asset = await this.prisma.objectAsset.findUnique({
      where: { id: input.id },
      include: {
        revisions: { orderBy: { version: 'desc' }, take: 1 },
      },
    });
    if (!asset) {
      throw new NotFoundException('Object asset not found');
    }

    if (input.status === ObjectAssetStatus.ARCHIVED) {
      await this.assertObjectNotPinnedByActiveProducts(input.id);
    }

    const updated = await this.prisma.objectAsset.update({
      where: { id: input.id },
      data: { status: input.status },
      include: {
        revisions: { orderBy: { version: 'desc' }, take: 1 },
      },
    });
    return this.toObjectAssetModel({
      ...updated,
      currentRevisionId: updated.revisions[0]?.id ?? null,
    });
  }

  private async assertObjectNotPinnedByActiveProducts(objectAssetId: string) {
    const pins = await this.prisma.productModel.findMany({
      where: {
        objectAssetRevision: { objectAssetId },
        productRevision: {
          product: { status: { not: ProductStatus.ARCHIVED } },
        },
      },
      select: {
        productRevision: {
          select: {
            product: { select: { id: true, name: true } },
          },
        },
      },
      take: 8,
    });

    if (pins.length === 0) return;

    const names = [
      ...new Set(pins.map((pin) => pin.productRevision.product.name)),
    ];
    const label =
      names.length <= 3
        ? names.join(', ')
        : `${names.slice(0, 3).join(', ')} +${names.length - 3} more`;
    throw new BadRequestException(
      `Cannot archive: still pinned by ${label}. Archive or re-pin those products first.`
    );
  }
}

function cryptoRandom() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function parseOptionalJson(raw: string | undefined, fallback: unknown) {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    throw new BadRequestException('metadataJson must be valid JSON');
  }
}

function normalizeMaterialDocument(value: unknown) {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new BadRequestException('Material document must be an object');
  }
  const raw = value as Record<string, unknown>;
  const doc: Record<string, unknown> = {
    shaderModel: 'PBR',
  };

  const baseColor =
    typeof raw.baseColor === 'string'
      ? raw.baseColor
      : typeof raw.color === 'string'
        ? raw.color
        : undefined;
  if (baseColor) doc.baseColor = baseColor;

  const roughness =
    typeof raw.roughness === 'number' ? raw.roughness : undefined;
  if (roughness !== undefined) doc.roughness = roughness;

  const metallic =
    typeof raw.metallic === 'number'
      ? raw.metallic
      : typeof raw.metalness === 'number'
        ? raw.metalness
        : undefined;
  if (metallic !== undefined) doc.metallic = metallic;

  if (typeof raw.opacity === 'number') doc.opacity = raw.opacity;
  if (typeof raw.doubleSided === 'boolean') doc.doubleSided = raw.doubleSided;

  for (const key of [
    'baseColorTextureId',
    'normalTextureId',
    'roughnessTextureId',
    'metallicTextureId',
    'aoTextureId',
    'emissiveTextureId',
    'opacityTextureId',
  ] as const) {
    if (typeof raw[key] === 'string' && raw[key]) {
      doc[key] = raw[key];
    }
  }

  return doc;
}
