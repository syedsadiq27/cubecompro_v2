import { AssetDeleteButton } from '@/components/library/asset-delete-button';
import {
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
} from '@/components/ui';
import { graphRequest } from '@repo/product-graph';
import { OBJECT_ASSETS_QUERY } from '@repo/product-graph';
import { getProjectSession } from '@/lib/session-server';

export default async function ObjectsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  let error: string | null = null;
  let objects: Array<{
    id: string;
    name: string;
    code?: string | null;
    fileUri: string;
  }> = [];

  try {
    const data = await graphRequest<{
      objectAssets: Array<{
        id: string;
        name: string;
        code?: string | null;
        fileUri: string;
      }>;
    }>(OBJECT_ASSETS_QUERY, { projectId }, project.projectToken);
    objects = data.objectAssets;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load objects.';
  }

  return (
    <div>
      <PageHeader
        title="Objects"
        description="Project 3D object assets from CubeCom. Binary upload lands with multipart support."
      />
      {error ? <ErrorState message={error} /> : null}
      {!error && objects.length === 0 ? (
        <EmptyState message="No objects in this project." />
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {objects.map((object) => (
          <Panel key={object.id}>
            <h3 className="font-semibold">{object.name}</h3>
            <p className="text-sm text-[var(--bo-muted)]">
              {object.code || 'No code'}
            </p>
            <p className="mt-2 truncate text-xs text-[var(--bo-muted)]">
              {object.fileUri}
            </p>
            <div className="mt-3">
              <AssetDeleteButton
                kind="object"
                projectId={projectId}
                assetId={object.id}
              />
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
