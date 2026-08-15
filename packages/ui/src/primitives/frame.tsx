import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

export function Frame({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return (
    <div
      className={cn(
        'ui:overflow-hidden ui:rounded-2xl ui:border ui:border-[var(--border-strong)]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
