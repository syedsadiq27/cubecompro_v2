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
        <p>Load a product revision for visual projection.</p>
        {loadError ? (
          <p className="text-center text-red-600 font-mono text-[10px]">
            {loadError}
          </p>
        ) : null}
      </div>
    );
  }

  const boundChoiceKeys = new Set(
    (visualDocument?.bindings ?? []).map((binding) => binding.choiceKey)
  );
  const choices = [...graphDetail.choices].sort(
    (a, b) => a.sortOrder - b.sortOrder
  );

  return (
    <div className="flex h-full flex-col select-none">
      <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-3 text-[12px]">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[10px] font-mono font-bold text-[var(--text-muted)] uppercase tracking-wider">
            Visual projection
          </p>
          <StatusBadge role="draft" label="DEBUGGER" />
        </div>

        <p className="text-[11px] text-[var(--text-muted)]">
          Mapping debugger only — not Configurator Preview. Constraints are not
          applied here. Unbound Choices still update Selection; they do not
          change the scene.
        </p>

        {loadError ? (
          <div className="rounded-lg border border-red-500/40 bg-red-50/40 p-2 text-[10px] font-mono text-red-700">
            {loadError}
          </div>
        ) : null}

        {choices.map((choice) => {
          const selected = visualSelection[choice.key];
          const hasVisual = boundChoiceKeys.has(choice.key);
          return (
            <div key={choice.id} className="space-y-2">
              <div className="flex items-baseline justify-between gap-2">
                <div className="text-[12px] font-semibold text-[var(--ink)]">
                  {choice.name}
                </div>
                <div className="font-mono text-[10px] text-[var(--text-muted)]">
                  {hasVisual ? 'visual' : 'no visual binding'}
                </div>
              </div>
              <div
                className="space-y-1"
                role="radiogroup"
                aria-label={choice.name}
              >
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
                          `Selection.${choice.key} = "${value.key}"`
                        );
                      }}
                      className={`flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-left text-[12px] ${
                        active
                          ? 'font-semibold text-[var(--ink)]'
                          : 'text-[var(--text-secondary)] hover:text-[var(--ink)]'
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
                      {value.name}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}

        <pre className="rounded border border-[var(--line)] bg-[var(--canvas)]/50 p-2 font-mono text-[10px] text-[var(--ink)] whitespace-pre-wrap break-all">
          {JSON.stringify(visualSelection, null, 2)}
        </pre>
      </div>

      <div className="border-t border-[var(--line)] p-3">
        <button
          type="button"
          onClick={() => {
            clearVisualSelection();
            setStatusMessage('Selection = {} → baseline');
          }}
          className="w-full rounded border border-[var(--line)] px-3 py-2 text-[11px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)]"
        >
          Clear Selection (baseline)
        </button>
      </div>
    </div>
  );
}
