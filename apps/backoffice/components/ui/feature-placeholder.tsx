'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  BrowseSearch,
  BrowseWorkspace,
} from '@/components/ui/browse-workspace';
import { PageChrome } from '@/components/ui/page-chrome';
import { Panel } from '@/components/ui';

export function FeaturePlaceholder({
  title,
  description,
  detail,
  href,
  linkLabel,
}: {
  title: string;
  description: string;
  detail?: string;
  href?: string;
  linkLabel?: string;
}) {
  const [query, setQuery] = useState('');
  const cards = useMemo(
    () => [
      {
        id: 'overview',
        name: title,
        subtitle: 'Coming soon',
        body:
          detail ??
          'This surface is deferred in CubeCom v1. Catalog, library, and resolve stay on the API.',
      },
    ],
    [title, detail]
  );

  const filtered = cards.filter((card) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      card.name.toLowerCase().includes(q) ||
      card.subtitle.toLowerCase().includes(q)
    );
  });

  return (
    <PageChrome flush>
      <BrowseWorkspace
        title={title}
        meta={description}
        actions={
          href ? (
            <Link
              href={href}
              className="rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-sm font-medium"
            >
              {linkLabel ?? 'Back'}
            </Link>
          ) : null
        }
        filters={
          <span className="px-1 text-[13px] text-[var(--bo-muted)]">
            Overview
          </span>
        }
        search={
          <BrowseSearch
            value={query}
            onChange={setQuery}
            placeholder="Search…"
          />
        }
      >
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((card) => (
            <Panel key={card.id} className="space-y-2">
              <p className="text-[13px] font-medium text-[var(--bo-ink)]">
                {card.name}
              </p>
              <p className="text-[11px] text-[var(--bo-muted)]">
                {card.subtitle}
              </p>
              <p className="text-[13px] text-[var(--bo-muted)]">{card.body}</p>
            </Panel>
          ))}
        </div>
      </BrowseWorkspace>
    </PageChrome>
  );
}
