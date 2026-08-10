import { getDefaultProjectId } from './env';

export type CustomizerUrlParams = {
  projectId: string;
  modelCode: string | null;
};

export function parseCustomizerSearchParams(
  searchParams: URLSearchParams | { get: (key: string) => string | null }
): CustomizerUrlParams {
  const projectId =
    searchParams.get('projectId')?.trim() || getDefaultProjectId();
  const modelCode = searchParams.get('modelCode')?.trim() || null;

  return { projectId, modelCode };
}

export function buildCustomizerSearchParams({
  projectId,
  modelCode,
}: CustomizerUrlParams): string {
  const params = new URLSearchParams();
  params.set('projectId', projectId);
  if (modelCode) {
    params.set('modelCode', modelCode);
  }
  return params.toString();
}
