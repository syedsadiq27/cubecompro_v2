import { AssetDeleteButton } from '@/components/library/asset-delete-button';
import {
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
} from '@/components/ui';
import { graphRequest } from '@repo/product-graph';
import { TEXTURE_ASSETS_QUERY } from '@repo/product-graph';
import { getProjectSession } from '@/lib/session-server';

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
    id: string;
    name: string;
    code?: string | null;
    fileUri: string;
  }> = [];

  try {
    const data = await graphRequest<{
      textureAssets: Array<{
        id: string;
        name: string;
        code?: string | null;
        fileUri: string;
      }>;
    }>(TEXTURE_ASSETS_QUERY, { projectId }, project.projectToken);
    textures = data.textureAssets;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load textures.';
  }

  return (
    <div>
      <PageHeader
        title="Textures"
        description="Project texture assets from CubeCom. Binary upload lands with multipart support."
      />
      {error ? <ErrorState message={error} /> : null}
      {!error && textures.length === 0 ? (
        <EmptyState message="No textures in this project." />
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {textures.map((texture) => (
          <Panel key={texture.id}>
            <h3 className="font-semibold">{texture.name}</h3>
            <p className="text-sm text-[var(--bo-muted)]">
              {texture.code || 'No code'}
            </p>
            <p className="mt-2 truncate text-xs text-[var(--bo-muted)]">
              {texture.fileUri}
            </p>
            <div className="mt-3">
              <AssetDeleteButton
                kind="texture"
                projectId={projectId}
                assetId={texture.id}
              />
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
