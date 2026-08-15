'use client';

import { useEditorStore } from '@/lib/editor-store';

export function StatusFooter() {
  const editorDocument = useEditorStore((state) => state.document);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  return (
    <footer className="absolute inset-x-0 bottom-0 h-6 border-t border-[var(--line)] bg-[var(--surface-pure)] px-3 text-[11px] text-[var(--text-muted)] flex items-center justify-between z-[5] select-none">
      <div className="flex items-center gap-2">
        <span className="font-mono">
          {editorDocument?.modelName ? `⊘ ${editorDocument.modelName} (Loaded)` : '⊘ studio-chair.glb (Loaded)'}
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
          <span>Auto-save on</span>
        </div>
        <div className="flex items-center gap-1.5 text-amber-700">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-600" />
          <span>1 warning</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="font-mono">WebGL 2.0</span>
          <span>▾</span>
        </div>
        <button
          type="button"
          aria-label="Toggle Fullscreen"
          className="hover:text-[var(--ink)] font-mono"
          onClick={() => setStatusMessage('Fullscreen toggled')}
        >
          ⛶
        </button>
      </div>
    </footer>
  );
}
