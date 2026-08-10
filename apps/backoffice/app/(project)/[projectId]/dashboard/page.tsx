import Link from 'next/link';
import {
  GetProductsDocument,
  GetWorkflowsDocument,
} from '@repo/graphql/generated';
import {
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
} from '../../../../components/ui';
import { createProjectClient } from '../../../../lib/graphql';
import { PRODUCT_LIST_STATUSES } from '../../../../lib/product-status';
import { getProjectSession } from '../../../../lib/session-server';

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  let productCount = 0;
  let workflowCount = 0;
  let openWorkflows = 0;
  let error: string | null = null;

  try {
    const client = createProjectClient(projectId, project.projectToken);
    const [products, workflows] = await Promise.all([
      client.project(GetProductsDocument, { status: PRODUCT_LIST_STATUSES }),
      client.project(GetWorkflowsDocument),
    ]);
    productCount = products.getProductDetails?.length ?? 0;
    const list = workflows.getWorkflows ?? [];
    workflowCount = list.length;
    openWorkflows = list.filter(
      (item) =>
        item.workflowStatus?.Status_Name?.toLowerCase() !== 'completed' &&
        item.workflowStatus?.Status_Name?.toLowerCase() !== 'published'
    ).length;
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load dashboard.';
  }

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Project overview for catalog and workflow activity."
        actions={
          <Link
            href={`/${projectId}/products`}
            className="rounded-xl bg-[var(--bo-ink)] px-4 py-2 text-sm font-medium text-white"
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
            <p className="mt-2 text-3xl font-semibold">{workflowCount}</p>
          </Panel>
          <Panel>
            <p className="text-sm text-[var(--bo-muted)]">Open workflows</p>
            <p className="mt-2 text-3xl font-semibold">{openWorkflows}</p>
          </Panel>
        </div>
      ) : (
        <EmptyState message="Dashboard metrics unavailable." />
      )}
    </div>
  );
}
