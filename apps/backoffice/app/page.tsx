import { redirect } from 'next/navigation';
import { requireAuthenticatedUser } from '@/lib/require-auth';
import { getProjectSession } from '@/lib/session-server';

export default async function HomePage() {
  await requireAuthenticatedUser();

  const project = await getProjectSession();
  redirect(project ? `/${project.projectId}/dashboard` : '/projects');
}
