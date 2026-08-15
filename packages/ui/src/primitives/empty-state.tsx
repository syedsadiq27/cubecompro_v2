import type { ReactNode } from 'react';
import { cn } from '../lib/cn';
import { Stage } from '../brand/stage';

export type EmptyStateVariant =
  | 'default'
  | 'firstUse'
  | 'filtered'
  | 'error'
  | 'noPermission';

export function EmptyState({
  title,
  description,
  message,
  action,
  secondaryAction,
  stage = false,
  variant = 'default',
  className,
}: {
  title?: string;
  description?: string;
  message?: string;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  stage?: boolean;
  variant?: EmptyStateVariant;
  className?: string;
}) {
  const resolvedTitle =
    title ??
    message ??
    (variant === 'filtered'
      ? 'No results match these filters'
      : variant === 'error'
        ? 'Failed to load'
        : variant === 'noPermission'
          ? 'Permission required'
          : 'Nothing here yet');

  const content = (
    <div
      className={cn(
        'ui:flex ui:flex-col ui:items-center ui:justify-center ui:px-6 ui:py-10 ui:text-center',
        variant === 'error' &&
          'ui:rounded-xl ui:border ui:border-red-200/70 ui:bg-red-50/40',
        (variant === 'filtered' ||
          variant === 'firstUse' ||
          variant === 'default') &&
          'ui:rounded-xl ui:border ui:border-dashed ui:border-[var(--line)] ui:bg-[var(--canvas)]/30',
        className
      )}
    >
      <h3
        className={cn(
          'ui:text-[16px] ui:font-semibold ui:tracking-[-0.015em]',
          variant === 'error' ? 'ui:text-red-900' : 'ui:text-[var(--ink)]'
        )}
      >
        {resolvedTitle}
      </h3>
      {description ? (
        <p
          className={cn(
            'ui:mt-2 ui:max-w-[28rem] ui:text-[13px] ui:leading-relaxed',
            variant === 'error'
              ? 'ui:text-red-700/80'
              : 'ui:text-[var(--text-secondary)]'
          )}
        >
          {description}
        </p>
      ) : null}
      {(action || secondaryAction) && (
        <div className="ui:mt-5 ui:flex ui:flex-wrap ui:items-center ui:justify-center ui:gap-2.5">
          {action}
          {secondaryAction}
        </div>
      )}
    </div>
  );

  if (!stage) {
    return content;
  }

  return (
    <Stage size="cover" plane className="ui:rounded-[10px]">
      {content}
    </Stage>
  );
}
