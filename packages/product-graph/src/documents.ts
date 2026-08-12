export function objectDocumentUrl(apiUrl: string, assetId: string): string {
  return `${apiUrl.replace(/\/$/, '')}/documents/objects/${assetId}`;
}
