import { getEditorBaseUrl } from './env';

export function getEditorStudioPath(
  projectId: string,
  productId: string,
  modelId: string
): string {
  return `/${projectId}/products/${productId}/edit/${modelId}`;
}

export function getEditorEmbedSrc(
  projectId: string,
  productId: string,
  modelId: string,
  returnTo: string
): string {
  const url = new URL(
    `${getEditorBaseUrl()}/${projectId}/${productId}/${modelId}`
  );
  url.searchParams.set('embed', '1');
  url.searchParams.set('returnTo', returnTo);
  return url.toString();
}
