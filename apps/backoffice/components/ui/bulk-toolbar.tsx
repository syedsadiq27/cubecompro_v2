'use client';

import { Button, Typography } from '@repo/ui';
import type { ReactNode } from 'react';

export function BulkToolbar({
  count,
  onClear,
  children,
}: {
  count: number;
  onClear: () => void;
  children: ReactNode;
}) {
  if (count <= 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-[var(--line)] bg-[var(--brand-soft)]/50 px-3 py-1.5">
      <Typography as="span" variant="meta" className="font-medium text-[var(--brand)]">
        {count} selected
      </Typography>
      <div className="flex flex-wrap items-center gap-1.5">{children}</div>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        className="ui:ml-auto ui:h-7"
        onClick={onClear}
      >
        Clear
      </Button>
    </div>
  );
}
