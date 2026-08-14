'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import {
  deleteOverrideAction,
  upsertOverrideAction,
} from '@/actions/tenants';
import type { Catalog, Override } from '@/lib/types';

export function OverrideForm({
  organizationId,
  overrides,
  catalog,
}: {
  organizationId: string;
  overrides: Override[];
  catalog: Catalog;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const options = useMemo(
    () => [
      ...catalog.capabilities.map((row) => ({
        key: row.key,
        kind: 'CAPABILITY' as const,
        label: `${row.label} (${row.key})`,
      })),
      ...catalog.limits.map((row) => ({
        key: row.key,
        kind: 'LIMIT' as const,
        label: `${row.label} (${row.key})`,
      })),
    ],
    [catalog]
  );
  const [key, setKey] = useState(options[0]?.key ?? '');
  const selected = options.find((row) => row.key === key);
  const [value, setValue] = useState(
    selected?.kind === 'LIMIT' ? '0' : 'true'
  );

  return (
    <div className="space-y-4">
      {overrides.length === 0 ? (
        <p className="type-meta">No overrides. Plan values apply as-is.</p>
      ) : (
        <ul className="divide-y divide-[var(--line)]">
          {overrides.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-3 py-2 text-[13px]"
            >
              <span>
                <code className="font-mono text-[12px]">{row.key}</code>
                <span className="ml-2 text-[var(--ink)]">
                  {row.kind === 'CAPABILITY'
                    ? row.value === 'true' || row.value === '1'
                      ? 'enabled'
                      : 'disabled'
                    : row.value}
                </span>
              </span>
              <button
                type="button"
                className="type-meta hover:text-[var(--danger)]"
                onClick={() =>
                  start(async () => {
                    await deleteOverrideAction(organizationId, row.key);
                    router.refresh();
                  })
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
      <form
        className="flex flex-wrap items-end gap-2"
        onSubmit={(event) => {
          event.preventDefault();
          if (!selected) return;
          start(async () => {
            await upsertOverrideAction({
              organizationId,
              key,
              kind: selected.kind,
              value,
            });
            router.refresh();
          });
        }}
      >
        <label className="min-w-[220px] flex-1 space-y-1 text-[12px]">
          <span className="type-meta block">Key</span>
          <select
            value={key}
            onChange={(event) => {
              const next = event.target.value;
              setKey(next);
              const item = options.find((row) => row.key === next);
              setValue(item?.kind === 'LIMIT' ? '0' : 'true');
            }}
            className="w-full rounded-lg border border-[var(--line)] px-2 py-1.5 text-[13px]"
          >
            {options.map((row) => (
              <option key={row.key} value={row.key}>
                {row.label}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-1 text-[12px]">
          <span className="type-meta block">Value</span>
          {selected?.kind === 'CAPABILITY' ? (
            <select
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="rounded-lg border border-[var(--line)] px-2 py-1.5 text-[13px]"
            >
              <option value="true">enabled</option>
              <option value="false">disabled</option>
            </select>
          ) : (
            <input
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="w-28 rounded-lg border border-[var(--line)] px-2 py-1.5 text-[13px]"
            />
          )}
        </label>
        <button
          type="submit"
          disabled={pending || !selected}
          className="rounded-lg bg-[var(--ink)] px-3 py-1.5 text-[12px] text-white disabled:opacity-50"
        >
          Add override
        </button>
      </form>
    </div>
  );
}
