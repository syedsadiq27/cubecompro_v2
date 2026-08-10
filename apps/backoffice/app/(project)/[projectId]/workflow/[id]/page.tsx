import { GetWorkflowByIdDocument } from '@repo/graphql/generated';
import {
  ErrorState,
  PageHeader,
  Panel,
  StatusPill,
} from '../../../../../components/ui';
import { createProjectClient } from '../../../../../lib/graphql';
import { getProjectSession } from '../../../../../lib/session-server';

export default async function WorkflowDetailPage({
  params,
}: {
  params: Promise<{ projectId: string; id: string }>;
}) {
  const { projectId, id } = await params;
  const project = await getProjectSession();
  if (!project) return null;

  try {
    const client = createProjectClient(projectId, project.projectToken);
    const data = await client.project(GetWorkflowByIdDocument, {
      id: Number(id),
    });
    const workflow = data.getWorkflow;
    if (!workflow) return <ErrorState message="Workflow not found." />;

    return (
      <div>
        <PageHeader
          title={workflow.product?.Name || `Workflow ${id}`}
          description="Workflow detail, assignment, and comments."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <Panel className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Status</h3>
              {workflow.workflowStatus?.Status_Name ? (
                <StatusPill label={workflow.workflowStatus.Status_Name} />
              ) : null}
            </div>
            <p className="text-sm text-[var(--bo-muted)]">
              Priority: {workflow.priority || '—'}
            </p>
            <p className="text-sm text-[var(--bo-muted)]">
              ETA: {workflow.eta ?? '—'}
            </p>
            <p className="text-sm text-[var(--bo-muted)]">
              Product code: {workflow.product?.code || '—'}
            </p>
            <p className="text-sm text-[var(--bo-muted)]">
              Requested by:{' '}
              {[workflow.requestedBy?.firstname, workflow.requestedBy?.lastname]
                .filter(Boolean)
                .join(' ') || '—'}
            </p>
            <p className="text-sm text-[var(--bo-muted)]">
              Assigned to:{' '}
              {[workflow.assignedTo?.firstname, workflow.assignedTo?.lastname]
                .filter(Boolean)
                .join(' ') || '—'}
            </p>
          </Panel>
          <Panel>
            <h3 className="mb-3 font-semibold">Comments</h3>
            <div className="space-y-3">
              {(workflow.comments ?? []).length === 0 ? (
                <p className="text-sm text-[var(--bo-muted)]">No comments.</p>
              ) : (
                (workflow.comments ?? []).map((comment) => (
                  <div
                    key={String(comment.id)}
                    className="rounded-xl bg-[var(--bo-surface)] px-3 py-2"
                  >
                    <p className="text-sm">{comment.text}</p>
                    <p className="mt-1 text-xs text-[var(--bo-muted)]">
                      {[comment.user?.firstname, comment.user?.lastname]
                        .filter(Boolean)
                        .join(' ') || 'Unknown'}
                      {comment.createdAt ? ` · ${comment.createdAt}` : ''}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Panel>
        </div>
      </div>
    );
  } catch (error) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : 'Failed to load workflow.'
        }
      />
    );
  }
}
