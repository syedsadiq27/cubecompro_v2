'use client';

import { useMemo, useState } from 'react';
import { useEditorStore } from '@/lib/editor-store';
import { evaluateConfiguratorPreview } from '@/lib/visual/configurator-preview';

function getSwatchGradient(choiceKey: string, valueKey: string, name: string): string {
  const lower = (choiceKey + ' ' + valueKey + ' ' + name).toLowerCase();
  if (lower.includes('walnut')) {
    return 'radial-gradient(circle at 35% 35%, #8A6040, #5C3D24 60%, #2B1B10 100%)';
  }
  if (lower.includes('oak')) {
    return 'radial-gradient(circle at 35% 35%, #C8A265, #A47F46 60%, #634823 100%)';
  }
  if (lower.includes('marble')) {
    return 'radial-gradient(circle at 35% 35%, #F8FAFC, #E2E8F0 60%, #94A3B8 100%)';
  }
  if (lower.includes('black')) {
    return 'radial-gradient(circle at 35% 35%, #4B4B52, #232328 60%, #0C0C0E 100%)';
  }
  if (lower.includes('brass') || lower.includes('gold')) {
    return 'radial-gradient(circle at 35% 35%, #FFE082, #D4AF37 60%, #7A5B0B 100%)';
  }
  if (lower.includes('chrome') || lower.includes('steel')) {
    return 'radial-gradient(circle at 35% 35%, #FFFFFF, #CBD5E1 60%, #64748B 100%)';
  }
  return 'radial-gradient(circle at 35% 35%, #A1A1AA, #52525B 60%, #27272A 100%)';
}

export function PreviewSelectionBar() {
  const activeWorkspace = useEditorStore((state) => state.activeWorkspace);
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const visualSelection = useEditorStore((state) => state.selection);
  const setVisualSelection = useEditorStore((state) => state.setVisualSelection);
  const pickMode = useEditorStore((state) => state.pickMode);
  const cancelTargetPick = useEditorStore((state) => state.cancelTargetPick);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  const [autoApply, setAutoApply] = useState(true);

  // Compute effective selection with fallback to first value for complete validity
  const effectiveSelection = useMemo(() => {
    if (!graphDetail) return {};
    const result: Record<string, string> = {};
    for (const choice of graphDetail.choices) {
      result[choice.key] =
        visualSelection[choice.key] || choice.values[0]?.key || '';
    }
    return result;
  }, [graphDetail, visualSelection]);

  const preview = useMemo(() => {
    if (!graphDetail) return null;
    return evaluateConfiguratorPreview(
      graphDetail,
      effectiveSelection,
      visualDocument
    );
  }, [graphDetail, effectiveSelection, visualDocument]);

  const isConfigWorkspace =
    activeWorkspace === 'product' ||
    activeWorkspace === 'mappings' ||
    activeWorkspace === 'preview' ||
    activeWorkspace === 'model';

  // Only render in Config / Preview workspaces
  if (!graphDetail || !isConfigWorkspace) return null;

  const choices = [...graphDetail.choices].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[7]">
      {pickMode ? (
        <div className="pointer-events-auto mx-4 mb-2 flex items-center justify-between gap-2 rounded-xl border border-[#665CFF] bg-[#16171E] px-4 py-2.5 text-[12px] text-white shadow-xl">
          <span className="font-medium text-[#8F87FF]">
            Pick mode · {pickMode.operation} — click a scene object to bind
          </span>
          <button
            type="button"
            className="text-[11px] font-medium text-white/60 hover:text-white transition-colors"
            onClick={() => cancelTargetPick()}
          >
            Cancel
          </button>
        </div>
      ) : null}

      <div className="pointer-events-auto border-t border-white/10 bg-[#121318] px-5 py-2.5 text-white select-none shadow-2xl">
        <div className="flex flex-wrap items-center gap-6">
          {/* Header Title with collapse caret */}
          <div className="flex items-center gap-1.5 self-center shrink-0">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
              PREVIEW SELECTION
            </span>
            <button
              type="button"
              onClick={() => setStatusMessage('Interactive customizer preview state')}
              className="text-white/40 hover:text-white transition-colors text-[11px]"
              title="Information"
            >
              ⓘ
            </button>
            <button
              type="button"
              className="text-white/40 hover:text-white transition-colors text-[11px] ml-0.5"
              title="Collapse/expand"
            >
              ⌃
            </button>
          </div>

          {/* Choice Dropdown Columns */}
          <div className="flex flex-wrap items-center gap-4">
            {choices.map((choice) => {
              const selectedKey =
                effectiveSelection[choice.key] || choice.values[0]?.key || '';
              const selectedValue =
                choice.values.find((v) => v.key === selectedKey) ||
                choice.values[0];

              const swatchGradient = getSwatchGradient(
                choice.key,
                selectedValue?.key || '',
                selectedValue?.name || ''
              );

              return (
                <div key={choice.id} className="space-y-1">
                  <span className="block text-[10px] text-white/40 font-medium leading-none">
                    {choice.name}
                  </span>
                  <div className="relative">
                    <div className="flex h-8 items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#181920] px-3 py-1 shadow-sm min-w-[130px] cursor-pointer hover:border-white/20 transition-colors">
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className="h-3.5 w-3.5 shrink-0 rounded-full shadow-inner border border-white/25"
                          style={{ background: swatchGradient }}
                        />
                        <span className="truncate text-[12px] font-medium text-white">
                          {selectedValue?.name || 'Select'}
                        </span>
                      </div>
                      <span className="text-[10px] text-white/40">▾</span>
                    </div>

                    <select
                      value={selectedKey}
                      onChange={(event) => {
                        const next = event.target.value;
                        if (!next) return;
                        setVisualSelection(choice.key, next);
                      }}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    >
                      {choice.values.map((value) => (
                        <option
                          key={value.id}
                          value={value.key}
                          className="bg-[#181920] text-white"
                        >
                          {value.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              );
            })}

            {/* Validity Badge */}
            <div className="self-end pb-0.5">
              <div
                className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-bold tracking-wide shadow-xs ${
                  preview?.layers.validity === 'VALID'
                    ? 'bg-[#0D2418] text-emerald-400 border border-emerald-500/40'
                    : 'bg-red-950/80 text-red-400 border border-red-800/60'
                }`}
              >
                {preview?.layers.validity === 'VALID' ? (
                  <span>✓</span>
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                )}
                <span>{preview?.layers.validity || 'VALID'}</span>
                <span className="text-[9px] text-emerald-400/60 ml-0.5">▾</span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-row: Auto-apply toggle */}
        <div className="flex items-center gap-2.5 pt-1.5 border-t border-white/5 mt-2 text-[11px]">
          <span className="text-white/60 font-medium">Auto-apply</span>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={autoApply}
              onChange={(e) => setAutoApply(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-7 h-3.5 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[1.5px] after:left-[1.5px] after:bg-white after:rounded-full after:h-2.5 after:w-2.5 after:transition-all peer-checked:bg-[#665CFF]" />
          </label>
          <span className="text-[11px] text-white/40">
            Changes update the 3D view automatically.
          </span>
        </div>
      </div>
    </div>
  );
}
