'use client';

import { usePathname } from 'next/navigation';
import { AppShell } from './app-shell';

function isStudioEditorPath(pathname: string) {
  return (
    /\/products\/[^/]+\/edit\/[^/]+\/?$/.test(pathname) ||
    /\/products\/[^/]+\/studio\/?$/.test(pathname)
  );
}

export function ProjectShell({
  children,
  projectId,
  projectName,
  userName,
}: {
  children: React.ReactNode;
  projectId?: string;
  projectName?: string;
  userName: string;
}) {
  const pathname = usePathname();

  if (isStudioEditorPath(pathname)) {
    return (
      <div className="fixed inset-0 z-[100] bg-[var(--bo-canvas,#f4f2ee)]">
        {children}
      </div>
    );
  }

  return (
    <AppShell
      projectId={projectId}
      projectName={projectName}
      userName={userName}
    >
      {children}
    </AppShell>
  );
}
