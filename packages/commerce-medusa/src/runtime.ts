import type {
  CommerceRuntime,
} from '@repo/commerce-core';
import type { CommerceState, ResolvedCommerce } from '@repo/product-graph';

import type { ResolveMedusaConnection } from './connection.js';
import { CommerceRuntimeNotSupportedError } from './errors.js';
import { fetchMedusaVariantCommerceState } from './http.js';
import { commerceStateFromProviderFailure } from './map-state.js';

export type CreateMedusaCommerceRuntimeOptions = {
  resolveConnection: ResolveMedusaConnection;
  fetchImpl?: typeof fetch;
};

export function createMedusaCommerceRuntime(
  options: CreateMedusaCommerceRuntimeOptions
): CommerceRuntime {
  const fetchState = async (
    resolved: ResolvedCommerce
  ): Promise<CommerceState> => {
    if (resolved.externalReference.type !== 'VARIANT') {
      return {
        sellability: { status: 'UNSELLABLE', reason: 'NOT_AVAILABLE' },
        observedAt: new Date(),
      };
    }

    const variantId = resolved.externalReference.id?.trim();
    if (!variantId) {
      return {
        sellability: { status: 'UNSELLABLE', reason: 'NOT_AVAILABLE' },
        observedAt: new Date(),
      };
    }

    let connection;
    try {
      connection = await options.resolveConnection(
        resolved.integrationConnectionId
      );
    } catch {
      return commerceStateFromProviderFailure('UNKNOWN');
    }

    if (!connection?.baseUrl?.trim() || !connection.publishableApiKey?.trim()) {
      return commerceStateFromProviderFailure('PROVIDER_BLOCKED');
    }

    return fetchMedusaVariantCommerceState({
      connection: {
        baseUrl: connection.baseUrl.trim(),
        publishableApiKey: connection.publishableApiKey.trim(),
        regionId: connection.regionId?.trim() || undefined,
        currencyCode: connection.currencyCode?.trim() || undefined,
      },
      variantId,
      fetchImpl: options.fetchImpl,
    });
  };

  return {
    fetchState,
    async createCart() {
      throw new CommerceRuntimeNotSupportedError('createCart');
    },
    async addCartLine() {
      throw new CommerceRuntimeNotSupportedError('addCartLine');
    },
    async startCheckout() {
      throw new CommerceRuntimeNotSupportedError('startCheckout');
    },
  };
}
