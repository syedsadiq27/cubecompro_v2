import type { CommerceRuntime } from '@repo/commerce-core';
import { createMedusaCommerceRuntime } from '@repo/commerce-medusa';

export class UnsupportedCommerceProviderError extends Error {
  constructor(provider: string) {
    super(`Unsupported commerce provider for live runtime: ${provider}`);
    this.name = 'UnsupportedCommerceProviderError';
  }
}

export type CommerceConnectionRecord = {
  id: string;
  provider: string;
  accessToken: string;
  externalAccountId: string;
  apiVersion: string;
};

export type CreateCommerceRuntimeOptions = {
  fetchImpl?: typeof fetch;
  defaultBaseUrl?: string;
};

export function createCommerceRuntime(
  connection: CommerceConnectionRecord,
  options: CreateCommerceRuntimeOptions = {}
): CommerceRuntime {
  switch (connection.provider) {
    case 'cubecom':
      return createMedusaCommerceRuntime({
        resolveConnection: async () =>
          decodeCubecomEngineConnection(connection, options.defaultBaseUrl),
        fetchImpl: options.fetchImpl,
      });
    default:
      throw new UnsupportedCommerceProviderError(connection.provider);
  }
}

type CubecomEngineConfigJson = {
  baseUrl?: string;
  publishableApiKey?: string;
  regionId?: string;
  currencyCode?: string;
};

function decodeCubecomEngineConnection(
  connection: CommerceConnectionRecord,
  defaultBaseUrl?: string
): {
  baseUrl: string;
  publishableApiKey: string;
  regionId?: string;
  currencyCode?: string;
} {
  const trimmed = connection.accessToken.trim();
  if (trimmed.startsWith('{')) {
    let parsed: CubecomEngineConfigJson;
    try {
      parsed = JSON.parse(trimmed) as CubecomEngineConfigJson;
    } catch {
      throw new Error('Invalid cubecom connection config JSON');
    }
    const baseUrl = parsed.baseUrl?.trim() || defaultBaseUrl?.trim();
    const publishableApiKey = parsed.publishableApiKey?.trim();
    if (!baseUrl || !publishableApiKey) {
      throw new Error(
        'cubecom connection config requires baseUrl and publishableApiKey'
      );
    }
    return {
      baseUrl,
      publishableApiKey,
      regionId: parsed.regionId?.trim() || undefined,
      currencyCode: parsed.currencyCode?.trim() || undefined,
    };
  }

  const baseUrl =
    defaultBaseUrl?.trim() ||
    process.env.CUBECOM_COMMERCE_BASE_URL?.trim() ||
    '';
  if (!baseUrl) {
    throw new Error(
      'cubecom connection requires CUBECOM_COMMERCE_BASE_URL or JSON accessToken.baseUrl'
    );
  }

  return {
    baseUrl,
    publishableApiKey: trimmed,
    regionId:
      connection.externalAccountId !== 'default'
        ? connection.externalAccountId.trim() || undefined
        : undefined,
  };
}
