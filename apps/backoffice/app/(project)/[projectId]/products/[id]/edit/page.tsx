import Link from 'next/link';
import { GetProductDetailDocument } from '@repo/graphql/generated';
import {
  ErrorState,
  PageHeader,
  Panel,
} from '../../../../../../components/ui';
import { getEditorStudioPath } from '../../../../../../lib/editor-embed';
import { createProjectClient } from '../../../../../../lib/graphql';
import { getProjectSession } from '../../../../../../lib/session-server';

export default async function ProductEditorBoundaryPage({
  params,
}: {
  params: Promise<{ projectId: string; id: string }>;
}) {
  const { projectId, id } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  try {
    const client = createProjectClient(projectId, project.projectToken);
    const data = await client.project(GetProductDetailDocument, {
      prodId: id,
    });
    const product = data.getProductDetail;
    if (!product) {
      return <ErrorState message="Product not found." />;
    }

    const models = product.models ?? [];

    return (
      <div>
        <PageHeader
          title="3D / Configure"
          description={`Open the product studio for ${product.Name || id}.`}
        />
        <Panel className="space-y-4">
          <p className="text-sm text-[var(--bo-muted)]">
            Choose a model to open the Stage editor inside backoffice.
          </p>
          {models.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--bo-line)] bg-[var(--bo-surface)] px-4 py-10 text-center text-sm text-[var(--bo-muted)]">
              No models on this product yet.
            </div>
          ) : (
            <ul className="divide-y divide-[var(--bo-line)] rounded-xl border border-[var(--bo-line)]">
              {models.map((model) => (
                <li
                  key={model.id}
                  className="flex items-center justify-between gap-4 px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--bo-ink)]">
                      {model.name || `Model ${model.id}`}
                    </p>
                    <p className="type-meta mt-0.5 truncate">
                      {product.code || id} · Model {model.id}
                    </p>
                  </div>
                  <Link
                    href={getEditorStudioPath(projectId, id, String(model.id))}
                    className="shrink-0 rounded-xl bg-[var(--bo-ink)] px-3.5 py-2 text-[13px] font-medium text-white"
                  >
                    Open editor
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link
            href={`/${projectId}/products/${id}`}
            className="inline-flex rounded-xl border border-[var(--bo-line)] bg-white px-4 py-2 text-sm font-medium text-[var(--bo-ink)]"
          >
            Back to product metadata
          </Link>
        </Panel>
      </div>
    );
  } catch (error) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : 'Failed to load product.'
        }
      />
    );
  }
}
