import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { radiusClass } from '../lib/radius';

export function Input({
  className,
  insetStart = false,
  insetEnd = false,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  insetStart?: boolean;
  insetEnd?: boolean;
}) {
  return (
    <input
      className={cn(
        'ui:h-9 ui:w-full ui:border ui:border-[var(--line)] ui:bg-[var(--surface-pure)] ui:text-[13px] ui:text-[var(--ink)] ui:outline-none ui:transition-colors ui:placeholder:text-[var(--text-muted)] ui:focus:border-[var(--brand)] ui:disabled:cursor-not-allowed ui:disabled:opacity-50',
        insetStart ? 'ui:pl-10' : 'ui:pl-3',
        insetEnd ? 'ui:pr-10' : 'ui:pr-3',
        radiusClass('control'),
        className
      )}
      {...props}
    />
  );
}
