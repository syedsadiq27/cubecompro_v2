'use client';

import { useEffect, useMemo, useState } from 'react';
import { StatusBadge } from '@repo/ui';
import { useEditorStore } from '@/lib/editor-store';
import type { VisualDocument } from '@/lib/visual';

type PartOption = {
  choiceKey: string;
  choiceName: string;
  partLabel: string;
  meshLabels: string[];
};

function meshLabel(nodePath: string, targetKey: string): string {
  const leaf = nodePath.split('/').filter(Boolean).at(-1);
  return leaf || targetKey;
}

function buildPartOptions(
  document: VisualDocument | null,
  choices: Array<{ key: string; name: string; sortOrder: number }>
): PartOption[] {
  if (!document) return [];
  const choiceMeta = new Map(choices.map((c) => [c.key, c]));
  const byChoice = new Map<string, Set<string>>();

  for (const binding of document.bindings) {
    const target = document.targets.find((t) => t.key === binding.targetKey);
    if (!target) continue;
    const labels = byChoice.get(binding.choiceKey) ?? new Set<string>();
    labels.add(meshLabel(target.nodePath, target.key));
    byChoice.set(binding.choiceKey, labels);
  }

  const preferredLabel = (choiceKey: string, meshes: string[]): string => {
    if (choiceKey === 'frame') return 'Frame';
    if (choiceKey === 'color') return 'Seat';
    if (meshes.includes('Seat')) return 'Seat';
    if (meshes.includes('Frame')) return 'Frame';
    return choiceMeta.get(choiceKey)?.name ?? choiceKey;
  };

  return [...byChoice.entries()]
    .map(([choiceKey, meshes]) => {
      const choice = choiceMeta.get(choiceKey);
      const meshLabels = [...meshes].sort((a, b) => a.localeCompare(b));
      return {
        choiceKey,
        choiceName: choice?.name ?? choiceKey,
        partLabel: preferredLabel(choiceKey, meshLabels),
        meshLabels,
        sortOrder: choice?.sortOrder ?? 0,
      };
    })
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(({ sortOrder: _sortOrder, ...rest }) => rest);
}

export function PreviewPanel() {
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const visualSelection = useEditorStore((state) => state.visualSelection);
  const loadError = useEditorStore((state) => state.loadError);
  const setVisualSelection = useEditorStore((state) => state.setVisualSelection);
  const clearVisualSelection = useEditorStore(
    (state) => state.clearVisualSelection
  );
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  const partOptions = useMemo(
    () => buildPartOptions(visualDocument, graphDetail?.choices ?? []),
    [visualDocument, graphDetail]
  );

  const [activePartKey, setActivePartKey] = useState<string | null>(null);

  useEffect(() => {
    if (partOptions.length === 0) {
      setActivePartKey(null);
      return;
    }
    if (
      !activePartKey ||
      !partOptions.some((part) => part.choiceKey === activePartKey)
    ) {
      setActivePartKey(partOptions[0]!.choiceKey);
    }
  }, [partOptions, activePartKey]);

  if (!graphDetail) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-[12px] text-[var(--text-muted)]">
        <p>Load a product to configure choices.</p>
        {loadError ? (
          <p className="text-center text-red-600 font-mono text-[10px]">
            {loadError}
          </p>
        ) : null}
      </div>
    );
  }

  const activePart =
    partOptions.find((part) => part.choiceKey === activePartKey) ?? null;
  const activeChoice = activePart
    ? graphDetail.choices.find((choice) => choice.key === activePart.choiceKey)
    : null;
  const selectedValue = activePart
    ? visualSelection[activePart.choiceKey]
    : undefined;

  return (
    <div className="flex h-full flex-col select-none">
      <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-3 text-[12px]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Configure part
          </p>
          <StatusBadge role="published" label="LIVE" />
        </div>

        {loadError ? (
          <div className="rounded-lg border border-red-500/40 bg-red-50/40 p-2 text-[10px] font-mono text-red-700">
            {loadError}
          </div>
        ) : null}

        {partOptions.length === 0 ? (
          <p className="text-[var(--text-muted)]">
            No visual bindings on this revision.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-1.5">
              {partOptions.map((part) => {
                const selected = part.choiceKey === activePartKey;
                return (
                  <button
                    key={part.choiceKey}
                    type="button"
                    onClick={() => setActivePartKey(part.choiceKey)}
                    className={`rounded-md border px-2.5 py-2 text-left transition-colors ${
                      selected
                        ? 'border-[var(--ink)] bg-[var(--ink)] text-white'
                        : 'border-[var(--line)] bg-[var(--surface-pure)] text-[var(--ink)] hover:bg-[var(--canvas)]'
                    }`}
                  >
                    <div className="text-[11px] font-semibold">
                      {part.partLabel}
                    </div>
                    <div
                      className={`mt-0.5 text-[10px] font-mono ${
                        selected ? 'text-white/70' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      {part.meshLabels.join(', ')}
                    </div>
                  </button>
                );
              })}
            </div>

            {activePart && activeChoice ? (
              <div className="space-y-2 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-3">
                <div>
                  <div className="text-[12px] font-semibold text-[var(--ink)]">
                    {activePart.partLabel}
                  </div>
                  <div className="text-[10px] text-[var(--text-muted)]">
                    Choice <span className="font-mono">{activePart.choiceKey}</span>
                    {' · '}
                    meshes {activePart.meshLabels.join(', ')}
                  </div>
                </div>

                <div
                  className="space-y-1.5"
                  role="radiogroup"
                  aria-label={activePart.partLabel}
                >
                  {activeChoice.values.map((value) => {
                    const active = selectedValue === value.key;
                    return (
                      <button
                        key={value.id}
                        type="button"
                        role="radio"
                        aria-checked={active}
                        onClick={() => {
                          setVisualSelection(activePart.choiceKey, value.key);
                          setStatusMessage(
                            `${activePart.partLabel}: ${value.name}`
                          );
                        }}
                        className={`flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left text-[11px] transition-colors ${
                          active
                            ? 'border-[var(--ink)] bg-[var(--canvas)] font-semibold text-[var(--ink)]'
                            : 'border-[var(--line)] bg-[var(--canvas)]/40 text-[var(--text-secondary)] hover:bg-[var(--canvas)]'
                        }`}
                      >
                        <span
                          className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                            active
                              ? 'border-[var(--ink)]'
                              : 'border-[var(--line)]'
                          }`}
                          aria-hidden
                        >
                          {active ? (
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--ink)]" />
                          ) : null}
                        </span>
                        <span className="truncate">{value.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </>
        )}
      </div>

      <div className="border-t border-[var(--line)] p-3">
        <button
          type="button"
          onClick={() => {
            clearVisualSelection();
            setStatusMessage('Selection cleared → baseline');
          }}
          className="w-full rounded border border-[var(--line)] bg-[var(--surface-pure)] px-3 py-2 text-[11px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)]"
        >
          Reset to baseline
        </button>
      </div>
    </div>
  );
}
