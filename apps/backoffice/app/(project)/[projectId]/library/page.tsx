import { AssetLibrary } from '@/components/library/asset-library';
import type {
  LibraryAssetItem,
  LibraryFolderItem,
  LibraryScope,
} from '@/components/library/types';
import { EmptyState } from '@/components/bo';
import { graphRequest } from '@repo/product-graph';
import {
  LIBRARY_FOLDERS_QUERY,
  MATERIAL_ASSETS_QUERY,
  OBJECT_ASSETS_QUERY,
  TEXTURE_ASSETS_QUERY,
} from '@repo/product-graph';
import { getProjectSession } from '@/lib/session-server';

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
          }>;
        }>(OBJECT_ASSETS_QUERY, { projectId }, project.projectToken),
        graphRequest<{
          textureAssets: Array<{
            id: string;
            name: string;
            code?: string | null;
            folderId?: string | null;
          }>;
        }>(TEXTURE_ASSETS_QUERY, { projectId }, project.projectToken),
      ]);

    folders = folderData.libraryFolders;
    assets = [
      ...materialData.materialAssets.map(
        (asset): LibraryAssetItem => ({
          id: asset.id,
          type: 'material',
          name: asset.name,
          code: asset.code,
          folderId: asset.folderId,
          documentUrl: asset.documentUrl,
        })
      ),
      ...objectData.objectAssets.map(
        (asset): LibraryAssetItem => ({
          id: asset.id,
          type: 'model',
          name: asset.name,
          code: asset.code,
          folderId: asset.folderId,
          fileUrl: asset.fileUrl,
          format: asset.format,
          status: asset.status,
          meshCount: asset.meshCount,
          materialCount: asset.materialCount,
          nodeCount: asset.nodeCount,
          sizeBytes: asset.sizeBytes,
        })
      ),
      ...textureData.textureAssets.map(
        (asset): LibraryAssetItem => ({
          id: asset.id,
          type: 'texture',
          name: asset.name,
          code: asset.code,
          folderId: asset.folderId,
        })
      ),
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
