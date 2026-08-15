'use client';

import { useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';

export function RenderModePill() {
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const [renderMode, setRenderMode] = useState<'shaded' | 'wireframe' | 'material'>('shaded');

  return (
    <div className="pointer-events-none absolute right-4 bottom-10 z-[4] select-none">
      <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)]/95 p-1 shadow-sm backdrop-blur text-[11px]">
        <button
          type="button"
          onClick={() => setRenderMode('shaded')}
          className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
            renderMode === 'shaded'
              ? 'bg-[var(--ink)] text-white'
              : 'text-[var(--text-secondary)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]'
          }`}
        >
          Shaded
        </button>
        <button
          type="button"
          onClick={() => setRenderMode('wireframe')}
          className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
            renderMode === 'wireframe'
              ? 'bg-[var(--ink)] text-white'
              : 'text-[var(--text-secondary)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]'
          }`}
        >
          Wireframe
        </button>
        <button
          type="button"
          onClick={() => setRenderMode('material')}
          className={`rounded-lg px-2.5 py-1 font-medium transition-colors ${
            renderMode === 'material'
              ? 'bg-[var(--ink)] text-white'
              : 'text-[var(--text-secondary)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]'
          }`}
        >
          Material
        </button>
        <button
          type="button"
          onClick={() => setStatusMessage('Lighting rigs & shadow controls')}
          className="rounded-lg px-1.5 py-1 text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
          title="Lighting options"
        >
          ☼ ▾
        </button>
      </div>
    </div>
  );
}
