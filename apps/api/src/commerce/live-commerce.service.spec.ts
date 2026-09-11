jest.mock('@repo/commerce-core', () => {
  class CommerceConnectionResolveError extends Error {
    constructor(message: string) {
      super(message);
      this.name = 'CommerceConnectionResolveError';
    }
  }
  return {
    CommerceConnectionResolveError,
    resolveCommerceConnection: (input: {
      mappingConnectionId?: string | null;
      projectDefaultConnectionId?: string | null;
      organizationDefaultConnectionId?: string | null;
    }) => {
      const mapping = input.mappingConnectionId?.trim();
      if (mapping) return mapping;
      const project = input.projectDefaultConnectionId?.trim();
      if (project) return project;
      const org = input.organizationDefaultConnectionId?.trim();
      if (org) return org;
      throw new CommerceConnectionResolveError(
        'No commerce connection resolved: mapping, project default, and organization default are all missing'
      );
    },
  };
});

jest.mock('@repo/product-graph', () => ({
  evaluateConfiguration: () => ({
    valid: true,
    complete: true,
    issues: [],
  }),
  toResolvedCommerce: (input: {
    resolution: {
      status: string;
      provider?: string;
      integrationConnectionId?: string;
      externalReference?: { type: 'VARIANT'; id: string };
    };
    integrationConnectionId?: string | null;
  }) => {
    if (input.resolution.status !== 'RESOLVED') return null;
    const integrationConnectionId =
      input.integrationConnectionId?.trim() ||
      input.resolution.integrationConnectionId?.trim();
    if (!integrationConnectionId || !input.resolution.externalReference) {
      return null;
    }
    return {
      provider: input.resolution.provider,
      integrationConnectionId,
      externalReference: input.resolution.externalReference,
    };
  },
  canPurchase: (input: {
    evaluation: { valid: boolean; complete: boolean };
    resolution: { status: string };
    commerceState: { sellability: { status: string } };
  }) =>
    input.evaluation.valid &&
    input.evaluation.complete &&
    input.resolution.status === 'RESOLVED' &&
    input.commerceState.sellability.status === 'SELLABLE',
}));

jest.mock('@repo/commerce-medusa', () => ({
  createMedusaCommerceRuntime: jest.fn(),
}));

import { BadRequestException } from '@nestjs/common';
import type { CommerceRuntime } from '@repo/commerce-core';
import type { CommerceState } from '@repo/product-graph';
import { LiveCommerceService } from './live-commerce.service';

describe('LiveCommerceService.resolveLive', () => {
  const organizationId = 'org_1';
  const productRevisionId = 'rev_1';

  const cubecomConnection = (id: string) => ({
    id,
    organizationId,
    provider: 'cubecom',
    accessToken: JSON.stringify({
      baseUrl: 'http://localhost:9000',
      publishableApiKey: 'pk_test',
    }),
    externalAccountId: 'default',
    apiVersion: '2026-07',
  });

  function sellableRuntime(
    state: CommerceState = {
      sellability: { status: 'SELLABLE' },
      inventory: { available: 3, tracked: true },
      price: { amount: '10', currencyCode: 'USD' },
    }
  ): CommerceRuntime {
    return {
      fetchState: async () => state,
      createCart: async () => {
        throw new Error('not used');
      },
      addCartLine: async () => undefined,
      startCheckout: async () => {
        throw new Error('not used');
      },
    };
  }

  function buildService(overrides?: {
    resolveSelection?: jest.Mock;
    orgDefaultConnection?: { id: string } | null;
    runtime?: CommerceRuntime;
  }) {
    const orgDefault =
      overrides && 'orgDefaultConnection' in overrides
        ? overrides.orgDefaultConnection
        : cubecomConnection('conn_org_default');

    const prisma = {
      productRevision: {
        findUnique: jest.fn(async () => ({
          id: productRevisionId,
          product: { organizationId },
          choices: [
            {
              key: 'finish',
              required: true,
              values: [{ key: 'oak' }],
            },
          ],
        })),
      },
      integrationConnection: {
        findFirst: jest.fn(
          async (args: {
            where: { id?: string; organizationId?: string; provider?: string };
          }) => {
            if (args.where.id) {
              return cubecomConnection(args.where.id);
            }
            return orgDefault;
          }
        ),
      },
    };

    const commerceMappings = {
      resolveSelection:
        overrides?.resolveSelection ??
        jest.fn(async () => ({
          identity: { finish: 'oak' },
          identitySignature: 'sig',
          resolution: {
            status: 'RESOLVED' as const,
            provider: 'cubecom',
            externalReference: { type: 'VARIANT' as const, id: 'variant_1' },
          },
        })),
    };

    const service = new LiveCommerceService(
      prisma as never,
      commerceMappings as never
    );
    service.createRuntime = () => overrides?.runtime ?? sellableRuntime();

    return { service, prisma, commerceMappings };
  }

  it('resolved + available → SELLABLE and canPurchase', async () => {
    const { service } = buildService();
    const result = await service.resolveLive({
      productRevisionId,
      organizationId,
      provider: 'cubecom',
      selection: { finish: 'oak' },
    });

    expect(result.commerceState?.sellability).toEqual({ status: 'SELLABLE' });
    expect(result.canPurchase).toBe(true);
    expect(result.connectionRef).toBe('conn_org_default');
  });

  it('resolved + unavailable inventory → normalized non-sellable', async () => {
    const { service } = buildService({
      runtime: sellableRuntime({
        sellability: { status: 'UNSELLABLE', reason: 'OUT_OF_STOCK' },
        inventory: { available: 0, tracked: true },
      }),
    });

    const result = await service.resolveLive({
      productRevisionId,
      organizationId,
      provider: 'cubecom',
      selection: { finish: 'oak' },
    });

    expect(result.commerceState?.sellability).toEqual({
      status: 'UNSELLABLE',
      reason: 'OUT_OF_STOCK',
    });
    expect(result.canPurchase).toBe(false);
  });

  it('provider/auth failure → PROVIDER_BLOCKED', async () => {
    const { service } = buildService({
      runtime: sellableRuntime({
        sellability: { status: 'UNSELLABLE', reason: 'PROVIDER_BLOCKED' },
      }),
    });

    const result = await service.resolveLive({
      productRevisionId,
      organizationId,
      provider: 'cubecom',
      selection: { finish: 'oak' },
    });

    expect(result.commerceState?.sellability).toEqual({
      status: 'UNSELLABLE',
      reason: 'PROVIDER_BLOCKED',
    });
    expect(result.canPurchase).toBe(false);
  });

  it('unmapped selection keeps ProductGraph UNMAPPED behavior', async () => {
    const { service } = buildService({
      resolveSelection: jest.fn(async () => ({
        identity: { finish: 'oak' },
        identitySignature: 'sig',
        resolution: { status: 'UNMAPPED' as const },
      })),
    });

    const result = await service.resolveLive({
      productRevisionId,
      organizationId,
      provider: 'cubecom',
      selection: { finish: 'oak' },
    });

    expect(result.resolution.status).toBe('UNMAPPED');
    expect(result.commerceState).toBeNull();
    expect(result.canPurchase).toBe(false);
    expect(result.connectionRef).toBeNull();
  });

  it('explicit mapping connection beats org default', async () => {
    const { service, prisma } = buildService({
      resolveSelection: jest.fn(async () => ({
        identity: { finish: 'oak' },
        identitySignature: 'sig',
        resolution: {
          status: 'RESOLVED' as const,
          provider: 'cubecom',
          integrationConnectionId: 'conn_mapping',
          externalReference: { type: 'VARIANT' as const, id: 'variant_1' },
        },
      })),
    });

    const result = await service.resolveLive({
      productRevisionId,
      organizationId,
      provider: 'cubecom',
      selection: { finish: 'oak' },
    });

    expect(result.connectionRef).toBe('conn_mapping');
    expect(prisma.integrationConnection.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 'conn_mapping' }),
      })
    );
  });

  it('no connection → deterministic failure', async () => {
    const { service } = buildService({
      orgDefaultConnection: null,
      resolveSelection: jest.fn(async () => ({
        identity: { finish: 'oak' },
        identitySignature: 'sig',
        resolution: {
          status: 'RESOLVED' as const,
          provider: 'cubecom',
          externalReference: { type: 'VARIANT' as const, id: 'variant_1' },
        },
      })),
    });

    await expect(
      service.resolveLive({
        productRevisionId,
        organizationId,
        provider: 'cubecom',
        selection: { finish: 'oak' },
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects shopify on the live endpoint (Shopify path unchanged elsewhere)', async () => {
    const { service } = buildService();
    await expect(
      service.resolveLive({
        productRevisionId,
        organizationId,
        provider: 'shopify',
        selection: { finish: 'oak' },
      })
    ).rejects.toBeInstanceOf(BadRequestException);
  });
});
