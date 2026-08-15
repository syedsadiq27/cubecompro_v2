'use client';

import Link from 'next/link';
import { cn } from '@repo/ui';
import { ChevronRightIcon } from '@/components/bo/icons';

export type AttentionItem = {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'good' | 'low';
  severityLabel: string;
  href?: string;
};

export function AttentionCard({
  title = 'Attention needed',
  items,
}: {
  title?: string;
  items: AttentionItem[];
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs">
      <h3 className="text-[14px] font-semibold text-[var(--ink)]">
        {title}
      </h3>

      <div className="mt-3.5 divide-y divide-[var(--line)]/60">
        {items.map((item) => {
          const body = (
            <div className="flex items-center justify-between gap-3 py-2.5 transition-colors group-hover:opacity-80">
              <div className="flex items-start gap-3 min-w-0">
                {item.severity === 'high' ? (
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-700 text-[11px] font-bold">
                    !
                  </div>
                ) : item.severity === 'medium' ? (
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                    ▲
                  </div>
                ) : item.severity === 'good' ? (
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                    ✓
                  </div>
                ) : (
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--text-muted)] text-[11px] font-bold">
                    i
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[var(--ink)]">
                    {item.title}
                  </p>
                  <p className="truncate text-[11px] text-[var(--text-muted)] mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={cn(
                    'rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide',
                    item.severity === 'high' && 'bg-red-50 text-red-700 border border-red-200/60',
                    item.severity === 'medium' && 'bg-amber-50 text-amber-800 border border-amber-200/60',
                    item.severity === 'good' && 'bg-emerald-50 text-emerald-800 border border-emerald-200/60',
                    item.severity === 'low' && 'bg-[var(--surface)] text-[var(--text-muted)]'
                  )}
                >
                  {item.severityLabel}
                </span>
                <ChevronRightIcon size={12} className="text-[var(--text-muted)]" />
              </div>
            </div>
          );

          if (item.href) {
            return (
              <Link key={item.id} href={item.href} className="group block no-underline">
                {body}
              </Link>
            );
          }

          return (
            <div key={item.id} className="group block">
              {body}
            </div>
          );
        })}
      </div>
    </div>
  );
}
