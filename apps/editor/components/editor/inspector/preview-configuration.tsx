'use client';

import { useEffect } from 'react';
import { applyPreviewConfiguration } from '@/lib/preview-configuration';
import { useEditorStore } from '@/lib/editor-store';
import { FieldLabel } from './fields';

export function PreviewConfigurationSection() {
  const graphDetail = useEditorStore((state) => state.graphDetail);
  const runtime = useEditorStore((state) => state.runtime);
  const previewSelections = useEditorStore((state) => state.previewSelections);
  const setPreviewSelection = useEditorStore(
    (state) => state.setPreviewSelection
  );
  const resetPreviewSelections = useEditorStore(
    (state) => state.resetPreviewSelections
  );

  useEffect(() => {
    if (!graphDetail || !runtime) return;
    if (Object.keys(previewSelections).length === 0) return;
    applyPreviewConfiguration(
      runtime.productRoot,
      graphDetail,
      previewSelections
    );
    useEditorStore.setState((state) => ({
      outlineRevision: state.outlineRevision + 1,
    }));
  }, [graphDetail, runtime, previewSelections]);

  if (!graphDetail) return null;

  const mappedAttributes = graphDetail.attributes.filter((attribute) =>
    attribute.values.some((value) =>
      graphDetail.visualEffects.some(
        (effect) => effect.attributeValueId === value.id
      )
    )
  );

  const attributes =
    mappedAttributes.length > 0 ? mappedAttributes : graphDetail.attributes;

  return (
    <div className="space-y-3 border-t border-[var(--line)] pt-3">
      <FieldLabel>Preview configuration</FieldLabel>
      {attributes.length === 0 ? (
        <p className="text-[12px] text-[var(--text-muted)]">
          No product options yet. Add options on the product page.
        </p>
      ) : (
        <div className="space-y-2">
          {attributes.map((attribute) => (
            <label key={attribute.id} className="block">
              <span className="mb-1 block text-[11px] text-[var(--text-muted)]">
                {attribute.name}
              </span>
              <select
                value={previewSelections[attribute.id] ?? ''}
                onChange={(event) =>
                  setPreviewSelection(attribute.id, event.target.value)
                }
                className="w-full rounded-md border border-[var(--line)] px-2 py-1.5 text-[12px]"
              >
                {attribute.values.map((value) => (
                  <option key={value.id} value={value.id}>
                    {value.name}
                  </option>
                ))}
              </select>
            </label>
          ))}
          <button
            type="button"
            onClick={() => resetPreviewSelections()}
            className="w-full rounded-md px-2 py-1.5 text-left text-[12px] text-[var(--text-muted)] hover:bg-black/[0.03] hover:text-[var(--ink)]"
          >
            Reset
          </button>
        </div>
      )}
    </div>
  );
}
