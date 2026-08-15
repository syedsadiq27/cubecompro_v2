'use client';

import { DetailRow, InspectorSection, StatusBadge } from '@repo/ui';
import { useEditorStore } from '@/lib/editor-store';

export function PreviewInspector() {
  const visualSelection = useEditorStore((state) => state.visualSelection);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const graphDetail = useEditorStore((state) => state.graphDetail);

  const activeBindings =
    visualDocument?.bindings.filter(
      (binding) => visualSelection[binding.choiceKey] === binding.valueKey
    ) ?? [];

  return (
    <div className="space-y-4 select-none">
      <div>
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-[13px] font-bold text-[var(--ink)]">
            Engine proof
          </h3>
          <StatusBadge
            role="published"
            label={visualDocument ? 'HYDRATED' : 'IDLE'}
          />
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">
          Selection drives deriveVisualState → reconcileScene
        </p>
      </div>

      <div>
        <InspectorSection title="Revision" />
        <div className="space-y-1.5 text-[11px]">
          <DetailRow
            label="ProductRevision"
            value={
              <span className="font-mono">
                {graphDetail?.id?.slice(0, 8) ?? '—'}
              </span>
            }
          />
          <DetailRow
            label="Active bindings"
            value={
              <span className="font-mono">
                {activeBindings.length} / {visualDocument?.bindings.length ?? 0}
              </span>
            }
          />
        </div>
      </div>

      <div>
        <InspectorSection title="Selection" />
        <pre className="rounded border border-[var(--line)] bg-[var(--canvas)]/50 p-2 font-mono text-[10px] text-[var(--ink)] whitespace-pre-wrap break-all">
          {JSON.stringify(visualSelection, null, 2)}
        </pre>
      </div>

      <div>
        <InspectorSection title="Fired bindings" />
        <div className="space-y-1.5 text-[11px]">
          {activeBindings.length === 0 ? (
            <p className="text-[var(--text-muted)]">
              None — reconcile restores baseline.
            </p>
          ) : (
            activeBindings.map((binding) => (
              <div
                key={`${binding.choiceKey}:${binding.valueKey}:${binding.targetKey}:${binding.operation}`}
                className="rounded border border-[var(--line)] bg-[var(--canvas)]/50 p-2 font-mono text-[10px] text-[var(--text-muted)]"
              >
                <span className="font-sans font-bold text-[var(--ink)]">
                  {binding.choiceKey}={binding.valueKey}
                </span>
                <div>
                  {binding.operation} → {binding.targetKey}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
