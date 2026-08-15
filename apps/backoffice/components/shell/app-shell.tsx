'use client';

import { Wordmark } from '@repo/ui';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { AppSidebar } from './app-sidebar';

export function AppShell({
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
  const [navOpen, setNavOpen] = useState(false);

  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  useEffect(() => {
    if (!navOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setNavOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navOpen]);

  return (
    <div className="flex h-dvh overflow-hidden bg-[var(--canvas)]">
      <header className="fixed inset-x-0 top-0 z-30 flex h-12 items-center gap-3 border-b border-[var(--bo-line)] bg-[var(--bo-panel)] px-3 lg:hidden">
        <button
          type="button"
          aria-label="Open navigation"
          aria-expanded={navOpen}
          onClick={() => setNavOpen(true)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-[var(--bo-ink)] hover:bg-black/[0.04]"
        >
          <span className="flex w-4 flex-col gap-1">
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
            <span className="h-px w-full bg-current" />
          </span>
        </button>
        <div className="min-w-0 flex-1">
          {projectName ? (
            <p className="truncate text-[13px] font-medium tracking-tight text-[var(--bo-ink)]">
              {projectName}
            </p>
          ) : (
            <Wordmark size="sm" />
          )}
        </div>
        <Link
          href="/projects"
          className="shrink-0 rounded-md px-2 py-1 text-[12px] text-[var(--bo-muted)] hover:bg-black/[0.04] hover:text-[var(--bo-ink)]"
        >
          Switch
        </Link>
      </header>

      {navOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/35 lg:hidden"
          onClick={() => setNavOpen(false)}
        />
      ) : null}

      <div
        className={`fixed inset-y-0 left-0 z-50 flex w-[min(18rem,88vw)] transform transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-auto lg:translate-x-0 ${
          navOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <AppSidebar
          projectId={projectId}
          projectName={projectName}
          userName={userName}
          onNavigate={() => setNavOpen(false)}
        />
      </div>

      <main className="relative min-h-0 min-w-0 flex-1 overflow-hidden pt-12 lg:pt-0">
        <div className="absolute inset-0 flex flex-col px-3 py-3 sm:px-5 lg:px-8 lg:py-6">
          <div className="flex min-h-0 flex-1 flex-col overflow-y-auto has-[[data-fill-page]]:overflow-hidden">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
