import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CommerceConnectionResolveError,
  resolveCommerceConnection,
} from '@repo/commerce-core';
import {
  canPurchase,
  evaluateConfiguration,
  toResolvedCommerce,
  type CommerceState,
  type CommerceResolution,
  type Selection,
} from '@repo/product-graph';
import { CommerceMappingService } from '../product/commerce-mapping.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  createCommerceRuntime,
  type CommerceConnectionRecord,
  type CreateCommerceRuntimeOptions,
  type CubecomConnectionConfig,
  UnsupportedCommerceProviderError,
} from './create-commerce-runtime';

function parseCubecomConfigJson(
  value: unknown
): CubecomConnectionConfig | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  const record = value as Record<string, unknown>;
  const baseUrl =
    typeof record.baseUrl === 'string' ? record.baseUrl.trim() : '';
  const publishableApiKey =
    typeof record.publishableApiKey === 'string'
      ? record.publishableApiKey.trim()
      : '';
  if (!baseUrl || !publishableApiKey) {
    return null;
  }
  return {
    baseUrl,
    publishableApiKey,
    regionId:
      typeof record.regionId === 'string' && record.regionId.trim()
        ? record.regionId.trim()
        : undefined,
    currencyCode:
      typeof record.currencyCode === 'string' && record.currencyCode.trim()
        ? record.currencyCode.trim()
        : undefined,
  };
}

export type ResolveCommerceLiveInput = {
  productRevisionId: string;
  provider: string;
  selection: Selection;
  organizationId: string;
  integrationConnectionId?: string | null;
  projectDefaultConnectionId?: string | null;
};

export type ResolveCommerceLiveResult = {
  resolution: CommerceResolution;
  identitySignature: string;
  identity: Record<string, string | null>;
  connectionRef: string | null;
  commerceState: CommerceState | null;
  canPurchase: boolean;
  evaluation: { valid: boolean; complete: boolean };
};

@Injectable()
export class LiveCommerceService {
  createRuntime = createCommerceRuntime;

  constructor(
    private readonly prisma: PrismaService,
    private readonly commerceMappings: CommerceMappingService
  ) {}

  async resolveLive(
    input: ResolveCommerceLiveInput,
    runtimeOptions: CreateCommerceRuntimeOptions = {}
  ): Promise<ResolveCommerceLiveResult> {
    if (input.provider !== 'cubecom') {
      throw new BadRequestException(
        `Live commerce resolve supports provider "cubecom" only (got "${input.provider}")`
      );
    }

    const revision = await this.prisma.productRevision.findUnique({
      where: { id: input.productRevisionId },
      include: {
        product: true,
        choices: { include: { values: true } },
      },
    });
    if (!revision) {
      throw new NotFoundException('Product revision not found');
    }
    if (revision.product.organizationId !== input.organizationId) {
      throw new BadRequestException(
        'organizationId does not match product revision organization'
      );
    }

    const mapped = await this.commerceMappings.resolveSelection({
      productRevisionId: input.productRevisionId,
      provider: input.provider,
      selection: input.selection,
      integrationConnectionId: input.integrationConnectionId,
    });

    const evaluationResult = evaluateConfiguration(
      input.selection,
      revision.choices.map((choice) => ({
        key: choice.key,
        required: choice.required,
        values: choice.values.map((value) => ({ key: value.key })),
      })),
      []
    );
    const evaluation = {
      valid: evaluationResult.valid,
      complete: evaluationResult.complete,
    };

    if (mapped.resolution.status !== 'RESOLVED') {
      return {
        resolution: mapped.resolution,
        identitySignature: mapped.identitySignature,
        identity: mapped.identity,
        connectionRef: null,
        commerceState: null,
        canPurchase: false,
        evaluation,
      };
    }

    const organizationDefault = await this.prisma.integrationConnection.findFirst(
      {
        where: {
          organizationId: input.organizationId,
          provider: 'cubecom',
        },
        orderBy: { createdAt: 'asc' },
      }
    );

    let connectionRef: string;
    try {
      connectionRef = resolveCommerceConnection({
        mappingConnectionId:
          mapped.resolution.integrationConnectionId ??
          input.integrationConnectionId,
        projectDefaultConnectionId: input.projectDefaultConnectionId,
        organizationDefaultConnectionId: organizationDefault?.id ?? null,
      });
    } catch (error) {
      if (error instanceof CommerceConnectionResolveError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }

    const connection = await this.prisma.integrationConnection.findFirst({
      where: {
        id: connectionRef,
        organizationId: input.organizationId,
      },
    });
    if (!connection) {
      throw new NotFoundException('Commerce connection not found');
    }
    if (connection.provider !== 'cubecom') {
      throw new BadRequestException(
        `Resolved connection provider must be cubecom (got "${connection.provider}")`
      );
    }

    const record: CommerceConnectionRecord = {
      id: connection.id,
      provider: connection.provider,
      accessToken: connection.accessToken,
      externalAccountId: connection.externalAccountId,
      apiVersion: connection.apiVersion,
      config: parseCubecomConfigJson(connection.configJson),
    };

    let runtime;
    try {
      runtime = this.createRuntime(record, runtimeOptions);
    } catch (error) {
      if (error instanceof UnsupportedCommerceProviderError) {
        throw new BadRequestException(error.message);
      }
      throw error;
    }

    const resolved = toResolvedCommerce({
      resolution: mapped.resolution,
      integrationConnectionId: connectionRef,
    });
    if (!resolved) {
      return {
        resolution: mapped.resolution,
        identitySignature: mapped.identitySignature,
        identity: mapped.identity,
        connectionRef,
        commerceState: null,
        canPurchase: false,
        evaluation,
      };
    }

    const commerceState = await runtime.fetchState(resolved);
    const purchase = canPurchase({
      evaluation,
      resolution: mapped.resolution,
      commerceState,
    });

    return {
      resolution: mapped.resolution,
      identitySignature: mapped.identitySignature,
      identity: mapped.identity,
      connectionRef,
      commerceState,
      canPurchase: purchase,
      evaluation,
    };
  }
}
