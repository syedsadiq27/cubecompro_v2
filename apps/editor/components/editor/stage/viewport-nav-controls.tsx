'use client';

import { useEditorStore } from '@/lib/editor-store';

export function ViewportNavControls() {
  const runtime = useEditorStore((state) => state.runtime);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  return (
    <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 z-[4] flex flex-col items-center gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)]/95 p-1 shadow-sm backdrop-blur select-none">
      <button
        type="button"
        onClick={() => runtime?.frameSelection()}
        className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded text-[11px] font-medium text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
        title="Fit to view"
      >
        Fit
      </button>
      <button
        type="button"
        onClick={() => setStatusMessage('Zoom in')}
        className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded text-[14px] text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
        title="Zoom in"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => setStatusMessage('Zoom out')}
        className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded text-[14px] text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
        title="Zoom out"
      >
        -
      </button>
      <button
        type="button"
        onClick={() => setStatusMessage('Pan camera (Middle click)')}
        className="pointer-events-auto flex h-7 w-7 items-center justify-center rounded text-[12px] text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
        title="Pan camera"
      >
        ✋
      </button>
    </div>
  );
}
