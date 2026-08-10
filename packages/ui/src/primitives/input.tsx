import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'ui:h-9 ui:w-full ui:rounded-[7px] ui:border ui:border-[var(--line)] ui:bg-[var(--surface-pure)] ui:px-3 ui:text-[13px] ui:text-[var(--ink)] ui:outline-none ui:transition-colors ui:placeholder:text-[var(--text-muted)] ui:focus:border-[var(--ink)]/40 ui:disabled:cursor-not-allowed ui:disabled:opacity-50',
        className
      )}
      {...props}
    />
  );
}
