'use client';

import { useMemo, useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';
import type { CameraProjection } from '@/lib/camera/types';
import {
  MobileAccordion,
  MobileDrillHeader,
  MobileField,
  MobileSheetAction,
  useExclusiveAccordion,
} from './mobile-accordion';

export function MobileCameraWorkspace({
  onRequestExpand,
}: {
  onRequestExpand?: () => void;
}) {
  const cameraPresets = useEditorStore((state) => state.cameraPresets);
  const activeCameraPresetId = useEditorStore(
    (state) => state.activeCameraPresetId
  );
  const setActiveCameraPreset = useEditorStore(
    (state) => state.setActiveCameraPreset
  );
  const saveCurrentViewAsPreset = useEditorStore(
    (state) => state.saveCurrentViewAsPreset
  );
  const saveActivePreset = useEditorStore((state) => state.saveActivePreset);
  const deleteCameraPreset = useEditorStore((state) => state.deleteCameraPreset);
  const renameCameraPreset = useEditorStore((state) => state.renameCameraPreset);
  const cameraConfig = useEditorStore((state) => state.cameraConfig);
  const updateCameraConfig = useEditorStore((state) => state.updateCameraConfig);
  const cameraAnimations = useEditorStore((state) => state.cameraAnimations);
  const playCameraAnimation = useEditorStore(
    (state) => state.playCameraAnimation
  );
  const isPlayingAnimation = useEditorStore((state) => state.isPlayingAnimation);
  const activeAnimationId = useEditorStore((state) => state.activeAnimationId);

  const { isOpen, toggle } = useExclusiveAccordion();
  const [drillPresetId, setDrillPresetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const drilledPreset = useMemo(
    () => cameraPresets.find((preset) => preset.id === drillPresetId) ?? null,
    [cameraPresets, drillPresetId]
  );

  if (drilledPreset) {
    return (
      <div className="flex h-full min-h-0 flex-col overflow-hidden">
        <MobileDrillHeader
          title={drilledPreset.name}
          onBack={() => setDrillPresetId(null)}
        />
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
          <MobileField label="Name">
            <input
              type="text"
              value={renameValue || drilledPreset.name}
              onChange={(event) => setRenameValue(event.target.value)}
              onBlur={() => {
                const next = renameValue.trim();
                if (next && next !== drilledPreset.name) {
                  renameCameraPreset(drilledPreset.id, next);
                }
              }}
              className="h-8 w-full rounded-xl border border-white/10 bg-[#16171E] px-3 text-[12px] text-white outline-none"
            />
          </MobileField>

          <MobileField label="Projection">
            <select
              value={cameraConfig.projection}
              onChange={(event) =>
                updateCameraConfig({
                  projection: event.target.value as CameraProjection,
                })
              }
              className="h-8 w-full rounded-xl border border-white/10 bg-[#16171E] px-3 text-[12px] text-white outline-none"
            >
              <option value="PERSPECTIVE">Perspective</option>
              <option value="ORTHOGRAPHIC">Orthographic</option>
            </select>
          </MobileField>

          <MobileField label="FOV">
            <input
              type="number"
              value={cameraConfig.fov}
              onChange={(event) =>
                updateCameraConfig({ fov: Number(event.target.value) || 45 })
              }
              className="h-8 w-full rounded-xl border border-white/10 bg-[#16171E] px-3 font-mono text-[12px] text-white outline-none"
            />
          </MobileField>

          <div className="space-y-1">
            <span className="text-[10px] font-medium text-white/50">
              Position
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['x', 'y', 'z'] as const).map((axis, index) => (
                <div
                  key={axis}
                  className="rounded-xl border border-white/10 bg-[#16171E] px-2 py-1.5 text-center"
                >
                  <span className="block text-[9px] text-white/40">
                    {axis.toUpperCase()}
                  </span>
                  <span className="font-mono text-[11px] text-white">
                    {cameraConfig.position[index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setActiveCameraPreset(drilledPreset.id);
              saveActivePreset();
            }}
            className="flex h-9 w-full items-center justify-center rounded-xl bg-[#665CFF] text-[12px] font-medium text-white"
          >
            Save Current View
          </button>
          <button
            type="button"
            onClick={() => {
              deleteCameraPreset(drilledPreset.id);
              setDrillPresetId(null);
            }}
            className="flex h-9 w-full items-center justify-center rounded-xl border border-red-500/30 bg-red-950/20 text-[12px] font-medium text-red-300"
          >
            Delete Preset
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <MobileAccordion
        title="Presets"
        open={isOpen('presets')}
        onToggle={() => toggle('presets')}
        count={cameraPresets.length}
        actions={
          <MobileSheetAction
            tone="accent"
            onClick={() => {
              saveCurrentViewAsPreset();
              onRequestExpand?.();
            }}
          >
            + Preset
          </MobileSheetAction>
        }
      >
        <div className="space-y-1">
          {cameraPresets.map((preset) => {
            const isActive = preset.id === activeCameraPresetId;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  setActiveCameraPreset(preset.id);
                  setDrillPresetId(preset.id);
                  setRenameValue(preset.name);
                  onRequestExpand?.();
                }}
                className={`flex w-full items-center justify-between rounded-xl border px-2.5 py-2 text-left ${
                  isActive
                    ? 'border-[#665CFF] bg-[#232549]'
                    : 'border-white/10 bg-[#16171E]'
                }`}
              >
                <div className="min-w-0">
                  <p className="truncate text-[12px] font-semibold text-white">
                    {preset.name}
                  </p>
                  <p className="font-mono text-[9px] text-white/40">
                    FOV {preset.camera.fov}° · {preset.camera.projection}
                  </p>
                </div>
                {isActive ? (
                  <span className="shrink-0 rounded-full bg-[#665CFF]/30 px-2 py-0.5 font-mono text-[9px] text-[#9D95FF]">
                    Active
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </MobileAccordion>

      <MobileAccordion
        title="Motion"
        open={isOpen('motion')}
        onToggle={() => toggle('motion')}
        count={cameraAnimations.length}
      >
        <div className="space-y-1">
          {cameraAnimations.length === 0 ? (
            <p className="py-2 text-center text-[11px] text-white/40">
              No camera animations yet.
            </p>
          ) : (
            cameraAnimations.map((animation) => {
              const playing =
                isPlayingAnimation && activeAnimationId === animation.id;
              return (
                <button
                  key={animation.id}
                  type="button"
                  onClick={() => playCameraAnimation(animation.id)}
                  className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#16171E] px-2.5 py-2 text-left"
                >
                  <span className="truncate text-[12px] font-medium text-white">
                    {animation.name}
                  </span>
                  <span className="text-[10px] text-[#9D95FF]">
                    {playing ? 'Playing…' : 'Play'}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </MobileAccordion>
    </div>
  );
}
