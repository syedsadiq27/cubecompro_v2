'use client';

import { useMemo } from 'react';
import { StatusBadge } from '@repo/ui';
import { useEditorStore } from '@/lib/editor-store';
import {
  evaluateConfiguratorPreview,
  isChoiceValueAvailable,
} from '@/lib/visual/configurator-preview';

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

  const preview = useMemo(() => {
    if (!graphDetail) return null;
    return evaluateConfiguratorPreview(graphDetail, visualSelection);
  }, [graphDetail, visualSelection]);

  if (!graphDetail || !preview) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-[12px] text-[var(--text-muted)]">
        <p>Load a product revision for Configurator Preview.</p>
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
            Configurator Preview
          </p>
          <StatusBadge
            role={
              preview.validation.issues.some(
                (issue) => issue.code === 'violated_constraint'
              )
                ? 'danger'
                : preview.validation.valid
                  ? 'published'
                  : 'warning'
            }
            label={
              preview.validation.issues.some(
                (issue) => issue.code === 'violated_constraint'
              )
                ? 'BLOCKED'
                : preview.validation.valid
                  ? 'VALID'
                  : 'INCOMPLETE'
            }
          />
        </div>

        <p className="text-[11px] text-[var(--text-muted)]">
          Selection → validate + availability → visual projection. Same 3D
          preview — not a separate storefront.
        </p>

        {(graphDetail.constraints?.length ?? 0) > 0 ? (
          <div className="rounded-lg border border-[var(--line)] bg-[var(--canvas)]/50 p-2 font-mono text-[10px] text-[var(--text-muted)] space-y-0.5">
            <div className="font-sans text-[11px] font-semibold text-[var(--ink)]">
              Constraints ({graphDetail.constraints.length})
            </div>
            {graphDetail.constraints.map((constraint) => {
              const label = constraint.terms
                .map((term) =>
                  term.choiceKey && term.choiceValueKey
                    ? `${term.choiceKey}=${term.choiceValueKey}`
                    : '?'
                )
                .join(' ∧ ');
              return <div key={constraint.id}>forbid {label}</div>;
            })}
          </div>
        ) : null}

        {loadError ? (
          <div className="rounded-lg border border-red-500/40 bg-red-50/40 p-2 text-[10px] font-mono text-red-700">
            {loadError}
          </div>
        ) : null}

        {!preview.validation.valid ? (
          <div className="rounded-lg border border-amber-500/40 bg-amber-50/40 p-2 text-[10px] font-mono text-amber-900 space-y-0.5">
            {preview.issueLabels.map((label) => (
              <div key={label}>{label}</div>
            ))}
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
                  {choice.required ? (
                    <span className="ml-1 text-[10px] font-normal text-[var(--text-muted)]">
                      required
                    </span>
                  ) : null}
                </div>
                <div className="font-mono text-[10px] text-[var(--text-muted)]">
                  {hasVisual ? 'visual' : 'selection only'}
                </div>
              </div>
              <div
                className="space-y-1"
                role="radiogroup"
                aria-label={choice.name}
              >
                {choice.values.map((value) => {
                  const active = selected === value.key;
                  const available = isChoiceValueAvailable(
                    preview.availability,
                    choice.key,
                    value.key
                  );
                  return (
                    <button
                      key={value.id}
                      type="button"
                      role="radio"
                      aria-checked={active}
                      aria-disabled={!available}
                      disabled={!available}
                      onClick={() => {
                        if (!available) return;
                        setVisualSelection(choice.key, value.key);
                        setStatusMessage(
                          `Selection.${choice.key} = "${value.key}"`
                        );
                      }}
                      className={`flex w-full items-center gap-2 rounded-md px-1 py-1.5 text-left text-[12px] ${
                        !available
                          ? 'cursor-not-allowed text-[var(--text-muted)] opacity-40'
                          : active
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
                      <span className="truncate">{value.name}</span>
                      {!available ? (
                        <span className="ml-auto font-mono text-[10px]">
                          unavailable
                        </span>
                      ) : null}
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
