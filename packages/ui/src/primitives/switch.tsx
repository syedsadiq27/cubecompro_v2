import type { ButtonHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export function Switch({
  checked = false,
  onCheckedChange,
  className,
  disabled,
  id,
  'aria-label': ariaLabel,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> & {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      className={cn(
        'ui:relative ui:inline-flex ui:h-5 ui:w-9 ui:shrink-0 ui:items-center ui:rounded-full ui:transition-colors ui:focus-visible:outline ui:focus-visible:outline-2 ui:focus-visible:outline-offset-2 ui:focus-visible:outline-[var(--brand)] ui:disabled:opacity-40',
        checked ? 'ui:bg-[var(--ink)]' : 'ui:bg-[var(--border-strong)]',
        className
      )}
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      <span
        aria-hidden
        className={cn(
          'ui:inline-block ui:h-4 ui:w-4 ui:rounded-full ui:bg-white ui:shadow-sm ui:transition-transform',
          checked ? 'ui:translate-x-[18px]' : 'ui:translate-x-[2px]'
        )}
      />
    </button>
  );
}
