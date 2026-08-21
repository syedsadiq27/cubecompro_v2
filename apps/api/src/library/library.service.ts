import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ObjectAssetPurpose,
  ObjectAssetStatus,
  LibraryRevisionStatus,
  ProductStatus,
  TextureSemanticSlot,
  type Prisma,
} from '@prisma/client';
import { DocumentStoreService } from '../documents/document-store.service';
import { EntitlementService } from '../entitlements/entitlement.service';
import { PrismaService } from '../prisma/prisma.service';
import { parseGlbMetadata } from './parse-glb';
import { MATERIAL_FACTORS, TEXTURE_SLOT_PROPERTIES, normalizeMaterialSampler } from '@repo/product-graph';

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
        include: {
          revisions: { orderBy: { version: 'desc' } },
        },
      })
      .then((assets) =>
        assets.map((asset) => {
          const published = asset.revisions.find(
            (row) => row.status === LibraryRevisionStatus.PUBLISHED
          );
          const draft = asset.revisions.find(
            (row) => row.status === LibraryRevisionStatus.DRAFT
          );
          return {
            id: asset.id,
            organizationId: asset.organizationId,
            projectId: asset.projectId,
            folderId: asset.folderId,
            name: asset.name,
            code: asset.code,
            documentUri: asset.documentUri,
            documentSha256: asset.documentSha256,
            documentUrl: this.publicMaterialUrl(asset.id),
            currentRevisionId: (draft ?? published)?.id ?? null,
            publishedRevisionId: published?.id ?? null,
            hasDraft: Boolean(draft),
            createdAt: asset.createdAt,
            updatedAt: asset.updatedAt,
          };
        })
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
    const frozen = await this.freezeMaterialDocument({
      organizationId: input.organizationId,
      projectId: input.projectId,
      idHint,
      document: document as Record<string, unknown>,
    });

    const created = await this.prisma.materialAsset.create({
      data: {
        organizationId: input.organizationId,
        projectId: input.projectId,
        folderId: input.folderId,
        name: input.name,
        code: input.code,
        documentUri: frozen.definitionUri,
        documentSha256: frozen.contentHash,
        revisions: {
          create: {
            version: 1,
            status: LibraryRevisionStatus.DRAFT,
            definitionUri: frozen.definitionUri,
            contentHash: frozen.contentHash,
            textureUsages: {
              create: frozen.textureUsages.map((usage) => ({
                slot: usage.slot,
                textureAssetRevisionId: usage.textureAssetRevisionId,
                ...(usage.texCoord !== undefined
                  ? { texCoord: usage.texCoord }
                  : {}),
                ...(usage.transformJson
                  ? { transformJson: usage.transformJson }
                  : {}),
                ...(usage.samplerJson
                  ? { samplerJson: usage.samplerJson }
                  : {}),
              })),
            },
          },
        },
      },
      include: {
        revisions: { orderBy: { version: 'desc' }, take: 1 },
      },
    });

    return {
      ...created,
      documentUrl: this.publicMaterialUrl(created.id),
      currentRevisionId: created.revisions[0]?.id ?? null,
      publishedRevisionId: null,
      hasDraft: true,
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
      include: {
        revisions: { orderBy: { version: 'desc' } },
      },
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

    const draft = existing.revisions.find(
      (row) => row.status === LibraryRevisionStatus.DRAFT
    );
    const published = existing.revisions.find(
      (row) => row.status === LibraryRevisionStatus.PUBLISHED
    );
    let currentRevisionId = (draft ?? published)?.id ?? null;

    if (input.documentJson !== undefined) {
      let document: unknown;
      try {
        document = JSON.parse(input.documentJson);
      } catch {
        throw new BadRequestException('documentJson must be valid JSON');
      }
      document = normalizeMaterialDocument(document);

      const version =
        draft?.version ?? (existing.revisions[0]?.version ?? 0) + 1;
      const frozen = await this.freezeMaterialDocument({
        organizationId: existing.organizationId,
        projectId: existing.projectId,
        idHint: `${existing.id}-v${version}-draft`,
        document: document as Record<string, unknown>,
      });
      data.documentUri = frozen.definitionUri;
      data.documentSha256 = frozen.contentHash;

      const usageRows = frozen.textureUsages.map((usage) => ({
        slot: usage.slot,
        textureAssetRevisionId: usage.textureAssetRevisionId,
        ...(usage.texCoord !== undefined ? { texCoord: usage.texCoord } : {}),
        ...(usage.transformJson
          ? { transformJson: usage.transformJson }
          : {}),
        ...(usage.samplerJson ? { samplerJson: usage.samplerJson } : {}),
      }));

      if (draft) {
        await this.prisma.$transaction(async (tx) => {
          await tx.materialTextureUsage.deleteMany({
            where: { materialAssetRevisionId: draft.id },
          });
          await tx.materialAssetRevision.update({
            where: { id: draft.id },
            data: {
              definitionUri: frozen.definitionUri,
              contentHash: frozen.contentHash,
              frozenAt: new Date(),
              textureUsages: { create: usageRows },
            },
          });
        });
        currentRevisionId = draft.id;
      } else {
        const revision = await this.prisma.materialAssetRevision.create({
          data: {
            materialAssetId: existing.id,
            version,
            status: LibraryRevisionStatus.DRAFT,
            definitionUri: frozen.definitionUri,
            contentHash: frozen.contentHash,
            textureUsages: { create: usageRows },
          },
        });
        currentRevisionId = revision.id;
      }
    }

    const updated = await this.prisma.materialAsset.update({
      where: { id: existing.id },
      data,
    });
    const publishedRevision = await this.prisma.materialAssetRevision.findFirst(
      {
        where: {
          materialAssetId: existing.id,
          status: LibraryRevisionStatus.PUBLISHED,
        },
        orderBy: { version: 'desc' },
      }
    );
    return {
      ...updated,
      documentUrl: this.publicMaterialUrl(updated.id),
      currentRevisionId,
      publishedRevisionId: publishedRevision?.id ?? null,
      hasDraft: true,
    };
  }

  async publishMaterial(id: string) {
    const draft = await this.prisma.materialAssetRevision.findFirst({
      where: { materialAssetId: id, status: LibraryRevisionStatus.DRAFT },
      orderBy: { version: 'desc' },
    });
    if (!draft) {
      throw new BadRequestException('No draft material revision to publish');
    }

    const published = await this.prisma.materialAssetRevision.update({
      where: { id: draft.id },
      data: {
        status: LibraryRevisionStatus.PUBLISHED,
        frozenAt: new Date(),
      },
    });

    const asset = await this.prisma.materialAsset.findUnique({
      where: { id },
    });
    if (!asset) {
      throw new NotFoundException('Material asset not found');
    }

    return {
      ...asset,
      documentUrl: this.publicMaterialUrl(asset.id),
      currentRevisionId: published.id,
      publishedRevisionId: published.id,
      hasDraft: false,
    };
  }

  listTextures(projectId: string) {
    return this.prisma.textureAsset.findMany({
      where: { projectId },
      orderBy: { name: 'asc' },
      include: {
        revisions: { orderBy: { version: 'desc' }, take: 1 },
      },
    }).then((assets) =>
      assets.map((asset) => {
        const revision = asset.revisions[0];
        return {
          id: asset.id,
          organizationId: asset.organizationId,
          projectId: asset.projectId,
          folderId: asset.folderId,
          name: asset.name,
          code: asset.code,
          fileUri: asset.fileUri,
          fileSha256: asset.fileSha256,
          currentRevisionId: revision?.id ?? null,
          fileUrl: revision
            ? this.publicTextureRevisionUrl(revision.id)
            : null,
          sizeBytes: revision?.sizeBytes ?? null,
          mimeType: revision?.mimeType ?? null,
          createdAt: asset.createdAt,
          updatedAt: asset.updatedAt,
        };
      })
    );
  }

  async createTexture(input: {
    organizationId: string;
    projectId: string;
    folderId?: string;
    name: string;
    code?: string;
    metadataJson?: string;
    fileBase64?: string;
    fileName?: string;
  }) {
    await this.assertProject(input.organizationId, input.projectId);

    if (input.fileBase64) {
      const bytes = Buffer.from(input.fileBase64, 'base64');
      if (bytes.length === 0) {
        throw new BadRequestException('Texture file is empty');
      }
      const { extension, mimeType } = textureFileMeta(input.fileName);
      const stored = await this.documents.putImmutableBytes(bytes, extension);
      const created = await this.prisma.textureAsset.create({
        data: {
          organizationId: input.organizationId,
          projectId: input.projectId,
          folderId: input.folderId,
          name: input.name,
          code: input.code,
          fileUri: stored.uri,
          fileSha256: stored.sha256,
          revisions: {
            create: {
              version: 1,
              status: LibraryRevisionStatus.PUBLISHED,
              artifactUri: stored.uri,
              contentHash: stored.sha256,
              mimeType,
              sizeBytes: bytes.length,
            },
          },
        },
        include: {
          revisions: { orderBy: { version: 'desc' }, take: 1 },
        },
      });
      return {
        ...created,
        currentRevisionId: created.revisions[0]?.id ?? null,
      };
    }

    const metadata = parseOptionalJson(input.metadataJson, {
      kind: 'texture',
      name: input.name,
    });
    const idHint = cryptoRandom();
    const stored = await this.documents.putJson(
      `${input.organizationId}/${input.projectId}/textures/${idHint}.json`,
      metadata
    );

    const created = await this.prisma.textureAsset.create({
      data: {
        organizationId: input.organizationId,
        projectId: input.projectId,
        folderId: input.folderId,
        name: input.name,
        code: input.code,
        fileUri: stored.uri,
        fileSha256: stored.sha256,
        revisions: {
          create: {
            version: 1,
            status: LibraryRevisionStatus.PUBLISHED,
            artifactUri: stored.uri,
            contentHash: stored.sha256,
            mimeType: 'application/json',
          },
        },
      },
      include: {
        revisions: { orderBy: { version: 'desc' }, take: 1 },
      },
    });

    return {
      ...created,
      currentRevisionId: created.revisions[0]?.id ?? null,
    };
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
    createdAt: Date;
    updatedAt: Date;
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
    status: LibraryRevisionStatus;
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

  private async resolveTextureRevisionId(
    projectId: string,
    idHint: string
  ): Promise<string> {
    const asRevision = await this.prisma.textureAssetRevision.findUnique({
      where: { id: idHint },
      include: { textureAsset: true },
    });
    if (asRevision) {
      if (asRevision.textureAsset.projectId !== projectId) {
        throw new BadRequestException(
          `Texture revision ${idHint} is outside this project`
        );
      }
      return asRevision.id;
    }

    const asset = await this.prisma.textureAsset.findFirst({
      where: { id: idHint, projectId },
      include: {
        revisions: { orderBy: { version: 'desc' }, take: 1 },
      },
    });
    if (asset?.revisions[0]) {
      return asset.revisions[0].id;
    }

    throw new BadRequestException(
      `Unknown textureAssetRevisionId / textureAssetId: ${idHint}`
    );
  }

  private async freezeMaterialDocument(input: {
    organizationId: string;
    projectId: string;
    idHint: string;
    document: Record<string, unknown>;
  }): Promise<{
    definitionUri: string;
    contentHash: string;
    textureUsages: Array<{
      slot: TextureSemanticSlot;
      textureAssetRevisionId: string;
      texCoord?: number;
      transformJson?: Prisma.InputJsonValue;
      samplerJson?: Prisma.InputJsonValue;
    }>;
  }> {
    const definition: Record<string, unknown> = {
      shaderModel: 'PBR',
    };
    for (const factor of MATERIAL_FACTORS) {
      if (input.document[factor.key] !== undefined) {
        definition[factor.key] = input.document[factor.key];
      }
    }

    const usages: Array<{
      slot: TextureSemanticSlot;
      textureAssetRevisionId: string;
      texCoord?: number;
      transformJson?: Prisma.InputJsonValue;
      samplerJson?: Prisma.InputJsonValue;
    }> = [];

    for (const slot of TEXTURE_SLOT_PROPERTIES) {
      const idHint = slot.legacyIds
        .map((key) => input.document[key])
        .find(
          (value): value is string =>
            typeof value === 'string' && value.trim().length > 0
        );
      if (!idHint) continue;
      usages.push({
        slot: slot.slot,
        textureAssetRevisionId: await this.resolveTextureRevisionId(
          input.projectId,
          idHint.trim()
        ),
      });
    }

    if (Array.isArray(input.document.textureUsages)) {
      for (const raw of input.document.textureUsages) {
        if (typeof raw !== 'object' || raw === null) continue;
        const entry = raw as Record<string, unknown>;
        const slot =
          typeof entry.slot === 'string' &&
          (Object.values(TextureSemanticSlot) as string[]).includes(entry.slot)
            ? (entry.slot as TextureSemanticSlot)
            : null;
        const idHint =
          typeof entry.textureAssetRevisionId === 'string'
            ? entry.textureAssetRevisionId.trim()
            : '';
        if (!slot || !idHint) continue;
        const existing = usages.findIndex((u) => u.slot === slot);
        const next = {
          slot,
          textureAssetRevisionId: await this.resolveTextureRevisionId(
            input.projectId,
            idHint
          ),
          ...(typeof entry.texCoord === 'number'
            ? { texCoord: entry.texCoord }
            : {}),
          ...(entry.transform && typeof entry.transform === 'object'
            ? { transformJson: entry.transform as Prisma.InputJsonValue }
            : {}),
          ...(normalizeMaterialSampler(entry.sampler)
            ? {
                samplerJson: normalizeMaterialSampler(
                  entry.sampler
                ) as Prisma.InputJsonValue,
              }
            : {}),
        };
        if (existing >= 0) usages[existing] = next;
        else usages.push(next);
      }
    }

    const stored = await this.documents.putJson(
      `${input.organizationId}/${input.projectId}/material-revisions/${input.idHint}.json`,
      {
        ...definition,
        textureUsages: usages.map((usage) => ({
          slot: usage.slot,
          textureAssetRevisionId: usage.textureAssetRevisionId,
          ...(usage.texCoord !== undefined ? { texCoord: usage.texCoord } : {}),
          ...(usage.transformJson ? { transform: usage.transformJson } : {}),
          ...(usage.samplerJson ? { sampler: usage.samplerJson } : {}),
        })),
      }
    );

    return {
      definitionUri: stored.uri,
      contentHash: stored.sha256,
      textureUsages: usages,
    };
  }

  private publicMaterialUrl(id: string) {
    const base =
      process.env.API_PUBLIC_URL ??
      process.env.NEXT_PUBLIC_PRODUCT_GRAPH_URL ??
      'http://localhost:3005';
    return `${base.replace(/\/$/, '')}/documents/materials/${id}`;
  }

  private publicMaterialRevisionUrl(id: string) {
    const base =
      process.env.API_PUBLIC_URL ??
      process.env.NEXT_PUBLIC_PRODUCT_GRAPH_URL ??
      'http://localhost:3005';
    return `${base.replace(/\/$/, '')}/documents/material-revisions/${id}`;
  }

  private publicTextureRevisionUrl(id: string) {
    const base =
      process.env.API_PUBLIC_URL ??
      process.env.NEXT_PUBLIC_PRODUCT_GRAPH_URL ??
      'http://localhost:3005';
    return `${base.replace(/\/$/, '')}/documents/texture-revisions/${id}`;
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

  listMaterialRevisions(materialAssetId: string) {
    return this.prisma.materialAssetRevision
      .findMany({
        where: { materialAssetId },
        orderBy: { version: 'asc' },
        include: {
          textureUsages: {
            include: {
              textureRevision: {
                include: { textureAsset: { select: { name: true } } },
              },
            },
          },
        },
      })
      .then((revisions) =>
        revisions.map((revision) => ({
          id: revision.id,
          materialAssetId: revision.materialAssetId,
          version: revision.version,
          definitionUri: revision.definitionUri,
          contentHash: revision.contentHash,
          frozenAt: revision.frozenAt,
          documentUrl: this.publicMaterialRevisionUrl(revision.id),
          status: revision.status,
          textureUsages: revision.textureUsages.map((usage) => ({
            slot: usage.slot,
            textureAssetRevisionId: usage.textureAssetRevisionId,
            textureName: usage.textureRevision.textureAsset.name,
            wrapS:
              usage.samplerJson &&
              typeof usage.samplerJson === 'object' &&
              !Array.isArray(usage.samplerJson) &&
              typeof (usage.samplerJson as { wrapS?: unknown }).wrapS ===
                'string'
                ? String((usage.samplerJson as { wrapS: string }).wrapS)
                : null,
            wrapT:
              usage.samplerJson &&
              typeof usage.samplerJson === 'object' &&
              !Array.isArray(usage.samplerJson) &&
              typeof (usage.samplerJson as { wrapT?: unknown }).wrapT ===
                'string'
                ? String((usage.samplerJson as { wrapT: string }).wrapT)
                : null,
          })),
        }))
      );
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
              status: LibraryRevisionStatus.PUBLISHED,
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
            status: LibraryRevisionStatus.PUBLISHED,
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

    const draft = await this.prisma.objectAssetRevision.findFirst({
      where: {
        objectAssetId: asset.id,
        status: LibraryRevisionStatus.DRAFT,
      },
      orderBy: { version: 'desc' },
    });
    const latest = await this.prisma.objectAssetRevision.findFirst({
      where: { objectAssetId: asset.id },
      orderBy: { version: 'desc' },
    });
    const version = draft?.version ?? (latest?.version ?? 0) + 1;

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

    const revisionData = {
      runtimeArtifactUri: stored.uri,
      contentHash: stored.sha256,
      format,
      sizeBytes: bytes.length,
      parsedMetadataUri,
      parsedMetadataSha256,
      metadataVersion,
      frozenAt: new Date(),
    };

    const revision = draft
      ? await this.prisma.objectAssetRevision.update({
          where: { id: draft.id },
          data: revisionData,
        })
      : await this.prisma.objectAssetRevision.create({
          data: {
            objectAssetId: asset.id,
            version,
            status: LibraryRevisionStatus.DRAFT,
            ...revisionData,
          },
        });

    await this.prisma.objectAsset.update({
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
    });

    return this.toRevisionModel(revision);
  }

  async publishObject(id: string) {
    const draft = await this.prisma.objectAssetRevision.findFirst({
      where: { objectAssetId: id, status: LibraryRevisionStatus.DRAFT },
      orderBy: { version: 'desc' },
    });
    if (!draft) {
      throw new BadRequestException('No draft object revision to publish');
    }
    const published = await this.prisma.objectAssetRevision.update({
      where: { id: draft.id },
      data: {
        status: LibraryRevisionStatus.PUBLISHED,
        frozenAt: new Date(),
      },
    });
    return this.toRevisionModel(published);
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

function textureFileMeta(fileName?: string): {
  extension: string;
  mimeType: string;
} {
  const lower = (fileName ?? '').toLowerCase();
  if (lower.endsWith('.png')) return { extension: 'png', mimeType: 'image/png' };
  if (lower.endsWith('.jpg') || lower.endsWith('.jpeg')) {
    return { extension: 'jpg', mimeType: 'image/jpeg' };
  }
  if (lower.endsWith('.webp')) {
    return { extension: 'webp', mimeType: 'image/webp' };
  }
  if (lower.endsWith('.ktx2')) {
    return { extension: 'ktx2', mimeType: 'image/ktx2' };
  }
  if (lower.endsWith('.gif')) return { extension: 'gif', mimeType: 'image/gif' };
  return { extension: 'bin', mimeType: 'application/octet-stream' };
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
  if (typeof raw.emissive === 'string') doc.emissive = raw.emissive;
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

  if (Array.isArray(raw.textureUsages)) {
    doc.textureUsages = raw.textureUsages;
  }

  return doc;
}
