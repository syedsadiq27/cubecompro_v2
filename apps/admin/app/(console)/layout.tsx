import { redirect } from 'next/navigation';
import { AdminShell } from '@/components/admin-shell';
import { CubeStoreHydrator } from '@/components/cube-store-hydrator';
import { getSessionUser } from '@/lib/session-server';

export default async function ConsoleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();
  if (!user) redirect('/login');
  return (
    <CubeStoreHydrator
      session={{
        userName: user.name || user.email,
        email: user.email,
        role: user.role,
      }}
    >
      <AdminShell>{children}</AdminShell>
    </CubeStoreHydrator>
  );
}
