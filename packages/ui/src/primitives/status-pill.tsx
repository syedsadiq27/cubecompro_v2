import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type Status = 'live' | 'draft' | 'cancelled' | 'warning' | 'info';

const STATUS_CLASS: Record<Status, string> = {
  live: 'ui:bg-[var(--success-soft)] ui:text-[var(--success)]',
  draft: 'ui:bg-[var(--warning-soft)] ui:text-[var(--warning)]',
  cancelled: 'ui:bg-[var(--danger-soft)] ui:text-[var(--danger)]',
  warning: 'ui:bg-[var(--warning-soft)] ui:text-[var(--warning)]',
  info: 'ui:bg-[var(--info-soft)] ui:text-[var(--info)]',
};

export function StatusPill({
  status = 'draft',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  status?: Status;
}) {
  return (
    <span
      className={cn(
        'ui:inline-flex ui:items-center ui:rounded-full ui:px-2.5 ui:py-0.5 ui:text-[11px] ui:font-medium',
        STATUS_CLASS[status],
        className
      )}
      {...props}
    />
  );
}
