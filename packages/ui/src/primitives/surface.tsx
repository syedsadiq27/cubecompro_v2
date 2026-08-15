import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { radiusClass } from '../lib/radius';

export function Surface({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'ui:relative ui:overflow-hidden ui:border ui:border-[var(--line)]/70 ui:bg-[var(--surface-pure)]',
        radiusClass('panel'),
        className
      )}
      {...props}
    />
  );
}
