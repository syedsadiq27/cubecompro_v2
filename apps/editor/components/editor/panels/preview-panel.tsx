'use client';

import { StatusBadge } from '@repo/ui';
import { useEditorStore } from '@/lib/editor-store';

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

  const choices = [...graphDetail.choices].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );
  const boundChoiceKeys = new Set(
    (visualDocument?.bindings ?? []).map((binding) => binding.choiceKey)
  );

  return (
    <div className="flex h-full flex-col select-none">
      <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-4 text-[12px]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Selection
          </p>
          <StatusBadge role="published" label="LIVE" />
        </div>

        {loadError ? (
          <div className="rounded-lg border border-red-500/40 bg-red-50/40 p-2 text-[10px] font-mono text-red-700">
            {loadError}
          </div>
        ) : null}

        {choices.map((choice) => {
          const selected = visualSelection[choice.key];
          const drivesVisual = boundChoiceKeys.has(choice.key);
          return (
            <div
              key={choice.id}
              className="space-y-2 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-3"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-[var(--ink)]">
                  {choice.name}
                </span>
                <span className="font-mono text-[10px] text-[var(--text-muted)]">
                  {choice.key}
                  {drivesVisual ? '' : ' · no visual'}
                </span>
              </div>
              <div className="space-y-1.5" role="radiogroup" aria-label={choice.name}>
                {choice.values.map((value) => {
                  const active = selected === value.key;
                  return (
                    <button
                      key={value.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      onClick={() => {
                        setVisualSelection(choice.key, value.key);
                        setStatusMessage(
                          `${choice.key} = ${value.key}`
                        );
                      }}
                      className={`flex w-full items-center gap-2 rounded-md border px-2.5 py-2 text-left text-[11px] transition-colors ${
                        active
                          ? 'border-[var(--brand)] bg-violet-50/30 font-semibold text-[var(--ink)]'
                          : 'border-[var(--line)] bg-[var(--canvas)]/40 text-[var(--text-secondary)] hover:bg-[var(--canvas)]'
                      }`}
                    >
                      <span
                        className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${
                          active
                            ? 'border-[var(--brand)]'
                            : 'border-[var(--line)]'
                        }`}
                        aria-hidden
                      >
                        {active ? (
                          <span className="h-1.5 w-1.5 rounded-full bg-[var(--brand)]" />
                        ) : null}
                      </span>
                      <span className="truncate">{value.name}</span>
                      <span className="ml-auto font-mono text-[10px] text-[var(--text-muted)]">
                        {value.key}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <div className="rounded-lg border border-[var(--line)] bg-[var(--canvas)]/60 p-2.5 font-mono text-[10px] text-[var(--text-muted)]">
          <div className="mb-1 font-sans text-[11px] text-[var(--ink)]">
            Active Selection
          </div>
          <pre className="whitespace-pre-wrap break-all text-[var(--ink)]">
            {JSON.stringify(visualSelection, null, 2)}
          </pre>
        </div>
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
