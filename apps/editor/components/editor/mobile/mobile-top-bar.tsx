'use client';

import { useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';
import {
  ArrowLeftIcon,
  ChevronDownIcon,
  MenuIcon,
  SettingsIcon,
} from '@/components/editor/icons';

export function MobileTopBar({
  onBack,
  hasBack,
}: {
  onBack?: () => void;
  hasBack?: boolean;
}) {
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const [renderMode, setRenderMode] = useState<
    'shaded' | 'wireframe' | 'material'
  >('shaded');
  const [modeOpen, setModeOpen] = useState(false);

  return (
    <header className="pointer-events-auto absolute inset-x-0 top-0 z-20 flex h-12 items-center justify-between px-3 select-none text-white bg-gradient-to-b from-[#0E0F12]/90 via-[#0E0F12]/60 to-transparent backdrop-blur-xs">
      <div className="flex items-center gap-2">
        {hasBack ? (
          <button
            type="button"
            onClick={onBack}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#14151B]/90 text-white shadow-md backdrop-blur hover:bg-white/10 transition-colors"
            aria-label="Back"
          >
            <ArrowLeftIcon size="md" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setStatusMessage('Product navigation')}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#14151B]/90 text-white shadow-md backdrop-blur hover:bg-white/10 transition-colors"
            aria-label="Menu"
          >
            <MenuIcon size="md" />
          </button>
        )}
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => setModeOpen((open) => !open)}
          className="flex h-8 items-center gap-1.5 rounded-xl border border-white/10 bg-[#14151B]/90 px-3 text-[11px] font-medium text-white shadow-md backdrop-blur hover:bg-white/10 transition-colors"
        >
          <span className="capitalize">{renderMode}</span>
          <ChevronDownIcon className="text-white/40" />
        </button>

        {modeOpen ? (
          <div className="absolute left-1/2 top-full z-30 mt-1.5 w-32 -translate-x-1/2 space-y-0.5 rounded-xl border border-white/10 bg-[#16171E] p-1 text-[11px] text-white shadow-2xl backdrop-blur">
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
        onClick={() =>
          setStatusMessage('Environment and lighting options')
        }
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#14151B]/90 text-white/80 shadow-md backdrop-blur hover:bg-white/10 hover:text-white transition-colors"
        title="Settings"
        aria-label="Settings"
      >
        <SettingsIcon size="md" />
      </button>
    </header>
  );
}
