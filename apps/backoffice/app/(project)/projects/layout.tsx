import { AppShell } from '@/components/shell/app-shell';
import { CubeStoreHydrator } from '@/components/shell/cube-store-hydrator';
import { requireAuthenticatedUser } from '@/lib/require-auth';

export default async function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAuthenticatedUser();

  const userName =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email;

  return (
    <CubeStoreHydrator
      session={{ userName, email: user.email, role: user.role }}
      unmount="workspace"
    >
      <AppShell>{children}</AppShell>
    </CubeStoreHydrator>
  );
}
