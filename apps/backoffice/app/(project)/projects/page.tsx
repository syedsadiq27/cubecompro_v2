import { GetProjectsByUserIdDocument } from '@repo/graphql/generated';
import { ProjectSelectButton } from '../../../components/projects/project-select-button';
import { EmptyState, ErrorState, PageHeader, Panel } from '../../../components/ui';
import { createGlobalClient } from '../../../lib/graphql';
import { getSessionUser } from '../../../lib/session-server';

export default async function ProjectsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  let projects: Array<{
    id: string;
    name?: string | null;
    organization?: { name?: string | null } | null;
    inProduction?: boolean | null;
    active?: boolean | null;
  }> = [];
  let error: string | null = null;

  try {
    const client = createGlobalClient(user.token);
    const data = await client.global(GetProjectsByUserIdDocument, {
      userId: user.userId,
    });
    projects = (data.getProjectByuserID ?? []).map((project) => ({
      id: String(project.id),
      name: project.name,
      organization: project.organization,
      inProduction: project.inProduction,
      active: project.active,
    }));
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load projects.';
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Select a project to open its catalog, workflows, and settings."
      />
      {error ? <ErrorState message={error} /> : null}
      {!error && projects.length === 0 ? (
        <EmptyState message="No projects are assigned to this account yet." />
      ) : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <Panel key={project.id} className="flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold">
                {project.name || `Project ${project.id}`}
              </h3>
              <p className="mt-1 text-sm text-[var(--bo-muted)]">
                {project.organization?.name || 'No organization'}
              </p>
              <p className="mt-3 text-xs text-[var(--bo-muted)]">
                {project.inProduction ? 'In production' : 'Not in production'}
                {project.active === false ? ' · inactive' : ''}
              </p>
            </div>
            <div className="mt-5">
              <ProjectSelectButton
                projectId={project.id}
                projectName={project.name || `Project ${project.id}`}
              />
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
