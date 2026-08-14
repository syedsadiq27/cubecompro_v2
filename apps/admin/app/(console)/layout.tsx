import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { getSessionUser } from '@/lib/session-server';

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  return (
    <AdminShell userName={user.name || user.email}>{children}</AdminShell>
  );
}
