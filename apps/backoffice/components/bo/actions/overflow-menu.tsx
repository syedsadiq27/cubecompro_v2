'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Button, cn } from '@repo/ui';

export type OverflowMenuItem = {
  id: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
  separatorBefore?: boolean;
};

export function OverflowMenu({
  items,
  label = 'Actions',
  align = 'right',
}: {
  items: OverflowMenuItem[];
  label?: string;
  align?: 'left' | 'right';
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (items.length === 0) return null;

  return (
    <div ref={rootRef} className="relative inline-flex">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        aria-label={label}
        className="ui:h-7 ui:min-w-7 ui:px-1.5 ui:text-[13px] ui:leading-none ui:tracking-[0.14em]"
        onClick={() => setOpen((value) => !value)}
      >
        •••
      </Button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          className={cn(
            'absolute top-full z-30 mt-1 min-w-[152px] rounded border border-[var(--line)] bg-[var(--surface-pure)] py-0.5 shadow-md',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          {items.map((item) => (
            <div key={item.id}>
              {item.separatorBefore ? (
                <div className="my-0.5 border-t border-[var(--line)]" />
              ) : null}
              <button
                type="button"
                role="menuitem"
                disabled={item.disabled}
                className={cn(
                  'block w-full px-2.5 py-1.5 text-left text-[12px] disabled:opacity-40',
                  item.danger
                    ? 'text-[var(--danger)] hover:bg-[var(--danger-soft)]'
                    : 'text-[var(--ink)] hover:bg-[var(--surface)]'
                )}
                onClick={() => {
                  setOpen(false);
                  item.onClick();
                }}
              >
                {item.label}
              </button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function RowActionMenu({
  items,
  label,
}: {
  items: OverflowMenuItem[];
  label: string;
}) {
  return <OverflowMenu items={items} label={label} />;
}
