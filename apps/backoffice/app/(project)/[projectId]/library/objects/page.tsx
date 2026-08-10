import { GetProjectObjectsDocument } from '@repo/graphql/generated';
import { AssetDeleteButton } from '../../../../../components/library/asset-delete-button';
import {
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
} from '../../../../../components/ui';
import { resolveImageUrl } from '../../../../../lib/env';
import { createProjectClient } from '../../../../../lib/graphql';
import { getProjectSession } from '../../../../../lib/session-server';

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
    id: string | number;
    name?: string | null;
    code?: string | null;
    ProductMedium?: { Image_URL?: string | null } | null;
  }> = [];

  try {
    const client = createProjectClient(projectId, project.projectToken);
    const data = await client.project(GetProjectObjectsDocument);
    objects = data.getObject ?? [];
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load objects.';
  }

  return (
    <div>
      <PageHeader
        title="3D objects"
        description="Mesh and object assets for this project."
      />
      {error ? <ErrorState message={error} /> : null}
      {!error && objects.length === 0 ? (
        <EmptyState message="No objects in this project." />
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {objects.map((object) => {
          const image = resolveImageUrl(object.ProductMedium?.Image_URL);
          return (
            <Panel key={String(object.id)}>
              <div className="mb-3 aspect-video overflow-hidden rounded-xl bg-[var(--bo-surface)]">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={object.name ?? ''}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <h3 className="font-semibold">{object.name}</h3>
              <p className="text-sm text-[var(--bo-muted)]">
                {object.code || 'No code'}
              </p>
              <div className="mt-3">
                <AssetDeleteButton
                  kind="object"
                  projectId={projectId}
                  assetId={String(object.id)}
                />
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
