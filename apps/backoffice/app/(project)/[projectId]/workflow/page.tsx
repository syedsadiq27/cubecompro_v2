import Link from 'next/link';
import { GetWorkflowsDocument } from '@repo/graphql/generated';
import {
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
  StatusPill,
} from '../../../../components/ui';
import { resolveImageUrl } from '../../../../lib/env';
import { createProjectClient } from '../../../../lib/graphql';
import { getProjectSession } from '../../../../lib/session-server';

export default async function WorkflowPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  let error: string | null = null;
  let workflows: Array<{
    id: string | number;
    priority?: string | null;
    eta?: number | null;
    createdAt?: string | null;
    workflowStatus?: {
      Status_Name?: string | null;
      colour?: string | null;
    } | null;
    assignedTo?: {
      firstname?: string | null;
      lastname?: string | null;
    } | null;
    product?: {
      id?: string | number | null;
      Name?: string | null;
      ProductMedia?: Array<{ Image_URL?: string | null } | null> | null;
    } | null;
  }> = [];

  try {
    const client = createProjectClient(projectId, project.projectToken);
    const data = await client.project(GetWorkflowsDocument);
    workflows = data.getWorkflows ?? [];
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load workflows.';
  }

  return (
    <div>
      <PageHeader
        title="Workflow"
        description="Review product workflow requests and assignments."
      />
      {error ? <ErrorState message={error} /> : null}
      {!error && workflows.length === 0 ? (
        <EmptyState message="No workflow items for this project." />
      ) : null}
      <div className="space-y-3">
        {workflows.map((workflow) => {
          const image = resolveImageUrl(
            workflow.product?.ProductMedia?.[0]?.Image_URL
          );
          const assignee = [workflow.assignedTo?.firstname, workflow.assignedTo?.lastname]
            .filter(Boolean)
            .join(' ');
          return (
            <Panel
              key={String(workflow.id)}
              className="flex flex-col gap-4 md:flex-row md:items-center"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[var(--bo-surface)]">
                {image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={image}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold">
                    {workflow.product?.Name || `Workflow ${workflow.id}`}
                  </h3>
                  {workflow.workflowStatus?.Status_Name ? (
                    <StatusPill
                      label={workflow.workflowStatus.Status_Name}
                      color={workflow.workflowStatus.colour}
                    />
                  ) : null}
                </div>
                <p className="mt-1 text-sm text-[var(--bo-muted)]">
                  {assignee ? `Assigned to ${assignee}` : 'Unassigned'}
                  {workflow.priority ? ` · ${workflow.priority}` : ''}
                  {workflow.eta != null ? ` · ETA ${workflow.eta}` : ''}
                </p>
              </div>
              <Link
                href={`/${projectId}/workflow/${workflow.id}`}
                className="rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
              >
                Open
              </Link>
            </Panel>
          );
        })}
      </div>
    </div>
  );
}
