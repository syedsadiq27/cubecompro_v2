'use client';

import { type ReactNode } from 'react';
import { cn } from '@repo/ui';

/** Section Header Primitive with Title, Count badge, Subtitle and Action slots */
export function SectionHeader({
  title,
  subtitle,
  count,
  actions,
  className,
}: {
  title: string;
  subtitle?: ReactNode;
  count?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-3', className)}>
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-semibold text-[var(--ink)] tracking-tight">
            {title}
          </h2>
          {count != null ? (
            <span className="rounded bg-[var(--canvas)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--text-muted)] border border-[var(--line)]">
              {count}
            </span>
          ) : null}
        </div>
        {subtitle ? (
          <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
            {subtitle}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/** Detail Grid for Key-Value Matrix and Metadata */
export function DetailGrid({
  children,
  cols = 2,
  className,
}: {
  children: ReactNode;
  cols?: 1 | 2 | 3 | 4;
  className?: string;
}) {
  const colClass =
    cols === 1
      ? 'grid-cols-1'
      : cols === 3
        ? 'grid-cols-1 sm:grid-cols-3'
        : cols === 4
          ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
          : 'grid-cols-1 sm:grid-cols-2';

  return (
    <div className={cn('grid gap-4', colClass, className)}>
      {children}
    </div>
  );
}

/** SplitPane Layout: Left Main Area + Right 340px Sticky Inspector */
export function SplitPane({
  left,
  right,
  className,
}: {
  left: ReactNode;
  right: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-1 gap-6 lg:grid-cols-12 items-start', className)}>
      <div className="space-y-6 lg:col-span-8">{left}</div>
      <div className="lg:col-span-4 sticky top-6 space-y-4">{right}</div>
    </div>
  );
}

/** Sticky Action Bar for Unsaved Changes / Bulk Edits */
export function StickyActionBar({
  visible,
  message = 'You have unsaved changes in this draft.',
  primaryAction,
  secondaryAction,
}: {
  visible: boolean;
  message?: ReactNode;
  primaryAction?: ReactNode;
  secondaryAction?: ReactNode;
}) {
  if (!visible) return null;

  return (
    <div className="fixed bottom-6 inset-x-0 z-40 flex justify-center px-4 animate-in slide-in-from-bottom-3 duration-200 pointer-events-none">
      <div className="flex items-center justify-between gap-4 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] px-5 py-3 shadow-xl pointer-events-auto max-w-xl w-full">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
          <span className="text-[13px] font-medium text-[var(--ink)]">{message}</span>
        </div>
        <div className="flex items-center gap-2">
          {secondaryAction}
          {primaryAction}
        </div>
      </div>
    </div>
  );
}
