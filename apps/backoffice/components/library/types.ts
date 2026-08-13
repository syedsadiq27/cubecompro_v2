export type LibraryAssetType = 'material' | 'model' | 'texture';

export type LibraryFolderItem = {
  id: string;
  name: string;
  parentId?: string | null;
  sortOrder?: number;
};

export type LibraryAssetItem = {
  id: string;
  type: LibraryAssetType;
  name: string;
  code?: string | null;
  folderId?: string | null;
  documentUrl?: string | null;
  fileUrl?: string | null;
  format?: string | null;
  status?: string | null;
  meshCount?: number | null;
  materialCount?: number | null;
  nodeCount?: number | null;
  sizeBytes?: number | null;
};

export type LibraryScope =
  | { kind: 'all' }
  | { kind: 'recent' }
  | { kind: 'type'; type: LibraryAssetType }
  | { kind: 'folder'; folderId: string };

export function assetTypeLabel(type: LibraryAssetType): string {
  if (type === 'material') return 'Material';
  if (type === 'model') return 'Model';
  return 'Texture';
}

export function formatBytes(size?: number | null): string | null {
  if (size == null || !Number.isFinite(size)) return null;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}
