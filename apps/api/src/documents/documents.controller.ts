import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Req,
  Res,
  UnauthorizedException,
  StreamableFile,
} from '@nestjs/common';
import { createReadStream } from 'node:fs';
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

  @Get('objects/:id/metadata')
  async getObjectMetadata(
    @Param('id') id: string,
    @Req()
    req: { headers: { authorization?: string } },
    @Res({ passthrough: true }) res: Response
  ) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const user = this.auth.verifyAccessToken(
      header.slice('Bearer '.length).trim()
    );

    const asset = await this.prisma.objectAsset.findUnique({ where: { id } });
    if (!asset || asset.organizationId !== user.organizationId) {
      throw new NotFoundException('Object asset not found');
    }
    if (!asset.parsedMetadataUri) {
      throw new NotFoundException('Object metadata missing');
    }

    const absolute = this.documents.resolveAbsolutePath(
      asset.parsedMetadataUri
    );
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
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const user = this.auth.verifyAccessToken(
      header.slice('Bearer '.length).trim()
    );

    const asset = await this.prisma.objectAsset.findUnique({ where: { id } });
    if (!asset || asset.organizationId !== user.organizationId) {
      throw new NotFoundException('Object asset not found');
    }

    const absolute = this.documents.resolveAbsolutePath(asset.fileUri);
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

  @Get('materials/:id')
  async getMaterial(
    @Param('id') id: string,
    @Req()
    req: { headers: { authorization?: string } },
    @Res({ passthrough: true }) res: Response
  ) {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing bearer token');
    }
    const user = this.auth.verifyAccessToken(
      header.slice('Bearer '.length).trim()
    );

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
