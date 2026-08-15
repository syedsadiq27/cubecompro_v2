'use client';

import {
  FunnelIcon,
  GridIcon,
  SettingsIcon,
  TableIcon,
} from '@/components/bo/icons';
import { cn } from '@repo/ui';
import type { ReactNode } from 'react';

export function EntityTabs({ children }: { children: ReactNode }) {
  return (
    <div
      role="tablist"
      className="flex gap-1 border-b border-[var(--line)] px-6"
    >
      {children}
    </div>
  );
}

export function EntityTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        'relative -mb-px border-b-2 px-3.5 py-2.5 text-[13px] font-medium transition-colors',
        active
          ? 'border-[#665CFF] text-[var(--ink)]'
          : 'border-transparent text-[var(--text-muted)] hover:text-[var(--ink)]'
      )}
    >
      {label}
    </button>
  );
}

export function MoreFiltersButton({
  onClick,
  active,
}: {
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] px-3 text-[13px] font-medium transition-colors hover:bg-[var(--canvas)]/50',
        active
          ? 'border-[var(--ink)] bg-[var(--surface)]/50 text-[var(--ink)]'
          : 'text-[var(--ink)]'
      )}
    >
      <FunnelIcon size={14} className="text-[var(--text-muted)]" />
      <span>More filters</span>
    </button>
  );
}

export function ClearFiltersButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-9 shrink-0 px-2.5 text-[13px] font-medium text-[var(--text-muted)] transition-colors hover:text-[var(--ink)]"
    >
      Clear
    </button>
  );
}

export function ViewModeSwitcher({
  mode = 'table',
  onChange,
}: {
  mode?: 'table' | 'grid';
  onChange?: (mode: 'table' | 'grid') => void;
}) {
  return (
    <div className="flex items-center rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-0.5">
      <button
        type="button"
        title="Table view"
        aria-label="Table view"
        onClick={() => onChange?.('table')}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded text-[var(--text-muted)] transition-colors',
          mode === 'table'
            ? 'bg-[var(--canvas)] text-[var(--ink)]'
            : 'hover:text-[var(--ink)]'
        )}
      >
        <TableIcon size={15} />
      </button>
      <button
        type="button"
        title="Grid view"
        aria-label="Grid view"
        onClick={() => onChange?.('grid')}
        className={cn(
          'flex h-7 w-7 items-center justify-center rounded text-[var(--text-muted)] transition-colors',
          mode === 'grid'
            ? 'bg-[var(--canvas)] text-[var(--ink)]'
            : 'hover:text-[var(--ink)]'
        )}
      >
        <GridIcon size={15} />
      </button>
    </div>
  );
}

export function ToolbarSettingsButton({
  onClick,
}: {
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      title="Table settings"
      aria-label="Table settings"
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] text-[var(--text-muted)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
    >
      <SettingsIcon size={15} />
    </button>
  );
}

export function ToolbarIconButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] text-[var(--text-muted)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
    >
      <TableIcon size={15} />
    </button>
  );
}
