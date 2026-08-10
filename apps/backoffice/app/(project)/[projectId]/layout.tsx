import { redirect } from 'next/navigation';
import { ProjectShell } from '../../../components/shell/project-shell';
import {
  getProjectSession,
  getSessionUser,
} from '../../../lib/session-server';

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const project = await getProjectSession();
  if (!project || project.projectId !== projectId) {
    redirect('/projects');
  }

  const userName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

  return (
    <ProjectShell
      projectId={projectId}
      projectName={project.projectName}
      userName={userName}
    >
      {children}
    </ProjectShell>
  );
}
