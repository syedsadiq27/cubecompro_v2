'use client';

import { useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';
import { ChevronDownIcon, SettingsIcon } from '@/components/editor/icons';

export function RenderModePill() {
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const [renderMode, setRenderMode] = useState<
    'shaded' | 'wireframe' | 'material'
  >('shaded');
  const [modeOpen, setModeOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute right-4 top-3.5 z-[4] flex items-center gap-1.5 select-none text-white">
      <div className="pointer-events-auto relative">
        <button
          type="button"
          onClick={() => setModeOpen((open) => !open)}
          className="flex h-8 items-center gap-1.5 rounded-xl border border-white/10 bg-[#121318]/95 px-3 text-[11px] font-medium text-white shadow-2xl backdrop-blur hover:bg-white/10 transition-colors"
        >
          <span className="capitalize">{renderMode}</span>
          <ChevronDownIcon className="text-white/40" />
        </button>

        {modeOpen ? (
          <div className="absolute right-0 top-full z-30 mt-1.5 w-32 space-y-0.5 rounded-xl border border-white/10 bg-[#16171E] p-1 text-[11px] text-white shadow-2xl backdrop-blur">
            {(['shaded', 'wireframe', 'material'] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => {
                  setRenderMode(mode);
                  setModeOpen(false);
                }}
                className={`w-full rounded-lg px-2.5 py-1.5 text-left capitalize transition-colors ${
                  renderMode === mode
                    ? 'bg-[#665CFF] text-white'
                    : 'hover:bg-white/10'
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setStatusMessage('Viewport and environment settings')}
        className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-[#121318]/95 text-white/70 shadow-2xl backdrop-blur hover:bg-white/10 hover:text-white transition-colors"
        title="Viewport Settings"
      >
        <SettingsIcon size="sm" />
      </button>
    </div>
  );
}
