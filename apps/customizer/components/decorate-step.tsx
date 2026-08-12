'use client';

import type { DecorationRegion } from '@repo/configurator-core';
import { ExperiencePanel } from '@repo/customizer-ui';
import { HEADWEAR_CAMERA_POSITIONS } from '@/lib/product-camera';
import { useConfiguration } from '@/providers/configuration-provider';
import type { ModelSceneApi } from './model-canvas';

const REGION_LABELS: Record<DecorationRegion, string> = {
  front: 'Front',
  left: 'Left side',
  right: 'Right side',
  back: 'Back',
};

export function DecorateStep({
  sceneApi,
}: {
  sceneApi: ModelSceneApi | null;
}) {
  const { state, patchState, adapters } = useConfiguration();
  const active = state.decorations.find(
    (entry) => entry.region === state.activeDecorationRegion
  );

  const selectRegion = (region: DecorationRegion) => {
    patchState({ activeDecorationRegion: region });
    const position = HEADWEAR_CAMERA_POSITIONS[region];
    sceneApi?.focusRegion({
      position: position.toArray() as [number, number, number],
      target: [0, 0, 0],
    });
  };

  const updateActiveDecoration = (
    partial: Partial<{ logoName: string; text: string; size: number }>
  ) => {
    const region = state.activeDecorationRegion;
    const existing = state.decorations.filter((entry) => entry.region !== region);
    const current = state.decorations.find((entry) => entry.region === region);
    patchState({
      decorations: [
        ...existing,
        {
          id: current?.id ?? `deco-${region}`,
          region,
          logoName: partial.logoName ?? current?.logoName,
          text: partial.text ?? current?.text,
          size: partial.size ?? current?.size ?? 50,
        },
      ],
    });
  };

  return (
    <ExperiencePanel
      eyebrow="Decorate"
      title="Add your artwork"
      description="Upload a logo, choose a side, and place it on the product."
    >
      <div>
        <p className="mb-3 text-sm font-semibold text-[#1f1f1f]">Placement</p>
        <div className="grid grid-cols-2 gap-2">
          {adapters.decoration.regions.map((region) => {
            const selected = state.activeDecorationRegion === region;
            return (
              <button
                key={region}
                type="button"
                onClick={() => selectRegion(region)}
                className={[
                  'rounded-xl border px-3 py-3 text-left text-sm transition-colors',
                  selected
                    ? 'border-[color:var(--cc-primary,#1f1f1f)] ring-1 ring-[color:var(--cc-primary,#1f1f1f)]'
                    : 'border-[#e4e0d9] bg-white hover:border-[#cfc9bf]',
                ].join(' ')}
              >
                {REGION_LABELS[region]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-semibold text-[#1f1f1f]">Upload logo</p>
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#d8d4cd] bg-white px-4 py-8 text-center">
          <span className="text-sm font-medium text-[#353535]">
            {active?.logoName ? active.logoName : 'Choose a file'}
          </span>
          <span className="mt-1 text-xs text-[#7a776f]">
            PNG or SVG · placement stub for now
          </span>
          <input
            type="file"
            accept="image/png,image/svg+xml,image/jpeg"
            className="sr-only"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              updateActiveDecoration({ logoName: file.name });
            }}
          />
        </label>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="font-semibold text-[#1f1f1f]">Size</span>
          <span className="text-[#7a776f]">{active?.size ?? 50}%</span>
        </div>
        <input
          type="range"
          min={20}
          max={100}
          value={active?.size ?? 50}
          onChange={(event) =>
            updateActiveDecoration({ size: Number(event.target.value) })
          }
          className="w-full accent-[color:var(--cc-primary,#1f1f1f)]"
        />
        <p className="mt-2 text-xs text-[#7a776f]">
          Position / drag directly on model — coming with DecorationAdapter
          mesh anchors.
        </p>
      </div>

      <div>
        <p className="mb-2 text-sm font-semibold text-[#1f1f1f]">+ Add text</p>
        <input
          type="text"
          value={active?.text ?? ''}
          placeholder="Your text"
          onChange={(event) =>
            updateActiveDecoration({ text: event.target.value })
          }
          className="w-full rounded-xl border border-[#e4e0d9] bg-white px-3 py-2.5 text-sm text-[#353535] outline-none focus:border-[color:var(--cc-primary,#1f1f1f)]"
        />
      </div>
    </ExperiencePanel>
  );
}
