'use client';

import { useId, useState, type ReactNode } from 'react';
import { cn } from '../lib/cn';

export function Tooltip({
  content,
  children,
  className,
  side = 'top',
}: {
  content: ReactNode;
  children: ReactNode;
  className?: string;
  side?: 'top' | 'bottom';
}) {
  const [open, setOpen] = useState(false);
  const id = useId();

  return (
    <span
      className={cn('ui:relative ui:inline-flex', className)}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span aria-describedby={open ? id : undefined}>{children}</span>
      {open ? (
        <span
          id={id}
          role="tooltip"
          className={cn(
            'ui:pointer-events-none ui:absolute ui:left-1/2 ui:z-50 ui:-translate-x-1/2 ui:whitespace-nowrap ui:rounded-md ui:bg-[var(--ink)] ui:px-2 ui:py-1 ui:text-[11px] ui:font-medium ui:text-white ui:shadow-sm',
            side === 'top' && 'ui:bottom-[calc(100%+6px)]',
            side === 'bottom' && 'ui:top-[calc(100%+6px)]'
          )}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
