import { AppShell } from '@/components/shell/app-shell';
import { requireAuthenticatedUser } from '@/lib/require-auth';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuthenticatedUser();

  const userName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

  return <AppShell userName={userName}>{children}</AppShell>;
}
