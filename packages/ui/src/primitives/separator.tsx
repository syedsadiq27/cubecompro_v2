import type { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export function Separator({
  className,
  orientation = 'horizontal',
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  orientation?: 'horizontal' | 'vertical';
}) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        'ui:shrink-0 ui:bg-[var(--line)]',
        orientation === 'horizontal' ? 'ui:h-px ui:w-full' : 'ui:h-4 ui:w-px',
        className
      )}
      {...props}
    />
  );
}
