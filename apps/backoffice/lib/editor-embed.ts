import { getEditorBaseUrl } from './env';

export function getEditorStudioPath(
  projectId: string,
  productId: string,
  modelId: string
): string {
  return `/${projectId}/products/${productId}/edit/${modelId}`;
}

export function getProduct3DStudioPath(
  projectId: string,
  productId: string
): string {
  return `/${projectId}/products/${productId}/studio`;
}

export function getStudioChoiceHref(input: {
  projectId: string;
  productId: string;
  modelId?: string | null;
  choiceKey?: string;
  valueKey?: string;
}): string {
  const path = input.modelId
    ? getEditorStudioPath(input.projectId, input.productId, input.modelId)
    : getProduct3DStudioPath(input.projectId, input.productId);
  const params = new URLSearchParams();
  if (input.choiceKey) params.set('choice', input.choiceKey);
  if (input.valueKey) params.set('value', input.valueKey);
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export function getStudioChoiceValueHref(input: {
  projectId: string;
  productId: string;
  modelId?: string | null;
  choiceKey: string;
  valueKey: string;
}): string {
  return getStudioChoiceHref(input);
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
