import { redirect } from 'next/navigation';
import { AppShell } from '../../../components/shell/app-shell';
import { getSessionUser } from '../../../lib/session-server';

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect('/login');

  const userName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

  return <AppShell userName={userName}>{children}</AppShell>;
}
