'use client';

import { Heading, Input, Typography, cn } from '@repo/ui';
import { HeaderActions } from '@/components/ui/header-actions';
import type { ActionMenuItem } from '@/components/ui/action-menu';

export function BrowseWorkspace({
  title,
  meta,
  subtitle,
  actions,
  primaryAction,
  secondaryAction,
  overflow,
  filters,
  search,
  secondary,
  children,
  inspector,
}: {
  title: string;
  meta?: React.ReactNode;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryAction?: React.ReactNode;
  overflow?: ActionMenuItem[];
  filters?: React.ReactNode;
  search?: React.ReactNode;
  secondary?: React.ReactNode;
  children: React.ReactNode;
  inspector?: React.ReactNode;
}) {
  const resolvedActions =
    actions ??
    (primaryAction || secondaryAction || overflow ? (
      <HeaderActions
        primary={primaryAction}
        secondary={secondaryAction}
        overflow={overflow}
      />
    ) : null);

  return (
    <div className="relative flex min-h-0 flex-1 overflow-hidden">
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--line)] px-3 py-2">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <Heading
                as="h1"
                variant="section"
                className="text-[15px] md:text-[15px]"
              >
                {title}
              </Heading>
              {meta ? (
                typeof meta === 'string' || typeof meta === 'number' ? (
                  <Typography as="span" variant="meta">
                    {meta}
                  </Typography>
                ) : (
                  <span className="text-[11px] text-[var(--text-muted)]">
                    {meta}
                  </span>
                )
              ) : null}
            </div>
            {subtitle ? (
              <div className="mt-0.5">
                {typeof subtitle === 'string' ? (
                  <Typography variant="meta">{subtitle}</Typography>
                ) : (
                  subtitle
                )}
              </div>
            ) : null}
          </div>
          {resolvedActions ? (
            <div className="flex flex-wrap items-center gap-1.5">
              {resolvedActions}
            </div>
          ) : null}
        </header>

        {(filters || search) && (
          <div className="flex flex-wrap items-center gap-1.5 border-b border-[var(--line)] px-3 py-1.5">
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-0.5">
              {filters}
            </div>
            {search}
          </div>
        )}

        {secondary}

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-2.5">
          {children}
        </div>
      </div>

      {inspector}
    </div>
  );
}

/** Compact filter segment — selected ≠ primary filled button. */
export function BrowseTab({
  label,
  count,
  active,
  onClick,
}: {
  label: string;
  count?: number;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'inline-flex h-7 items-center gap-1 rounded px-2.5 text-[12px] font-medium transition-colors',
        active
          ? 'bg-[var(--brand-soft)] text-[var(--brand)]'
          : 'text-[var(--text-secondary)] hover:bg-[var(--surface)] hover:text-[var(--ink)]'
      )}
    >
      {label}
      {count != null ? (
        <span
          className={cn(
            'tabular-nums text-[11px]',
            active ? 'text-[var(--brand)]/70' : 'text-[var(--text-muted)]'
          )}
        >
          {count}
        </span>
      ) : null}
    </button>
  );
}

/** Entity sibling tabs — underline/rail, not filter segments. */
export function EntityTab({
  label,
  active,
  onClick,
  href,
}: {
  label: string;
  active: boolean;
  onClick?: () => void;
  href?: string;
}) {
  const className = cn(
    'relative -mb-px border-b-2 px-3 py-2 text-[13px] font-medium transition-colors',
    active
      ? 'border-[var(--brand)] text-[var(--ink)]'
      : 'border-transparent text-[var(--text-muted)] hover:text-[var(--ink)]'
  );

  if (href) {
    return (
      <a href={href} className={className} aria-current={active ? 'page' : undefined}>
        {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={className}
    >
      {label}
    </button>
  );
}

export function EntityTabList({ children }: { children: React.ReactNode }) {
  return (
    <div
      role="tablist"
      className="flex gap-0.5 border-b border-[var(--line)] px-3"
    >
      {children}
    </div>
  );
}

export function BrowseSearch({
  value,
  onChange,
  placeholder = 'Search…',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <Input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="ui:h-7 ui:max-w-[200px] ui:rounded ui:text-[12px] sm:ui:w-[180px]"
    />
  );
}
