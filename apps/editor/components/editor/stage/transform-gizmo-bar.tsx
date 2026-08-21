'use client';

import { useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';
import {
  CameraIcon,
  ChevronDownIcon,
  FocusIcon,
  GridIcon,
  MousePointerIcon,
  MoveIcon,
  RotateIcon,
  ScaleIcon,
} from '@/components/editor/icons';

export function TransformGizmoBar() {
  const toolMode = useEditorStore((state) => state.toolMode);
  const setToolMode = useEditorStore((state) => state.setToolMode);
  const runtime = useEditorStore((state) => state.runtime);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const [gridSnapOpen, setGridSnapOpen] = useState(false);

  return (
    <div className="pointer-events-none absolute left-4 top-3.5 z-[4] flex items-center gap-2">
      <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-white/10 bg-[#121318]/95 p-1 shadow-2xl backdrop-blur select-none text-white">
        <button
          type="button"
          onClick={() => setToolMode('select')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            toolMode === 'select'
              ? 'bg-[#665CFF] text-white shadow-xs'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
          }`}
          title="Select & Inspect Objects (V)"
        >
          <MousePointerIcon size="sm" />
        </button>

        <button
          type="button"
          onClick={() => setToolMode('translate')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            toolMode === 'translate'
              ? 'bg-[#665CFF] text-white shadow-xs'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
          }`}
          title="Move / Translate Object (W)"
        >
          <MoveIcon size="sm" />
        </button>

        <button
          type="button"
          onClick={() => setToolMode('rotate')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            toolMode === 'rotate'
              ? 'bg-[#665CFF] text-white shadow-xs'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
          }`}
          title="Rotate Object (E)"
        >
          <RotateIcon size="sm" />
        </button>

        <button
          type="button"
          onClick={() => setToolMode('scale')}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            toolMode === 'scale'
              ? 'bg-[#665CFF] text-white shadow-xs'
              : 'text-white/60 hover:bg-white/10 hover:text-white'
          }`}
          title="Scale Object (R)"
        >
          <ScaleIcon size="sm" />
        </button>

        <button
          type="button"
          onClick={() => runtime?.frameSelection()}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          title="Frame Selected Object in Viewport (F)"
        >
          <FocusIcon size="sm" />
        </button>

        <button
          type="button"
          onClick={() =>
            setStatusMessage('Capturing high-resolution camera snapshot…')
          }
          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          title="Capture High-Resolution Viewport Snapshot"
        >
          <CameraIcon size="sm" />
        </button>

        <div className="mx-0.5 h-4 w-px bg-white/15" />

        <div className="relative">
          <button
            type="button"
            onClick={() => setGridSnapOpen((open) => !open)}
            className="flex h-8 items-center gap-1 rounded-lg px-2 text-[12px] font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
            title="Ground Grid & Snapping Options"
          >
            <GridIcon size="sm" />
            <ChevronDownIcon className="text-white/40" />
          </button>
          {gridSnapOpen ? (
            <div className="absolute right-0 top-full z-30 mt-1.5 w-44 rounded-xl border border-white/10 bg-[#16171E] p-1 text-[12px] text-white shadow-2xl backdrop-blur">
              <button
                type="button"
                className="w-full rounded-lg px-2.5 py-1.5 text-left hover:bg-white/10 transition-colors"
                onClick={() => {
                  setGridSnapOpen(false);
                  setStatusMessage('Toggle ground grid');
                }}
              >
                Toggle Ground Grid
              </button>
              <button
                type="button"
                className="w-full rounded-lg px-2.5 py-1.5 text-left hover:bg-white/10 transition-colors"
                onClick={() => {
                  setGridSnapOpen(false);
                  setStatusMessage('Snap: 0.1m');
                }}
              >
                Snap Position: 0.1m
              </button>
              <button
                type="button"
                className="w-full rounded-lg px-2.5 py-1.5 text-left hover:bg-white/10 transition-colors"
                onClick={() => {
                  setGridSnapOpen(false);
                  setStatusMessage('Snap: 15°');
                }}
              >
                Snap Rotation: 15°
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
