'use client';

import { CameraTimeline } from '@/components/editor/stage/camera-timeline';
import { useEditorStore } from '@/lib/editor-store';

export function CameraActionWindow() {
  const cameraPresets = useEditorStore((state) => state.cameraPresets);
  const activeCameraPresetId = useEditorStore((state) => state.activeCameraPresetId);
  const setActiveCameraPreset = useEditorStore((state) => state.setActiveCameraPreset);
  const isPlayingAnimation = useEditorStore((state) => state.isPlayingAnimation);
  const playCameraAnimation = useEditorStore((state) => state.playCameraAnimation);
  const stopCameraAnimation = useEditorStore((state) => state.stopCameraAnimation);
  const cameraAnimations = useEditorStore((state) => state.cameraAnimations);
  const activeAnimationId = useEditorStore((state) => state.activeAnimationId);

  return (
    <div className="flex h-full flex-col bg-[#101116] border-t border-white/10 text-white select-none">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2 shrink-0 bg-[#0E0F12]">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-[13px] text-white">Camera Timeline & Sequences</span>
          <div className="flex items-center gap-1.5 text-[11px] text-white/50">
            <span>Active:</span>
            <span className="text-[#9D95FF] font-medium">Intro Animation (1.5s)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              if (isPlayingAnimation) {
                stopCameraAnimation();
              } else {
                const animId = activeAnimationId || cameraAnimations[0]?.id || 'anim-intro';
                playCameraAnimation(animId);
              }
            }}
            className="flex items-center gap-1.5 rounded-lg bg-[#665CFF] px-3 py-1 text-[11px] font-medium text-white shadow-xs hover:bg-[#574CEE] transition-colors"
          >
            <span>{isPlayingAnimation ? '⏸ Pause' : '▶ Play'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Timeline Body */}
      <div className="flex-1 p-3 flex flex-col justify-center">
        <CameraTimeline inline />
      </div>
    </div>
  );
}
