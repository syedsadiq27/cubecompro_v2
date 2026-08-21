'use client';

import { useCallback, useState, type ReactNode } from 'react';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from '@/components/editor/icons';

export function useExclusiveAccordion(initial: string | null = null) {
  const [openId, setOpenId] = useState<string | null>(initial);

  const isOpen = useCallback((id: string) => openId === id, [openId]);

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  return { openId, isOpen, toggle, setOpenId };
}

export function MobileAccordion({
  title,
  open,
  onToggle,
  actions,
  children,
  count,
}: {
  title: string;
  open: boolean;
  onToggle: () => void;
  actions?: ReactNode;
  children?: ReactNode;
  count?: number;
}) {
  return (
    <section className="border-b border-white/10 last:border-b-0">
      <div className="flex items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
        >
          <span className="flex w-3.5 shrink-0 justify-center text-white/50">
            {open ? <ChevronDownIcon /> : <ChevronRightIcon />}
          </span>
          <span className="truncate font-mono text-[11px] font-bold uppercase tracking-wider text-white/80">
            {title}
          </span>
          {typeof count === 'number' ? (
            <span className="rounded-full bg-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/50">
              {count}
            </span>
          ) : null}
        </button>
        {actions ? (
          <div
            className="flex shrink-0 items-center gap-1"
            onClick={(event) => event.stopPropagation()}
          >
            {actions}
          </div>
        ) : null}
      </div>
      {open ? <div className="px-3 pb-3">{children}</div> : null}
    </section>
  );
}

export function MobileSheetAction({
  children,
  onClick,
  tone = 'default',
}: {
  children: ReactNode;
  onClick?: () => void;
  tone?: 'default' | 'accent' | 'danger';
}) {
  const toneClass =
    tone === 'accent'
      ? 'border-[#665CFF]/50 bg-[#665CFF]/20 text-[#9D95FF]'
      : tone === 'danger'
        ? 'border-red-500/30 bg-red-950/30 text-red-300'
        : 'border-white/10 bg-white/5 text-white/80';

  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-lg border px-2 py-1 text-[10px] font-medium transition-colors hover:bg-white/10 ${toneClass}`}
    >
      {children}
    </button>
  );
}

export function MobileDrillHeader({
  title,
  onBack,
}: {
  title: string;
  onBack: () => void;
}) {
  return (
    <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2.5">
      <button
        type="button"
        onClick={onBack}
        className="flex min-w-0 items-center gap-1.5 text-[13px] font-semibold text-white"
      >
        <ArrowLeftIcon size="sm" className="text-white/60" />
        <span className="truncate">{title}</span>
      </button>
    </div>
  );
}

export function MobileField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="text-[10px] font-medium text-white/50">{label}</label>
      {children}
    </div>
  );
}
