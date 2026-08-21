'use client';

import { useMemo } from 'react';
import { useEditorStore } from '@/lib/editor-store';
import { evaluateConfiguratorPreview } from '@/lib/visual/configurator-preview';

export function PreviewInspector() {
  const visualSelection = useEditorStore((state) => state.selection);
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
    <div className="space-y-4 select-none text-white">
      <div>
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-[13px] font-bold text-white">
            Configurator Preview
          </h3>
          <span
            className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] font-bold tracking-wide ${
              preview?.layers.validity === 'VALID'
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/60'
                : 'bg-red-950/80 text-red-400 border border-red-800/60'
            }`}
          >
            {preview?.layers.validity ?? '—'}
          </span>
        </div>
        <p className="text-[11px] text-white/50">
          UNMAPPED blocks purchase only — not selection or render.
        </p>
      </div>

      <div className="space-y-2">
        <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
          Product affinity
        </h4>
        <div className="space-y-1.5 text-[11px] rounded-xl border border-white/10 bg-[#181920] p-3">
          <div className="flex justify-between">
            <span className="text-white/50">Product</span>
            <span className="font-medium text-white">{editorDocument?.productName ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Model</span>
            <span className="font-medium text-white">{editorDocument?.modelName ?? 'No model'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
          Runtime status
        </h4>
        <div className="space-y-1.5 text-[11px] rounded-xl border border-white/10 bg-[#181920] p-3">
          <div className="flex justify-between">
            <span className="text-white/50">Configuration</span>
            <span className="font-mono text-white">
              {preview
                ? `${preview.layers.validity} · ${preview.layers.completeness}`
                : '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Commerce</span>
            <span className="font-mono text-white">{preview?.layers.commerce ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Purchase</span>
            <span className="font-mono text-white">{preview?.layers.purchase ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Visual</span>
            <span className="font-mono text-white">{preview?.layers.visual ?? '—'}</span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
          Revision
        </h4>
        <div className="space-y-1.5 text-[11px] rounded-xl border border-white/10 bg-[#181920] p-3">
          <div className="flex justify-between">
            <span className="text-white/50">ProductRevision</span>
            <span className="font-mono text-white">
              {graphDetail?.id?.slice(0, 8) ?? '—'}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Constraints</span>
            <span className="font-mono text-white">
              {graphDetail?.constraints.length ?? 0}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-white/50">Fired visuals</span>
            <span className="font-mono text-white">
              {activeBindings.length} / {visualDocument?.bindings.length ?? 0}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
          Selection
        </h4>
        <pre className="rounded-xl border border-white/10 bg-[#181920] p-3 font-mono text-[10px] text-white/80 whitespace-pre-wrap break-all">
          {JSON.stringify(visualSelection, null, 2)}
        </pre>
      </div>

      {preview && !preview.validation.valid ? (
        <div className="space-y-2">
          <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-amber-400/80">
            Validation
          </h4>
          <div className="space-y-1 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 font-mono text-[10px] text-amber-300">
            {preview.issueLabels.map((label) => (
              <div key={label}>{label}</div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="space-y-2">
        <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-white/50">
          Fired visual bindings
        </h4>
        <div className="space-y-1.5 text-[11px]">
          {activeBindings.length === 0 ? (
            <p className="text-white/40">
              None — reconcile restores baseline.
            </p>
          ) : (
            activeBindings.map((binding) => (
              <div
                key={`${binding.choiceKey}:${binding.valueKey}:${binding.targetKey}:${binding.operation}`}
                className="rounded-xl border border-white/10 bg-[#181920] p-3 font-mono text-[10px] text-white/70"
              >
                <span className="font-sans font-bold text-white">
                  {binding.choiceKey}={binding.valueKey}
                </span>
                <div className="text-white/40 mt-0.5">
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
