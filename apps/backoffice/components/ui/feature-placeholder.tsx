'use client';

import Link from 'next/link';
import { Button, FilterTab, FilterTabs } from '@repo/ui';
import {
  BackofficePageHeader,
  ListChrome,
  PageBody,
  StatusBadge,
} from '@/components/bo';
import { ChevronRightIcon } from '@/components/bo/icons';

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
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--surface-pure)]">
      <BackofficePageHeader
        title={title}
        description={description}
        actions={
          href ? (
            <Button
              as={Link}
              href={href}
              size="sm"
              variant="secondary"
              className="ui:text-[13px]"
            >
              {linkLabel ?? 'Back'}
            </Button>
          ) : null
        }
      />

      <ListChrome
        views={
          <FilterTabs>
            <FilterTab label="Overview" active onClick={() => {}} />
          </FilterTabs>
        }
      />

      <PageBody>
        <div className="max-w-4xl space-y-4">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                  Service Status
                </p>
                <h3 className="mt-1 text-[16px] font-semibold text-[var(--ink)]">
                  {title} Workspace
                </h3>
              </div>
              <StatusBadge role="draft" label="Coming Soon" />
            </div>

            <p className="mt-3 text-[13px] text-[var(--text-secondary)] leading-relaxed">
              {detail ??
                'This surface is in active development. Core operational primitives, 3D configurator pipelines, catalog, and product graph remain fully accessible via the Backoffice and GraphQL API.'}
            </p>

            {href ? (
              <div className="mt-4 pt-3 border-t border-[var(--line)]">
                <Link
                  href={href}
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-[#665CFF] hover:underline"
                >
                  <span>{linkLabel ?? 'Return to previous workspace'}</span>
                  <ChevronRightIcon size={12} />
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </PageBody>
    </div>
  );
}
