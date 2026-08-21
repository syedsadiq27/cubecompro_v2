import { useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';

export function CameraPresetsBar() {
  const activeWorkspace = useEditorStore((state) => state.activeWorkspace);
  const runtime = useEditorStore((state) => state.runtime);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const [cameraMode, setCameraMode] = useState<'Orbit' | 'Pan' | 'Free'>('Orbit');
  const [orbitDropdownOpen, setOrbitDropdownOpen] = useState(false);

  const isConfigWorkspace =
    activeWorkspace === 'product' ||
    activeWorkspace === 'mappings' ||
    activeWorkspace === 'preview' ||
    activeWorkspace === 'model';

  const bottomClass = isConfigWorkspace ? 'bottom-[108px]' : 'bottom-6';

  return (
    <div
      className={`pointer-events-none absolute inset-x-0 ${bottomClass} z-[4] flex items-center justify-center gap-2 px-4 select-none text-white transition-all duration-200`}
    >
      {/* Orbit mode dropdown */}
      <div className="pointer-events-auto relative">
        <button
          type="button"
          onClick={() => setOrbitDropdownOpen((o) => !o)}
          className="flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-[#121318]/95 px-3 text-[12px] font-medium text-white shadow-2xl backdrop-blur hover:bg-white/10 transition-colors"
          title="Camera Navigation Mode"
        >
          <span>{cameraMode}</span>
          <span className="text-[10px] text-white/40">▾</span>
        </button>

        {orbitDropdownOpen ? (
          <div className="absolute bottom-full mb-1.5 left-0 w-36 rounded-xl border border-white/10 bg-[#16171E] p-1 text-[12px] text-white shadow-2xl backdrop-blur z-30">
            <button
              type="button"
              className={`w-full rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                cameraMode === 'Orbit' ? 'bg-[#665CFF]/20 text-[#9D95FF] font-semibold' : 'hover:bg-white/10'
              }`}
              onClick={() => {
                setCameraMode('Orbit');
                setOrbitDropdownOpen(false);
                setStatusMessage('Camera mode: Orbit');
              }}
            >
              Orbit Camera
            </button>
            <button
              type="button"
              className={`w-full rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                cameraMode === 'Pan' ? 'bg-[#665CFF]/20 text-[#9D95FF] font-semibold' : 'hover:bg-white/10'
              }`}
              onClick={() => {
                setCameraMode('Pan');
                setOrbitDropdownOpen(false);
                setStatusMessage('Camera mode: Pan');
              }}
            >
              Pan Camera
            </button>
            <button
              type="button"
              className={`w-full rounded-lg px-2.5 py-1.5 text-left transition-colors ${
                cameraMode === 'Free' ? 'bg-[#665CFF]/20 text-[#9D95FF] font-semibold' : 'hover:bg-white/10'
              }`}
              onClick={() => {
                setCameraMode('Free');
                setOrbitDropdownOpen(false);
                setStatusMessage('Camera mode: Free fly');
              }}
            >
              Free Fly
            </button>
          </div>
        ) : null}
      </div>

      {/* Zoom / Frame / View Controls Bar */}
      <div className="pointer-events-auto flex items-center gap-1 rounded-xl border border-white/10 bg-[#121318]/95 p-1 shadow-2xl backdrop-blur text-[12px]">
        {/* Recenter target */}
        <button
          type="button"
          onClick={() => {
            runtime?.frameSelection();
            setStatusMessage('Recenter camera');
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          title="Recenter Camera on Scene Target"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="22" y1="12" x2="18" y2="12" />
            <line x1="6" y1="12" x2="2" y2="12" />
            <line x1="12" y1="6" x2="12" y2="2" />
            <line x1="12" y1="22" x2="12" y2="18" />
          </svg>
        </button>

        {/* Zoom out */}
        <button
          type="button"
          onClick={() => {
            runtime?.zoomCamera(-0.25);
            setStatusMessage('Zoomed out');
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors font-medium text-[14px]"
          title="Zoom Out (−)"
        >
          −
        </button>

        {/* Zoom in */}
        <button
          type="button"
          onClick={() => {
            runtime?.zoomCamera(0.2);
            setStatusMessage('Zoomed in');
          }}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors font-medium text-[14px]"
          title="Zoom In (+)"
        >
          +
        </button>

        {/* Frame / Fit */}
        <button
          type="button"
          onClick={() => runtime?.frameSelection()}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          title="Fit 3D Model in Viewport (Home / F)"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3" />
          </svg>
        </button>

        {/* Fullscreen / expand */}
        <button
          type="button"
          onClick={() => setStatusMessage('Toggle stage fullscreen')}
          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition-colors"
          title="Toggle Fullscreen Canvas (F11)"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15 3 21 3 21 9" />
            <polyline points="9 21 3 21 3 15" />
            <line x1="21" y1="3" x2="14" y2="10" />
            <line x1="3" y1="21" x2="10" y2="14" />
          </svg>
        </button>
      </div>
    </div>
  );
}
