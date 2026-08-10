import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
}) {
  return (
    <button
      type={type}
      className={cn(
        'ui:inline-flex ui:items-center ui:justify-center ui:gap-2 ui:rounded-[7px] ui:font-medium ui:transition-colors ui:focus-visible:outline ui:focus-visible:outline-2 ui:focus-visible:outline-offset-2 ui:focus-visible:outline-[var(--ink)] ui:disabled:pointer-events-none ui:disabled:opacity-40',
        size === 'sm' && 'ui:h-8 ui:px-3 ui:text-[12px]',
        size === 'md' && 'ui:h-9 ui:px-3.5 ui:text-[13px]',
        variant === 'primary' &&
          'ui:bg-[var(--ink)] ui:text-white ui:hover:bg-black',
        variant === 'secondary' &&
          'ui:border ui:border-[var(--line)] ui:bg-[var(--surface-pure)] ui:text-[var(--ink)] ui:hover:border-[var(--border-strong)] ui:hover:bg-[var(--surface)]',
        variant === 'ghost' &&
          'ui:bg-transparent ui:text-[var(--ink)] ui:hover:bg-black/[0.04]',
        variant === 'danger' &&
          'ui:bg-[var(--danger)] ui:text-white ui:hover:bg-[#b03e3e]',
        className
      )}
      {...props}
    />
  );
}
