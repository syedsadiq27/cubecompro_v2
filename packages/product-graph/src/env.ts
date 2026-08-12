export function getApiBaseUrl(override?: string): string {
  const value =
    override ??
    process.env.NEXT_PUBLIC_PRODUCT_GRAPH_URL ??
    process.env.NEXT_PUBLIC_CUBECOM_API_URL ??
    (process.env.NODE_ENV !== 'production' ? 'http://localhost:3005' : undefined);
  if (!value) {
    throw new Error('NEXT_PUBLIC_PRODUCT_GRAPH_URL is not set');
  }
  return value.replace(/\/$/, '');
}
