'use client';

import { useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';

export function OrientationWidget() {
  const projection = useEditorStore((state) => state.cameraConfig.projection);
  const updateCameraConfig = useEditorStore(
    (state) => state.updateCameraConfig
  );
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const label = projection === 'ORTHOGRAPHIC' ? 'Ortho' : 'Persp';

  return (
    <div className="pointer-events-none absolute right-4 top-3.5 z-[4] flex flex-col items-center gap-2 select-none">
      <div className="pointer-events-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/95 border border-stone-200/90 shadow-md backdrop-blur transition-transform hover:scale-105 cursor-pointer">
        <div className="relative h-8 w-8 flex items-center justify-center">
          <span
            className="absolute top-0 h-4 w-1 rounded-full bg-emerald-500 shadow-xs"
            title="Y-axis"
          />
          <span
            className="absolute bottom-1 right-0 h-1 w-4 rounded-full bg-blue-500 shadow-xs"
            title="Z-axis"
          />
          <span
            className="absolute bottom-1 left-0 h-1 w-4 rounded-full bg-red-500 shadow-xs"
            title="X-axis"
          />
          <span className="relative z-10 h-3 w-3 rounded-full bg-white border border-stone-300 shadow-xs" />
        </div>
      </div>

      <div className="pointer-events-auto relative">
        <button
          type="button"
          onClick={() => setDropdownOpen((o) => !o)}
          className="flex h-7 items-center gap-1.5 rounded-full border border-stone-200/90 bg-white/95 px-3 text-[11px] font-medium text-stone-700 shadow-md backdrop-blur hover:bg-stone-50 hover:text-stone-900 transition-colors"
        >
          <span>{label}</span>
          <span className="text-[9px] text-stone-400">▾</span>
        </button>

        {dropdownOpen ? (
          <div className="absolute right-0 top-full mt-1 w-32 rounded-xl border border-stone-200 bg-white p-1 text-[11px] text-stone-800 shadow-xl">
            <button
              type="button"
              className={`w-full rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                projection === 'PERSPECTIVE'
                  ? 'bg-stone-100 font-semibold text-stone-900'
                  : 'hover:bg-stone-50'
              }`}
              onClick={() => {
                updateCameraConfig({ projection: 'PERSPECTIVE' });
                setDropdownOpen(false);
                setStatusMessage('Switched to Perspective projection');
              }}
            >
              Perspective
            </button>
            <button
              type="button"
              className={`w-full rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                projection === 'ORTHOGRAPHIC'
                  ? 'bg-stone-100 font-semibold text-stone-900'
                  : 'hover:bg-stone-50'
              }`}
              onClick={() => {
                updateCameraConfig({ projection: 'ORTHOGRAPHIC' });
                setDropdownOpen(false);
                setStatusMessage('Switched to Orthographic projection');
              }}
            >
              Orthographic
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
