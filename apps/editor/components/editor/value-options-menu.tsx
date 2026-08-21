'use client';

import { useEffect, useId, useRef, useState } from 'react';

export type ValueMenuAction = {
  id: string;
  label: string;
  tone?: 'default' | 'accent' | 'danger';
  disabled?: boolean;
  onSelect: () => void;
};

export function ValueOptionsMenu({
  actions,
}: {
  actions: ValueMenuAction[];
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative shrink-0">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={(event) => {
          event.stopPropagation();
          setOpen((prev) => !prev);
        }}
        className="rounded-md p-0.5 text-white/30 transition-colors hover:bg-white/10 hover:text-white"
        title="Value options"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          className="absolute right-0 top-full z-20 mt-1 min-w-[160px] overflow-hidden rounded-xl border border-white/10 bg-[#16171E] py-1 shadow-xl"
          onClick={(event) => event.stopPropagation()}
        >
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              role="menuitem"
              disabled={action.disabled}
              onClick={() => {
                if (action.disabled) return;
                setOpen(false);
                action.onSelect();
              }}
              className={`flex w-full px-3 py-1.5 text-left text-[12px] transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                action.tone === 'danger'
                  ? 'text-red-400 hover:bg-red-500/10'
                  : action.tone === 'accent'
                    ? 'text-[#9D95FF] hover:bg-[#665CFF]/15'
                    : 'text-white/80 hover:bg-white/5 hover:text-white'
              }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
