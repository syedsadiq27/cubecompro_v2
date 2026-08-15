'use client';

import { ActionMenu, type ActionMenuItem } from '@/components/ui/action-menu';

export function HeaderActions({
  primary,
  secondary,
  overflow,
}: {
  primary?: React.ReactNode;
  secondary?: React.ReactNode;
  overflow?: ActionMenuItem[];
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-1.5">
      {secondary}
      {primary}
      {overflow && overflow.length > 0 ? (
        <ActionMenu items={overflow} label="More actions" />
      ) : null}
    </div>
  );
}
