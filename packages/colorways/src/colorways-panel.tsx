'use client';

import { useMemo, useState } from 'react';
import { ColorSidebar } from '@repo/customizer-ui';
import {
  getVariantThumbnailUrl,
  groupColorways,
} from './group-colorways';
import { ColorwayChipGrid } from './colorway-chip-grid';
import { ColorwayTypeGrid } from './colorway-type-grid';
import { ColorwayVariantGrid } from './colorway-variant-grid';
import type {
  ColorwayVariant,
  ColorwaysSceneApi,
} from './types';

export function ColorwaysPanel({
  variants,
  imageBaseUrl,
  sceneApi,
  onBack,
  embedded = false,
  selectedVariantId: controlledSelectedId,
  onSelectedVariantChange,
}: {
  variants: ColorwayVariant[];
  imageBaseUrl: string;
  sceneApi: ColorwaysSceneApi | null;
  onBack?: () => void;
  embedded?: boolean;
  selectedVariantId?: number | null;
  onSelectedVariantChange?: (id: number | null) => void;
}) {
  const groups = useMemo(() => groupColorways(variants), [variants]);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(
    groups.length === 1 ? groups[0]?.id ?? null : null
  );
  const [internalSelectedId, setInternalSelectedId] = useState<number | null>(
    null
  );
  const selectedVariantId =
    controlledSelectedId !== undefined
      ? controlledSelectedId
      : internalSelectedId;

  const setSelectedVariantId = (id: number | null) => {
    setInternalSelectedId(id);
    onSelectedVariantChange?.(id);
  };

  const selectedGroup =
    groups.find((group) => group.id === selectedGroupId) ?? null;

  const flatVariants = useMemo(() => {
    if (groups.length <= 1) {
      return groups[0]?.variants ?? variants;
    }
    if (selectedGroup) return selectedGroup.variants;
    return variants;
  }, [groups, selectedGroup, variants]);

  const chips = flatVariants.map((variant) => ({
    id: String(variant.id),
    label: variant.varientName || variant.varientCode,
    thumbnailUrl: getVariantThumbnailUrl(variant, imageBaseUrl),
    selected: variant.id === selectedVariantId,
  }));

  const handleSelectVariant = (id: string) => {
    const variant = flatVariants.find((entry) => String(entry.id) === id);
    if (!variant || !sceneApi) return;
    const ok = sceneApi.applyVariant(variant);
    if (!ok) return;
    setSelectedVariantId(variant.id);
  };

  if (embedded) {
    if (!variants.length) return null;

    return (
      <div className="flex flex-col gap-4">
        {groups.length > 1 && !selectedGroup ? (
          <ColorwayTypeGrid
            types={groups.map((group) => {
              const thumbVariant = group.variants[0];
              return {
                id: group.id,
                label: group.label,
                thumbnailUrl: thumbVariant
                  ? getVariantThumbnailUrl(thumbVariant, imageBaseUrl)
                  : null,
                selected: false,
              };
            })}
            onSelect={setSelectedGroupId}
          />
        ) : (
          <>
            {groups.length > 1 && selectedGroup ? (
              <button
                type="button"
                onClick={() => setSelectedGroupId(null)}
                className="self-start text-xs font-medium text-[#7a776f] hover:text-[#353535]"
              >
                ← All colorway types
              </button>
            ) : null}
            <ColorwayChipGrid
              title={
                selectedGroup
                  ? `Choose a ${selectedGroup.label.toLowerCase()} colorway`
                  : 'Choose a colorway'
              }
              chips={chips}
              onSelect={handleSelectVariant}
            />
          </>
        )}
      </div>
    );
  }

  const typeOptions = groups.map((group) => {
    const thumbVariant = group.variants[0];
    return {
      id: group.id,
      label: group.label,
      thumbnailUrl: thumbVariant
        ? getVariantThumbnailUrl(thumbVariant, imageBaseUrl)
        : null,
      selected: group.id === selectedGroupId,
    };
  });

  const variantOptions = (selectedGroup?.variants ?? []).map((variant) => ({
    id: String(variant.id),
    label: variant.varientName || variant.varientCode,
    thumbnailUrl: getVariantThumbnailUrl(variant, imageBaseUrl),
    selected: variant.id === selectedVariantId,
  }));

  if (!variants.length) {
    return (
      <ColorSidebar
        title="Colorways"
        description="No colorway variants were found for this model."
        onBack={onBack}
      >
        <div className="rounded-md border border-dashed border-[#c2c2c2] bg-white/60 p-4 text-sm text-[#5d5d5d]">
          Solid color configuration is available as a separate package.
        </div>
      </ColorSidebar>
    );
  }

  return (
    <ColorSidebar
      title="Colorways"
      description={
        selectedGroup
          ? `Choose a ${selectedGroup.label.toLowerCase()} colorway`
          : 'Choose a colorway type'
      }
      onBack={
        selectedGroup && groups.length > 1
          ? () => setSelectedGroupId(null)
          : onBack
      }
    >
      {!selectedGroup ? (
        <ColorwayTypeGrid types={typeOptions} onSelect={setSelectedGroupId} />
      ) : (
        <ColorwayVariantGrid
          variants={variantOptions}
          onSelect={handleSelectVariant}
        />
      )}
    </ColorSidebar>
  );
}
