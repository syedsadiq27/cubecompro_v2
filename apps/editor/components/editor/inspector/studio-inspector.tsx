'use client';

import { useMemo } from 'react';
import {
  createInspectorContext,
  objectLabel,
  readMaterialName,
} from '@/lib/inspector/context';
import { buildNodePath, nodeLabel } from '@/lib/scene-tree';
import { useEditorStore } from '@/lib/editor-store';
import { ObjectConfigurationSection } from './object-configuration';
import { PreviewConfigurationSection } from './preview-configuration';
import { TransformStep } from './steps';
import { FieldLabel, KeyValue } from './fields';

export function StudioInspector() {
  const selected = useEditorStore((state) => state.selected);
  const document = useEditorStore((state) => state.document);
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const runtime = useEditorStore((state) => state.runtime);
  const selectionRevision = useEditorStore((state) => state.selectionRevision);

  const ctx = useMemo(
    () =>
      createInspectorContext({
        selected,
        document,
        selectionRevision,
      }),
    [selected, document, selectionRevision]
  );

  if (!selected) {
    const mappedAttrs =
      graphDetail?.attributes.filter((attribute) =>
        attribute.values.some((value) =>
          graphDetail.visualEffects.some(
            (effect) => effect.attributeValueId === value.id
          )
        )
      ).length ?? 0;
    const behaviors = graphDetail?.visualEffects.length ?? 0;

    return (
      <aside className="flex h-full w-[300px] shrink-0 flex-col border-l border-[var(--line)] bg-[var(--surface-pure)]">
        <div className="border-b border-[var(--line)] px-3 py-3">
          <p className="type-nav-label">Inspector</p>
          <p className="mt-1 truncate text-[13px] font-medium text-[var(--ink)]">
            {document?.modelName || document?.productName || 'Model'}
          </p>
          <p className="type-meta mt-0.5 truncate">
            {document?.productCode || 'Product'}
          </p>
        </div>
        <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-3">
          <div>
            <FieldLabel>Model</FieldLabel>
            <p className="mt-1 text-[12px] text-[var(--ink)]">
              {document?.modelName || '—'}
            </p>
          </div>
          <KeyValue label="Environment" value="Studio Soft" />
          <KeyValue label="Camera" value="Perspective" />
          <div>
            <FieldLabel>Configuration</FieldLabel>
            <p className="mt-1 text-[12px] text-[var(--ink)]">
              {mappedAttrs} attributes mapped
            </p>
            <p className="text-[12px] text-[var(--ink)]">
              {behaviors} visual behaviors
            </p>
          </div>
          <PreviewConfigurationSection />
        </div>
      </aside>
    );
  }

  const path = runtime
    ? buildNodePath(selected, runtime.productRoot)
    : selected.name;
  const title = nodeLabel(selected);
  const materialName = readMaterialName(selected);

  return (
    <aside className="flex h-full w-[300px] shrink-0 flex-col border-l border-[var(--line)] bg-[var(--surface-pure)]">
      <div className="border-b border-[var(--line)] px-3 py-3">
        <p className="type-nav-label">Inspector</p>
        <p className="mt-1 truncate text-[13px] font-medium text-[var(--ink)]">
          {title}
        </p>
        <p className="type-meta mt-0.5 truncate">{selected.type}</p>
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-3 py-3">
        <div>
          <FieldLabel>Mesh</FieldLabel>
          <p className="mt-1 truncate text-[12px] font-medium text-[var(--ink)]">
            {objectLabel(selected) || selected.name || '—'}
          </p>
          <p className="type-meta mt-0.5 truncate">{path}</p>
        </div>

        <div>
          <FieldLabel>Transform</FieldLabel>
          <div className="mt-2">
            <TransformStep ctx={ctx} />
          </div>
        </div>

        <div>
          <FieldLabel>Material</FieldLabel>
          <p className="mt-1 text-[12px] text-[var(--ink)]">
            {materialName || '—'}
          </p>
        </div>

        <ObjectConfigurationSection
          selectedPath={path}
          selectedName={title}
        />
      </div>
    </aside>
  );
}
