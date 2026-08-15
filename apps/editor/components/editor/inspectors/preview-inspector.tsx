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

  const byPart = new Map<string, typeof activeBindings>();
  for (const binding of activeBindings) {
    const target = visualDocument?.targets.find(
      (entry) => entry.key === binding.targetKey
    );
    const part =
      target?.nodePath.split('/').filter(Boolean).at(-1) ?? binding.targetKey;
    const list = byPart.get(part) ?? [];
    list.push(binding);
    byPart.set(part, list);
  }

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
          Pick Frame or Seat in Preview, then a value.
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
            label="Active meshes"
            value={
              <span className="font-mono">
                {byPart.size} / {visualDocument?.targets.length ?? 0}
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
        <InspectorSection title="Meshes changing" />
        <div className="space-y-1.5 text-[11px]">
          {byPart.size === 0 ? (
            <p className="text-[var(--text-muted)]">
              None — scene matches ObjectAsset baseline.
            </p>
          ) : (
            [...byPart.entries()].map(([part, bindings]) => {
              const sample = bindings[0]!;
              const summary =
                sample.operation === 'SET_MATERIAL'
                  ? sample.materialAssetId.slice(0, 10) + '…'
                  : sample.visible
                    ? 'visible'
                    : 'hidden';
              return (
                <div
                  key={part}
                  className="space-y-0.5 rounded border border-[var(--line)] bg-[var(--canvas)]/50 p-2 text-[10px] text-[var(--text-secondary)]"
                >
                  <span className="block font-sans font-bold text-[var(--ink)]">
                    {part}
                  </span>
                  <span className="font-mono text-[var(--text-muted)]">
                    {sample.choiceKey}={sample.valueKey} · {sample.operation} ·{' '}
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
