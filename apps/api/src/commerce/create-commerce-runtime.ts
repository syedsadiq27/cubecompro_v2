import type { CommerceRuntime } from '@repo/commerce-core';
import { createMedusaCommerceRuntime } from '@repo/commerce-medusa';

export class UnsupportedCommerceProviderError extends Error {
  constructor(provider: string) {
    super(`Unsupported commerce provider for live runtime: ${provider}`);
    this.name = 'UnsupportedCommerceProviderError';
  }
}

export type CubecomConnectionConfig = {
  baseUrl: string;
  publishableApiKey: string;
  regionId?: string;
  currencyCode?: string;
};

export type CommerceConnectionRecord = {
  id: string;
  provider: string;
  /** Shopify OAuth / privileged secrets only — not cubecom engine config. */
  accessToken: string;
  externalAccountId: string;
  apiVersion: string;
  /** Explicit engine config for provider "cubecom". */
  config?: CubecomConnectionConfig | null;
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

function asCubecomConfig(
  value: unknown
): CubecomEngineConfigJson | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }
  return value as CubecomEngineConfigJson;
}

function decodeCubecomEngineConnection(
  connection: CommerceConnectionRecord,
  defaultBaseUrl?: string
): CubecomConnectionConfig {
  const fromConfig = asCubecomConfig(connection.config);
  if (fromConfig) {
    const baseUrl =
      fromConfig.baseUrl?.trim() ||
      defaultBaseUrl?.trim() ||
      process.env.CUBECOM_COMMERCE_BASE_URL?.trim() ||
      '';
    const publishableApiKey = fromConfig.publishableApiKey?.trim() || '';
    if (!baseUrl || !publishableApiKey) {
      throw new Error(
        'cubecom connection config requires baseUrl and publishableApiKey'
      );
    }
    return {
      baseUrl,
      publishableApiKey,
      regionId: fromConfig.regionId?.trim() || undefined,
      currencyCode: fromConfig.currencyCode?.trim() || undefined,
    };
  }

  const trimmed = connection.accessToken.trim();
  if (trimmed.startsWith('{')) {
    let parsed: CubecomEngineConfigJson;
    try {
      parsed = JSON.parse(trimmed) as CubecomEngineConfigJson;
    } catch {
      throw new Error(
        'Invalid legacy cubecom accessToken JSON; migrate to configJson'
      );
    }
    const baseUrl = parsed.baseUrl?.trim() || defaultBaseUrl?.trim();
    const publishableApiKey = parsed.publishableApiKey?.trim();
    if (!baseUrl || !publishableApiKey) {
      throw new Error(
        'legacy cubecom accessToken JSON requires baseUrl and publishableApiKey'
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
  if (!baseUrl || !trimmed) {
    throw new Error(
      'cubecom connection requires configJson { baseUrl, publishableApiKey } (or CUBECOM_COMMERCE_BASE_URL + legacy publishable accessToken)'
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
