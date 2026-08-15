'use client';

import {
  BoxIcon,
  LinkIcon,
  MoreHorizontalIcon,
  PencilIcon,
} from '@/components/bo/icons';
import Link from 'next/link';

export function InspectorActionCards({
  configureHref,
  editHref,
  mapCommerceHref,
  onMore,
}: {
  configureHref?: string;
  editHref?: string;
  mapCommerceHref?: string;
  onMore?: () => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-2 border-b border-[var(--line)] p-4">
      {configureHref ? (
        <Link
          href={configureHref}
          className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2.5 text-center text-[var(--ink)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--canvas)]"
        >
          <BoxIcon size={18} className="text-[var(--ink)]" />
          <span className="text-[11px] font-medium">Configure</span>
        </Link>
      ) : (
        <div className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2.5 text-center opacity-40">
          <BoxIcon size={18} className="text-[var(--text-muted)]" />
          <span className="text-[11px] font-medium text-[var(--text-muted)]">
            Configure
          </span>
        </div>
      )}

      {editHref ? (
        <Link
          href={editHref}
          className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2.5 text-center text-[var(--ink)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--canvas)]"
        >
          <PencilIcon size={18} className="text-[var(--ink)]" />
          <span className="text-[11px] font-medium">Edit</span>
        </Link>
      ) : null}

      {mapCommerceHref ? (
        <Link
          href={mapCommerceHref}
          className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2.5 text-center text-[var(--ink)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--canvas)]"
        >
          <LinkIcon size={18} className="text-[var(--ink)]" />
          <span className="text-[11px] font-medium leading-tight">
            Map Commerce
          </span>
        </Link>
      ) : null}

      <button
        type="button"
        onClick={onMore}
        className="flex flex-col items-center justify-center gap-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-2.5 text-center text-[var(--ink)] transition-colors hover:border-[var(--border-strong)] hover:bg-[var(--canvas)]"
      >
        <MoreHorizontalIcon size={18} className="text-[var(--ink)]" />
        <span className="text-[11px] font-medium">More</span>
      </button>
    </div>
  );
}
