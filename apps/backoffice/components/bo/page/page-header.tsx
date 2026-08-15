'use client';

import { PageHeader as UiPageHeader, cn } from '@repo/ui';
import type { ReactNode } from 'react';
import {
  OverflowMenu,
  type OverflowMenuItem,
} from '@/components/bo/actions/overflow-menu';

function Meta({ children }: { children: ReactNode }) {
  return <>{children}</>;
}

function Actions({
  primary,
  secondary,
  overflow,
  children,
}: {
  primary?: ReactNode;
  secondary?: ReactNode;
  overflow?: OverflowMenuItem[];
  children?: ReactNode;
}) {
  if (children) {
    return (
      <div className="flex flex-wrap items-center justify-end gap-2.5">
        {children}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2.5">
      {secondary}
      {primary}
      {overflow && overflow.length > 0 ? (
        <OverflowMenu items={overflow} label="More actions" />
      ) : null}
    </div>
  );
}

export function PageHeader({
  title,
  count,
  meta,
  description,
  actions,
  children,
  className,
}: {
  title: string;
  count?: ReactNode;
  meta?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  const numericCount = typeof count === 'number' ? count : undefined;
  const countMeta =
    count != null && typeof count !== 'number' ? count : undefined;

  return (
    <UiPageHeader
      title={title}
      count={numericCount}
      meta={meta ?? countMeta}
      description={description}
      action={actions ?? children}
      className={className}
    />
  );
}

PageHeader.Meta = Meta;
PageHeader.Actions = Actions;

export const BackofficePageHeader = PageHeader;

export {
  ListWorkspace as ListChrome,
  PageWorkspaceBody as PageBody,
  PageWorkspace as PageFrame,
  PageWorkspace,
  ListWorkspace,
  PageWorkspaceBody,
  InspectorWorkspace,
  MetricsStrip,
  MetricCard,
} from '@repo/ui';

export function PageToolbar({
  children,
  className,
  bordered = true,
}: {
  children: ReactNode;
  className?: string;
  bordered?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex shrink-0 flex-wrap items-center gap-2 px-6 py-2.5',
        bordered && 'border-b border-[var(--line)]',
        className
      )}
    >
      {children}
    </div>
  );
}
