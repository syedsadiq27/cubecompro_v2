import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export function Surface({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'ui:relative ui:overflow-hidden ui:rounded-[10px] ui:border ui:border-[var(--line)]/70 ui:bg-[var(--surface-pure)]',
        className
      )}
      {...props}
    />
  );
}
