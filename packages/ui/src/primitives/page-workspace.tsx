'use client';

import type { ComponentProps, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { InspectorPanel } from './inspector';

export function PageWorkspace({
  children,
  inspector,
  className,
  tone = 'surface',
}: {
  children: ReactNode;
  inspector?: ReactNode;
  className?: string;
  tone?: 'surface' | 'canvas';
}) {
  return (
    <div
      data-fill-page
      data-ui-page-workspace=""
      className={cn(
        'select-none',
        tone === 'surface' ? 'bg-[var(--surface-pure)]' : 'bg-[var(--canvas)]',
        className
      )}
    >
      <div data-ui-page-workspace-main="">{children}</div>
      {inspector}
    </div>
  );
}

export function ListWorkspace({
  views,
  toolbar,
  bulk,
  className,
}: {
  views?: ReactNode;
  toolbar?: ReactNode;
  bulk?: ReactNode;
  className?: string;
}) {
  if (!views && !toolbar && !bulk) return null;

  return (
    <div
      className={cn(
        'shrink-0 border-b border-[var(--line)] bg-[var(--surface-pure)]',
        className
      )}
    >
      {views ? <div className="px-6 pt-3 pb-1">{views}</div> : null}
      {toolbar ? (
        <div
          className={cn(
            'px-6 py-2.5',
            views ? 'border-t border-[var(--line)]' : undefined
          )}
        >
          {toolbar}
        </div>
      ) : null}
      {bulk}
    </div>
  );
}

export function PageWorkspaceBody({
  children,
  flush = false,
  className,
}: {
  children: ReactNode;
  flush?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'min-w-0',
        flush
          ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
          : 'min-h-0 flex-1 overflow-y-auto px-6 py-6',
        className
      )}
    >
      {children}
    </div>
  );
}

export function InspectorWorkspace({
  children,
  className,
  open = true,
  onClose,
  widthClassName = 'w-[var(--suite-inspector-width,330px)] sm:w-[var(--suite-inspector-width-lg,350px)]',
}: ComponentProps<typeof InspectorPanel>) {
  return (
    <InspectorPanel
      open={open}
      onClose={onClose}
      widthClassName={widthClassName}
      className={className}
    >
      {children}
    </InspectorPanel>
  );
}

export function MetricsStrip({
  children,
  className,
  columns = 5,
}: {
  children: ReactNode;
  className?: string;
  columns?: 4 | 5;
}) {
  return (
    <div
      className={cn(
        'shrink-0 border-b border-[var(--line)] bg-[var(--surface-pure)] px-6 py-5',
        className
      )}
    >
      <div
        className={cn(
          'grid grid-cols-1 gap-3 sm:grid-cols-2',
          columns === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
        )}
      >
        {children}
      </div>
    </div>
  );
}

export function MetricCard({
  label,
  value,
  hint,
  className,
}: {
  label: ReactNode;
  value: ReactNode;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'space-y-1 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-3.5',
        className
      )}
    >
      <span className="block font-mono text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </span>
      <span className="block font-mono text-[22px] font-bold text-[var(--ink)]">
        {value}
      </span>
      {hint != null ? (
        <span className="block text-[11px] text-[var(--text-muted)]">{hint}</span>
      ) : null}
    </div>
  );
}
