'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  BrowseSearch,
  BrowseWorkspace,
} from '@/components/ui/browse-workspace';
import { PageChrome } from '@/components/ui/page-chrome';
import { Panel } from '@/components/ui';

export function CommercePlaceholder({
  projectId,
  title,
  description,
  href,
  linkLabel,
}: {
  projectId: string;
  title: string;
  description: string;
  href?: string;
  linkLabel?: string;
}) {
  const [query, setQuery] = useState('');

  return (
    <PageChrome flush>
      <BrowseWorkspace
        title={title}
        meta={description}
        actions={
          <Link
            href={href ?? `/${projectId}/products`}
            className="rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-sm font-medium"
          >
            {linkLabel ?? 'Back to products'}
          </Link>
        }
        filters={
          <span className="px-1 text-[13px] text-[var(--bo-muted)]">
            Commerce
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
          <Panel className="space-y-2">
            <p className="text-[13px] font-medium text-[var(--bo-ink)]">
              {title}
            </p>
            <p className="text-[11px] text-[var(--bo-muted)]">Coming soon</p>
            <p className="text-[13px] text-[var(--bo-muted)]">
              Product → configuration → resolution → SKU / price / inventory →
              channel will land here as dedicated workflows.
            </p>
          </Panel>
        </div>
      </BrowseWorkspace>
    </PageChrome>
  );
}
