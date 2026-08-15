import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { radiusClass } from '../lib/radius';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'ui:h-9 ui:w-full ui:border ui:border-[var(--line)] ui:bg-[var(--surface-pure)] ui:px-3 ui:text-[13px] ui:text-[var(--ink)] ui:outline-none ui:transition-colors ui:placeholder:text-[var(--text-muted)] ui:focus:border-[var(--brand)] ui:disabled:cursor-not-allowed ui:disabled:opacity-50',
        radiusClass('control'),
        className
      )}
      {...props}
    />
  );
}
