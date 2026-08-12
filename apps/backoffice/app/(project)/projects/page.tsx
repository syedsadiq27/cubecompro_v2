import { ProjectSelectButton } from '@/components/projects/project-select-button';
import { EmptyState, ErrorState, PageHeader, Panel } from '@/components/ui';
import { graphRequest } from '@repo/product-graph';
import { MY_PROJECTS_QUERY } from '@repo/product-graph';
import { getSessionUser } from '@/lib/session-server';

export default async function ProjectsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  let projects: Array<{
    id: string;
    name?: string | null;
    organization?: { name?: string | null } | null;
  }> = [];
  let error: string | null = null;

  try {
    const data = await graphRequest<{
      myProjects: Array<{
        id: string;
        name: string;
        organizationName?: string | null;
      }>;
    }>(MY_PROJECTS_QUERY, undefined, user.token);
    projects = data.myProjects.map((project) => ({
      id: project.id,
      name: project.name,
      organization: { name: project.organizationName },
    }));
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load projects.';
  }

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Select a project to open its catalog, library, and settings."
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
