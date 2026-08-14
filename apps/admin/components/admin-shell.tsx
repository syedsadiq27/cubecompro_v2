'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Wordmark } from '@repo/ui/wordmark';
import { AdminNav } from './admin-nav';

export function AdminShell({
  children,
  userName,
}: {
  children: React.ReactNode;
  userName: string;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[var(--canvas)] md:flex-row">
      <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[var(--line)] bg-[var(--surface-pure)] px-3 md:hidden">
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--ink)] hover:bg-[var(--surface)]"
        >
          <span className="flex flex-col gap-1.5">
            <span className="block h-px w-4 bg-current" />
            <span className="block h-px w-4 bg-current" />
            <span className="block h-px w-4 bg-current" />
          </span>
        </button>
        <Wordmark size="sm" />
        <span className="text-[10px] font-semibold tracking-[0.08em] text-[var(--text-muted)] uppercase">
          Admin
        </span>
      </header>

      {open ? (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-[var(--ink)]/30 md:hidden"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={`fixed inset-y-0 left-0 z-50 w-[min(220px,86vw)] transform transition-transform duration-200 md:static md:z-auto md:w-[220px] md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <AdminNav userName={userName} />
      </div>

      <main className="min-h-0 min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-[var(--canvas)]">
        <div className="mx-auto w-full max-w-5xl px-4 py-4 md:px-6 md:py-6">
          {children}
        </div>
      </main>
    </div>
  );
}
