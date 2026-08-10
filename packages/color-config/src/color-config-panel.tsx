'use client';

import { useEffect, useMemo, useState } from 'react';
import { ColorSidebar, ExperiencePanel } from '@repo/customizer-ui';
import { buildColorParts, buildColorSwatches } from './build-color-parts';
import { ColorPartList } from './color-part-list';
import { ColorSwatchGrid } from './color-swatch-grid';
import type {
  ColorConfigAsset,
  ColorConfigMaterials,
  ColorConfigSceneApi,
  ColorPart,
} from './types';

export function ColorConfigPanel({
  assets,
  materials,
  sceneApi,
  onBack,
  initialPartId = null,
  selectedColors: controlledColors,
  onSelectedColorsChange,
}: {
  assets: ColorConfigAsset[];
  materials: ColorConfigMaterials;
  sceneApi: ColorConfigSceneApi | null;
  onBack?: () => void;
  initialPartId?: string | null;
  selectedColors?: Record<string, string>;
  onSelectedColorsChange?: (colors: Record<string, string>) => void;
}) {
  const parts = useMemo(
    () => buildColorParts(assets, materials),
    [assets, materials]
  );
  const catalog = useMemo(() => buildColorSwatches(materials), [materials]);
  const [selectedPartId, setSelectedPartId] = useState<string | null>(
    initialPartId
  );
  const [internalColors, setInternalColors] = useState<Record<string, string>>(
    {}
  );

  useEffect(() => {
    if (initialPartId) {
      setSelectedPartId(initialPartId);
    }
  }, [initialPartId]);

  const selectedColors = controlledColors ?? internalColors;

  const setSelectedColors = (
    updater:
      | Record<string, string>
      | ((current: Record<string, string>) => Record<string, string>)
  ) => {
    const next =
      typeof updater === 'function' ? updater(selectedColors) : updater;
    setInternalColors(next);
    onSelectedColorsChange?.(next);
  };

  const selectedPart: ColorPart | null =
    parts.find((part) => part.id === selectedPartId) ?? null;

  const swatches = useMemo(() => {
    if (!selectedPart) return [];
    const preferred = new Set(
      selectedPart.swatches.map((hex) => hex.toLowerCase())
    );
    const fromPart = selectedPart.swatches.map((hex) => {
      const match = catalog.find((entry) => entry.hex === hex.toLowerCase());
      return {
        hex: hex.toLowerCase(),
        label: match?.label ?? hex.toUpperCase(),
        selected: selectedColors[selectedPart.id] === hex.toLowerCase(),
      };
    });
    if (fromPart.length > 0 && fromPart.length < catalog.length) {
      return fromPart;
    }
    return catalog
      .filter((entry) => preferred.size === 0 || preferred.has(entry.hex))
      .map((entry) => ({
        ...entry,
        selected: selectedColors[selectedPart.id] === entry.hex,
      }));
  }, [catalog, selectedPart, selectedColors]);

  const handleSelectColor = (hex: string) => {
    if (!selectedPart) return;
    const normalized = hex.toLowerCase();
    sceneApi?.applyPartColor(selectedPart.id, normalized);
    setSelectedColors((current) => ({
      ...current,
      [selectedPart.id]: normalized,
    }));
  };

  if (!parts.length) {
    return (
      <ColorSidebar
        title="Color"
        description="No colorable parts were found for this model."
        onBack={onBack}
      >
        <div className="rounded-md border border-dashed border-[#c2c2c2] bg-white/60 p-4 text-sm text-[#5d5d5d]">
          Try a colorway for a complete look.
        </div>
      </ColorSidebar>
    );
  }

  if (selectedPart) {
    const partLabel = selectedPart.label.replace(/ color$/i, '');
    return (
      <ExperiencePanel
        eyebrow="Customize parts"
        title={partLabel}
        description="Pick a color for this part. Changes apply immediately on the product."
      >
        <button
          type="button"
          onClick={() => {
            if (initialPartId && onBack) {
              onBack();
              return;
            }
            setSelectedPartId(null);
          }}
          className="self-start text-sm font-medium text-[#7a776f] hover:text-[#353535]"
        >
          ← Back
        </button>
        {selectedColors[selectedPart.id] ? (
          <div className="flex items-center gap-2 text-sm text-[#6f6b63]">
            <span
              className="inline-block h-3.5 w-3.5 rounded-full border border-[#d6d6d6]"
              style={{ backgroundColor: selectedColors[selectedPart.id] }}
            />
            {catalog.find(
              (entry) => entry.hex === selectedColors[selectedPart.id]
            )?.label ?? selectedColors[selectedPart.id]?.toUpperCase()}
          </div>
        ) : null}
        <ColorSwatchGrid
          title="Colors"
          swatches={swatches}
          onSelect={handleSelectColor}
        />
      </ExperiencePanel>
    );
  }

  return (
    <ExperiencePanel
      eyebrow="Customize parts"
      title="Part colors"
      description="Choose a part to recolor."
    >
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="self-start text-sm font-medium text-[#7a776f] hover:text-[#353535]"
        >
          ← Back
        </button>
      ) : null}
      <ColorPartList
        parts={parts.map((part) => ({
          id: part.id,
          label: part.label.replace(/ color$/i, ''),
          selected: Boolean(selectedColors[part.id]),
        }))}
        onSelect={setSelectedPartId}
      />
    </ExperiencePanel>
  );
}
