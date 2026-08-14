'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { setLeadStatusAction } from '@/actions/leads';
import { FUNNEL, type FunnelId } from '@/lib/funnel';
import type { LeadRow } from '@/lib/leads';
import { FunnelBadge } from './funnel-badge';

function leadKey(row: LeadRow) {
  return `${row.email}|${row.timestamp}`;
}

export function LeadsBoard({ rows }: { rows: LeadRow[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [filter, setFilter] = useState<FunnelId | 'all'>('all');
  const [local, setLocal] = useState<Record<string, FunnelId>>({});

  const resolved = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        status: local[leadKey(row)] ?? row.status,
      })),
    [rows, local]
  );

  const counts = useMemo(() => {
    const map = Object.fromEntries(FUNNEL.map((stage) => [stage.id, 0])) as Record<
      FunnelId,
      number
    >;
    for (const row of resolved) map[row.status] += 1;
    return map;
  }, [resolved]);

  const visible =
    filter === 'all'
      ? resolved
      : resolved.filter((row) => row.status === filter);

  function move(row: LeadRow, status: FunnelId) {
    setLocal((prev) => ({ ...prev, [leadKey(row)]: status }));
    start(async () => {
      await setLeadStatusAction(row.email, row.timestamp, status);
      router.refresh();
    });
  }

  return (
    <div className="space-y-4">
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 md:mx-0 md:flex-wrap md:px-0">
        <button
          type="button"
          onClick={() => setFilter('all')}
          className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] ${
            filter === 'all'
              ? 'bg-[var(--ink)] text-white'
              : 'bg-[var(--surface-pure)] text-[var(--text-secondary)] ring-1 ring-[var(--line)]'
          }`}
        >
          All {resolved.length}
        </button>
        {FUNNEL.map((stage) => (
          <button
            key={stage.id}
            type="button"
            onClick={() => setFilter(stage.id)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-[12px] ${
              filter === stage.id
                ? 'bg-[var(--ink)] text-white'
                : 'bg-[var(--surface-pure)] text-[var(--text-secondary)] ring-1 ring-[var(--line)]'
            }`}
          >
            {stage.label} {counts[stage.id]}
          </button>
        ))}
      </div>

      <div className="space-y-3 md:hidden">
        {visible.map((row) => (
          <article
            key={leadKey(row)}
            className="rounded-2xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-[14px] font-medium text-[var(--ink)]">
                {row.name || '—'}
              </p>
              <FunnelBadge status={row.status} />
            </div>
            <p className="type-meta mt-1">{row.timestamp || '—'}</p>
            {row.email ? (
              <a
                href={`mailto:${row.email}`}
                className="mt-1 block break-all text-[13px] text-[var(--brand)]"
              >
                {row.email}
              </a>
            ) : null}
            <dl className="mt-3 space-y-2 text-[13px]">
              <div className="flex justify-between gap-3">
                <dt className="type-meta">Company</dt>
                <dd className="text-right">{row.company || '—'}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="type-meta">Interest</dt>
                <dd className="text-right">{row.interest || '—'}</dd>
              </div>
            </dl>
            {row.message ? (
              <p className="mt-3 text-[13px] leading-relaxed text-[var(--text-secondary)]">
                {row.message}
              </p>
            ) : null}
            <label className="mt-3 block">
              <span className="type-meta mb-1 block">Funnel</span>
              <select
                value={row.status}
                disabled={pending}
                onChange={(event) =>
                  move(row, event.target.value as FunnelId)
                }
                className="w-full rounded-lg border border-[var(--line)] px-2 py-2 text-[13px]"
              >
                {FUNNEL.map((stage) => (
                  <option key={stage.id} value={stage.id}>
                    {stage.label}
                  </option>
                ))}
              </select>
            </label>
          </article>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-2xl border border-[var(--line)] md:block">
        <table className="w-full min-w-[860px] text-left text-[13px]">
          <thead className="bg-[var(--surface)] text-[11px] font-semibold tracking-[0.04em] text-[var(--text-muted)] uppercase">
            <tr>
              <th className="px-4 py-2.5 font-semibold">When</th>
              <th className="px-4 py-2.5 font-semibold">Name</th>
              <th className="px-4 py-2.5 font-semibold">Email</th>
              <th className="px-4 py-2.5 font-semibold">Company</th>
              <th className="px-4 py-2.5 font-semibold">Interest</th>
              <th className="px-4 py-2.5 font-semibold">Status</th>
              <th className="px-4 py-2.5 font-semibold">Message</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={leadKey(row)} className="border-t border-[var(--line)]">
                <td className="px-4 py-2.5 type-meta whitespace-nowrap">
                  {row.timestamp || '—'}
                </td>
                <td className="px-4 py-2.5 font-medium">{row.name || '—'}</td>
                <td className="px-4 py-2.5">
                  {row.email ? (
                    <a href={`mailto:${row.email}`} className="hover:underline">
                      {row.email}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td className="px-4 py-2.5">{row.company || '—'}</td>
                <td className="px-4 py-2.5">{row.interest || '—'}</td>
                <td className="px-4 py-2.5">
                  <select
                    value={row.status}
                    disabled={pending}
                    onChange={(event) =>
                      move(row, event.target.value as FunnelId)
                    }
                    className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] px-2 py-1 text-[12px]"
                  >
                    {FUNNEL.map((stage) => (
                      <option key={stage.id} value={stage.id}>
                        {stage.label}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="max-w-[240px] px-4 py-2.5 text-[var(--text-secondary)]">
                  <span className="line-clamp-3">{row.message || '—'}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {visible.length === 0 ? (
        <p className="type-meta">No leads in this stage.</p>
      ) : null}
    </div>
  );
}
