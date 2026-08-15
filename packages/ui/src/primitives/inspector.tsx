'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { cn } from '../lib/cn';

export function InspectorPanel({
  children,
  className,
  open = true,
  onClose,
  widthClassName = 'w-[var(--suite-inspector-width,330px)] sm:w-[var(--suite-inspector-width-lg,350px)]',
}: {
  children: ReactNode;
  className?: string;
  open?: boolean;
  onClose?: () => void;
  widthClassName?: string;
}) {
  if (!open) return null;

  return (
    <>
      {onClose ? (
        <button
          type="button"
          aria-label="Close inspector"
          data-ui-inspector-scrim=""
          className="bg-black/20 lg:hidden"
          onClick={onClose}
        />
      ) : null}
      <aside
        data-ui-inspector-panel=""
        data-ui-inspector-drawer={onClose ? 'true' : undefined}
        className={cn(
          'z-30 flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-l border-[var(--line)] bg-[var(--surface-pure)] select-none',
          widthClassName,
          className
        )}
      >
        {children}
      </aside>
    </>
  );
}

export function InspectorHeader({
  title,
  subtitle,
  badge,
  status,
  thumbnail,
  actions,
  onClose,
  className,
}: {
  title: ReactNode;
  subtitle?: ReactNode;
  badge?: ReactNode;
  status?: ReactNode;
  thumbnail?: ReactNode;
  actions?: ReactNode;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <div className={cn('space-y-3 border-b border-[var(--line)] p-4', className)}>
      <div className="flex items-start gap-3">
        {thumbnail}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-[14px] font-bold leading-tight text-[var(--ink)]">
                {title}
              </h3>
              {subtitle ? (
                <p className="mt-0.5 truncate font-mono text-[10px] text-[var(--text-muted)]">
                  {subtitle}
                </p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {badge}
              {onClose ? (
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close inspector"
                  className="flex h-6 w-6 items-center justify-center rounded text-[var(--text-muted)] transition-colors hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
                >
                  ×
                </button>
              ) : null}
            </div>
          </div>
          {status ? <div className="mt-2">{status}</div> : null}
        </div>
      </div>
      {actions ? <div className="pt-1">{actions}</div> : null}
    </div>
  );
}

export function InspectorSection({
  title,
  action,
  children,
  className,
}: {
  title?: string;
  action?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('space-y-2', className)}>
      {title || action ? (
        <div className="mb-1.5 flex items-center justify-between border-b border-[var(--line)]/60 pb-1.5">
          {title ? (
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
              {title}
            </h4>
          ) : (
            <span />
          )}
          {action ? <div>{action}</div> : null}
        </div>
      ) : null}
      {children}
    </div>
  );
}

export function InspectorBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'min-h-0 flex-1 space-y-4 overflow-y-auto p-4',
        className
      )}
    >
      {children}
    </div>
  );
}

export function InspectorActions({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-wrap gap-1.5 border-b border-[var(--line)] p-4',
        className
      )}
    >
      {children}
    </div>
  );
}

export function InspectorThumb({
  src,
  alt = '',
}: {
  src?: string | null;
  alt?: string;
}) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--line)] bg-[var(--canvas)]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <span className="text-[11px] font-semibold uppercase text-[var(--text-muted)]">
          —
        </span>
      )}
    </span>
  );
}

export function DetailRow({
  label,
  value,
  className,
  href,
  onClick,
  affordance,
  isCode,
}: {
  label: ReactNode;
  value: ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  affordance?: boolean;
  isCode?: boolean;
}) {
  const valueNode = href ? (
    <Link href={href} className="text-[var(--ink)] hover:underline">
      {value}
    </Link>
  ) : (
    value
  );

  const body = (
    <>
      <span className="shrink-0 text-[var(--text-secondary)]">{label}</span>
      <div className="flex max-w-[68%] items-center justify-end gap-1 truncate text-right font-medium text-[var(--ink)]">
        <span
          className={cn(
            'truncate',
            isCode && 'font-mono text-[11px] text-[var(--text-secondary)]'
          )}
        >
          {valueNode}
        </span>
        {affordance ? (
          <span className="shrink-0 text-[var(--text-muted)]">›</span>
        ) : null}
      </div>
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'flex w-full items-center justify-between gap-3 text-left text-[11px] sm:text-[12px] hover:opacity-80',
          className
        )}
      >
        {body}
      </button>
    );
  }

  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 text-[11px] sm:text-[12px]',
        (href || onClick) && 'hover:opacity-80',
        className
      )}
    >
      {body}
    </div>
  );
}

export const InspectorField = DetailRow;
