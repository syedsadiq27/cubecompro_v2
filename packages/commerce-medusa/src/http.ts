import type { CommerceState } from '@repo/product-graph';

import type { MedusaEngineConnection } from './connection.js';
import {
  commerceStateFromProviderFailure,
  mapMedusaVariantToCommerceState,
  pickVariantFromStoreResponse,
  type MedusaStoreVariantsResponse,
} from './map-state.js';

export type FetchMedusaVariantStateInput = {
  connection: MedusaEngineConnection;
  variantId: string;
  fetchImpl?: typeof fetch;
};

export async function fetchMedusaVariantCommerceState(
  input: FetchMedusaVariantStateInput
): Promise<CommerceState> {
  const observedAt = new Date();
  const baseUrl = input.connection.baseUrl.replace(/\/$/, '');
  const url = new URL(`${baseUrl}/store/product-variants`);
  url.searchParams.set('id', input.variantId);
  url.searchParams.set('fields', '*calculated_price,+inventory_quantity');
  if (input.connection.regionId) {
    url.searchParams.set('region_id', input.connection.regionId);
  }
  if (input.connection.currencyCode) {
    url.searchParams.set('currency_code', input.connection.currencyCode);
  }

  const fetchImpl = input.fetchImpl ?? fetch;

  let response: Response;
  try {
    response = await fetchImpl(url.toString(), {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'x-publishable-api-key': input.connection.publishableApiKey,
      },
    });
  } catch {
    return commerceStateFromProviderFailure('UNKNOWN', observedAt);
  }

  if (response.status === 404) {
    return mapMedusaVariantToCommerceState(undefined, observedAt);
  }

  if (response.status === 401 || response.status === 403) {
    return commerceStateFromProviderFailure('PROVIDER_BLOCKED', observedAt);
  }

  if (!response.ok) {
    return commerceStateFromProviderFailure(
      response.status >= 500 ? 'PROVIDER_BLOCKED' : 'UNKNOWN',
      observedAt
    );
  }

  let body: MedusaStoreVariantsResponse;
  try {
    body = (await response.json()) as MedusaStoreVariantsResponse;
  } catch {
    return commerceStateFromProviderFailure('UNKNOWN', observedAt);
  }

  const variant = pickVariantFromStoreResponse(body, input.variantId);
  return mapMedusaVariantToCommerceState(variant, observedAt);
}
