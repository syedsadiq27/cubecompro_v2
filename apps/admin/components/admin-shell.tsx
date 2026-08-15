'use client';

import { useEffect, useState, type ReactNode } from 'react';
import Link from 'next/link';
import { AdminNav } from './admin-nav';
import { CommandPalette } from './ops/command-palette';
import { SuiteShell, TopBar } from '@repo/ui';

export function AdminShell({
  children,
  userName,
}: {
  children: ReactNode;
  userName: string;
}) {
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <>
      <SuiteShell
        mobileTitle={
          <>
            cubecom{' '}
            <span className="font-mono text-[9px] font-semibold uppercase text-[var(--text-muted)]">
              admin
            </span>
          </>
        }
        sidebar={<AdminNav userName={userName} />}
        topBar={
          <TopBar
            start={
              <>
                <button
                  type="button"
                  onClick={() => setPaletteOpen(true)}
                  className="flex h-8 w-64 items-center gap-2 rounded-md border border-[var(--line)] bg-[var(--canvas)]/40 px-2.5 text-left text-[12px] text-[var(--text-muted)] transition-colors hover:border-[var(--ink)]"
                >
                  <span>🔍</span>
                  <span className="flex-1 truncate">Search platform... ⌘K</span>
                  <kbd className="rounded border bg-[var(--surface-pure)] px-1 py-0.5 font-mono text-[9px]">
                    ⌘K
                  </kbd>
                </button>
                <span className="hidden h-8 items-center gap-1.5 rounded-md border border-[var(--line)] bg-[var(--canvas)] px-2.5 font-mono text-[10px] text-[var(--text-muted)] sm:inline-flex">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
                  us-east-1 · prod
                </span>
              </>
            }
            end={
              <>
                <Link
                  href="/audit"
                  className="flex h-8 items-center text-[12px] text-[var(--text-muted)] hover:text-[var(--ink)]"
                >
                  Audit feed
                </Link>
                <span className="text-[var(--text-muted)]">·</span>
                <Link
                  href="/settings"
                  className="flex h-8 items-center text-[12px] text-[var(--text-muted)] hover:text-[var(--ink)]"
                >
                  Settings
                </Link>
                <span className="text-[var(--text-muted)]">·</span>
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--line)] text-[12px] text-[var(--ink)] hover:bg-[var(--canvas)]"
                  title="Help"
                >
                  ?
                </button>
              </>
            }
          />
        }
      >
        {children}
      </SuiteShell>
      <CommandPalette
        isOpen={paletteOpen}
        onClose={() => setPaletteOpen(false)}
      />
    </>
  );
}
