import { GetProjectTexturesDocument } from '@repo/graphql/generated';
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

export default async function TexturesPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  let error: string | null = null;
  let textures: Array<{
    id: string | number;
    name?: string | null;
    code?: string | null;
    description?: string | null;
    ProductMedium?: { Image_URL?: string | null } | null;
  }> = [];

  try {
    const client = createProjectClient(projectId, project.projectToken);
    const data = await client.project(GetProjectTexturesDocument);
    textures = data.gettexture ?? [];
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load textures.';
  }

  return (
    <div>
      <PageHeader
        title="Textures"
        description="Project texture assets. Upload via multipart GraphQL is a follow-up."
      />
      {error ? <ErrorState message={error} /> : null}
      {!error && textures.length === 0 ? (
        <EmptyState message="No textures in this project." />
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {textures.map((texture) => {
          const image = resolveImageUrl(texture.ProductMedium?.Image_URL);
          return (
            <Panel key={String(texture.id)}>
              <div className="mb-3 aspect-video overflow-hidden rounded-xl bg-[var(--bo-surface)]">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={texture.name ?? ''}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <h3 className="font-semibold">{texture.name}</h3>
              <p className="text-sm text-[var(--bo-muted)]">
                {texture.code || 'No code'}
              </p>
              <p className="mt-2 text-sm text-[var(--bo-muted)]">
                {texture.description || 'No description'}
              </p>
              <div className="mt-3">
                <AssetDeleteButton
                  kind="texture"
                  projectId={projectId}
                  assetId={String(texture.id)}
                />
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
