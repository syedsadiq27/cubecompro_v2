'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '@repo/ui';

export function MetricCard({
  icon,
  title,
  value,
  trend,
  trendDirection = 'up',
  subtitle = 'vs last 30 days',
  href,
}: {
  icon?: ReactNode;
  title: string;
  value: string | number;
  trend?: string;
  trendDirection?: 'up' | 'down';
  subtitle?: string;
  href?: string;
}) {
  const content = (
    <div
      className={cn(
        'group relative flex flex-col justify-between rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 transition-all duration-150',
        href && 'hover:border-[var(--border-strong)] hover:shadow-xs cursor-pointer'
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {icon ? (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--canvas)] text-[var(--ink)]">
              {icon}
            </div>
          ) : null}
          <span className="text-[12px] font-medium text-[var(--text-secondary)]">
            {title}
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-[24px] font-semibold tracking-tight text-[var(--ink)] tabular-nums">
          {value}
        </span>
        {trend ? (
          <span
            className={cn(
              'flex items-center text-[12px] font-medium tabular-nums',
              trendDirection === 'up' ? 'text-emerald-700' : 'text-amber-700'
            )}
          >
            {trend}
          </span>
        ) : null}
      </div>

      {subtitle ? (
        <span className="mt-1 text-[11px] text-[var(--text-muted)] font-normal">
          {subtitle}
        </span>
      ) : null}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block no-underline">
        {content}
      </Link>
    );
  }

  return content;
}

export function MetricGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {children}
    </div>
  );
}
