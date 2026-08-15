'use client';

import { useMemo } from 'react';
import { DetailRow, InspectorSection, StatusBadge } from '@repo/ui';
import { useEditorStore } from '@/lib/editor-store';
import { evaluateConfiguratorPreview } from '@/lib/visual/configurator-preview';

export function PreviewInspector() {
  const visualSelection = useEditorStore((state) => state.visualSelection);
  const visualDocument = useEditorStore((state) => state.visualDocument);
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const editorDocument = useEditorStore((state) => state.document);

  const preview = useMemo(() => {
    if (!graphDetail) return null;
    return evaluateConfiguratorPreview(
      graphDetail,
      visualSelection,
      visualDocument
    );
  }, [graphDetail, visualSelection, visualDocument]);

  const activeBindings =
    visualDocument?.bindings.filter(
      (binding) => visualSelection[binding.choiceKey] === binding.valueKey
    ) ?? [];

  return (
    <div className="space-y-4 select-none">
      <div>
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-[13px] font-bold text-[var(--ink)]">
            Configurator Preview
          </h3>
          <StatusBadge
            role={
              preview?.layers.validity === 'VALID' ? 'published' : 'danger'
            }
            label={preview?.layers.validity ?? '—'}
          />
        </div>
        <p className="text-[11px] text-[var(--text-muted)]">
          UNMAPPED blocks purchase only — not selection or render.
        </p>
      </div>

      <div>
        <InspectorSection title="Product affinity" />
        <div className="space-y-1.5 text-[11px]">
          <DetailRow
            label="Product"
            value={editorDocument?.productName ?? '—'}
          />
          <DetailRow
            label="Model"
            value={editorDocument?.modelName ?? 'No model'}
          />
        </div>
      </div>

      <div>
        <InspectorSection title="Runtime status" />
        <div className="space-y-1.5 text-[11px]">
          <DetailRow
            label="Configuration"
            value={
              <span className="font-mono">
                {preview
                  ? `${preview.layers.validity} · ${preview.layers.completeness}`
                  : '—'}
              </span>
            }
          />
          <DetailRow
            label="Commerce"
            value={
              <span className="font-mono">
                {preview?.layers.commerce ?? '—'}
              </span>
            }
          />
          <DetailRow
            label="Purchase"
            value={
              <span className="font-mono">
                {preview?.layers.purchase ?? '—'}
              </span>
            }
          />
          <DetailRow
            label="Visual"
            value={
              <span className="font-mono">{preview?.layers.visual ?? '—'}</span>
            }
          />
        </div>
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
            label="Constraints"
            value={
              <span className="font-mono">
                {graphDetail?.constraints.length ?? 0}
              </span>
            }
          />
          <DetailRow
            label="Fired visuals"
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

      {preview && !preview.validation.valid ? (
        <div>
          <InspectorSection title="Validation" />
          <div className="space-y-1 font-mono text-[10px] text-amber-900">
            {preview.issueLabels.map((label) => (
              <div key={label}>{label}</div>
            ))}
          </div>
        </div>
      ) : null}

      <div>
        <InspectorSection title="Fired visual bindings" />
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
