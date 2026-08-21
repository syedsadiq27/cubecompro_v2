'use client';

import { useMemo, useState } from 'react';
import { ChoiceValueSelect } from '@/components/editor/choice-value-select';
import { useEditorStore } from '@/lib/editor-store';
import { evaluateConfiguratorPreview } from '@/lib/visual/configurator-preview';

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
  const [pendingSelection, setPendingSelection] = useState<
    Record<string, string>
  >({});

  const effectiveSelection = useMemo(() => {
    if (!graphDetail) return {};
    const result: Record<string, string> = {};
    for (const choice of graphDetail.choices) {
      result[choice.key] =
        pendingSelection[choice.key] ||
        visualSelection[choice.key] ||
        choice.values[0]?.key ||
        '';
    }
    return result;
  }, [graphDetail, pendingSelection, visualSelection]);

  const preview = useMemo(() => {
    if (!graphDetail) return null;
    return evaluateConfiguratorPreview(
      graphDetail,
      effectiveSelection,
      visualDocument
    );
  }, [graphDetail, effectiveSelection, visualDocument]);

  const hideForCamera =
    activeWorkspace === 'cameras' || (activeWorkspace as string) === 'camera';

  if (!graphDetail || hideForCamera) return null;

  const choices = [...graphDetail.choices].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  const applyChoice = (choiceKey: string, valueKey: string) => {
    if (autoApply) {
      setVisualSelection(choiceKey, valueKey);
      setPendingSelection((prev) => {
        if (!(choiceKey in prev)) return prev;
        const next = { ...prev };
        delete next[choiceKey];
        return next;
      });
      return;
    }
    setPendingSelection((prev) => ({ ...prev, [choiceKey]: valueKey }));
  };

  const applyPending = () => {
    for (const [choiceKey, valueKey] of Object.entries(pendingSelection)) {
      setVisualSelection(choiceKey, valueKey);
    }
    setPendingSelection({});
    setStatusMessage('Applied live selection to scene');
  };

  const pendingCount = Object.keys(pendingSelection).length;

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
        <div className="flex flex-wrap items-end gap-x-4 gap-y-2">
          <div className="flex h-8 items-center gap-1.5 shrink-0">
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
              LIVE SELECTION
            </span>
          </div>

          {choices.map((choice) => {
            const selectedKey =
              effectiveSelection[choice.key] || choice.values[0]?.key || '';
            const values = [...choice.values].sort(
              (a, b) => a.sortOrder - b.sortOrder
            );

            return (
              <ChoiceValueSelect
                key={choice.id}
                label={choice.name}
                value={selectedKey}
                compact
                className="w-[150px]"
                options={values.map((value) => ({
                  key: value.key,
                  name: value.name,
                }))}
                onChange={(next) => applyChoice(choice.key, next)}
              />
            );
          })}

          <div
            className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-bold tracking-wide ${
              preview?.layers.validity === 'VALID'
                ? 'border border-emerald-500/40 bg-[#0D2418] text-emerald-400'
                : 'border border-red-800/60 bg-red-950/80 text-red-400'
            }`}
          >
            {preview?.layers.validity === 'VALID' ? '✓' : '·'}
            <span>{preview?.layers.validity || 'VALID'}</span>
          </div>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-2.5 border-t border-white/5 pt-1.5 text-[11px]">
          <span className="font-medium text-white/60">Auto-apply</span>
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={autoApply}
              onChange={(event) => setAutoApply(event.target.checked)}
              className="peer sr-only"
            />
            <div className="h-3.5 w-7 rounded-full bg-white/20 after:absolute after:left-[1.5px] after:top-[1.5px] after:h-2.5 after:w-2.5 after:rounded-full after:bg-white after:transition-all peer-checked:bg-[#665CFF] peer-checked:after:translate-x-full" />
          </label>
          <span className="text-white/40">
            {autoApply
              ? 'Changes update the 3D view automatically.'
              : 'Changes stay pending until you apply.'}
          </span>
          {!autoApply && pendingCount > 0 ? (
            <button
              type="button"
              onClick={applyPending}
              className="ml-auto rounded-lg bg-[#665CFF] px-2.5 py-1 text-[11px] font-medium text-white"
            >
              Apply ({pendingCount})
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
