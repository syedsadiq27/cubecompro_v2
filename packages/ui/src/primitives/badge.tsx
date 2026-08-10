import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export function Badge({
  tone = 'neutral',
  className,
  ...props
}: HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
}) {
  return (
    <span
      className={cn(
        'ui:inline-flex ui:items-center ui:rounded-md ui:px-2 ui:py-0.5 ui:text-[11px] ui:font-medium',
        tone === 'neutral' &&
          'ui:bg-[var(--surface)] ui:text-[var(--text-secondary)]',
        tone === 'success' &&
          'ui:bg-[var(--success-soft)] ui:text-[var(--success)]',
        tone === 'warning' &&
          'ui:bg-[var(--warning-soft)] ui:text-[var(--warning)]',
        tone === 'danger' &&
          'ui:bg-[var(--danger-soft)] ui:text-[var(--danger)]',
        tone === 'info' && 'ui:bg-[var(--info-soft)] ui:text-[var(--info)]',
        className
      )}
      {...props}
    />
  );
}
