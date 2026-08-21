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
import {
  clearMaterialDocumentCache,
  useMaterialDocument,
} from './material-preview';
import { MaterialSwatch } from './material-swatch';
import { ModelGlbPreview } from './model-preview';
import { EditMaterialDialog } from './edit-material-dialog';
import { MaterialRevisionsPanel } from './material-revisions-panel';
import { ObjectRevisionsPanel } from './object-revisions-panel';
import { UploadObjectRevisionDialog } from './upload-object-revision-dialog';
import {
  assetTypeLabel,
  type LibraryAssetItem,
} from './types';
import {
  libraryAssetStatusLabel,
  libraryAssetStatusRole,
} from './asset-status';

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
  const [revisionUploadOpen, setRevisionUploadOpen] = useState(false);
  const [revisionRefreshKey, setRevisionRefreshKey] = useState(0);

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

  const statusLabel = libraryAssetStatusLabel(asset.status);
  const statusRole = libraryAssetStatusRole(asset.status);

  return (
    <>
      <aside className="flex h-full w-[min(340px,92vw)] flex-col border-l border-[var(--line)] bg-[var(--surface-pure)] shadow-[-8px_0_24px_rgba(0,0,0,0.06)] lg:static lg:shadow-none">
        <div className="shrink-0 border-b border-[var(--line)] p-4">
          <div className="flex items-start gap-3.5">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[var(--line)] bg-[var(--canvas)] shadow-xs">
              {asset.imageUrl || asset.fileUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={asset.imageUrl || asset.fileUrl || ''}
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
                  {assetTypeLabel(asset.type)}
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
                <StatusBadge role={statusRole} label={statusLabel} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 border-b border-[var(--line)] p-4">
          {asset.type === 'material' ? (
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
          ) : asset.type === 'model' ? (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="flex-1 ui:flex ui:items-center ui:justify-center ui:gap-1.5 ui:h-8 ui:text-[12px]"
              onClick={() => setRevisionUploadOpen(true)}
            >
              <PencilIcon size={14} />
              <span>New revision</span>
            </Button>
          ) : (
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="flex-1 ui:flex ui:items-center ui:justify-center ui:gap-1.5 ui:h-8 ui:text-[12px]"
              onClick={() =>
                toast.info('Edit is not available for this asset type')
              }
            >
              <PencilIcon size={14} />
              <span>Edit</span>
            </Button>
          )}

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

        <div className="min-h-0 flex-1 space-y-6 overflow-y-auto p-4 text-[13px]">
          <section className="space-y-2">
            <h3 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              Summary
            </h3>
            <div className="space-y-1.5">
              <InspectorRow label="Type" value={assetTypeLabel(asset.type)} />
              <InspectorRow
                label="Created"
                value={asset.createdDate || '—'}
              />
              <InspectorRow
                label="Updated"
                value={
                  asset.updatedDate
                    ? [asset.updatedDate, asset.updatedTime]
                        .filter(Boolean)
                        .join(' ')
                    : '—'
                }
              />
              {(asset.productUsage != null || asset.configUsage != null) && (
                <InspectorRow
                  label="Usage"
                  value={`${asset.productUsage ?? 0} products · ${asset.configUsage ?? 0} configurations`}
                />
              )}
            </div>
          </section>

          {asset.type === 'model' ? (
            <ObjectRevisionsPanel
              projectId={projectId}
              objectAssetId={asset.id}
              refreshKey={revisionRefreshKey}
              onUpload={() => setRevisionUploadOpen(true)}
            />
          ) : null}

          {asset.type === 'material' ? (
            <MaterialRevisionsPanel
              projectId={projectId}
              materialAssetId={asset.id}
              refreshKey={revisionRefreshKey}
            />
          ) : null}

          <section className="space-y-2 border-t border-[var(--line)]/60 pt-4">
            <h3 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              Details
            </h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 py-1">
                <span className="text-[12px] text-[var(--text-secondary)]">
                  Asset ID
                </span>
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
                <span className="text-[12px] text-[var(--text-secondary)]">
                  File
                </span>
                <div className="text-right">
                  <p className="font-mono text-[12px] text-[var(--ink)]">
                    {asset.fileName || asset.code || asset.name}
                  </p>
                  <p className="text-[11px] text-[var(--text-muted)]">
                    {asset.fileSize || '—'}
                  </p>
                </div>
              </div>

              <InspectorRow
                label="Format"
                value={
                  asset.format ||
                  (asset.type === 'material'
                    ? 'PBR'
                    : asset.type === 'texture'
                      ? 'Image'
                      : '—')
                }
                isMono
              />
              {asset.resolution ? (
                <InspectorRow label="Resolution" value={asset.resolution} />
              ) : null}
              {asset.colorSpace ? (
                <InspectorRow label="Color space" value={asset.colorSpace} />
              ) : null}

              {asset.tags && asset.tags.length > 0 ? (
                <div className="flex items-center justify-between gap-2 py-1">
                  <span className="text-[12px] text-[var(--text-secondary)]">
                    Tags
                  </span>
                  <div className="flex flex-wrap items-center justify-end gap-1">
                    {asset.tags.slice(0, 5).map((tag) => (
                      <span
                        key={tag}
                        className="rounded bg-[var(--canvas)] px-1.5 py-0.5 text-[11px] text-[var(--text-secondary)] font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}

              <div className="flex items-center justify-between gap-2 py-1">
                <span className="text-[12px] text-[var(--text-secondary)]">
                  Folder
                </span>
                <span className="text-[12px] font-medium text-[var(--ink)]">
                  {asset.folderName || 'Unfiled'}
                </span>
              </div>
            </div>
          </section>

          {(asset.productUsage != null || asset.configUsage != null) && (
            <section className="space-y-2 border-t border-[var(--line)]/60 pt-4">
              <h3 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Usage
              </h3>
              <div className="space-y-1">
                <Link
                  href={`/${projectId}/products`}
                  className="flex items-center justify-between py-1.5 text-[var(--ink)] hover:text-[#665CFF] no-underline group"
                >
                  <span className="text-[12px] text-[var(--text-secondary)]">
                    Products
                  </span>
                  <span className="flex items-center gap-1 font-mono text-[12px] font-medium group-hover:underline">
                    {asset.productUsage ?? 0}
                    <ChevronRightIcon
                      size={12}
                      className="text-[var(--text-muted)]"
                    />
                  </span>
                </Link>
                {asset.configUsage != null ? (
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-[12px] text-[var(--text-secondary)]">
                      Configurations
                    </span>
                    <span className="font-mono text-[12px] font-medium text-[var(--ink)]">
                      {asset.configUsage}
                    </span>
                  </div>
                ) : null}
              </div>
            </section>
          )}

          {(asset.createdDate || asset.updatedDate) && (
            <section className="space-y-2 border-t border-[var(--line)]/60 pt-4">
              <h3 className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
                Activity
              </h3>
              <div className="space-y-3">
                {asset.updatedDate ? (
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-600 shrink-0" />
                    <div className="min-w-0 text-[12px]">
                      <p className="font-medium text-[var(--ink)]">
                        Asset updated
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {[asset.updatedDate, asset.updatedTime]
                          .filter(Boolean)
                          .join(' ')}
                      </p>
                    </div>
                  </div>
                ) : null}
                {asset.createdDate ? (
                  <div className="flex items-start gap-2.5">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600 shrink-0" />
                    <div className="min-w-0 text-[12px]">
                      <p className="font-medium text-[var(--ink)]">
                        Asset created
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        {asset.createdDate}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          )}
        </div>
      </aside>

      {asset.type === 'material' ? (
        <EditMaterialDialog
          projectId={projectId}
          materialId={asset.id}
          name={asset.name}
          code={asset.code}
          document={document}
          open={editOpen}
          onClose={() => setEditOpen(false)}
          onSaved={() => {
            clearMaterialDocumentCache(asset.id);
            setRevisionRefreshKey((key) => key + 1);
          }}
        />
      ) : null}

      {asset.type === 'model' ? (
        <UploadObjectRevisionDialog
          projectId={projectId}
          objectAssetId={asset.id}
          assetName={asset.name}
          open={revisionUploadOpen}
          onClose={() => {
            setRevisionUploadOpen(false);
            setRevisionRefreshKey((key) => key + 1);
          }}
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
