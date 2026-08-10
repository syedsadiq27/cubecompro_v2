'use client';

import { useMemo, useState } from 'react';
import { ColorConfigPanel, buildColorParts } from '@repo/color-config';
import {
  getVariantThumbnailUrl,
  selectSignatureLooks,
  type ColorwayVariant,
} from '@repo/colorways';
import {
  CurrentLookSummary,
  ExperiencePanel,
  SignatureLookGrid,
} from '@repo/customizer-ui';
import { getImageBaseUrl } from '../lib/env';
import type { ModelVariant, ProductObjectAsset } from '../lib/api/model';
import type { ParsedModelMaterials } from '../lib/materials';
import { useConfiguration } from '../providers/configuration-provider';
import type { ModelSceneApi } from './model-canvas';

export function ColorStep({
  assets,
  materials,
  variants,
  sceneApi,
}: {
  assets: ProductObjectAsset[];
  materials: ParsedModelMaterials;
  variants: ModelVariant[];
  sceneApi: ModelSceneApi | null;
}) {
  const { state, patchState } = useConfiguration();
  const imageBaseUrl = getImageBaseUrl();
  const [showAll, setShowAll] = useState(false);
  const [showParts, setShowParts] = useState(false);
  const [activePartId, setActivePartId] = useState<string | null>(null);

  const colorwayVariants = useMemo<ColorwayVariant[]>(
    () =>
      variants.map((variant) => ({
        id: variant.id,
        varientCode: variant.varientCode,
        varientName: variant.varientName,
        configuration: variant.configuration,
        media: variant.media,
      })),
    [variants]
  );

  const signatureLooks = useMemo(
    () =>
      selectSignatureLooks(colorwayVariants, {
        limit: showAll ? 12 : 4,
        getThumbnailUrl: (variant) =>
          getVariantThumbnailUrl(variant, imageBaseUrl),
      }),
    [colorwayVariants, imageBaseUrl, showAll]
  );

  const parts = useMemo(
    () => buildColorParts(assets, materials),
    [assets, materials]
  );

  const partColorMap = Object.fromEntries(
    state.partColors.map((entry) => [entry.partId, entry.hex])
  );

  const selectedLook =
    signatureLooks.find((look) => look.id === state.colorway?.id) ??
    (state.colorway
      ? {
          title: state.colorway.displayName,
          descriptor: 'Selected colorway',
          accents: [] as string[],
          partSummary: '',
        }
      : null);

  const accentLabels = ['Crown', 'Visor', 'Mesh'];

  if (activePartId) {
    return (
      <ColorConfigPanel
        assets={assets}
        materials={materials}
        sceneApi={sceneApi}
        initialPartId={activePartId}
        selectedColors={partColorMap}
        onSelectedColorsChange={(colors) => {
          patchState({
            partColors: Object.entries(colors).map(([partId, hex]) => {
              const part = parts.find((entry) => entry.id === partId);
              return {
                partId,
                label: part?.label.replace(/ color$/i, '') ?? partId,
                hex,
              };
            }),
          });
        }}
        onBack={() => setActivePartId(null)}
      />
    );
  }

  if (showParts) {
    return (
      <ExperiencePanel
        compact
        eyebrow="Build your own"
        title="Customize parts"
        description="Control each part independently."
      >
        <button
          type="button"
          onClick={() => setShowParts(false)}
          className="self-start text-sm font-medium text-[#6f6b63] hover:text-[#141311]"
        >
          ← Back to looks
        </button>
        <ul className="flex flex-col gap-2">
          {parts.map((part) => {
            const hex = partColorMap[part.id];
            return (
              <li key={part.id}>
                <button
                  type="button"
                  onClick={() => setActivePartId(part.id)}
                  className="flex w-full items-center justify-between rounded-[1.1rem] border border-[#ebe6de] bg-white px-3 py-3 text-left hover:border-[#d9d2c7]"
                >
                  <span className="text-sm font-medium text-[#2f2d2a]">
                    {part.label.replace(/ color$/i, '')}
                  </span>
                  <span className="flex items-center gap-2 text-sm text-[#7a776f]">
                    {hex ? (
                      <span
                        className="inline-block h-3.5 w-3.5 rounded-full border border-[#d6d6d6]"
                        style={{ backgroundColor: hex }}
                      />
                    ) : null}
                    {hex?.toUpperCase() ?? 'Choose'}
                    <span aria-hidden="true">›</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </ExperiencePanel>
    );
  }

  return (
    <ExperiencePanel
      compact
      eyebrow="Color"
      title="Choose your look"
      description="Start with a curated colorway, then make it yours."
    >
      <CurrentLookSummary
        title={selectedLook?.title || 'No look selected'}
        descriptor={
          selectedLook?.descriptor || 'Pick a signature colorway to begin'
        }
        accents={
          state.partColors.length > 0
            ? state.partColors.slice(0, 3).map((entry) => entry.hex)
            : selectedLook?.accents
        }
        labels={
          state.partColors.length > 0
            ? state.partColors.slice(0, 3).map((entry) => entry.label)
            : accentLabels
        }
      />

      <SignatureLookGrid
        title="Signature colorways"
        looks={signatureLooks.map((look) => ({
          id: look.id,
          title: look.title,
          descriptor: look.descriptor,
          thumbnailUrl: look.thumbnailUrl,
          accents: look.accents,
          selected: state.colorway?.id === look.id,
        }))}
        footer={
          !showAll && colorwayVariants.length > signatureLooks.length
            ? `${signatureLooks.length} of ${colorwayVariants.length} colorways`
            : undefined
        }
        onSelect={(id) => {
          const selected = signatureLooks.find((look) => look.id === id);
          if (!selected) return;
          sceneApi?.applyVariant(selected.source);
          patchState({
            colorway: {
              id: selected.id,
              displayName: selected.title,
              commerceVariantId: selected.commerceVariantId,
              commerceVariantCode: selected.commerceVariantCode,
            },
            partColors: [],
          });
        }}
      />

      {colorwayVariants.length > 4 ? (
        <button
          type="button"
          onClick={() => setShowAll((current) => !current)}
          className="self-start text-sm font-medium text-[#141311] underline-offset-4 hover:underline"
        >
          {showAll ? 'Show fewer →' : `View all →`}
        </button>
      ) : null}

      {parts.length ? (
        <div className="border-t border-[#e8e2d8] pt-5">
          <p className="text-[0.6875rem] font-medium tracking-[0.16em] text-[#8a867e] uppercase">
            Build your own
          </p>
          <button
            type="button"
            onClick={() => setShowParts(true)}
            className="mt-2 text-sm font-semibold leading-snug text-[#141311] underline-offset-4 hover:underline"
          >
            Customize crown, visor, mesh and details →
          </button>
        </div>
      ) : null}
    </ExperiencePanel>
  );
}
