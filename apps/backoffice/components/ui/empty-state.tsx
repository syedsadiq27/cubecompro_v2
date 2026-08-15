import { Button, Typography, cn } from '@repo/ui';
import type { ReactNode } from 'react';

type EmptyVariant = 'firstUse' | 'filtered' | 'error';

export function EmptyState({
  variant,
  title,
  description,
  message,
  action,
  secondaryAction,
  onClearFilters,
  onRetry,
  className,
}: {
  variant?: EmptyVariant;
  title?: string;
  description?: string;
  message?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  onClearFilters?: () => void;
  onRetry?: () => void;
  className?: string;
}) {
  if (variant === 'filtered') {
    return (
      <div
        className={cn(
          'rounded border border-dashed border-[var(--line)] bg-[var(--canvas)]/40 px-3 py-4',
          className
        )}
      >
        <Typography variant="bodyStrong" className="text-[13px]">
          {title ?? message ?? 'No results match these filters'}
        </Typography>
        {(onClearFilters || action) && (
          <div className="mt-3">
            {action ?? (
              <Button type="button" size="sm" variant="secondary" onClick={onClearFilters}>
                Clear filters
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'error') {
    return (
      <div
        className={cn(
          'rounded border border-[var(--danger)]/25 bg-[var(--danger-soft)] px-3 py-4',
          className
        )}
      >
        <Typography variant="bodyStrong" className="text-[13px] text-[var(--danger)]">
          {title ?? message ?? 'Something failed to load'}
        </Typography>
        {description ? (
          <Typography variant="meta" className="mt-1 max-w-md">
            {description}
          </Typography>
        ) : null}
        {(onRetry || action) && (
          <div className="mt-3">
            {action ?? (
              <Button type="button" size="sm" variant="secondary" onClick={onRetry}>
                Retry
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }

  const resolvedTitle =
    title ?? message ?? (variant === 'firstUse' ? 'Nothing here yet' : 'Nothing here yet');

  return (
    <div
      className={cn(
        'rounded border border-dashed border-[var(--line)] bg-[var(--canvas)]/40 px-3 py-4',
        className
      )}
    >
      <Typography variant="bodyStrong" className="text-[13px]">
        {resolvedTitle}
      </Typography>
      {description ? (
        <Typography variant="meta" className="mt-1 max-w-md">
          {description}
        </Typography>
      ) : null}
      {(action || secondaryAction) && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );
}
