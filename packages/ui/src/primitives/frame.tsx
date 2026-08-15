import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { radiusClass } from '../lib/radius';

export function Frame({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return (
    <div
      className={cn(
        'ui:overflow-hidden ui:border ui:border-[var(--border-strong)]',
        radiusClass('card'),
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
