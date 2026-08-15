'use client';

import { BellIcon, ChevronDownIcon, HelpCircleIcon } from '@/components/bo/icons';
import {
  Button,
  SuiteShell,
  TopBar as SuiteTopBar,
  useSidebarNavigate,
} from '@repo/ui';
import Link from 'next/link';
import type { ReactNode } from 'react';

export { useSidebarNavigate };

export function TopBar({
  orgName = 'Default Org',
  projectName,
}: {
  orgName?: string;
  projectName?: string;
}) {
  return (
    <SuiteTopBar
      start={
        <span className="truncate text-[13px] text-[var(--text-secondary)]">
          <span className="font-medium text-[var(--ink)]">
            {projectName || 'Workspace'}
          </span>
          <span className="mx-1.5 text-[var(--text-muted)]">·</span>
          {orgName}
        </span>
      }
      end={
        <>
          <button
            type="button"
            aria-label="Help & Documentation"
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
          >
            <HelpCircleIcon size={18} />
          </button>
          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-8 w-8 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
          >
            <BellIcon size={18} />
            <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--ink)] text-[10px] font-semibold text-white">
              3
            </span>
          </button>
          <div className="mx-1 h-4 w-px bg-[var(--line)]" />
          <button
            type="button"
            className="flex h-8 items-center gap-1.5 rounded-md px-2.5 text-[13px] font-medium text-[var(--ink)] transition-colors hover:bg-[var(--canvas)]"
          >
            <span>{orgName}</span>
            <ChevronDownIcon size={14} className="text-[var(--text-muted)]" />
          </button>
        </>
      }
    />
  );
}

export function BackofficeShell({
  children,
  sidebar,
  projectName,
  orgName = 'Default Org',
}: {
  children: ReactNode;
  sidebar: ReactNode;
  projectName?: string;
  orgName?: string;
}) {
  return (
    <SuiteShell
      sidebar={sidebar}
      mobileTitle={projectName || 'CubeCom'}
      mobileTrailing={
        <Button as={Link} href="/projects" variant="ghost" size="sm" className="shrink-0">
          Switch
        </Button>
      }
      topBar={<TopBar orgName={orgName} projectName={projectName} />}
    >
      {children}
    </SuiteShell>
  );
}
