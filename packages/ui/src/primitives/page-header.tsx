'use client';

import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export function PageHeader({
  title,
  count,
  meta,
  description,
  action,
  breadcrumbs,
  className,
}: {
  title: ReactNode;
  count?: number;
  meta?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  breadcrumbs?: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn('border-b border-[var(--line)] bg-[var(--surface-pure)] px-6 py-4 select-none', className)}>
      {breadcrumbs ? <div className="mb-2">{breadcrumbs}</div> : null}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-0.5 min-w-0">
          <div className="flex items-baseline gap-2.5 min-w-0">
            <h1 className="text-[20px] sm:text-[22px] font-bold tracking-tight text-[var(--ink)] leading-tight">
              {title}
            </h1>
            {count != null ? (
              <span className="rounded-full bg-[var(--canvas)] border border-[var(--line)] px-2 py-0.2 font-mono text-[11px] font-medium text-[var(--text-secondary)]">
                {count}
              </span>
            ) : null}
            {meta ? (
              <span className="text-[13px] font-normal text-[var(--text-muted)]">
                {meta}
              </span>
            ) : null}
          </div>
          {description ? (
            <p className="text-[12px] sm:text-[13px] text-[var(--text-secondary)] leading-relaxed max-w-2xl">
              {description}
            </p>
          ) : null}
        </div>
        {action ? <div className="flex shrink-0 items-center gap-2">{action}</div> : null}
      </div>
    </header>
  );
}
