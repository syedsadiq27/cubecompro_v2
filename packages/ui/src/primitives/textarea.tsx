import type { TextareaHTMLAttributes } from 'react';
import { cn } from '../lib/cn';
import { radiusClass } from '../lib/radius';

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'ui:min-h-[96px] ui:w-full ui:resize-y ui:border ui:border-[var(--line)] ui:bg-[var(--surface-pure)] ui:px-3 ui:py-2 ui:text-[13px] ui:text-[var(--ink)] ui:outline-none ui:transition-colors ui:placeholder:text-[var(--text-muted)] ui:focus:border-[var(--brand)] ui:disabled:cursor-not-allowed ui:disabled:opacity-50',
        radiusClass('control'),
        className
      )}
      {...props}
    />
  );
}
