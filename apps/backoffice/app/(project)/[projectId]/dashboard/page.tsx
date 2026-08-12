import Link from 'next/link';
import {
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
} from '@/components/ui';
import { graphRequest } from '@repo/product-graph';
import { PRODUCTS_BY_PROJECT_QUERY } from '@repo/product-graph';
import { getProjectSession } from '@/lib/session-server';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  let productCount = 0;
  let error: string | null = null;

  try {
    const data = await graphRequest<{
      productsByProject: Array<{ id: string }>;
    }>(
      PRODUCTS_BY_PROJECT_QUERY,
      { projectId },
      project.projectToken
    );
    productCount = data.productsByProject.length;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load dashboard.';
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Project overview for catalog activity."
        actions={
          <Link
            href={`/${projectId}/products`}
            className="bo-btn-primary rounded-xl px-4 py-2 text-sm font-medium"
          >
            View products
          </Link>
        }
      />
      {error ? <ErrorState message={error} /> : null}
      {!error ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Panel>
            <p className="text-sm text-[var(--bo-muted)]">Products</p>
            <p className="mt-2 text-3xl font-semibold">{productCount}</p>
          </Panel>
          <Panel>
            <p className="text-sm text-[var(--bo-muted)]">Workflows</p>
            <p className="mt-2 text-3xl font-semibold">0</p>
            <p className="mt-1 text-xs text-[var(--bo-muted)]">Deferred in v1</p>
          </Panel>
          <Panel>
            <p className="text-sm text-[var(--bo-muted)]">Open workflows</p>
            <p className="mt-2 text-3xl font-semibold">0</p>
            <p className="mt-1 text-xs text-[var(--bo-muted)]">Deferred in v1</p>
          </Panel>
        </div>
      ) : (
        <EmptyState message="Dashboard metrics unavailable." />
      )}
    </div>
  );
}
