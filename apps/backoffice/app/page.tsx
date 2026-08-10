import { redirect } from 'next/navigation';
import { getProjectSession, getSessionUser } from '../lib/session-server';

export default async function HomePage() {
  const user = await getSessionUser();
  if (!user) {
    redirect('/login');
  }

  const project = await getProjectSession();
  redirect(project ? `/${project.projectId}/dashboard` : '/projects');
}
