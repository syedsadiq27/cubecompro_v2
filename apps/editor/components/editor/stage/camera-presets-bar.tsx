'use client';

import { useEditorStore } from '@/lib/editor-store';

export function CameraPresetsBar() {
  const toolMode = useEditorStore((state) => state.toolMode);
  const setToolMode = useEditorStore((state) => state.setToolMode);
  const runtime = useEditorStore((state) => state.runtime);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-10 z-[4] flex justify-center px-4 select-none">
      <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)]/95 p-1 shadow-sm backdrop-blur text-[12px]">
        <button
          type="button"
          onClick={() => setToolMode('select')}
          className={`rounded-lg px-2.5 py-1 ${
            toolMode === 'select'
              ? 'bg-[var(--ink)] font-medium text-white'
              : 'text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]'
          }`}
        >
          Select <span className="opacity-60 text-[10px]">V</span>
        </button>
        <button
          type="button"
          onClick={() => setToolMode('translate')}
          className={`rounded-lg px-2.5 py-1 ${
            toolMode === 'translate'
              ? 'bg-[var(--ink)] font-medium text-white'
              : 'text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]'
          }`}
        >
          Move <span className="opacity-60 text-[10px]">W</span>
        </button>
        <button
          type="button"
          onClick={() => setToolMode('rotate')}
          className={`rounded-lg px-2.5 py-1 ${
            toolMode === 'rotate'
              ? 'bg-[var(--ink)] font-medium text-white'
              : 'text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]'
            }`}
        >
          Rotate <span className="opacity-60 text-[10px]">E</span>
        </button>
        <button
          type="button"
          onClick={() => setToolMode('scale')}
          className={`rounded-lg px-2.5 py-1 ${
            toolMode === 'scale'
              ? 'bg-[var(--ink)] font-medium text-white'
              : 'text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]'
          }`}
        >
          Scale <span className="opacity-60 text-[10px]">R</span>
        </button>

        <div className="mx-1 h-3.5 w-px bg-[var(--line)]" />

        <button
          type="button"
          onClick={() => runtime?.frameSelection()}
          className="rounded-lg px-2.5 py-1 text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
        >
          Frame <span className="opacity-60 text-[10px]">F</span>
        </button>
        <button
          type="button"
          onClick={() => setStatusMessage('Front camera view')}
          className="rounded-lg px-2 py-1 text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
        >
          Front
        </button>
        <button
          type="button"
          onClick={() => setStatusMessage('Side camera view')}
          className="rounded-lg px-2 py-1 text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
        >
          Side
        </button>
        <button
          type="button"
          onClick={() => setStatusMessage('Top camera view')}
          className="rounded-lg px-2 py-1 text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
        >
          Top
        </button>
      </div>
    </div>
  );
}
