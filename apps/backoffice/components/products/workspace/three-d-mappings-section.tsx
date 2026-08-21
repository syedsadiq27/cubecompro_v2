'use client';

import { useMemo } from 'react';
import { AccordionRow, CheckIcon } from '@/components/bo';
import {
  buildVisualMappingCatalog,
  buildVisualMappingChoices,
  listLinkedObjectResources,
  listMappingTargets,
  type GraphDetail,
  type MaterialAssetOption,
  type ObjectAssetOption,
} from '@/lib/product-workspace';
import { OptionMappingCard } from '@/components/products/workspace/three-d-option-mapping-card';

export function ThreeDMappingsSection({
  projectId,
  productId,
  modelId,
  detail,
  objectAssets,
  materialAssets,
  editable,
}: {
  projectId: string;
  productId: string;
  modelId?: string | null;
  detail: GraphDetail | null;
  objectAssets: ObjectAssetOption[];
  materialAssets: MaterialAssetOption[];
  editable: boolean;
}) {
  const catalog = useMemo(
    () =>
      buildVisualMappingCatalog({
        materialAssets,
        objectAssets,
      }),
    [materialAssets, objectAssets]
  );
  const choices = useMemo(
    () => buildVisualMappingChoices(detail, catalog),
    [catalog, detail]
  );
  const materialTargets = useMemo(
    () => listMappingTargets(detail, 'SET_MATERIAL'),
    [detail]
  );
  const visibilityTargets = useMemo(
    () => listMappingTargets(detail, 'SET_VISIBILITY'),
    [detail]
  );
  const objectTargets = useMemo(
    () => listMappingTargets(detail, 'REPLACE_COMPONENT'),
    [detail]
  );
  const objectResources = useMemo(
    () => listLinkedObjectResources(detail, catalog),
    [catalog, detail]
  );

  return (
    <div className="rounded-xl border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-xs space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] pb-3">
        <div>
          <h3 className="text-[14px] font-semibold text-[var(--ink)]">
            3D Mappings
          </h3>
          <p className="text-[12px] text-[var(--text-secondary)] mt-0.5">
            When a product value is selected, define what changes visually.
          </p>
        </div>
      </div>

      {choices.length === 0 ? (
        <p className="text-[12px] text-[var(--text-secondary)]">
          No options on this revision yet. Add choices first, then map values
          here.
        </p>
      ) : (
        <div className="space-y-3">
          {choices.map((choice, index) => {
            const complete =
              choice.valueCount > 0 &&
              choice.mappedCount === choice.valueCount;
            return (
              <AccordionRow
                key={choice.id}
                defaultOpen={index === 0 || choice.unboundCount > 0}
                title={choice.name}
                badge={
                  <span className="flex items-center gap-1.5 text-[11px] tabular-nums text-[var(--text-muted)]">
                    {choice.mappedCount} / {choice.valueCount} mapped
                    {complete ? (
                      <CheckIcon size={12} className="text-emerald-600" />
                    ) : null}
                  </span>
                }
              >
                <OptionMappingCard
                  projectId={projectId}
                  productId={productId}
                  modelId={modelId}
                  choice={choice}
                  materialTargets={materialTargets}
                  visibilityTargets={visibilityTargets}
                  objectTargets={objectTargets}
                  materialAssets={materialAssets}
                  objectResources={objectResources}
                  editable={editable}
                />
              </AccordionRow>
            );
          })}
        </div>
      )}
    </div>
  );
}
