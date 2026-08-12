'use client';

import { useEditorStore, type ToolMode } from '@/lib/editor-store';

const TOOLS: Array<{ id: ToolMode; label: string; hint: string }> = [
  { id: 'select', label: 'Select', hint: 'V' },
  { id: 'translate', label: 'Move', hint: 'W' },
  { id: 'rotate', label: 'Rotate', hint: 'E' },
  { id: 'scale', label: 'Scale', hint: 'R' },
];

export function ViewportToolbar() {
  const toolMode = useEditorStore((state) => state.toolMode);
  const setToolMode = useEditorStore((state) => state.setToolMode);
  const runtime = useEditorStore((state) => state.runtime);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[4] flex justify-center px-4">
      <div className="pointer-events-auto flex flex-wrap items-center justify-center gap-1 rounded-[12px] border border-[var(--line)] bg-[var(--surface-pure)]/95 p-1 shadow-sm backdrop-blur">
        {TOOLS.map((tool) => {
          const active = toolMode === tool.id;
          return (
            <button
              key={tool.id}
              type="button"
              onClick={() => setToolMode(tool.id)}
              className={`rounded-[8px] px-2.5 py-1.5 text-[12px] ${
                active
                  ? 'bg-[var(--ink)] font-medium text-white'
                  : 'text-[var(--text-muted)] hover:bg-black/[0.04] hover:text-[var(--ink)]'
              }`}
              title={`${tool.label} (${tool.hint})`}
            >
              {tool.label}
              <span className="ml-1 opacity-60">{tool.hint}</span>
            </button>
          );
        })}
        <div className="mx-1 h-4 w-px bg-[var(--line)]" />
        <button
          type="button"
          onClick={() => runtime?.frameSelection()}
          className="rounded-[8px] px-2.5 py-1.5 text-[12px] text-[var(--text-muted)] hover:bg-black/[0.04] hover:text-[var(--ink)]"
          title="Frame selection (F)"
        >
          Frame F
        </button>
        <button
          type="button"
          onClick={() => setStatusMessage('Camera presets land next.')}
          className="rounded-[8px] px-2.5 py-1.5 text-[12px] text-[var(--text-muted)] hover:bg-black/[0.04] hover:text-[var(--ink)]"
        >
          Front
        </button>
        <button
          type="button"
          onClick={() => setStatusMessage('Camera presets land next.')}
          className="rounded-[8px] px-2.5 py-1.5 text-[12px] text-[var(--text-muted)] hover:bg-black/[0.04] hover:text-[var(--ink)]"
        >
          Side
        </button>
        <button
          type="button"
          onClick={() => setStatusMessage('Camera presets land next.')}
          className="rounded-[8px] px-2.5 py-1.5 text-[12px] text-[var(--text-muted)] hover:bg-black/[0.04] hover:text-[var(--ink)]"
        >
          Top
        </button>
      </div>
    </div>
  );
}
