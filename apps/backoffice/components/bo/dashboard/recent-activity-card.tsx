'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';

export type ActivityItem = {
  id: string;
  icon: ReactNode;
  title: string;
  subtitle: string;
  time: string;
  href?: string;
};

export function RecentActivityCard({
  title = 'Recent activity',
  viewAllHref,
  items,
}: {
  title?: string;
  viewAllHref?: string;
  items: ActivityItem[];
}) {
  return (
    <div className="flex h-full flex-col rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs">
      <div className="flex items-center justify-between">
        <h3 className="text-[14px] font-semibold text-[var(--ink)]">
          {title}
        </h3>
        {viewAllHref ? (
          <Link
            href={viewAllHref}
            className="text-[12px] font-medium text-[#665CFF] hover:underline"
          >
            View all
          </Link>
        ) : null}
      </div>

      <div className="mt-3.5 divide-y divide-[var(--line)]/60">
        {items.map((item) => {
          const body = (
            <div className="flex items-center justify-between gap-3 py-2.5 transition-colors group-hover:opacity-80">
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[var(--canvas)] text-[var(--ink)]">
                  {item.icon}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[13px] font-medium text-[var(--ink)]">
                    {item.title}
                  </p>
                  <p className="truncate text-[11px] text-[var(--text-muted)] mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <span className="shrink-0 text-[11px] text-[var(--text-muted)] tabular-nums">
                {item.time}
              </span>
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
