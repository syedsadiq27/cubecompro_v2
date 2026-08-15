'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button, useToast } from '@repo/ui';
import {
  ChevronRightIcon,
  CloseIcon,
  EyeIcon,
  MoreHorizontalIcon,
  PencilIcon,
} from '@/components/bo/icons';
import { StatusBadge } from '@/components/bo/states/operational-states';
import { useMaterialDocument } from './material-preview';
import { MaterialSwatch } from './material-swatch';
import { ModelGlbPreview } from './model-preview';
import { EditMaterialDialog } from './edit-material-dialog';
import {
  assetTypeLabel,
  type LibraryAssetItem,
} from './types';

export function AssetInspector({
  asset,
  projectId,
  onClose,
}: {
  asset: LibraryAssetItem;
  projectId: string;
  onClose: () => void;
}) {
  const toast = useToast();
  const [copied, setCopied] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const { document } = useMaterialDocument(
    asset.type === 'material' ? asset.id : null,
    asset.type === 'material'
  );

  const handleCopyId = () => {
    navigator.clipboard.writeText(asset.id);
    setCopied(true);
    toast.success('Asset ID copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const statusRole =
    asset.status?.toUpperCase() === 'ACTIVE'
      ? 'published'
      : asset.status?.toUpperCase() === 'ARCHIVED'
        ? 'archived'
        : 'draft';

  return (
    <>
      <aside className="flex h-full w-[min(340px,92vw)] flex-col border-l border-[var(--line)] bg-[var(--surface-pure)] shadow-[-8px_0_24px_rgba(0,0,0,0.06)] lg:static lg:shadow-none">
        {/* Header with Preview Thumbnail */}
        <div className="shrink-0 border-b border-[var(--line)] p-4">
          <div className="flex items-start gap-3.5">
            {/* Thumbnail Preview */}
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--canvas)] shadow-xs">
              {asset.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.imageUrl}
                  alt={asset.name}
                  className="h-full w-full object-cover"
                />
              ) : asset.type === 'material' ? (
                <MaterialSwatch
                  color={document?.baseColor || '#8A6040'}
                  roughness={document?.roughness ?? 0.55}
                  metalness={document?.metallic ?? 0}
                  className="h-full w-full"
                />
              ) : asset.type === 'model' ? (
                <ModelGlbPreview
                  assetId={asset.id}
                  interactive={false}
                  className="h-full w-full"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[var(--text-muted)] text-[11px]">
                  IMG
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-1.5">
                <h2 className="truncate text-[15px] font-semibold text-[var(--ink)]">
                  {asset.name}
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close inspector"
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
                >
                  <CloseIcon size={14} />
                </button>
              </div>

              <p className="mt-0.5 font-mono text-[11px] text-[var(--text-muted)]">
                {asset.code || asset.detail || '—'}
              </p>

              <div className="mt-2">
                <StatusBadge role={statusRole} label={asset.status || 'ACTIVE'} />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 border-b border-[var(--line)] p-4">
          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="flex-1 ui:flex ui:items-center ui:justify-center ui:gap-1.5 ui:h-8 ui:text-[12px]"
            onClick={() => setEditOpen(true)}
          >
            <PencilIcon size={14} />
            <span>Edit</span>
          </Button>

          <Button
            type="button"
            size="sm"
            variant="secondary"
            className="flex-1 ui:flex ui:items-center ui:justify-center ui:gap-1.5 ui:h-8 ui:text-[12px]"
            onClick={() => toast.info(`Opening 3D preview for ${asset.name}`)}
          >
            <EyeIcon size={14} />
            <span>Preview</span>
          </Button>

          <button
            type="button"
            aria-label="More actions"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] text-[var(--ink)] transition-colors hover:bg-[var(--canvas)]"
            onClick={() => toast.info('Additional options')}
          >
            <MoreHorizontalIcon size={16} />
          </button>
        </div>

        {/* Inspector Body */}
        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 text-[13px]">
          {/* Summary Section */}
          <section className="space-y-2">
            <h3 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              Summary
            </h3>
            <div className="space-y-1.5">
              <InspectorRow label="Type" value={assetTypeLabel(asset.type)} />
              <InspectorRow
                label="Created"
                value={asset.createdDate ? `${asset.createdDate} by ${asset.creator || 'Demo Owner'}` : 'Apr 28, 2025 by Demo Owner'}
              />
              <InspectorRow
                label="Updated"
                value={asset.updatedDate ? `${asset.updatedDate} by ${asset.creator || 'Demo Owner'}` : 'May 14, 2025 by Demo Owner'}
              />
              <InspectorRow
                label="Usage"
                value={`${asset.productUsage ?? 12} products · ${asset.configUsage ?? 3} configurations`}
              />
            </div>
          </section>

          {/* Details Section */}
          <section className="space-y-2 border-t border-[var(--line)]/60 pt-4">
            <h3 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              Details
            </h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 py-1">
                <span className="text-[12px] text-[var(--text-secondary)]">Asset ID</span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="font-mono text-[11px] text-[var(--ink)] hover:underline"
                  title="Click to copy ID"
                >
                  {copied ? 'Copied ✓' : asset.id}
                </button>
              </div>

              <div className="flex items-start justify-between gap-2 py-1">
                <span className="text-[12px] text-[var(--text-secondary)]">File</span>
                <div className="text-right">
                  <p className="font-mono text-[12px] text-[var(--ink)]">
                    {asset.fileName || `${asset.code?.toLowerCase() || 'asset'}.${asset.format?.toLowerCase() || 'sbsar'}`}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {asset.fileSize || '2.4 MB'}
                  </p>
                </div>
              </div>

              <InspectorRow label="Format" value={asset.format || (asset.type === 'material' ? 'SBSAR' : 'GLB')} isMono />
              <InspectorRow label="Resolution" value={asset.resolution || '2048 x 2048'} />
              <InspectorRow label="Color space" value={asset.colorSpace || 'sRGB'} />

              {/* Tags */}
              <div className="flex items-center justify-between gap-2 py-1">
                <span className="text-[12px] text-[var(--text-secondary)]">Tags</span>
                <div className="flex flex-wrap items-center justify-end gap-1">
                  {(asset.tags || ['fabric', 'beige', 'textile']).slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded bg-[var(--canvas)] px-1.5 py-0.5 text-[11px] text-[var(--text-secondary)] font-mono"
                    >
                      {tag}
                    </span>
                  ))}
                  <span className="rounded bg-[var(--canvas)] px-1.5 py-0.5 text-[11px] text-[var(--text-muted)] font-mono">
                    +2
                  </span>
                </div>
              </div>

              {/* Folder */}
              <Link
                href={`/${projectId}/library?folder=${asset.folderId || 'fabrics'}`}
                className="flex items-center justify-between gap-2 py-1 text-[var(--ink)] hover:text-[#665CFF] no-underline group"
              >
                <span className="text-[12px] text-[var(--text-secondary)]">Folder</span>
                <span className="flex items-center gap-1 text-[12px] font-medium group-hover:underline">
                  {asset.folderName || 'Materials / Fabrics'}
                  <ChevronRightIcon size={12} className="text-[var(--text-muted)]" />
                </span>
              </Link>
            </div>
          </section>

          {/* Usage Section */}
          <section className="space-y-2 border-t border-[var(--line)]/60 pt-4">
            <h3 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              Usage
            </h3>
            <div className="space-y-1">
              <Link
                href={`/${projectId}/products`}
                className="flex items-center justify-between py-1.5 text-[var(--ink)] hover:text-[#665CFF] no-underline group"
              >
                <span className="text-[12px] text-[var(--text-secondary)]">Products</span>
                <span className="flex items-center gap-1 font-mono text-[12px] font-medium group-hover:underline">
                  {asset.productUsage ?? 12}
                  <ChevronRightIcon size={12} className="text-[var(--text-muted)]" />
                </span>
              </Link>
              <Link
                href={`/${projectId}/experience/rules`}
                className="flex items-center justify-between py-1.5 text-[var(--ink)] hover:text-[#665CFF] no-underline group"
              >
                <span className="text-[12px] text-[var(--text-secondary)]">Configurations</span>
                <span className="flex items-center gap-1 font-mono text-[12px] font-medium group-hover:underline">
                  {asset.configUsage ?? 3}
                  <ChevronRightIcon size={12} className="text-[var(--text-muted)]" />
                </span>
              </Link>
            </div>
          </section>

          {/* Activity Section */}
          <section className="space-y-2 border-t border-[var(--line)]/60 pt-4">
            <h3 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                <div className="min-w-0 text-[12px]">
                  <p className="font-medium text-[var(--ink)]">Asset updated</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    May 14, 2025 10:24 AM by Demo Owner
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                <div className="min-w-0 text-[12px]">
                  <p className="font-medium text-[var(--ink)]">Asset created</p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    Apr 28, 2025 9:11 AM by Demo Owner
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="text-[11px] font-medium text-[#665CFF] hover:underline pt-1"
                onClick={() => toast.info('Viewing full activity audit log')}
              >
                View all activity
              </button>
            </div>
          </section>
        </div>
      </aside>

      {asset.type === 'material' ? (
        <EditMaterialDialog
          projectId={projectId}
          materialId={asset.id}
          name={asset.name}
          code={asset.code}
          document={null}
          open={editOpen}
          onClose={() => setEditOpen(false)}
        />
      ) : null}
    </>
  );
}

function InspectorRow({
  label,
  value,
  isMono,
}: {
  label: string;
  value: string;
  isMono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-1">
      <span className="text-[12px] text-[var(--text-secondary)]">{label}</span>
      <span
        className={`text-right text-[12px] font-medium text-[var(--ink)] ${
          isMono ? 'font-mono' : ''
        }`}
      >
        {value}
      </span>
    </div>
  );
}
