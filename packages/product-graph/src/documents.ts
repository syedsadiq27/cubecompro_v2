export function objectDocumentUrl(apiUrl: string, assetId: string): string {
  return `${apiUrl.replace(/\/$/, '')}/documents/objects/${assetId}`;
}

export function objectMetadataUrl(apiUrl: string, assetId: string): string {
  return `${objectDocumentUrl(apiUrl, assetId)}/metadata`;
}

export function materialDocumentUrl(apiUrl: string, assetId: string): string {
  return `${apiUrl.replace(/\/$/, '')}/documents/materials/${assetId}`;
}
