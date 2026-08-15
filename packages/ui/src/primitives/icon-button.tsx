import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { radiusClass } from '../lib/radius';

export type IconButtonSize = 'sm' | 'md';

export function IconButton({
  className,
  size = 'sm',
  variant = 'ghost',
  children,
  type = 'button',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: IconButtonSize;
  variant?: 'ghost' | 'secondary';
  children: ReactNode;
}) {
  return (
    <button
      type={type}
      className={cn(
        'ui:inline-flex ui:items-center ui:justify-center ui:text-[var(--ink)] ui:transition ui:focus-visible:outline ui:focus-visible:outline-2 ui:focus-visible:outline-offset-2 ui:focus-visible:outline-[var(--brand)] ui:disabled:pointer-events-none ui:disabled:opacity-40',
        radiusClass('control'),
        size === 'sm' && 'ui:h-8 ui:w-8',
        size === 'md' && 'ui:h-9 ui:w-9',
        variant === 'ghost' && 'ui:hover:bg-black/[0.04]',
        variant === 'secondary' &&
          'ui:border ui:border-[var(--border-strong)] ui:hover:border-[var(--ink)]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
