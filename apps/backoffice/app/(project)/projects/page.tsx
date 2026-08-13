import { ProjectsBrowse } from '@/components/projects/projects-browse';
import { ErrorState } from '@/components/ui';
import { PageChrome } from '@/components/ui/page-chrome';
import { graphRequest } from '@repo/product-graph';
import { MY_PROJECTS_QUERY } from '@repo/product-graph';
import { getSessionUser } from '@/lib/session-server';

export default async function ProjectsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  let projects: Array<{
    id: string;
    name: string;
    organizationName: string;
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
      organizationName: project.organizationName || 'No organization',
    }));
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load projects.';
  }

  if (error) {
    return (
      <PageChrome title="Projects">
        <ErrorState message={error} />
      </PageChrome>
    );
  }

  return <ProjectsBrowse projects={projects} />;
}
