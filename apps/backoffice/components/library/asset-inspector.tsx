'use client';

import { useState } from 'react';
import { useMaterialDocument } from './material-preview';
import { MaterialSwatch } from './material-swatch';
import { ModelGlbPreview } from './model-preview';
import { EditMaterialDialog } from './edit-material-dialog';
import {
  assetTypeLabel,
  formatBytes,
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
  const { document, loading } = useMaterialDocument(
    asset.type === 'material' ? asset.id : null,
    asset.type === 'material'
  );
  const [editOpen, setEditOpen] = useState(false);

  const mapLabels =
    asset.type === 'material'
      ? [
          document?.baseColorTextureId ? 'Base color' : null,
          document?.normalTextureId ? 'Normal' : null,
          document?.roughnessTextureId ? 'Roughness' : null,
          document?.metallicTextureId ? 'Metallic' : null,
        ].filter(Boolean)
      : [];

  return (
    <>
      <aside className="flex h-full w-[min(320px,92vw)] flex-col border-l border-[var(--bo-line)] bg-white shadow-[-12px_0_32px_rgba(0,0,0,0.06)]">
        <div className="border-b border-[var(--bo-line)] px-4 py-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
                Inspector
              </p>
              <h2 className="mt-2 truncate text-base font-semibold text-[var(--bo-ink)]">
                {asset.name}
              </h2>
              <p className="mt-0.5 text-sm text-[var(--bo-muted)]">
                {assetTypeLabel(asset.type)}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-2 py-1 text-sm text-[var(--bo-muted)] hover:bg-black/[0.04] hover:text-[var(--bo-ink)]"
              aria-label="Close inspector"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
          <div className="mb-4 overflow-hidden rounded-xl border border-[var(--bo-line)]">
            {asset.type === 'material' ? (
              <MaterialSwatch
                color={document?.baseColor || '#8A6040'}
                roughness={document?.roughness ?? 0.55}
                metalness={document?.metallic ?? 0}
                className="aspect-square w-full"
              />
            ) : asset.type === 'model' ? (
              <ModelGlbPreview
                assetId={asset.id}
                interactive
                className="aspect-square w-full"
              />
            ) : (
              <div className="relative aspect-square bg-[repeating-conic-gradient(#d9d4cc_0%_25%,#ebe7e1_0%_50%)_50%/20px_20px]">
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/30 to-transparent px-3 py-3">
                  <p className="truncate text-[12px] font-medium text-white">
                    {asset.name}
                  </p>
                </div>
              </div>
            )}
          </div>

          <dl className="space-y-3 text-sm">
            <Row label="Type" value={assetTypeLabel(asset.type)} />
            <Row label="Key" value={asset.code || '—'} />
            {asset.type === 'material' ? (
              <>
                <Row
                  label="Base color"
                  value={loading ? '…' : document?.baseColor || '—'}
                />
                <Row
                  label="Roughness"
                  value={(document?.roughness ?? 0.55).toFixed(2)}
                />
                <Row
                  label="Metalness"
                  value={(document?.metallic ?? 0).toFixed(2)}
                />
                <Row
                  label="Maps"
                  value={
                    mapLabels.length > 0 ? mapLabels.join(', ') : 'None linked'
                  }
                />
              </>
            ) : null}
            {asset.type === 'model' ? (
              <>
                <Row
                  label="Format"
                  value={(asset.format || 'glb').toUpperCase()}
                />
                <Row label="Status" value={asset.status || 'READY'} />
                <Row
                  label="Size"
                  value={formatBytes(asset.sizeBytes) || '—'}
                />
                <Row
                  label="Meshes"
                  value={
                    asset.meshCount != null ? String(asset.meshCount) : '—'
                  }
                />
                <Row
                  label="Materials"
                  value={
                    asset.materialCount != null
                      ? String(asset.materialCount)
                      : '—'
                  }
                />
                <Row
                  label="Nodes"
                  value={
                    asset.nodeCount != null ? String(asset.nodeCount) : '—'
                  }
                />
              </>
            ) : null}
            {asset.type === 'texture' ? (
              <>
                <Row label="Format" value="—" />
                <Row label="Dimensions" value="—" />
                <Row label="Color space" value="—" />
              </>
            ) : null}
          </dl>

          <div className="mt-6 border-t border-[var(--bo-line)] pt-4">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
              Used by
            </p>
            <p className="mt-2 text-sm text-[var(--bo-ink)]">
              0 products · 0 mappings
            </p>
            <p className="mt-1 text-xs text-[var(--bo-muted)]">
              Usage links appear when this asset is attached to products.
            </p>
          </div>

          <div className="mt-6 grid gap-2">
            {asset.type === 'material' ? (
              <button
                type="button"
                onClick={() => setEditOpen(true)}
                className="bo-btn-primary inline-flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-sm font-medium"
              >
                Edit material
              </button>
            ) : null}
            {asset.type === 'model' ? (
              <a
                href={`/${projectId}/products`}
                className="bo-btn-primary inline-flex w-full items-center justify-center rounded-xl px-3 py-2.5 text-sm font-medium"
              >
                Open in 3D Studio
              </a>
            ) : null}
            {asset.type === 'texture' ? (
              <button
                type="button"
                disabled
                className="inline-flex w-full items-center justify-center rounded-xl border border-[var(--bo-line)] px-3 py-2.5 text-sm font-medium text-[var(--bo-muted)] opacity-60"
              >
                Edit texture
              </button>
            ) : null}
          </div>
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
        />
      ) : null}
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className="text-[var(--bo-muted)]">{label}</dt>
      <dd className="max-w-[60%] truncate text-right font-medium text-[var(--bo-ink)]">
        {value}
      </dd>
    </div>
  );
}
