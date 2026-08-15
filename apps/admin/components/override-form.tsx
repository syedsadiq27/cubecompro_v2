'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { Button, Field, Input, Select } from '@repo/ui';
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="ui:text-[var(--text-muted)] ui:hover:text-[var(--danger)]"
                onClick={() =>
                  start(async () => {
                    await deleteOverrideAction(organizationId, row.key);
                    router.refresh();
                  })
                }
              >
                Remove
              </Button>
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
        <Field label="Key" htmlFor="override-key" className="min-w-[220px] flex-1">
          <Select
            id="override-key"
            value={key}
            onChange={(event) => {
              const next = event.target.value;
              setKey(next);
              const item = options.find((row) => row.key === next);
              setValue(item?.kind === 'LIMIT' ? '0' : 'true');
            }}
          >
            {options.map((row) => (
              <option key={row.key} value={row.key}>
                {row.label}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Value" htmlFor="override-value">
          {selected?.kind === 'CAPABILITY' ? (
            <Select
              id="override-value"
              value={value}
              onChange={(event) => setValue(event.target.value)}
            >
              <option value="true">enabled</option>
              <option value="false">disabled</option>
            </Select>
          ) : (
            <Input
              id="override-value"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="ui:w-28"
            />
          )}
        </Field>
        <Button type="submit" disabled={pending || !selected} size="sm">
          Add override
        </Button>
      </form>
    </div>
  );
}
