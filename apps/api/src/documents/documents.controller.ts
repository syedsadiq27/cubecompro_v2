import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
  UnauthorizedException,
  StreamableFile,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { readFile } from 'node:fs/promises';
import type { Response } from 'express';
import { AuthService } from '../auth/auth.service';
import { DocumentStoreService } from './document-store.service';
import { PrismaService } from '../prisma/prisma.service';

@Controller('documents')
export class DocumentsController {
  constructor(
    private readonly documents: DocumentStoreService,
    private readonly prisma: PrismaService,
    private readonly auth: AuthService
  ) {}

  private requireUser(req: { headers: { authorization?: string } }) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    return this.auth.verifyAccessToken(
      header.slice('Bearer '.length).trim()
    );
  }

  @Get('objects/:id/metadata')
  async getObjectMetadata(
    @Param('id') id: string,
    @Req()
    req: { headers: { authorization?: string } },
    @Res({ passthrough: true }) res: Response
  ) {
    const user = this.requireUser(req);

    const asset = await this.prisma.objectAsset.findUnique({
      where: { id },
      include: {
        revisions: { orderBy: { version: 'desc' }, take: 1 },
      },
    });
    if (!asset || asset.organizationId !== user.organizationId) {
      throw new NotFoundException('Object asset not found');
    }
    const metaUri =
      asset.revisions[0]?.parsedMetadataUri ?? asset.parsedMetadataUri;
    if (!metaUri) {
      throw new NotFoundException('Object metadata missing');
    }

    const absolute = this.documents.resolveAbsolutePath(metaUri);
    if (!absolute) {
      throw new NotFoundException('Object metadata file missing');
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'private, max-age=60');
    return new StreamableFile(createReadStream(absolute));
  }

  @Get('objects/:id')
  async getObject(
    @Param('id') id: string,
    @Req()
    req: { headers: { authorization?: string } },
    @Res({ passthrough: true }) res: Response
  ) {
    const user = this.requireUser(req);

    const asset = await this.prisma.objectAsset.findUnique({
      where: { id },
      include: {
        revisions: { orderBy: { version: 'desc' }, take: 1 },
      },
    });
    if (!asset || asset.organizationId !== user.organizationId) {
      throw new NotFoundException('Object asset not found');
    }

    const tip = asset.revisions[0];
    const uri = tip?.runtimeArtifactUri ?? asset.fileUri;
    const absolute = this.documents.resolveAbsolutePath(uri);
    if (!absolute) {
      throw new NotFoundException('Object file missing');
    }

    const isGlb = absolute.endsWith('.glb');
    res.setHeader(
      'Content-Type',
      isGlb ? 'model/gltf-binary' : 'application/octet-stream'
    );
    res.setHeader('Cache-Control', 'private, max-age=60');
    return new StreamableFile(createReadStream(absolute));
  }

  @Get('object-revisions/:id')
  async getObjectRevision(
    @Param('id') id: string,
    @Req()
    req: { headers: { authorization?: string } },
    @Res({ passthrough: true }) res: Response
  ) {
    const user = this.requireUser(req);

    const revision = await this.prisma.objectAssetRevision.findUnique({
      where: { id },
      include: { objectAsset: true },
    });
    if (
      !revision ||
      revision.objectAsset.organizationId !== user.organizationId
    ) {
      throw new NotFoundException('Object asset revision not found');
    }

    const absolute = this.documents.resolveAbsolutePath(
      revision.runtimeArtifactUri
    );
    if (!absolute) {
      throw new NotFoundException('Object revision artifact missing');
    }

    const bytes = await readFile(absolute);
    const hash = createHash('sha256').update(bytes).digest('hex');
    if (hash !== revision.contentHash) {
      throw new BadRequestException(
        'Object revision artifact hash mismatch (corrupt or substituted)'
      );
    }

    const isGlb =
      absolute.endsWith('.glb') || revision.format === 'glb';
    res.setHeader(
      'Content-Type',
      isGlb ? 'model/gltf-binary' : 'application/octet-stream'
    );
    res.setHeader('Cache-Control', 'private, max-age=300');
    res.setHeader('X-Content-Hash', revision.contentHash);
    return new StreamableFile(bytes);
  }

  @Get('materials/:id')
  async getMaterial(
    @Param('id') id: string,
    @Req()
    req: { headers: { authorization?: string } },
    @Res({ passthrough: true }) res: Response
  ) {
    const user = this.requireUser(req);

    const asset = await this.prisma.materialAsset.findUnique({ where: { id } });
    if (!asset || asset.organizationId !== user.organizationId) {
      throw new NotFoundException('Material asset not found');
    }

    const absolute = this.documents.resolveAbsolutePath(asset.documentUri);
    if (!absolute) {
      throw new NotFoundException('Material document missing');
    }

    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'private, max-age=60');
    return new StreamableFile(createReadStream(absolute));
  }
}
