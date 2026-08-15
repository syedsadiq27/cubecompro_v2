'use client';

import type { ReactNode } from 'react';
import { Card, Typography } from '@repo/ui';

export function OptionCard({
  label,
  value,
  children,
  open = false,
}: {
  label: string;
  value: string;
  children: ReactNode;
  open?: boolean;
}) {
  return (
    <Card as="section" padding="md">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <Typography as="h3" variant="label">
            {label}
          </Typography>
          <Typography variant="bodyStrong" className="mt-1">
            {value}
          </Typography>
        </div>
        <Typography as="span" variant="meta" tone="muted" aria-hidden>
          {open ? '⌃' : '⌄'}
        </Typography>
      </div>
      <div className="flex flex-wrap gap-3">{children}</div>
    </Card>
  );
}

export function SwatchButton({
  label,
  swatch,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  swatch: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`relative h-11 w-11 shrink-0 rounded-full border-2 transition ${
        selected
          ? 'border-[var(--stage-violet)] shadow-[0_0_0_3px_rgba(102,92,255,0.15)]'
          : 'border-transparent hover:border-[var(--ink)]/20'
      } ${disabled ? 'cursor-not-allowed opacity-30' : ''}`}
      style={{ backgroundColor: swatch }}
    >
      <span className="absolute inset-1 rounded-full border border-white/25 shadow-inner" />
      <span className="sr-only">{label}</span>
    </button>
  );
}

export function ChoiceButton({
  label,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`min-w-16 rounded-lg border px-4 py-2.5 text-sm font-medium transition ${
        selected
          ? 'border-[var(--stage-violet)] bg-[var(--stage-violet)]/10 text-[var(--ink)] shadow-[0_0_0_2px_rgba(102,92,255,0.1)]'
          : 'border-[var(--line)] bg-[var(--surface-pure)] hover:border-[var(--ink)]/30'
      } ${disabled ? 'cursor-not-allowed opacity-30' : ''}`}
    >
      {label}
    </button>
  );
}
