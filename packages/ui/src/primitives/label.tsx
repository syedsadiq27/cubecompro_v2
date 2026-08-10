import type { LabelHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        'ui:block ui:text-[12px] ui:font-medium ui:text-[var(--ink)]',
        className
      )}
      {...props}
    />
  );
}
