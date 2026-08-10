export const DEFAULT_PROJECT_ID = '193';

export function getServerPath(): string {
  const value =
    process.env.NEXT_PUBLIC_3DDD_SERVER_PATH ??
    'https://qa-product-3ddd-plus-server-659729422033.us-east1.run.app';
  return value.replace(/\/$/, '');
}

export function getImageBaseUrl(): string {
  const value =
    process.env.NEXT_PUBLIC_IMAGE_URL ??
    'https://storage.googleapis.com/3ddplusgcp/';
  return value.endsWith('/') ? value : `${value}/`;
}

export function getDefaultProjectId(): string {
  return process.env.NEXT_PUBLIC_DEFAULT_PROJECT_ID ?? DEFAULT_PROJECT_ID;
}
