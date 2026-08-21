import { AssetLibrary } from '@/components/library/asset-library';
import { libraryAssetStatusLabel } from '@/components/library/asset-status';
import type {
  LibraryAssetItem,
  LibraryFolderItem,
  LibraryScope,
} from '@/components/library/types';
import { formatBytes } from '@/components/library/types';
import { EmptyState } from '@/components/bo';
import { graphRequest } from '@repo/product-graph';
import {
  LIBRARY_FOLDERS_QUERY,
  MATERIAL_ASSETS_QUERY,
  OBJECT_ASSETS_QUERY,
  TEXTURE_ASSETS_QUERY,
} from '@repo/product-graph';
import { getProjectSession } from '@/lib/session-server';

function formatAssetDate(value?: string | Date | null): {
  date: string | null;
  time: string | null;
} {
  if (!value) return { date: null, time: null };
  const parsed = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(parsed.getTime())) return { date: null, time: null };
  return {
    date: parsed.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    time: parsed.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    }),
  };
}

export default async function LibraryPage({
  params,
  searchParams,
}: {
  params: Promise<{ projectId: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { projectId } = await params;
  const { type } = await searchParams;
  const project = await getProjectSession();
  if (!project) return null;

  let error: string | null = null;
  let folders: LibraryFolderItem[] = [];
  let assets: LibraryAssetItem[] = [];

  try {
    const [folderData, materialData, objectData, textureData] =
      await Promise.all([
        graphRequest<{
          libraryFolders: LibraryFolderItem[];
        }>(
          LIBRARY_FOLDERS_QUERY,
          { projectId, parentId: null },
          project.projectToken
        ),
        graphRequest<{
          materialAssets: Array<{
            id: string;
            name: string;
            code?: string | null;
            folderId?: string | null;
            documentUrl?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          }>;
        }>(MATERIAL_ASSETS_QUERY, { projectId }, project.projectToken),
        graphRequest<{
          objectAssets: Array<{
            id: string;
            name: string;
            code?: string | null;
            folderId?: string | null;
            fileUrl?: string | null;
            format?: string | null;
            status?: string | null;
            meshCount?: number | null;
            materialCount?: number | null;
            nodeCount?: number | null;
            sizeBytes?: number | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          }>;
        }>(OBJECT_ASSETS_QUERY, { projectId }, project.projectToken),
        graphRequest<{
          textureAssets: Array<{
            id: string;
            name: string;
            code?: string | null;
            folderId?: string | null;
            fileUrl?: string | null;
            sizeBytes?: number | null;
            mimeType?: string | null;
            createdAt?: string | null;
            updatedAt?: string | null;
          }>;
        }>(TEXTURE_ASSETS_QUERY, { projectId }, project.projectToken),
      ]);

    folders = folderData.libraryFolders;
    const folderNameById = new Map(
      folders.map((folder) => [folder.id, folder.name] as const)
    );

    assets = [
      ...materialData.materialAssets.map((asset): LibraryAssetItem => {
        const updated = formatAssetDate(asset.updatedAt);
        const created = formatAssetDate(asset.createdAt);
        return {
          id: asset.id,
          type: 'material',
          name: asset.name,
          code: asset.code,
          detail: asset.code || 'Material',
          folderId: asset.folderId,
          folderName: asset.folderId
            ? folderNameById.get(asset.folderId) || null
            : null,
          documentUrl: asset.documentUrl,
          status: 'READY',
          format: 'PBR',
          updatedDate: updated.date,
          updatedTime: updated.time,
          createdDate: created.date,
        };
      }),
      ...objectData.objectAssets.map((asset): LibraryAssetItem => {
        const updated = formatAssetDate(asset.updatedAt);
        const created = formatAssetDate(asset.createdAt);
        const size = formatBytes(asset.sizeBytes);
        return {
          id: asset.id,
          type: 'model',
          name: asset.name,
          code: asset.code,
          detail:
            [
              asset.format?.toUpperCase(),
              asset.meshCount != null ? `${asset.meshCount} meshes` : null,
              size,
            ]
              .filter(Boolean)
              .join(' · ') || 'Model',
          folderId: asset.folderId,
          folderName: asset.folderId
            ? folderNameById.get(asset.folderId) || null
            : null,
          fileUrl: asset.fileUrl,
          format: asset.format,
          status: libraryAssetStatusLabel(asset.status),
          meshCount: asset.meshCount,
          materialCount: asset.materialCount,
          nodeCount: asset.nodeCount,
          sizeBytes: asset.sizeBytes,
          fileSize: size,
          fileName: asset.code
            ? `${asset.code}.${asset.format || 'glb'}`
            : null,
          updatedDate: updated.date,
          updatedTime: updated.time,
          createdDate: created.date,
        };
      }),
      ...textureData.textureAssets.map((asset): LibraryAssetItem => {
        const updated = formatAssetDate(asset.updatedAt);
        const created = formatAssetDate(asset.createdAt);
        const size = formatBytes(asset.sizeBytes);
        return {
          id: asset.id,
          type: 'texture',
          name: asset.name,
          code: asset.code,
          detail: [asset.mimeType, size].filter(Boolean).join(' · ') || 'Texture',
          folderId: asset.folderId,
          folderName: asset.folderId
            ? folderNameById.get(asset.folderId) || null
            : null,
          fileUrl: asset.fileUrl,
          imageUrl: asset.fileUrl,
          format: asset.mimeType,
          status: 'READY',
          sizeBytes: asset.sizeBytes,
          fileSize: size,
          updatedDate: updated.date,
          updatedTime: updated.time,
          createdDate: created.date,
        };
      }),
    ].sort((a, b) => a.name.localeCompare(b.name));
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load library.';
  }

  if (error) {
    return (
      <div data-fill-page className="flex min-h-0 flex-1 flex-col p-6">
        <EmptyState
          variant="error"
          title="Library failed to load"
          description={error}
        />
      </div>
    );
  }

  const initialScope: LibraryScope | undefined =
    type === 'material' || type === 'model' || type === 'texture'
      ? { kind: 'type', type }
      : undefined;

  return (
    <AssetLibrary
      projectId={projectId}
      folders={folders}
      assets={assets}
      initialScope={initialScope}
    />
  );
}
