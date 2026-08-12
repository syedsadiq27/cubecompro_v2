import Link from 'next/link';
import {
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
} from '@/components/ui';
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
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  const errors: string[] = [];
  let folders: Array<{ id: string; name: string }> = [];
  let materials: Array<{ id: string; name: string; code?: string | null }> =
    [];
  let textureCount = 0;
  let objectCount = 0;

  try {
    const [folderData, materialData, textureData, objectData] =
      await Promise.all([
        graphRequest<{
          libraryFolders: Array<{ id: string; name: string }>;
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
          }>;
        }>(MATERIAL_ASSETS_QUERY, { projectId }, project.projectToken),
        graphRequest<{ textureAssets: Array<{ id: string }> }>(
          TEXTURE_ASSETS_QUERY,
          { projectId },
          project.projectToken
        ),
        graphRequest<{ objectAssets: Array<{ id: string }> }>(
          OBJECT_ASSETS_QUERY,
          { projectId },
          project.projectToken
        ),
      ]);
    folders = folderData.libraryFolders;
    materials = materialData.materialAssets;
    textureCount = textureData.textureAssets.length;
    objectCount = objectData.objectAssets.length;
  } catch (error) {
    errors.push(
      error instanceof Error ? error.message : 'Failed to load library.'
    );
  }

  return (
    <div>
      <PageHeader
        title="Asset library"
        description="Folders, materials, textures, and objects for this project."
        actions={
          <div className="flex gap-2">
            <Link
              href={`/${projectId}/library/textures`}
              className="rounded-xl border border-[var(--bo-line)] px-4 py-2 text-sm"
            >
              Textures ({textureCount})
            </Link>
            <Link
              href={`/${projectId}/library/objects`}
              className="rounded-xl border border-[var(--bo-line)] px-4 py-2 text-sm"
            >
              Objects ({objectCount})
            </Link>
          </div>
        }
      />
      {errors.map((message) => (
        <div key={message} className="mb-3">
          <ErrorState message={message} />
        </div>
      ))}
      <div className="mb-8">
        <h3 className="mb-3 text-sm font-medium text-[var(--bo-muted)]">
          Folders ({folders.length})
        </h3>
        {folders.length === 0 && errors.length === 0 ? (
          <EmptyState message="No folders yet." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {folders.map((folder) => (
              <Panel key={folder.id}>
                <p className="font-medium">{folder.name}</p>
              </Panel>
            ))}
          </div>
        )}
      </div>
      <div>
        <h3 className="mb-3 text-sm font-medium text-[var(--bo-muted)]">
          Materials ({materials.length})
        </h3>
        {materials.length === 0 && errors.length === 0 ? (
          <EmptyState message="No materials yet." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {materials.map((material) => (
              <Panel key={material.id}>
                <p className="font-medium">{material.name}</p>
                <p className="text-xs text-[var(--bo-muted)]">
                  {material.code || 'No code'}
                </p>
              </Panel>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
