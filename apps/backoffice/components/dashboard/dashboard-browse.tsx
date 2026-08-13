'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  BrowseSearch,
  BrowseTab,
  BrowseWorkspace,
} from '@/components/ui/browse-workspace';

type DashboardCard = {
  id: string;
  name: string;
  value: string;
  subtitle: string;
  href?: string;
};

export function DashboardBrowse({
  projectId,
  productCount,
}: {
  projectId: string;
  productCount: number;
}) {
  const [tab, setTab] = useState<'all' | 'catalog' | 'ops'>('all');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const cards: DashboardCard[] = useMemo(
    () => [
      {
        id: 'products',
        name: 'Products',
        value: String(productCount),
        subtitle: 'Catalog',
        href: `/${projectId}/products`,
      },
      {
        id: 'assets',
        name: 'Assets',
        value: 'Library',
        subtitle: 'Materials · Models · Textures',
        href: `/${projectId}/library`,
      },
      {
        id: 'workflows',
        name: 'Workflows',
        value: '0',
        subtitle: 'Deferred in v1',
      },
      {
        id: 'open-workflows',
        name: 'Open workflows',
        value: '0',
        subtitle: 'Deferred in v1',
      },
    ],
    [productCount, projectId]
  );

  const filtered = cards.filter((card) => {
    if (tab === 'catalog' && !['products', 'assets'].includes(card.id)) {
      return false;
    }
    if (tab === 'ops' && !['workflows', 'open-workflows'].includes(card.id)) {
      return false;
    }
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      card.name.toLowerCase().includes(q) ||
      card.subtitle.toLowerCase().includes(q)
    );
  });

  const selected = filtered.find((card) => card.id === selectedId) ?? null;

  return (
    <BrowseWorkspace
      title="Dashboard"
      meta="Project overview"
      actions={
        <Link
          href={`/${projectId}/products`}
          className="bo-btn-primary rounded-lg px-3 py-1.5 text-sm font-medium"
        >
          View products
        </Link>
      }
      filters={
        <>
          <BrowseTab
            label="All"
            active={tab === 'all'}
            onClick={() => setTab('all')}
          />
          <BrowseTab
            label="Catalog"
            active={tab === 'catalog'}
            onClick={() => setTab('catalog')}
          />
          <BrowseTab
            label="Operations"
            active={tab === 'ops'}
            onClick={() => setTab('ops')}
          />
        </>
      }
      search={
        <BrowseSearch value={query} onChange={setQuery} placeholder="Search…" />
      }
      inspector={
        selected ? (
          <>
            <button
              type="button"
              aria-label="Close inspector"
              className="absolute inset-0 z-20 bg-black/10 lg:bg-transparent"
              onClick={() => setSelectedId(null)}
            />
            <div className="absolute inset-y-0 right-0 z-30">
              <aside className="flex h-full w-[min(320px,92vw)] flex-col border-l border-[var(--bo-line)] bg-white shadow-[-12px_0_32px_rgba(0,0,0,0.06)]">
                <div className="border-b border-[var(--bo-line)] px-4 py-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
                        Inspector
                      </p>
                      <h2 className="mt-2 text-base font-semibold text-[var(--bo-ink)]">
                        {selected.name}
                      </h2>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedId(null)}
                      className="rounded-md px-2 py-1 text-sm text-[var(--bo-muted)] hover:bg-black/[0.04]"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="px-4 py-4">
                  <p className="text-3xl font-semibold text-[var(--bo-ink)]">
                    {selected.value}
                  </p>
                  <p className="mt-2 text-sm text-[var(--bo-muted)]">
                    {selected.subtitle}
                  </p>
                  {selected.href ? (
                    <Link
                      href={selected.href}
                      className="bo-btn-primary mt-6 inline-flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-sm font-medium"
                    >
                      Open
                    </Link>
                  ) : null}
                </div>
              </aside>
            </div>
          </>
        ) : null
      }
    >
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((card) => {
          const active = selectedId === card.id;
          return (
            <button
              key={card.id}
              type="button"
              onClick={() =>
                setSelectedId((current) =>
                  current === card.id ? null : card.id
                )
              }
              className={`overflow-hidden rounded-xl border text-left transition ${
                active
                  ? 'border-[var(--bo-ink)]/45 bg-[var(--bo-ink)]/[0.02]'
                  : 'border-[var(--bo-line)] hover:border-[var(--bo-ink)]/30'
              }`}
            >
              <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_30%_20%,#f7f4ef,#e0dcd4)]">
                <p className="text-3xl font-semibold text-[var(--bo-ink)]">
                  {card.value}
                </p>
              </div>
              <div className="border-t border-[var(--bo-line)] bg-white px-2 py-1.5">
                <p className="truncate text-[12px] font-medium text-[var(--bo-ink)]">
                  {card.name}
                </p>
                <p className="mt-0.5 truncate text-[10px] text-[var(--bo-muted)]">
                  {card.subtitle}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </BrowseWorkspace>
  );
}
