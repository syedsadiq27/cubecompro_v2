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
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden bg-[var(--surface-pure)]">
      <BackofficePageHeader
        title={title}
        description={description}
        actions={
          <Button
            as={Link}
            href={href ?? `/${projectId}/products`}
            size="sm"
            variant="secondary"
            className="ui:text-[13px]"
          >
            {linkLabel ?? 'Back to products'}
          </Button>
        }
      />

      <ListChrome
        views={
          <FilterTabs>
            <FilterTab label="Commerce" active onClick={() => {}} />
          </FilterTabs>
        }
      />

      <PageBody>
        <div className="max-w-4xl space-y-4">
          <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                  Commerce Resolve Pipeline
                </p>
                <h3 className="mt-1 text-[16px] font-semibold text-[var(--ink)]">
                  {title}
                </h3>
              </div>
              <StatusBadge role="draft" label="Active Development" />
            </div>

            <p className="mt-3 text-[13px] text-[var(--text-secondary)] leading-relaxed">
              Product → configuration → resolution → SKU / price / inventory → channel mappings will resolve here as dedicated enterprise workflows. Configure product options and commerce properties directly within individual product workspaces.
            </p>

            <div className="mt-4 pt-3 border-t border-[var(--line)]">
              <Link
                href={href ?? `/${projectId}/products`}
                className="inline-flex items-center gap-1 text-[13px] font-medium text-[#665CFF] hover:underline"
              >
                <span>{linkLabel ?? 'Back to products'}</span>
                <ChevronRightIcon size={12} />
              </Link>
            </div>
          </div>
        </div>
      </PageBody>
    </div>
  );
}
