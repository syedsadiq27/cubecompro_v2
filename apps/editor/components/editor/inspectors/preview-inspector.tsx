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
            Visual Replay
          </h3>
          <StatusBadge
            role="published"
            label={visualDocument ? 'HYDRATED' : 'IDLE'}
          />
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">
          Selection → deriveVisualState → reconcileScene
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
            label="Bindings"
            value={
              <span className="font-mono">
                {activeBindings.length} / {visualDocument?.bindings.length ?? 0}{' '}
                active
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
        <InspectorSection title="Active visual bindings" />
        <div className="space-y-1.5 text-[11px]">
          {activeBindings.length === 0 ? (
            <p className="text-[var(--text-muted)]">
              None — scene should match ObjectAsset baseline.
            </p>
          ) : (
            activeBindings.map((binding) => {
              const target = visualDocument?.targets.find(
                (entry) => entry.key === binding.targetKey
              );
              const summary =
                binding.operation === 'SET_MATERIAL'
                  ? binding.materialAssetId
                  : binding.visible
                    ? 'visible'
                    : 'hidden';
              return (
                <div
                  key={`${binding.choiceKey}:${binding.valueKey}:${binding.targetKey}:${binding.operation}`}
                  className="space-y-0.5 rounded border border-[var(--line)] bg-[var(--canvas)]/50 p-2 font-mono text-[10px] text-[var(--text-secondary)]"
                >
                  <span className="block font-sans font-bold text-[var(--ink)]">
                    {binding.choiceKey} → {binding.valueKey}
                  </span>
                  <span className="text-[var(--text-muted)]">
                    {binding.operation} · {binding.targetKey}
                    {target?.nodePath ? ` · ${target.nodePath}` : ''} ·{' '}
                    {summary}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
