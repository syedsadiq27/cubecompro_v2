import { getApiBaseUrl } from './env.js';

type GraphQlResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

export async function graphRequest<T>(
  query: string,
  variables?: Record<string, unknown>,
  token?: string,
  apiUrl?: string
): Promise<T> {
  const base = getApiBaseUrl(apiUrl);

  const response = await fetch(`${base}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ query, variables }),
    cache: 'no-store',
  });

  const json = (await response.json()) as GraphQlResponse<T>;
  if (!response.ok || json.errors?.length) {
    throw new Error(
      json.errors?.map((error) => error.message).join('; ') ||
        `Product graph API error (${response.status})`
    );
  }
  if (!json.data) {
    throw new Error('Product graph API returned no data');
  }
  return json.data;
}
