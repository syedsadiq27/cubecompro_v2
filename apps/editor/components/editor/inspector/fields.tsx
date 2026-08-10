'use client';

import type { ReactNode } from 'react';

export function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="text-[11px] text-[var(--text-muted)]">{children}</p>;
}

export function NumberField({
  label,
  value,
  onChange,
  step = 0.01,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
  step?: number;
}) {
  return (
    <label className="grid grid-cols-[16px_1fr] items-center gap-2 text-[12px]">
      <span className="text-[var(--text-muted)]">{label}</span>
      <input
        type="number"
        step={step}
        value={Number.isFinite(value) ? value.toFixed(3) : '0'}
        onChange={(event) => {
          const next = Number.parseFloat(event.target.value);
          if (Number.isFinite(next)) onChange(next);
        }}
        className="w-full rounded-[7px] border border-[var(--line)] bg-white px-2 py-1.5 text-[12px] text-[var(--ink)] outline-none focus:border-[var(--ink)]"
      />
    </label>
  );
}

export function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block space-y-1 text-[12px]">
      <FieldLabel>{label}</FieldLabel>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-[7px] border border-[var(--line)] bg-white px-2.5 py-2 text-[12px] text-[var(--ink)] outline-none focus:border-[var(--ink)]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function RowButton({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between rounded-[8px] border border-[var(--line)] px-3 py-2 text-left text-[12px] text-[var(--ink)] hover:bg-black/[0.03]"
    >
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="truncate text-[var(--ink)]">{value}</span>
    </button>
  );
}

export function KeyValue({
  label,
  value,
}: {
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-[12px]">
      <span className="text-[var(--text-muted)]">{label}</span>
      <span className="truncate text-[var(--ink)]">{value}</span>
    </div>
  );
}
