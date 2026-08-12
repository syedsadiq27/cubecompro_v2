import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DocumentStoreService } from '../documents/document-store.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LibraryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documents: DocumentStoreService
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
    return this.prisma.materialAsset.findMany({
      where: { projectId },
      orderBy: { name: 'asc' },
    });
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
    const materialsEnabled =
      await this.prisma.organizationEntitlement.findUnique({
        where: {
          organizationId_key: {
            organizationId: input.organizationId,
            key: 'materialsEnabled',
          },
        },
      });
    if (materialsEnabled && materialsEnabled.value === false) {
      throw new ForbiddenException('materialsEnabled entitlement is false');
    }

    let document: unknown;
    try {
      document = JSON.parse(input.documentJson);
    } catch {
      throw new BadRequestException('documentJson must be valid JSON');
    }

    const idHint = cryptoRandom();
    const stored = await this.documents.putJson(
      `${input.organizationId}/${input.projectId}/materials/${idHint}.json`,
      document
    );

    return this.prisma.materialAsset.create({
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

  listObjects(projectId: string) {
    return this.prisma.objectAsset.findMany({
      where: { projectId },
      orderBy: { name: 'asc' },
    }).then((assets) =>
      assets.map((asset) => ({
        ...asset,
        fileUrl: this.publicObjectUrl(asset.id),
      }))
    );
  }

  private publicObjectUrl(id: string) {
    const base =
      process.env.API_PUBLIC_URL ??
      process.env.NEXT_PUBLIC_PRODUCT_GRAPH_URL ??
      'http://localhost:3005';
    return `${base.replace(/\/$/, '')}/documents/objects/${id}`;
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
  }) {
    await this.assertProject(input.organizationId, input.projectId);
    const idHint = cryptoRandom();
    let stored;
    if (input.fileBase64) {
      const bytes = Buffer.from(input.fileBase64, 'base64');
      const ext = input.fileName?.toLowerCase().endsWith('.gltf')
        ? 'gltf'
        : 'glb';
      stored = await this.documents.putBytes(
        `${input.organizationId}/${input.projectId}/objects/${idHint}.${ext}`,
        bytes
      );
    } else {
      const metadata = parseOptionalJson(input.metadataJson, {
        kind: 'object',
        name: input.name,
      });
      stored = await this.documents.putJson(
        `${input.organizationId}/${input.projectId}/objects/${idHint}.json`,
        metadata
      );
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
      },
    });
    return { ...asset, fileUrl: this.publicObjectUrl(asset.id) };
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
