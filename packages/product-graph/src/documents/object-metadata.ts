import { objectMetadataUrl } from './urls.js';
import type { ParsedObjectMetadata } from '../graph/types.js';

export async function fetchObjectMetadata(
  apiUrl: string,
  token: string,
  assetId: string
): Promise<ParsedObjectMetadata | null> {
  const response = await fetch(objectMetadataUrl(apiUrl, assetId), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: 'no-store',
  });
  if (response.status === 404) return null;
  if (!response.ok) {
    throw new Error(`Failed to load object metadata (${response.status})`);
  }
  return (await response.json()) as ParsedObjectMetadata;
}
