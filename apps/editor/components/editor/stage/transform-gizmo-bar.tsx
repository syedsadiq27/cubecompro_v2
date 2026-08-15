'use client';

import { useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';

export function TransformGizmoBar() {
  const toolMode = useEditorStore((state) => state.toolMode);
  const setToolMode = useEditorStore((state) => state.setToolMode);
  const runtime = useEditorStore((state) => state.runtime);
  const [gridSnapOpen, setGridSnapOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute inset-x-0 top-4 z-[4] flex justify-center px-4">
      <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)]/95 p-1 shadow-sm backdrop-blur">
        {/* Select */}
        <button
          type="button"
          onClick={() => setToolMode('select')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            toolMode === 'select'
              ? 'border border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]'
              : 'text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]'
          }`}
          title="Select (V)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 3l7 18 3-7 7-3L3 3z" />
          </svg>
        </button>

        {/* Move */}
        <button
          type="button"
          onClick={() => setToolMode('translate')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            toolMode === 'translate'
              ? 'border border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]'
              : 'text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]'
          }`}
          title="Move (W)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="5 9 2 12 5 15" />
            <polyline points="9 5 12 2 15 5" />
            <polyline points="15 19 12 22 9 19" />
            <polyline points="19 9 22 12 19 15" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <line x1="12" y1="2" x2="12" y2="22" />
          </svg>
        </button>

        {/* Rotate */}
        <button
          type="button"
          onClick={() => setToolMode('rotate')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            toolMode === 'rotate'
              ? 'border border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]'
              : 'text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]'
          }`}
          title="Rotate (E)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
          </svg>
        </button>

        {/* Scale */}
        <button
          type="button"
          onClick={() => setToolMode('scale')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            toolMode === 'scale'
              ? 'border border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]'
              : 'text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]'
          }`}
          title="Scale (R)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
        </button>

        <div className="mx-1 h-4 w-px bg-[var(--line)]" />

        {/* Frame / Focus */}
        <button
          type="button"
          onClick={() => runtime?.frameSelection()}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
          title="Frame selection (F)"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>

        {/* Grid Snap dropdown */}
        <button
          type="button"
          onClick={() => setGridSnapOpen((o) => !o)}
          className="flex h-8 items-center gap-1 rounded-lg px-2 text-[11px] font-medium text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
          title="Grid & Snapping"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="3" y1="15" x2="21" y2="15" />
            <line x1="9" y1="3" x2="9" y2="21" />
            <line x1="15" y1="3" x2="15" y2="21" />
          </svg>
          <span>▾</span>
        </button>
      </div>
    </div>
  );
}
