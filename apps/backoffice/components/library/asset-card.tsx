'use client';

import { useMaterialDocument } from './material-preview';
import { MaterialSwatch } from './material-swatch';
import { ModelGlbPreview } from './model-preview';
import {
  assetTypeLabel,
  formatBytes,
  type LibraryAssetItem,
} from './types';

export function AssetCard({
  asset,
  selected,
  onSelect,
}: {
  asset: LibraryAssetItem;
  selected: boolean;
  onSelect: () => void;
}) {
  const { document } = useMaterialDocument(
    asset.type === 'material' ? asset.id : null,
    asset.type === 'material'
  );

  const subtitle =
    asset.type === 'material'
      ? assetTypeLabel(asset.type)
      : asset.type === 'model'
        ? [
            (asset.format || 'GLB').toUpperCase(),
            asset.meshCount != null ? `${asset.meshCount} meshes` : null,
            formatBytes(asset.sizeBytes),
          ]
            .filter(Boolean)
            .join(' · ')
        : assetTypeLabel(asset.type);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`group overflow-hidden rounded-xl border text-left transition ${
        selected
          ? 'border-[var(--ink)]/45 bg-[var(--ink)]/[0.02] shadow-[0_0_0_1px_rgba(0,0,0,0.04)]'
          : 'border-[var(--line)] hover:border-[var(--ink)]/30'
      }`}
    >
      <div className="relative aspect-square w-full overflow-hidden bg-[#ebe7e1]">
        {asset.type === 'material' ? (
          <MaterialSwatch
            color={document?.baseColor || '#8A6040'}
            roughness={document?.roughness ?? 0.55}
            metalness={document?.metallic ?? 0}
            className="absolute inset-0 h-full w-full"
          />
        ) : asset.type === 'model' ? (
          <ModelGlbPreview
            assetId={asset.id}
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <TextureCardVisual name={asset.name} />
        )}
      </div>
      <div className="border-t border-[var(--line)] bg-white px-2 py-1.5">
        <p className="truncate text-[12px] font-medium text-[var(--ink)]">
          {asset.name}
        </p>
        <p className="mt-0.5 truncate text-[10px] text-[var(--text-secondary)]">
          {subtitle}
        </p>
      </div>
    </button>
  );
}

function TextureCardVisual({ name }: { name: string }) {
  return (
    <div className="absolute inset-0 flex items-end bg-[repeating-conic-gradient(#d9d4cc_0%_25%,#ebe7e1_0%_50%)_50%/14px_14px]">
      <div className="w-full bg-gradient-to-t from-black/35 to-transparent px-2 py-2">
        <p className="truncate text-[11px] font-medium text-white">{name}</p>
      </div>
    </div>
  );
}
