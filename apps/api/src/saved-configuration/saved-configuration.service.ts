import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GraphVersionStatus } from '@prisma/client';
import { DocumentStoreService } from '../documents/document-store.service';
import { PrismaService } from '../prisma/prisma.service';
import { ResolveService } from '../resolve/resolve.service';

@Injectable()
export class SavedConfigurationService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly documents: DocumentStoreService,
    private readonly resolveService: ResolveService
  ) {}

  async save(input: {
    productId: string;
    productRevisionId: string;
    selectionsJson: string;
    metadataJson?: string;
  }) {
    const product = await this.prisma.product.findUnique({
      where: { id: input.productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const version = await this.prisma.productRevision.findFirst({
      where: {
        id: input.productRevisionId,
        productId: product.id,
        status: GraphVersionStatus.PUBLISHED,
      },
    });
    if (!version) {
      throw new BadRequestException(
        'SavedConfiguration requires a published ProductRevision'
      );
    }

    let selections: Record<string, unknown>;
    try {
      selections = JSON.parse(input.selectionsJson) as Record<string, unknown>;
    } catch {
      throw new BadRequestException('selectionsJson must be valid JSON');
    }

    const resolved = await this.resolveService.resolve({
      productId: product.id,
      productRevisionId: version.id,
      selections,
    });

    const statePayload = {
      configurationState: {
        productId: product.id,
        productRevisionId: version.id,
        graphVersion: version.version,
        selections,
      },
      resolved,
    };

    const stored = await this.documents.putJson(
      `${product.organizationId}/${product.projectId}/configurations/${Date.now().toString(36)}.json`,
      statePayload
    );

    let metadata: unknown = undefined;
    if (input.metadataJson) {
      try {
        metadata = JSON.parse(input.metadataJson);
      } catch {
        throw new BadRequestException('metadataJson must be valid JSON');
      }
    }

    return this.prisma.savedConfiguration.create({
      data: {
        organizationId: product.organizationId,
        projectId: product.projectId,
        productId: product.id,
        productRevisionId: version.id,
        stateUri: stored.uri,
        stateSha256: stored.sha256,
        metadata: metadata as object | undefined,
      },
    });
  }

  async getById(id: string) {
    const saved = await this.prisma.savedConfiguration.findUnique({
      where: { id },
    });
    if (!saved) {
      throw new NotFoundException(`SavedConfiguration ${id} not found`);
    }
    return saved;
  }
}
