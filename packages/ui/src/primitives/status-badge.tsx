'use client';

import type { ReactNode } from 'react';
import { cn } from '../lib/cn';

export type StatusRole =
  | 'published'
  | 'draft'
  | 'archived'
  | 'warning'
  | 'danger'
  | 'info'
  | 'active'
  | 'trial'
  | 'suspended';

const ROLE_STYLES: Record<StatusRole, string> = {
  published: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  active: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
  draft: 'bg-stone-100 text-stone-700 border-stone-200',
  archived: 'bg-stone-100 text-stone-500 border-stone-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200/80',
  trial: 'bg-amber-50 text-amber-800 border-amber-200/80',
  danger: 'bg-red-50 text-red-800 border-red-200/80',
  suspended: 'bg-red-50 text-red-800 border-red-200/80',
  info: 'bg-blue-50 text-blue-800 border-blue-200/80',
};

const DOT_COLORS: Record<StatusRole, string> = {
  published: 'bg-emerald-600',
  active: 'bg-emerald-600',
  draft: 'bg-stone-400',
  archived: 'bg-stone-400',
  warning: 'bg-amber-500',
  trial: 'bg-amber-500',
  danger: 'bg-red-600',
  suspended: 'bg-red-600',
  info: 'bg-blue-600',
};

export function StatusBadge({
  role,
  label,
  showDot = true,
  className,
}: {
  role: StatusRole;
  label: ReactNode;
  showDot?: boolean;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider',
        ROLE_STYLES[role] || ROLE_STYLES.draft,
        className
      )}
    >
      {showDot ? (
        <span
          className={cn(
            'h-1.5 w-1.5 rounded-full shrink-0',
            DOT_COLORS[role] || DOT_COLORS.draft
          )}
        />
      ) : null}
      <span>{label}</span>
    </span>
  );
}
