export function getImageBaseUrl(): string {
  const value =
    process.env.NEXT_PUBLIC_IMAGE_URL ??
    'https://storage.googleapis.com/3ddplusgcp/';
  return value.endsWith('/') ? value : `${value}/`;
}
