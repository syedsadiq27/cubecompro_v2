import type { SelectHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { radiusClass } from '../lib/radius';

export function Select({
  className,
  children,
  style,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'ui:h-9 ui:w-full ui:appearance-none ui:border ui:border-[var(--line)] ui:bg-[var(--surface-pure)] ui:bg-[length:12px] ui:bg-[position:right_12px_center] ui:bg-no-repeat ui:px-3 ui:pr-9 ui:text-[13px] ui:text-[var(--ink)] ui:outline-none ui:transition-colors ui:focus:border-[var(--brand)] ui:disabled:cursor-not-allowed ui:disabled:opacity-50',
        radiusClass('control'),
        className
      )}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12' fill='none'%3E%3Cpath d='M2.5 4.5L6 8L9.5 4.5' stroke='%238a8a84' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
        ...style,
      }}
      {...props}
    >
      {children}
    </select>
  );
}
