'use client';

import { useEditorStore } from '@/lib/editor-store';

export function ViewportNavControls() {
  const runtime = useEditorStore((state) => state.runtime);
  const toolMode = useEditorStore((state) => state.toolMode);
  const setToolMode = useEditorStore((state) => state.setToolMode);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  return (
    <>
      {/* Bottom-Left Keyboard Shortcut Badges */}
      <div className="pointer-events-none absolute left-4 bottom-4 z-[4] flex items-center gap-2 select-none text-[11px] text-white">
        <button
          type="button"
          onClick={() => setToolMode('select')}
          className={`pointer-events-auto flex items-center gap-1.5 rounded-xl border border-white/10 px-2.5 py-1 backdrop-blur shadow-md transition-colors ${
            toolMode === 'select'
              ? 'bg-[#232549] text-white font-medium border-[#665CFF]/60'
              : 'bg-[#121318]/90 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span>↖</span>
          <span>Select</span>
        </button>

        <button
          type="button"
          onClick={() => setToolMode('rotate')}
          className={`pointer-events-auto flex items-center gap-1.5 rounded-xl border border-white/10 px-2.5 py-1 backdrop-blur shadow-md transition-colors ${
            toolMode === 'rotate'
              ? 'bg-[#232549] text-white font-medium border-[#665CFF]/60'
              : 'bg-[#121318]/90 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="font-mono text-[9px] rounded bg-white/15 px-1 py-0.2">R</span>
          <span>Rotate</span>
        </button>

        <button
          type="button"
          onClick={() => setToolMode('translate')}
          className={`pointer-events-auto flex items-center gap-1.5 rounded-xl border border-white/10 px-2.5 py-1 backdrop-blur shadow-md transition-colors ${
            toolMode === 'translate'
              ? 'bg-[#232549] text-white font-medium border-[#665CFF]/60'
              : 'bg-[#121318]/90 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="font-mono text-[9px] rounded bg-white/15 px-1 py-0.2">W</span>
          <span className="font-mono text-[9px] rounded bg-white/15 px-1 py-0.2">E</span>
          <span>Translate</span>
        </button>

        <button
          type="button"
          onClick={() => setToolMode('scale')}
          className={`pointer-events-auto flex items-center gap-1.5 rounded-xl border border-white/10 px-2.5 py-1 backdrop-blur shadow-md transition-colors ${
            toolMode === 'scale'
              ? 'bg-[#232549] text-white font-medium border-[#665CFF]/60'
              : 'bg-[#121318]/90 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <span className="font-mono text-[9px] rounded bg-white/15 px-1 py-0.2">S</span>
          <span>Scale</span>
        </button>
      </div>

      {/* Bottom-Right Camera Navigation Buttons */}
      <div className="pointer-events-none absolute right-4 bottom-4 z-[4] flex flex-col items-center gap-1 rounded-xl border border-white/10 bg-[#121318]/95 p-1 shadow-2xl backdrop-blur select-none text-white">
        {/* Pan */}
        <button
          type="button"
          onClick={() => setStatusMessage('Pan camera (Middle click or Shift+drag)')}
          className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          title="Pan Camera"
        >
          ✋
        </button>

        {/* Zoom */}
        <button
          type="button"
          onClick={() => runtime?.zoomCamera(0.25)}
          className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          title="Zoom In"
        >
          🔍
        </button>

        {/* Frame Selection */}
        <button
          type="button"
          onClick={() => runtime?.frameSelection()}
          className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          title="Frame Selection (F)"
        >
          ⛶
        </button>
      </div>
    </>
  );
}
