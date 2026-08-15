'use client';

import { StatusBadge } from '@repo/ui';
import { useEditorStore } from '@/lib/editor-store';
import type { VisualBinding } from '@/lib/visual';

function bindingSummary(binding: VisualBinding): string {
  if (binding.operation === 'SET_MATERIAL') {
    return binding.materialAssetId;
  }
  return binding.visible ? 'visible' : 'hidden';
}

function targetNodePath(
  targetKey: string,
  targets: { key: string; nodePath: string }[]
): string {
  return targets.find((t) => t.key === targetKey)?.nodePath ?? targetKey;
}

export function MappingsPanel() {
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const visualSelection = useEditorStore((state) => state.visualSelection);
  const setVisualSelection = useEditorStore((state) => state.setVisualSelection);
  const setStatusMessage = useEditorStore((state) => state.setStatusMessage);

  const bindings = visualDocument?.bindings ?? [];
  const targets = visualDocument?.targets ?? [];
  const unsupported = visualDocument?.unsupported ?? [];

  if (!visualDocument) {
    return (
      <div className="flex h-full items-center justify-center p-4 text-[12px] text-[var(--text-muted)]">
        Load a product revision to hydrate visual bindings.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col justify-between select-none">
      <div className="min-h-0 flex-1 overflow-y-auto p-2.5 space-y-3 text-[12px]">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Option &rarr; Scene Bindings ({bindings.length})
          </p>
          <StatusBadge role="published" label="HYDRATED" />
        </div>

        {unsupported.length > 0 && (
          <div className="rounded-lg border border-amber-500/40 bg-amber-50/30 p-2 text-[10px] text-amber-900">
            {unsupported.map((entry) => (
              <div key={entry.effectId}>
                {entry.operation}: {entry.reason}
              </div>
            ))}
          </div>
        )}

        <div className="space-y-1.5 text-[11px]">
          {bindings.length === 0 ? (
            <p className="text-[var(--text-muted)]">
              No SET_MATERIAL / SET_VISIBILITY bindings on this model.
            </p>
          ) : (
            bindings.map((binding) => {
              const active =
                visualSelection[binding.choiceKey] === binding.valueKey;
              const rowKey = `${binding.effectId ?? ''}:${binding.choiceKey}:${binding.valueKey}:${binding.targetKey}:${binding.operation}`;
              return (
                <div
                  key={rowKey}
                  className={`rounded-lg border p-2.5 space-y-1.5 ${
                    active
                      ? 'border-[var(--brand)] bg-violet-50/20'
                      : 'border-[var(--line)] bg-[var(--surface-pure)]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--ink)]">
                      {binding.choiceKey} &rarr; {binding.valueKey}
                    </span>
                    <StatusBadge role="published" label={binding.operation} />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
                    <span>
                      Target: {binding.targetKey} (
                      {targetNodePath(binding.targetKey, targets)})
                    </span>
                    <span>{bindingSummary(binding)}</span>
                  </div>
                  <div className="flex items-center justify-end gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setVisualSelection(binding.choiceKey, binding.valueKey);
                        setStatusMessage(
                          `Replay ${binding.choiceKey}=${binding.valueKey}`
                        );
                      }}
                      className="rounded border border-[var(--line)] bg-[var(--canvas)]/50 px-2 py-0.5 text-[10px] font-medium hover:bg-[var(--canvas)]"
                    >
                      Apply selection
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
