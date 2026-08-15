'use client';

import { useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';
import { EyeIcon } from '@/components/editor/icons';

export function SceneOutlinerPanel({ showSearch = false }: { showSearch?: boolean }) {
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);
  const editorDocument = useEditorStore((state) => state.document);
  const [search, setSearch] = useState('');
  const [frameExpanded, setFrameExpanded] = useState(true);
  const [seatExpanded, setSeatExpanded] = useState(true);
  const [materialsExpanded, setMaterialsExpanded] = useState(true);
  const [visibleItems, setVisibleItems] = useState<Record<string, boolean>>({
    root: true,
    Chair_Frame: true,
    Front_Leg: true,
    Back_Leg: true,
    Side_Rail: true,
    Seat_Frame: true,
    Chair_Seat: true,
    Seat_Cushion: true,
    Seat_Back: true,
    Walnut_Wood: true,
    Leather_Black: true,
    Leather_White: true,
    Fabric_Gray: true,
  });

  const rootLabel =
    editorDocument?.modelName?.trim() ||
    editorDocument?.productName?.trim() ||
    'No model';

  const toggleVisibility = (key: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setVisibleItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (!editorDocument) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-[12px] text-[var(--text-muted)]">
        <p>No visual model attached to this product revision.</p>
        <p className="text-center text-[11px]">
          Attach a library object from the product 3D tab before authoring
          scene hierarchy.
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between">
      <div className="min-h-0 flex-1 overflow-y-auto p-2.5 text-[12px] space-y-1">
        {showSearch && (
          <div className="pb-1.5">
            <input
              type="text"
              placeholder="Search objects…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-[var(--line)] bg-[var(--canvas)] px-2.5 py-1 text-[11px] text-[var(--ink)] outline-none focus:border-[var(--brand)]"
            />
          </div>
        )}

        {/* Root Node */}
        <div className="flex items-center justify-between rounded-lg px-2 py-1 font-semibold text-[var(--ink)] bg-[var(--canvas)]/60">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] text-[var(--text-muted)]">⌄</span>
            <span className="font-mono text-[11px]">⬡</span>
            <span className="truncate">{rootLabel}</span>
          </div>
          <span className="rounded bg-violet-100/60 px-1 py-0.2 font-mono text-[9px] font-bold text-[var(--brand)] uppercase">
            Root
          </span>
        </div>

        {/* Subtree 1: Chair_Frame */}
        <div className="pl-2 space-y-0.5">
          <div
            onClick={() => setFrameExpanded(!frameExpanded)}
            className="flex items-center justify-between rounded-md px-1.5 py-1 text-[var(--ink)] hover:bg-[var(--canvas)] cursor-pointer"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] text-[var(--text-muted)]">{frameExpanded ? '⌄' : '›'}</span>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">⬡</span>
              <span className="truncate font-medium">Chair_Frame</span>
            </div>
            <button
              type="button"
              onClick={(e) => toggleVisibility('Chair_Frame', e)}
              className="text-[var(--text-muted)] hover:text-[var(--ink)]"
            >
              <EyeIcon size={14} className={visibleItems.Chair_Frame ? 'text-[var(--ink)]' : 'text-[var(--text-muted)] opacity-40'} />
            </button>
          </div>

          {frameExpanded && (
            <div className="pl-4 space-y-0.5 text-[11px] text-[var(--text-secondary)]">
              {['Front_Leg', 'Back_Leg', 'Side_Rail', 'Seat_Frame'].map((mesh) => (
                <div
                  key={mesh}
                  className="flex items-center justify-between rounded px-1.5 py-0.5 hover:bg-[var(--canvas)] cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">⬡</span>
                    <span className="truncate">{mesh}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => toggleVisibility(mesh, e)}
                    className="text-[var(--text-muted)] hover:text-[var(--ink)]"
                  >
                    <EyeIcon size={13} className={visibleItems[mesh] ? 'text-[var(--ink)]' : 'text-[var(--text-muted)] opacity-40'} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subtree 2: Chair_Seat */}
        <div className="pl-2 space-y-0.5">
          <div
            onClick={() => setSeatExpanded(!seatExpanded)}
            className="flex items-center justify-between rounded-md px-1.5 py-1 text-[var(--ink)] hover:bg-[var(--canvas)] cursor-pointer"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] text-[var(--text-muted)]">{seatExpanded ? '⌄' : '›'}</span>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">⬡</span>
              <span className="truncate font-medium">Chair_Seat</span>
            </div>
            <button
              type="button"
              onClick={(e) => toggleVisibility('Chair_Seat', e)}
              className="text-[var(--text-muted)] hover:text-[var(--ink)]"
            >
              <EyeIcon size={14} className={visibleItems.Chair_Seat ? 'text-[var(--ink)]' : 'text-[var(--text-muted)] opacity-40'} />
            </button>
          </div>

          {seatExpanded && (
            <div className="pl-4 space-y-0.5 text-[11px] text-[var(--text-secondary)]">
              {['Seat_Cushion', 'Seat_Back'].map((mesh) => (
                <div
                  key={mesh}
                  className="flex items-center justify-between rounded px-1.5 py-0.5 hover:bg-[var(--canvas)] cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">⬡</span>
                    <span className="truncate">{mesh}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => toggleVisibility(mesh, e)}
                    className="text-[var(--text-muted)] hover:text-[var(--ink)]"
                  >
                    <EyeIcon size={13} className={visibleItems[mesh] ? 'text-[var(--ink)]' : 'text-[var(--text-muted)] opacity-40'} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Subtree 3: Chair_Materials */}
        <div className="pl-2 space-y-0.5">
          <div
            onClick={() => setMaterialsExpanded(!materialsExpanded)}
            className="flex items-center justify-between rounded-md px-1.5 py-1 text-[var(--ink)] hover:bg-[var(--canvas)] cursor-pointer"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] text-[var(--text-muted)]">{materialsExpanded ? '⌄' : '›'}</span>
              <span className="font-mono text-[11px] text-[var(--text-muted)]">⬡</span>
              <span className="truncate font-medium">Chair_Materials</span>
            </div>
            <button
              type="button"
              onClick={(e) => toggleVisibility('Chair_Materials', e)}
              className="text-[var(--text-muted)] hover:text-[var(--ink)]"
            >
              <EyeIcon size={14} className={visibleItems.Chair_Materials ? 'text-[var(--ink)]' : 'text-[var(--text-muted)] opacity-40'} />
            </button>
          </div>

          {materialsExpanded && (
            <div className="pl-4 space-y-0.5 text-[11px] text-[var(--text-secondary)]">
              {[
                { id: 'Walnut_Wood', label: 'Walnut Wood', color: '#6B4423' },
                { id: 'Leather_Black', label: 'Leather_Black', color: '#1A1A1A' },
                { id: 'Leather_White', label: 'Leather_White', color: '#F0EFEA' },
                { id: 'Fabric_Gray', label: 'Fabric_Gray', color: '#8E8E93' },
              ].map((mat) => (
                <div
                  key={mat.id}
                  className="flex items-center justify-between rounded px-1.5 py-0.5 hover:bg-[var(--canvas)] cursor-pointer"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="h-2.5 w-2.5 rounded-full border border-black/20 shrink-0"
                      style={{ backgroundColor: mat.color }}
                    />
                    <span className="truncate">{mat.label}</span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => toggleVisibility(mat.id, e)}
                    className="text-[var(--text-muted)] hover:text-[var(--ink)]"
                  >
                    <EyeIcon size={13} className={visibleItems[mat.id] ? 'text-[var(--ink)]' : 'text-[var(--text-muted)] opacity-40'} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Drop Zone */}
      <div className="p-3 border-t border-[var(--line)] space-y-2 text-center bg-[var(--surface-pure)]">
        <div className="rounded-xl border border-dashed border-[var(--line)] p-3 space-y-1.5 bg-[var(--canvas)]/30">
          <p className="text-[11px] text-[var(--text-muted)]">Drop GLB / GLTF or</p>
          <button
            type="button"
            onClick={() => setStatusMessage('Opening model upload modal…')}
            className="inline-flex w-full items-center justify-center gap-1 rounded-md border border-[var(--line)] bg-[var(--surface-pure)] py-1 text-[11px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)] shadow-2xs"
          >
            <span>↑ Import model</span>
          </button>
        </div>
        <button
          type="button"
          onClick={() => setStatusMessage('Browsing asset library…')}
          className="text-[11px] font-medium text-[var(--brand)] hover:underline block w-full"
        >
          Browse library
        </button>
      </div>
    </div>
  );
}
