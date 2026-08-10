export const DEFAULT_PROJECT_ID = '193';

export function getServerPath(): string {
  const value =
    process.env.NEXT_PUBLIC_3DDD_SERVER_PATH ??
    'https://qa-product-3ddd-plus-server-659729422033.us-east1.run.app';
  return value.replace(/\/$/, '');
}

export function getLoginPath(): string {
  return process.env.NEXT_PUBLIC_3DDD_LOGIN_PATH ?? '/register';
}

export function getImageBaseUrl(): string {
  const value =
    process.env.NEXT_PUBLIC_IMAGE_URL ??
    'https://storage.googleapis.com/3ddplusgcp/';
  return value.endsWith('/') ? value : `${value}/`;
}

export function resolveImageUrl(path?: string | null): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${getImageBaseUrl()}${path.replace(/^\//, '')}`;
}

export function getEditorBaseUrl(): string {
  const value =
    process.env.NEXT_PUBLIC_EDITOR_URL ?? 'http://localhost:3003';
  return value.replace(/\/$/, '');
}

export function getEditorHref(
  projectId: string,
  productId: string,
  modelId: string
): string {
  return `${getEditorBaseUrl()}/${projectId}/${productId}/${modelId}`;
}
