import { DashboardBrowse } from '@/components/dashboard/dashboard-browse';
import { EmptyState } from '@/components/bo';
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

  if (error) {
    return (
      <div data-fill-page className="flex min-h-0 flex-1 flex-col p-6">
        <EmptyState
          variant="error"
          title="Dashboard failed to load"
          description={error}
        />
      </div>
    );
  }

  return <DashboardBrowse projectId={projectId} productCount={productCount} />;
}
