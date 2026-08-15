'use client';

import { DetailRow, InspectorSection, StatusBadge } from '@repo/ui';
import { useEditorStore } from '@/lib/editor-store';

export function ObjectInspector() {
  const selected = useEditorStore((state) => state.selected);
  const editorDocument = useEditorStore((state) => state.document);
  const parentLabel =
    editorDocument?.modelName?.trim() ||
    editorDocument?.productName?.trim() ||
    'No model';

  return (
    <div className="space-y-4">
      <div>
        <div className="flex items-center justify-between pb-1">
          <h3 className="text-[13px] font-semibold text-[var(--ink)]">
            {selected?.name || 'Mesh'}
          </h3>
          <StatusBadge role="published" label="MESH" />
        </div>
        <p className="text-[11px] font-mono text-[var(--text-muted)]">
          Parent: {parentLabel}
        </p>
      </div>

      <div>
        <InspectorSection title="Transform" />
        <div className="space-y-2 font-mono text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-muted)] font-sans">Position</span>
            <div className="flex gap-1 text-[var(--ink)]">
              <span className="rounded bg-[var(--canvas)] px-1.5 py-0.5 border">0.00</span>
              <span className="rounded bg-[var(--canvas)] px-1.5 py-0.5 border">0.42</span>
              <span className="rounded bg-[var(--canvas)] px-1.5 py-0.5 border">0.00</span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-muted)] font-sans">Scale</span>
            <div className="flex gap-1 text-[var(--ink)]">
              <span className="rounded bg-[var(--canvas)] px-1.5 py-0.5 border">1.00</span>
              <span className="rounded bg-[var(--canvas)] px-1.5 py-0.5 border">1.00</span>
              <span className="rounded bg-[var(--canvas)] px-1.5 py-0.5 border">1.00</span>
            </div>
          </div>
        </div>
      </div>

      <div>
        <InspectorSection title="Appearance" />
        <div className="space-y-1.5 text-[12px]">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[var(--text-secondary)]">Visible in Scene</span>
            <input type="checkbox" defaultChecked className="accent-[var(--brand)]" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[var(--text-secondary)]">Cast Shadow</span>
            <input type="checkbox" defaultChecked className="accent-[var(--brand)]" />
          </label>
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-[var(--text-secondary)]">Receive Shadow</span>
            <input type="checkbox" defaultChecked className="accent-[var(--brand)]" />
          </label>
        </div>
      </div>

      <div>
        <InspectorSection title="Configuration Binding" />
        <div className="rounded-lg bg-[var(--canvas)] p-2.5 space-y-1 text-[11px]">
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Bound Option</span>
            <span className="font-semibold text-[var(--ink)]">Frame &rarr; Walnut</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--text-muted)]">Material</span>
            <span className="font-medium text-[var(--brand)]">Walnut Wood (PBR)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
