import type { InputHTMLAttributes } from 'react';
import { cn } from '../lib/cn';

export function Checkbox({
  className,
  label,
  id,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
}) {
  const input = (
    <input
      id={id}
      type="checkbox"
      className={cn(
        'ui:h-4 ui:w-4 ui:shrink-0 ui:rounded-[4px] ui:border ui:border-[var(--line)] ui:accent-[var(--ink)] ui:focus-visible:outline ui:focus-visible:outline-2 ui:focus-visible:outline-offset-2 ui:focus-visible:outline-[var(--brand)] ui:disabled:opacity-50',
        className
      )}
      {...props}
    />
  );

  if (!label) {
    return input;
  }

  return (
    <label
      htmlFor={id}
      className="ui:inline-flex ui:cursor-pointer ui:items-center ui:gap-2 ui:text-[13px] ui:text-[var(--ink)]"
    >
      {input}
      {label}
    </label>
  );
}
