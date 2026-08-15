'use client';

import {
  type ReactNode,
  type SelectHTMLAttributes,
  type InputHTMLAttributes,
} from 'react';
import { cn } from '../lib/cn';

export function FilterTabs({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('flex items-center gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none py-0.5', className)}>
      {children}
    </div>
  );
}

export function FilterTab({
  label,
  count,
  active,
  onClick,
  className,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[13px] font-medium transition-all duration-150 cursor-pointer',
        active
          ? 'bg-[var(--surface-pure)] text-[var(--ink)] border border-[var(--border-strong)] font-semibold shadow-xs'
          : 'text-[var(--text-secondary)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]',
        className
      )}
    >
      <span>{label}</span>
      {count != null ? (
        <span
          className={cn(
            'tabular-nums text-[12px] font-mono',
            active ? 'text-[var(--ink)] font-semibold' : 'text-[var(--text-muted)]'
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

export function FilterBar({
  children,
  end,
  className,
  variant = 'card',
}: {
  children: ReactNode;
  end?: ReactNode;
  className?: string;
  variant?: 'card' | 'toolbar';
}) {
  return (
    <div
      className={cn(
        'flex w-full min-w-0 items-center justify-between gap-3',
        variant === 'card' &&
          'flex-wrap rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-2 shadow-2xs',
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2.5 overflow-x-auto">
        {children}
      </div>
      {end ? (
        <div className="flex shrink-0 items-center gap-1.5 pl-2">
          {end}
        </div>
      ) : null}
    </div>
  );
}

export function SearchField({
  value,
  onChange,
  placeholder = 'Search...',
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> & {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className={cn('relative min-w-[14rem] flex-1 max-w-sm', className)}>
      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[var(--text-muted)]">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="h-9 w-full rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] pl-9 pr-3 text-[13px] text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--text-muted)] focus:border-[var(--ink)]/40 focus:ring-1 focus:ring-[var(--ink)]/10"
        {...props}
      />
    </div>
  );
}

export function FilterSelect({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative shrink-0">
      <select
        className={cn(
          'h-9 cursor-pointer appearance-none rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] px-3 pr-7 text-[13px] font-medium text-[var(--ink)] outline-none transition-colors hover:bg-[var(--canvas)]/40 focus:border-[var(--ink)]/40',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-muted)]">
        ▼
      </span>
    </div>
  );
}
