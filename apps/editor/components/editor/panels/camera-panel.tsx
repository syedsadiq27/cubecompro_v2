'use client';

import { useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';

export function CameraPanel() {
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
  const renameCameraPreset = useEditorStore(
    (state) => state.renameCameraPreset
  );
  const deleteCameraPreset = useEditorStore(
    (state) => state.deleteCameraPreset
  );
  const cameraAnimations = useEditorStore((state) => state.cameraAnimations);
  const playCameraAnimation = useEditorStore(
    (state) => state.playCameraAnimation
  );
  const activeAnimationId = useEditorStore((state) => state.activeAnimationId);
  const isPlayingAnimation = useEditorStore(
    (state) => state.isPlayingAnimation
  );

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isAddingPreset, setIsAddingPreset] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [renamingPresetId, setRenamingPresetId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  const activePreset =
    cameraPresets.find((p) => p.id === activeCameraPresetId) ||
    cameraPresets[0];

  const handleAddPreset = () => {
    if (newPresetName.trim()) {
      saveCurrentViewAsPreset(newPresetName.trim());
      setNewPresetName('');
      setIsAddingPreset(false);
    }
  };

  const beginRename = (id: string, currentName: string) => {
    setActiveMenuId(null);
    setIsAddingPreset(false);
    setRenamingPresetId(id);
    setRenameValue(currentName);
  };

  const commitRename = () => {
    if (!renamingPresetId) return;
    const next = renameValue.trim();
    if (next) {
      renameCameraPreset(renamingPresetId, next);
      useEditorStore.getState().setStatusMessage(`Renamed view to “${next}”`);
    }
    setRenamingPresetId(null);
    setRenameValue('');
  };

  const cancelRename = () => {
    setRenamingPresetId(null);
    setRenameValue('');
  };

  return (
    <div className="flex h-full flex-col text-white select-none">
      <div className="min-h-0 flex-1 overflow-y-auto p-3 text-[12px] space-y-4">
        <section className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
              Camera Presets
            </span>
            <button
              type="button"
              onClick={() => {
                cancelRename();
                setIsAddingPreset(true);
              }}
              className="text-[11px] font-medium text-[#9D95FF] hover:underline"
            >
              + Add preset
            </button>
          </div>

          {isAddingPreset ? (
            <div className="flex items-center gap-1.5 rounded-xl border border-[#665CFF] bg-[#121318] p-1.5">
              <input
                autoFocus
                type="text"
                placeholder="Preset name…"
                value={newPresetName}
                onChange={(e) => setNewPresetName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleAddPreset();
                  if (e.key === 'Escape') setIsAddingPreset(false);
                }}
                className="min-w-0 flex-1 bg-transparent px-1.5 text-[12px] text-white outline-none"
              />
              <button
                type="button"
                onClick={handleAddPreset}
                className="rounded-lg bg-[#665CFF] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#574CEE]"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsAddingPreset(false)}
                className="rounded-lg px-2 py-1 text-[11px] text-white/60 hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : null}

          <div className="space-y-1">
            {cameraPresets.map((preset) => {
              const isActive = preset.id === activeCameraPresetId;
              const isRenaming = renamingPresetId === preset.id;

              if (isRenaming) {
                return (
                  <div
                    key={preset.id}
                    className="flex items-center gap-1.5 rounded-xl border border-[#665CFF] bg-[#121318] p-1.5"
                  >
                    <input
                      autoFocus
                      type="text"
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitRename();
                        if (e.key === 'Escape') cancelRename();
                      }}
                      className="min-w-0 flex-1 bg-transparent px-1.5 text-[12px] text-white outline-none"
                    />
                    <button
                      type="button"
                      onClick={commitRename}
                      className="rounded-lg bg-[#665CFF] px-2.5 py-1 text-[11px] font-medium text-white hover:bg-[#574CEE]"
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      onClick={cancelRename}
                      className="rounded-lg px-2 py-1 text-[11px] text-white/60 hover:text-white"
                    >
                      Cancel
                    </button>
                  </div>
                );
              }

              return (
                <div
                  key={preset.id}
                  onClick={() => setActiveCameraPreset(preset.id)}
                  className={`group relative flex items-center justify-between rounded-xl px-2.5 py-2 cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-[#242646] border border-[#665CFF]/60 text-white shadow-xs'
                      : 'border border-transparent text-white/80 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="text-[10px] text-white/40 group-hover:text-white/80 transition-colors">
                      ▷
                    </span>
                    <span className="truncate text-[12px] font-medium">
                      {preset.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {isActive ? (
                      <span className="rounded bg-[#665CFF]/30 px-1.5 py-0.5 font-mono text-[9px] font-bold text-[#9D95FF] border border-[#665CFF]/40">
                        Active
                      </span>
                    ) : null}

                    <div className="relative">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(
                            activeMenuId === preset.id ? null : preset.id
                          );
                        }}
                        className="p-1 text-white/40 hover:text-white transition-colors"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <circle cx="12" cy="5" r="2" />
                          <circle cx="12" cy="12" r="2" />
                          <circle cx="12" cy="19" r="2" />
                        </svg>
                      </button>

                      {activeMenuId === preset.id ? (
                        <div
                          className="absolute right-0 top-full z-30 mt-1 w-36 rounded-xl border border-white/10 bg-[#16171E] p-1 text-[11px] shadow-2xl backdrop-blur"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            className="w-full rounded-lg px-2.5 py-1.5 text-left text-white/80 hover:bg-white/10 hover:text-white"
                            onClick={() => beginRename(preset.id, preset.name)}
                          >
                            Rename view
                          </button>
                          <button
                            type="button"
                            className="w-full rounded-lg px-2.5 py-1.5 text-left text-red-400 hover:bg-white/10 hover:text-red-300"
                            onClick={() => {
                              deleteCameraPreset(preset.id);
                              setActiveMenuId(null);
                            }}
                          >
                            Delete preset
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-2 border-t border-white/10 pt-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
              Current View
            </span>
            <button
              type="button"
              onClick={() => saveCurrentViewAsPreset()}
              className="text-[11px] font-medium text-[#9D95FF] hover:underline"
              title="Capture current 3D viewport angle and position as a preset"
            >
              Save current as preset
            </button>
          </div>

          <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#181920] px-3 py-2.5">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-[10px] text-white/40">▷</span>
              <div className="min-w-0">
                <p className="truncate text-[12px] font-semibold text-white">
                  {activePreset?.name || 'Default View'}
                </p>
                <p className="text-[10px] text-white/40 leading-none mt-0.5">
                  Used in {activePreset?.sceneCount ?? 1} scene
                  {(activePreset?.sceneCount ?? 1) > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="p-1 text-white/40 hover:text-white transition-colors disabled:opacity-40"
              title="Rename view"
              disabled={!activePreset}
              onClick={() => {
                if (!activePreset) return;
                beginRename(activePreset.id, activePreset.name);
              }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
              </svg>
            </button>
          </div>
        </section>

        <section className="space-y-2 border-t border-white/10 pt-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
              Animations
            </span>
            <button
              type="button"
              onClick={() => {
                useEditorStore
                  .getState()
                  .setStatusMessage('Add custom animation curve');
              }}
              className="text-[11px] font-medium text-[#9D95FF] hover:underline"
            >
              + Add
            </button>
          </div>

          <div className="space-y-1.5">
            {cameraAnimations.map((anim) => {
              const isPlaying =
                isPlayingAnimation && activeAnimationId === anim.id;
              return (
                <div
                  key={anim.id}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-[#181920] px-3 py-2.5"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold text-white">
                      {anim.name}
                    </p>
                    <p className="text-[10px] text-white/40 leading-none mt-0.5">
                      {(anim.durationMs / 1000).toFixed(1)}s ·{' '}
                      {anim.easing === 'ease-in-out'
                        ? 'Ease In Out'
                        : anim.easing === 'linear'
                          ? 'Linear'
                          : anim.easing}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => playCameraAnimation(anim.id)}
                    className={`flex h-7 w-7 items-center justify-center rounded-lg transition-colors ${
                      isPlaying
                        ? 'bg-[#665CFF] text-white shadow-xs'
                        : 'bg-white/5 text-white/70 hover:bg-white/15 hover:text-white'
                    }`}
                    title={isPlaying ? 'Replay animation' : 'Play animation'}
                  >
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
