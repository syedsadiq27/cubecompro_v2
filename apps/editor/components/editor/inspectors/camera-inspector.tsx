'use client';

import { useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';
import type { CameraProjection } from '@/lib/camera/types';

export function CameraInspector() {
  const cameraPresets = useEditorStore((state) => state.cameraPresets);
  const activeCameraPresetId = useEditorStore(
    (state) => state.activeCameraPresetId
  );
  const saveActivePreset = useEditorStore((state) => state.saveActivePreset);
  const saveCurrentViewAsPreset = useEditorStore(
    (state) => state.saveCurrentViewAsPreset
  );
  const cameraConfig = useEditorStore((state) => state.cameraConfig);
  const orbitConfig = useEditorStore((state) => state.orbitConfig);
  const updateCameraConfig = useEditorStore((state) => state.updateCameraConfig);
  const updateOrbitConfig = useEditorStore((state) => state.updateOrbitConfig);
  const cameraAnimations = useEditorStore((state) => state.cameraAnimations);
  const playCameraAnimation = useEditorStore((state) => state.playCameraAnimation);
  const isPlayingAnimation = useEditorStore((state) => state.isPlayingAnimation);

  const [animDuration, setAnimDuration] = useState('1.50');
  const [animEasing, setAnimEasing] = useState<'ease-in-out' | 'linear' | 'ease-in' | 'ease-out'>('ease-in-out');
  const [animEnabled, setAnimEnabled] = useState(true);
  const [justSaved, setJustSaved] = useState(false);

  const activePreset = cameraPresets.find(
    (p) => p.id === activeCameraPresetId
  ) || cameraPresets[0];

  const handleSaveToCurrent = () => {
    saveActivePreset();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <div className="space-y-4 text-white select-none">
      {/* Preset Sync & Save Banner */}
      <div className="rounded-xl border border-white/10 bg-[#181920] p-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="h-2 w-2 rounded-full bg-[#665CFF]" />
            <span className="truncate text-[12px] font-semibold text-white">
              {activePreset?.name || 'Default View'}
            </span>
          </div>
          <span className="rounded bg-white/10 px-1.5 py-0.5 font-mono text-[9px] text-white/50">
            Live Synced
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveToCurrent}
            className="flex-1 rounded-lg bg-[#665CFF] py-1.5 px-2.5 text-center text-[11px] font-medium text-white shadow-xs transition-colors hover:bg-[#574CEE] active:scale-98"
          >
            {justSaved ? '✓ Saved!' : 'Save to Current Preset'}
          </button>
          <button
            type="button"
            onClick={() => saveCurrentViewAsPreset()}
            className="rounded-lg border border-white/15 bg-white/5 py-1.5 px-2.5 text-[11px] font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
            title="Save as a new separate preset"
          >
            + As New
          </button>
        </div>
      </div>

      {/* Transform Section */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
            Transform
          </h4>
          <span className="text-[10px] text-white/30">▾</span>
        </div>

        {/* Position */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-white/60 font-medium">Position</span>
          <div className="grid grid-cols-3 gap-1.5">
            {(['x', 'y', 'z'] as const).map((axis, i) => (
              <div
                key={axis}
                className="flex items-center rounded-lg border border-white/10 bg-[#181920] px-2 py-1"
              >
                <span className="font-mono text-[10px] font-bold uppercase text-white/40 mr-1.5">
                  {axis}
                </span>
                <input
                  type="number"
                  step={0.1}
                  className="w-full bg-transparent font-mono text-[12px] text-white outline-none"
                  value={cameraConfig.position[i]}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const pos = [...cameraConfig.position] as [number, number, number];
                    pos[i] = val;
                    updateCameraConfig({ position: pos });
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Target / Look At */}
        <div className="space-y-1.5">
          <span className="text-[11px] text-white/60 font-medium">Target / Look At</span>
          <div className="grid grid-cols-3 gap-1.5">
            {(['x', 'y', 'z'] as const).map((axis, i) => (
              <div
                key={axis}
                className="flex items-center rounded-lg border border-white/10 bg-[#181920] px-2 py-1"
              >
                <span className="font-mono text-[10px] font-bold uppercase text-white/40 mr-1.5">
                  {axis}
                </span>
                <input
                  type="number"
                  step={0.1}
                  className="w-full bg-transparent font-mono text-[12px] text-white outline-none"
                  value={cameraConfig.target[i]}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const tar = [...cameraConfig.target] as [number, number, number];
                    tar[i] = val;
                    updateCameraConfig({ target: tar });
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projection Section */}
      <div className="space-y-2.5 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
            Projection
          </h4>
          <span className="text-[10px] text-white/30">▾</span>
        </div>

        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] text-white/60">Type</span>
          <select
            value={cameraConfig.projection}
            onChange={(e) =>
              updateCameraConfig({
                projection: e.target.value as CameraProjection,
              })
            }
            className="h-7 rounded-lg border border-white/10 bg-[#181920] px-2 text-[12px] text-white outline-none"
          >
            <option value="PERSPECTIVE">Perspective</option>
            <option value="ORTHOGRAPHIC">Orthographic</option>
          </select>
        </div>

        {/* FOV */}
        <div className="space-y-1">
          <div className="flex items-center justify-between text-[11px] text-white/60">
            <span>FOV</span>
            <span className="font-mono text-white text-[12px]">{cameraConfig.fov}°</span>
          </div>
          <input
            type="range"
            min={15}
            max={100}
            step={1}
            value={cameraConfig.fov}
            onChange={(e) =>
              updateCameraConfig({ fov: Number(e.target.value) })
            }
            className="w-full accent-[#665CFF] h-1.5 bg-white/10 rounded-lg cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[10px] text-white/50">Near</span>
            <input
              type="number"
              step={0.01}
              value={cameraConfig.near}
              onChange={(e) =>
                updateCameraConfig({ near: Number(e.target.value) })
              }
              className="h-7 w-full rounded-lg border border-white/10 bg-[#181920] px-2 font-mono text-[12px] text-white outline-none"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] text-white/50">Far</span>
            <input
              type="number"
              step={10}
              value={cameraConfig.far}
              onChange={(e) =>
                updateCameraConfig({ far: Number(e.target.value) })
              }
              className="h-7 w-full rounded-lg border border-white/10 bg-[#181920] px-2 font-mono text-[12px] text-white outline-none"
            />
          </div>
        </div>
      </div>

      {/* Orbit Controls Section */}
      <div className="space-y-2.5 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
            Orbit Controls
          </h4>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={orbitConfig.enabled}
              onChange={(e) =>
                updateOrbitConfig({ enabled: e.target.checked })
              }
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#665CFF]" />
          </label>
        </div>

        {/* Checkboxes */}
        <div className="space-y-1.5 pt-0.5">
          {[
            { key: 'enableRotate', label: 'Enable Rotate' },
            { key: 'enablePan', label: 'Enable Pan' },
            { key: 'enableZoom', label: 'Enable Zoom' },
            { key: 'autoRotate', label: 'Auto Rotate' },
          ].map((item) => (
            <label
              key={item.key}
              className="flex items-center gap-2 text-[12px] text-white/80 cursor-pointer hover:text-white"
            >
              <input
                type="checkbox"
                checked={Boolean(orbitConfig[item.key as keyof typeof orbitConfig])}
                onChange={(e) =>
                  updateOrbitConfig({ [item.key]: e.target.checked })
                }
                className="rounded border-white/20 bg-white/10 text-[#665CFF] accent-[#665CFF] cursor-pointer"
              />
              <span>{item.label}</span>
            </label>
          ))}
        </div>

        {/* Sliders */}
        <div className="space-y-2 pt-1">
          {/* Min Distance */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-white/60">
              <span>Min Distance</span>
              <span className="font-mono text-white text-[12px]">{orbitConfig.minDistance}</span>
            </div>
            <input
              type="range"
              min={0.01}
              max={20}
              step={0.05}
              value={orbitConfig.minDistance}
              onChange={(e) =>
                updateOrbitConfig({ minDistance: Number(e.target.value) })
              }
              className="w-full accent-[#665CFF] h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Max Distance */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-white/60">
              <span>Max Distance</span>
              <span className="font-mono text-white text-[12px]">{orbitConfig.maxDistance}</span>
            </div>
            <input
              type="range"
              min={5}
              max={500}
              step={5}
              value={orbitConfig.maxDistance}
              onChange={(e) =>
                updateOrbitConfig({ maxDistance: Number(e.target.value) })
              }
              className="w-full accent-[#665CFF] h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Min Polar Angle */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-white/60">
              <span>Min Polar Angle</span>
              <span className="font-mono text-white text-[12px]">{orbitConfig.minPolarAngle}°</span>
            </div>
            <input
              type="range"
              min={0}
              max={90}
              step={5}
              value={orbitConfig.minPolarAngle}
              onChange={(e) =>
                updateOrbitConfig({ minPolarAngle: Number(e.target.value) })
              }
              className="w-full accent-[#665CFF] h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>

          {/* Max Polar Angle */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-white/60">
              <span>Max Polar Angle</span>
              <span className="font-mono text-white text-[12px]">{orbitConfig.maxPolarAngle}°</span>
            </div>
            <input
              type="range"
              min={45}
              max={95}
              step={1}
              value={orbitConfig.maxPolarAngle}
              onChange={(e) =>
                updateOrbitConfig({ maxPolarAngle: Number(e.target.value) })
              }
              className="w-full accent-[#665CFF] h-1.5 bg-white/10 rounded-lg cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Animation Section */}
      <div className="space-y-2.5 border-t border-white/10 pt-3">
        <div className="flex items-center justify-between">
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
            Animation
          </h4>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={animEnabled}
              onChange={(e) => setAnimEnabled(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-8 h-4 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#665CFF]" />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <span className="text-[10px] text-white/50">Duration</span>
            <div className="flex items-center rounded-lg border border-white/10 bg-[#181920] px-2 py-1">
              <input
                type="text"
                value={animDuration}
                onChange={(e) => setAnimDuration(e.target.value)}
                className="w-full bg-transparent font-mono text-[12px] text-white outline-none"
              />
              <span className="text-[11px] text-white/40">s</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-white/50">Easing</span>
            <select
              value={animEasing}
              onChange={(e) =>
                setAnimEasing(e.target.value as typeof animEasing)
              }
              className="h-8 w-full rounded-lg border border-white/10 bg-[#181920] px-2 text-[12px] text-white outline-none"
            >
              <option value="ease-in-out">Ease In Out</option>
              <option value="linear">Linear</option>
              <option value="ease-in">Ease In</option>
              <option value="ease-out">Ease Out</option>
            </select>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            const firstAnim = cameraAnimations[0];
            if (firstAnim) {
              playCameraAnimation(firstAnim.id);
            }
          }}
          disabled={isPlayingAnimation}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-[#665CFF]/40 bg-[#242145] py-2 text-[12px] font-medium text-[#9D95FF] transition-colors hover:bg-[#2E2A59] disabled:opacity-50 shadow-xs"
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <span>{isPlayingAnimation ? 'Playing…' : 'Preview Animation'}</span>
        </button>
      </div>
    </div>
  );
}
