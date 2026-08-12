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
