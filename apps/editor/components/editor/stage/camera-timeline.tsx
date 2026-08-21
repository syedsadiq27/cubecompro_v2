'use client';

import { useEditorStore } from '@/lib/editor-store';

export function CameraTimeline({ inline }: { inline?: boolean }) {
  const activeWorkspace = useEditorStore((state) => state.activeWorkspace);
  const isPlayingAnimation = useEditorStore(
    (state) => state.isPlayingAnimation
  );
  const animationProgress = useEditorStore(
    (state) => state.animationProgress
  );
  const cameraAnimations = useEditorStore((state) => state.cameraAnimations);
  const activeAnimationId = useEditorStore((state) => state.activeAnimationId);
  const playCameraAnimation = useEditorStore(
    (state) => state.playCameraAnimation
  );
  const stopCameraAnimation = useEditorStore(
    (state) => state.stopCameraAnimation
  );
  const setAnimationProgress = useEditorStore(
    (state) => state.setAnimationProgress
  );

  const isCamera =
    activeWorkspace === 'cameras' || (activeWorkspace as string) === 'camera';

  // If not inline and not playing or not camera, skip
  if (!inline && (!isCamera || isCamera)) {
    // When 4-zone layout is active, CameraActionWindow hosts the timeline.
    if (!isPlayingAnimation) return null;
  }

  const currentAnim =
    cameraAnimations.find((a) => a.id === activeAnimationId) ||
    cameraAnimations[0];

  const totalDuration = currentAnim ? currentAnim.durationMs / 1000 : 1.5;
  const currentSeconds = animationProgress * totalDuration;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    const ms = Math.floor((secs % 1) * 100);
    return `${mins}:${s.toString().padStart(2, '0')}`;
  };

  const handleTogglePlay = () => {
    if (isPlayingAnimation) {
      stopCameraAnimation();
    } else if (currentAnim) {
      playCameraAnimation(currentAnim.id);
    }
  };

  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progress = Math.max(0, Math.min(1, clickX / rect.width));
    setAnimationProgress(progress);
  };

  const content = (
    <div className={`w-full ${inline ? '' : 'max-w-4xl rounded-2xl border border-white/10 bg-[#121318]/95 p-3.5 shadow-2xl backdrop-blur'} text-white`}>
      {/* Header */}
      {!inline ? (
        <div className="flex items-center justify-between pb-2">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#665CFF] animate-pulse" />
            <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/70">
              Camera Animation Timeline
            </h4>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-0.5 text-[11px] text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            >
              <span>Fit to duration</span>
              <span className="text-[9px] text-white/40">▾</span>
            </button>
          </div>
        </div>
      ) : null}

      {/* Controls and Ruler */}
      <div className="flex items-center gap-4 pt-1">
        {/* Play/Pause button */}
        <button
          type="button"
          onClick={handleTogglePlay}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-white hover:bg-[#665CFF] transition-colors shadow-xs"
          title={isPlayingAnimation ? 'Pause (Space)' : 'Play animation (Space)'}
        >
          {isPlayingAnimation ? (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        {/* Timecode */}
        <span className="font-mono text-[11px] font-medium text-white/60 shrink-0 w-20">
          {formatTime(currentSeconds)} / {formatTime(totalDuration)}
        </span>

        {/* Timeline Track & Ruler */}
        <div className="relative flex-1">
          {/* Ruler markings */}
          <div className="flex justify-between text-[9px] font-mono text-white/40 px-0.5 pb-1">
            <span>0s</span>
            <span>0.5s</span>
            <span>1.0s</span>
            <span>1.5s</span>
            <span>2.0s</span>
          </div>

          {/* Track line background */}
          <div
            onClick={handleScrub}
            className="relative h-7 w-full rounded-lg bg-white/5 border border-white/10 cursor-pointer overflow-hidden flex items-center px-1"
          >
            {/* Violet keyframe block */}
            <div
              className="relative h-5 rounded-md bg-[#2E2866] border border-[#665CFF] flex items-center justify-between px-1.5"
              style={{ width: '85%' }}
            >
              {/* Left diamond marker */}
              <span className="text-[8px] text-[#9D95FF]">◆</span>
              <span className="truncate text-[10px] font-medium text-[#C2BDFF] px-2">
                {currentAnim?.name || 'Intro Animation'}
              </span>
              {/* Right diamond marker */}
              <span className="text-[8px] text-[#9D95FF]">◆</span>
            </div>

            {/* Scrubber Playhead */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none transition-all duration-75"
              style={{ left: `${Math.min(100, Math.max(0, animationProgress * 100))}%` }}
            >
              <div className="absolute -top-1 -left-1 h-2.5 w-2.5 rounded-full bg-white shadow-md" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (inline) return content;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[4] flex justify-center px-4 select-none">
      <div className="pointer-events-auto w-full max-w-4xl">
        {content}
      </div>
    </div>
  );
}
