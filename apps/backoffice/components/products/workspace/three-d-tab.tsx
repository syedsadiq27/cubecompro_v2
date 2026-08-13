'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProductModelAction } from '@/actions/graph';
import { ModelGlbPreview } from '@/components/library/model-preview';
import { Panel } from '@/components/ui';
import { getEditorStudioPath } from '@/lib/editor-embed';
import {
  humanizeEffectOperation,
  humanizeEffectValue,
  partLabel,
  type GraphDetail,
  type MaterialAssetOption,
  type ObjectAssetOption,
} from '@/lib/product-workspace';

const inputClass =
  'w-full rounded-lg border border-[var(--bo-line)] bg-white px-2.5 py-1.5 text-[13px]';

export function ThreeDTab({
  projectId,
  productId,
  detail,
  objectAssets,
  materialAssets = [],
  editable,
}: {
  projectId: string;
  productId: string;
  detail: GraphDetail | null;
  objectAssets: ObjectAssetOption[];
  materialAssets?: MaterialAssetOption[];
  editable: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const materialNames = useMemo(
    () => new Map(materialAssets.map((asset) => [asset.id, asset.name])),
    [materialAssets]
  );

  const primaryModel = detail?.models[0] ?? null;
  const primaryAsset =
    objectAssets.find((asset) => asset.id === primaryModel?.assetId) ?? null;
  const assetName = primaryAsset?.name ?? primaryModel?.name ?? null;
  const meshCount = primaryAsset?.meshCount ?? null;
  const targetCount = primaryModel?.targets?.length ?? 0;
  const mappingCount = detail?.visualEffects.length ?? 0;
  const editorHref = primaryModel
    ? getEditorStudioPath(projectId, productId, primaryModel.id)
    : null;
  const modelReady =
    Boolean(primaryModel) &&
    (primaryAsset?.status === 'READY' ||
      primaryAsset?.status === 'PARSED' ||
      !primaryAsset?.status);

  const mappingPreview = useMemo(() => {
    if (!detail) return [];
    const valueById = new Map(
      detail.attributes.flatMap((attribute) =>
        (attribute.values ?? []).map(
          (value) => [value.id, { attribute, value }] as const
        )
      )
    );
    const targetById = new Map(
      detail.models.flatMap((model) =>
        (model.targets ?? []).map((target) => [target.id, target] as const)
      )
    );
    return detail.visualEffects.map((effect) => {
      const valueMeta = valueById.get(effect.attributeValueId);
      const target = targetById.get(effect.modelTargetId);
      return {
        id: effect.id,
        choice: valueMeta
          ? `${valueMeta.attribute.name}: ${valueMeta.value.name}`
          : 'Choice',
        operation: humanizeEffectOperation(effect.operation),
        target: target ? partLabel(target) : 'Part',
        material: humanizeEffectValue(effect.valueJson, materialNames),
      };
    });
  }, [detail, materialNames]);

  if (!detail) {
    return (
      <Panel>
        <p className="text-sm text-[var(--bo-muted)]">
          Start a configuration before setting up the 3D experience.
        </p>
      </Panel>
    );
  }

  return (
    <div className="space-y-4">
      <Panel className="space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">3D</h2>
          <p className="mt-1 text-[13px] text-[var(--bo-muted)]">
            How the product looks when options change.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--bo-line)]">
          <div className="flex flex-col sm:flex-row">
            <div className="relative h-40 w-full shrink-0 overflow-hidden bg-[var(--bo-surface)] sm:h-44 sm:w-44">
              {primaryModel?.assetId ? (
                <ModelGlbPreview
                  assetId={primaryModel.assetId}
                  priority
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-[12px] text-[var(--bo-muted)]">
                  No model
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col justify-between gap-4 px-4 py-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[15px] font-semibold text-[var(--bo-ink)]">
                    {primaryModel ? assetName : 'No model attached'}
                  </p>
                  <p className="mt-1 text-[13px] text-[var(--bo-muted)]">
                    {primaryModel
                      ? [
                          meshCount != null
                            ? `${meshCount} mesh${meshCount === 1 ? '' : 'es'}`
                            : null,
                          `${targetCount} target${targetCount === 1 ? '' : 's'}`,
                          `${mappingCount} mapping${mappingCount === 1 ? '' : 's'}`,
                        ]
                          .filter(Boolean)
                          .join(' · ')
                      : 'Attach a library object, then map options in Studio.'}
                  </p>
                </div>
                {primaryModel ? (
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${
                      modelReady
                        ? 'bg-[var(--bo-live-soft)] text-[var(--bo-live)]'
                        : 'bg-black/[0.04] text-[var(--bo-muted)]'
                    }`}
                  >
                    {modelReady ? 'Ready' : (primaryAsset?.status ?? 'Attached')}
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap gap-2">
                {editorHref ? (
                  <Link
                    href={editorHref}
                    className="bo-btn-primary rounded-xl px-4 py-2 text-sm font-medium"
                  >
                    Open 3D Studio
                  </Link>
                ) : null}
              </div>
            </div>
          </div>

          {!primaryModel && editable ? (
            <form
              className="grid gap-2 border-t border-[var(--bo-line)] p-4 md:grid-cols-4"
              onSubmit={(event) => {
                event.preventDefault();
                const form = event.currentTarget;
                const formData = new FormData(form);
                startTransition(async () => {
                  const result = await createProductModelAction(
                    projectId,
                    productId,
                    formData
                  );
                  setMessage(
                    result.ok ? 'Model attached.' : result.error || 'Failed.'
                  );
                  if (result.ok) {
                    form.reset();
                    router.refresh();
                  }
                });
              }}
            >
              <input type="hidden" name="graphVersionId" value={detail.id} />
              <input type="hidden" name="key" value="primary" />
              <input
                name="name"
                required
                placeholder="Model name"
                defaultValue="Primary model"
                className={inputClass}
              />
              <select name="assetId" required className={inputClass}>
                {objectAssets.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                disabled={pending || objectAssets.length === 0}
                className="bo-btn-primary rounded-lg px-3 py-1.5 text-[13px] font-medium disabled:opacity-60"
              >
                Attach model
              </button>
            </form>
          ) : null}
          {message ? (
            <p className="border-t border-[var(--bo-line)] px-4 py-2 text-[12px] text-[var(--bo-muted)]">
              {message}
            </p>
          ) : null}
        </div>
      </Panel>

      {primaryModel ? (
        <Panel className="space-y-3">
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-[13px] font-semibold">Mappings</h3>
            <p className="text-[12px] text-[var(--bo-muted)]">
              {mappingCount}{' '}
              {mappingCount === 1 ? 'mapping' : 'mappings'}
            </p>
          </div>
          {mappingPreview.length === 0 ? (
            <p className="text-sm text-[var(--bo-muted)]">
              No mappings yet. Open 3D Studio to connect options to model parts.
            </p>
          ) : (
            <ul className="overflow-hidden rounded-xl border border-[var(--bo-line)]">
              {mappingPreview.map((row) => (
                <li
                  key={row.id}
                  className="border-b border-[var(--bo-line)] px-3.5 py-3 last:border-b-0"
                >
                  <p className="text-[14px] font-semibold text-[var(--bo-ink)]">
                    {row.choice}
                  </p>
                  <p className="mt-1 space-y-0.5 text-[13px] text-[var(--bo-muted)]">
                    <span className="block">→ {row.operation}</span>
                    <span className="block">→ {row.target}</span>
                    <span className="block">→ {row.material}</span>
                  </p>
                </li>
              ))}
            </ul>
          )}
        </Panel>
      ) : null}
    </div>
  );
}
