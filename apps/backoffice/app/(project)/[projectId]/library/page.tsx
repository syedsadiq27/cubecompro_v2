import Link from 'next/link';
import {
  GetProjectObjectsDocument,
  GetProjectTexturesDocument,
} from '@repo/graphql/generated';
import {
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
} from '../../../../components/ui';
import { resolveImageUrl } from '../../../../lib/env';
import { createProjectClient } from '../../../../lib/graphql';
import { getProjectSession } from '../../../../lib/session-server';

export default async function LibraryPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  let textureCount = 0;
  let objectCount = 0;
  const errors: string[] = [];
  let textures: Array<{
    id: string | number;
    name?: string | null;
    code?: string | null;
    ProductMedium?: { Image_URL?: string | null } | null;
  }> = [];

  const client = createProjectClient(projectId, project.projectToken);
  const [textureResult, objectResult] = await Promise.allSettled([
    client.project(GetProjectTexturesDocument),
    client.project(GetProjectObjectsDocument),
  ]);

  if (textureResult.status === 'fulfilled') {
    textures = (textureResult.value.gettexture ?? []).slice(0, 8);
    textureCount = textureResult.value.gettexture?.length ?? 0;
  } else {
    errors.push(
      textureResult.reason instanceof Error
        ? textureResult.reason.message
        : 'Failed to load textures.'
    );
  }

  if (objectResult.status === 'fulfilled') {
    objectCount = objectResult.value.getObject?.length ?? 0;
  } else {
    errors.push(
      objectResult.reason instanceof Error
        ? objectResult.reason.message
        : 'Failed to load objects.'
    );
  }

  return (
    <div>
      <PageHeader
        title="Asset library"
        description="Textures and 3D objects available to this project."
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
      {errors.length === 0 && textures.length === 0 ? (
        <EmptyState message="No textures yet. Open the textures view to manage assets." />
      ) : null}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {textures.map((texture) => {
          const image = resolveImageUrl(texture.ProductMedium?.Image_URL);
          return (
            <Panel key={String(texture.id)} className="overflow-hidden p-0">
              <div className="aspect-square bg-[var(--bo-surface)]">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt={texture.name ?? ''}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="p-3">
                <p className="font-medium">{texture.name}</p>
                <p className="text-xs text-[var(--bo-muted)]">
                  {texture.code || 'No code'}
                </p>
              </div>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
