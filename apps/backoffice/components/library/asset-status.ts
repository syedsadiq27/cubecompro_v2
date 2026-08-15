export type LibraryAssetStatusBucket =
  | 'published'
  | 'draft'
  | 'archived'
  | 'failed'
  | 'processing';

export function libraryAssetStatusBucket(
  status?: string | null
): LibraryAssetStatusBucket {
  const raw = (status || 'READY').toUpperCase();
  if (
    raw === 'READY' ||
    raw === 'ACTIVE' ||
    raw === 'PUBLISHED'
  ) {
    return 'published';
  }
  if (raw === 'ARCHIVED') return 'archived';
  if (raw === 'FAILED') return 'failed';
  if (raw === 'PROCESSING') return 'processing';
  if (raw === 'DRAFT') return 'draft';
  return 'published';
}

export function libraryAssetStatusLabel(status?: string | null): string {
  switch (libraryAssetStatusBucket(status)) {
    case 'published':
      return 'Published';
    case 'archived':
      return 'Archived';
    case 'failed':
      return 'Failed';
    case 'processing':
      return 'Processing';
    case 'draft':
      return 'Draft';
  }
}

export function libraryAssetStatusRole(
  status?: string | null
): 'published' | 'draft' | 'archived' | 'error' | 'processing' {
  const bucket = libraryAssetStatusBucket(status);
  if (bucket === 'published') return 'published';
  if (bucket === 'archived') return 'archived';
  if (bucket === 'failed') return 'error';
  if (bucket === 'processing') return 'processing';
  return 'draft';
}

export function libraryAssetStatusFilterKey(
  status?: string | null
): 'published' | 'draft' | 'archived' | 'other' {
  const bucket = libraryAssetStatusBucket(status);
  if (bucket === 'published') return 'published';
  if (bucket === 'archived') return 'archived';
  if (bucket === 'draft' || bucket === 'processing') return 'draft';
  return 'other';
}
