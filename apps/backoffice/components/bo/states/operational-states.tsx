'use client';

import { STATUS_VOCABULARY, type StatusGrammarRole } from '@/lib/status-vocabulary';
import { Button, cn, StatusBadge as SharedStatusBadge, type StatusRole } from '@repo/ui';
import {
  BoxIcon,
  CheckIcon,
  CloseIcon,
  ExternalLinkIcon,
} from '@/components/bo/icons';
import type { ReactNode } from 'react';

export function StatusBadge({
  role,
  label,
  className,
}: {
  role: StatusGrammarRole;
  label?: string;
  className?: string;
}) {
  const mappedRole: StatusRole =
    role === 'published'
      ? 'published'
      : role === 'draft'
        ? 'draft'
        : role === 'archived'
          ? 'archived'
          : role === 'needs_attention' || role === 'processing'
            ? 'warning'
            : role === 'error'
              ? 'danger'
              : 'info';

  return (
    <SharedStatusBadge
      role={mappedRole}
      label={label ?? STATUS_VOCABULARY[role]}
      className={className}
    />
  );
}

export function AttentionState({
  label,
  tone = 'warning',
}: {
  label: string;
  tone?: 'warning' | 'success' | 'danger' | 'neutral';
}) {
  const dot =
    tone === 'success'
      ? 'bg-emerald-600'
      : tone === 'danger'
        ? 'bg-red-600'
        : tone === 'neutral'
          ? 'bg-[var(--text-muted)]'
          : 'bg-amber-600';

  return (
    <span className="inline-flex min-w-0 items-center gap-1.5 text-[13px] text-[var(--text-secondary)]">
      <span className={cn('inline-block h-1.5 w-1.5 shrink-0 rounded-full', dot)} />
      <span className="truncate">{label}</span>
    </span>
  );
}

export type EmptyStateVariant =
  | 'firstUse'
  | 'filtered'
  | 'error'
  | 'noPermission'
  | 'incomplete'
  | 'syncFailed';

export function EmptyState({
  variant = 'firstUse',
  title,
  description,
  action,
  secondaryAction,
  onClearFilters,
  onRetry,
  className,
}: {
  variant?: EmptyStateVariant;
  title?: string;
  description?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  onClearFilters?: () => void;
  onRetry?: () => void;
  className?: string;
}) {
  // 1. Filtered Empty State
  if (variant === 'filtered') {
    return (
      <div
        className={cn(
          'rounded-xl border border-dashed border-[var(--line)] bg-[var(--canvas)]/30 p-8 text-center',
          className
        )}
      >
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--canvas)] text-[var(--text-muted)]">
          <span className="text-base">⌕</span>
        </div>
        <p className="mt-3 text-[14px] font-semibold text-[var(--ink)]">
          {title ?? 'No results match these filters'}
        </p>
        <p className="mt-1 text-[12px] text-[var(--text-secondary)] max-w-sm mx-auto">
          {description ?? 'Try broadening your search query or resetting the active filters.'}
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          {action ?? (
            <Button type="button" size="sm" variant="secondary" onClick={onClearFilters}>
              Clear filters
            </Button>
          )}
        </div>
      </div>
    );
  }

  // 2. Failed Load / Error State
  if (variant === 'error') {
    return (
      <div
        className={cn(
          'rounded-xl border border-red-200/70 bg-red-50/40 p-8 text-center',
          className
        )}
      >
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700">
          <span className="text-sm font-bold">!</span>
        </div>
        <p className="mt-3 text-[14px] font-semibold text-red-900">
          {title ?? 'Failed to load configuration'}
        </p>
        <p className="mt-1 text-[12px] text-red-700/80 max-w-md mx-auto">
          {description ?? 'An error occurred while fetching graph data from the API server. Please retry.'}
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          {action ?? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              onClick={onRetry}
              className="ui:border-red-300 ui:text-red-900 ui:hover:bg-red-100"
            >
              Retry request
            </Button>
          )}
        </div>
      </div>
    );
  }

  // 3. Permission Denied State
  if (variant === 'noPermission') {
    return (
      <div
        className={cn(
          'rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-8 text-center shadow-xs',
          className
        )}
      >
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[var(--canvas)] text-[var(--text-muted)]">
          <span className="text-sm">🔒</span>
        </div>
        <p className="mt-3 text-[14px] font-semibold text-[var(--ink)]">
          {title ?? 'Permission required'}
        </p>
        <p className="mt-1 text-[12px] text-[var(--text-secondary)] max-w-md mx-auto">
          {description ?? 'You have read-only access to this product workspace. An editor or admin role is required to modify configuration graphs or publish to commerce.'}
        </p>
        {(action || secondaryAction) && (
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            {action}
            {secondaryAction}
          </div>
        )}
      </div>
    );
  }

  // 4. Sync Failed / Connector Error State
  if (variant === 'syncFailed') {
    return (
      <div
        className={cn(
          'rounded-xl border border-amber-200 bg-amber-50/50 p-6 text-left shadow-xs',
          className
        )}
      >
        <div className="flex items-start gap-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-800 shrink-0 font-bold text-sm">
            ⚠
          </span>
          <div className="min-w-0 flex-1 space-y-1">
            <h3 className="text-[13px] font-semibold text-amber-950">
              {title ?? 'Commerce sync failed'}
            </h3>
            <p className="text-[12px] text-amber-900/90 leading-relaxed">
              {description ?? 'The Shopify connector timed out while verifying variant SKU-BLK-XL-WAL. Check your store credentials and retry.'}
            </p>
            <div className="pt-2 flex items-center gap-2.5">
              {action ?? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={onRetry}
                  className="ui:h-7 ui:text-[11px] ui:border-amber-300 ui:text-amber-900"
                >
                  Retry sync
                </Button>
              )}
              {secondaryAction}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 5. First-Use Empty State (Default)
  return (
    <div
      className={cn(
        'rounded-xl border border-dashed border-[var(--line)] bg-[var(--canvas)]/40 p-10 text-center',
        className
      )}
    >
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] text-[var(--text-muted)] shadow-xs">
        <BoxIcon size={24} />
      </div>
      <p className="mt-4 text-[15px] font-semibold text-[var(--ink)]">
        {title ?? 'Nothing here yet'}
      </p>
      {description ? (
        <p className="mt-1 text-[12px] text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      ) : null}
      {(action || secondaryAction) && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

/** Processing / Loading state indicator with step progress */
export function ProcessingState({
  title = 'Processing 3D geometry…',
  subtitle = 'Generating LODs, Draco mesh compression, and AR USDZ targets.',
  step,
  totalSteps = 3,
}: {
  title?: string;
  subtitle?: string;
  step?: number;
  totalSteps?: number;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-6 text-center shadow-xs max-w-md mx-auto">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full border border-blue-200 bg-blue-50 text-blue-600 animate-spin">
        <span className="text-sm">⟳</span>
      </div>
      <h3 className="mt-3 text-[14px] font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mt-1 text-[12px] text-[var(--text-secondary)] leading-relaxed">
        {subtitle}
      </p>
      {step != null ? (
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between text-[11px] text-[var(--text-muted)] font-mono">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-[var(--line)] overflow-hidden">
            <div
              className="h-full bg-[var(--ink)] transition-all duration-300"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

/** Incomplete configuration warning banner */
export function IncompleteConfigBanner({
  title = 'Configuration incomplete',
  issues,
  onResolve,
}: {
  title?: string;
  issues: string[];
  onResolve?: () => void;
}) {
  return (
    <div className="rounded-xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-xs">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-200 text-amber-900 text-[11px] font-bold shrink-0">
          !
        </span>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-[13px] font-semibold text-amber-950">{title}</p>
          <ul className="space-y-0.5 text-[12px] text-amber-900/90 list-disc list-inside">
            {issues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        </div>
        {onResolve ? (
          <Button
            type="button"
            size="sm"
            variant="secondary"
            onClick={onResolve}
            className="ui:h-7 ui:text-[11px] ui:border-amber-300 ui:text-amber-950 shrink-0"
          >
            Resolve blockers
          </Button>
        ) : null}
      </div>
    </div>
  );
}

/** Success alert banner after publish / save */
export function SuccessBanner({
  title = 'Product published successfully',
  description = 'Live version v1 is now active on your storefront customizer.',
  storefrontUrl,
  onClose,
}: {
  title?: string;
  description?: string;
  storefrontUrl?: string;
  onClose?: () => void;
}) {
  return (
    <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/60 p-4 shadow-xs animate-in fade-in duration-200">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-200 text-emerald-900 shrink-0">
            <CheckIcon size={12} />
          </span>
          <div className="space-y-0.5">
            <p className="text-[13px] font-semibold text-emerald-950">{title}</p>
            <p className="text-[12px] text-emerald-900/80">{description}</p>
            {storefrontUrl ? (
              <a
                href={storefrontUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-800 hover:underline pt-1"
              >
                <span>Open in 3D Customizer</span>
                <ExternalLinkIcon size={11} />
              </a>
            ) : null}
          </div>
        </div>
        {onClose ? (
          <button
            type="button"
            onClick={onClose}
            className="text-emerald-700/60 hover:text-emerald-950"
          >
            <CloseIcon size={14} />
          </button>
        ) : null}
      </div>
    </div>
  );
}

export function BulkActionBar({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children: ReactNode;
}) {
  if (count <= 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-3 border-b border-[var(--line)] bg-[var(--surface)]/60 px-6 py-2">
      <span className="text-[12px] font-semibold text-[var(--ink)]">
        {count} selected
      </span>
      <div className="flex flex-wrap items-center gap-2">{children}</div>
      <button
        type="button"
        className="ml-auto text-[12px] font-medium text-[var(--text-muted)] hover:text-[var(--ink)] px-2 py-1"
        onClick={onClear}
      >
        Clear
      </button>
    </div>
  );
}

export function SkeletonRows({
  rows = 6,
  cols = 5,
}: {
  rows?: number;
  cols?: number;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[var(--line)]">
      <div className="border-b border-[var(--line)] bg-[var(--surface)] px-4 py-2.5">
        <div className="h-3 w-24 animate-pulse rounded bg-[var(--line)]" />
      </div>
      <ul>
        {Array.from({ length: rows }).map((_, row) => (
          <li
            key={row}
            className="flex h-12 items-center gap-4 border-t border-[var(--line)] px-4"
          >
            {Array.from({ length: cols }).map((__, col) => (
              <div
                key={col}
                className={cn(
                  'h-3 animate-pulse rounded bg-[var(--line)]',
                  col === 0 ? 'w-[28%]' : 'w-[12%]'
                )}
              />
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
