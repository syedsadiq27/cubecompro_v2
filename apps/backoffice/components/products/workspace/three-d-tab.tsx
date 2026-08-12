'use client';

import Link from 'next/link';
import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createProductModelAction } from '@/actions/graph';
import { Panel } from '@/components/ui';
import { getEditorStudioPath } from '@/lib/editor-embed';
import {
  humanizeEffectValue,
  targetLabel,
  type GraphDetail,
  type ObjectAssetOption,
} from '@/lib/product-workspace';

const inputClass =
  'w-full rounded-lg border border-[var(--bo-line)] bg-white px-2.5 py-1.5 text-[13px]';

export function ThreeDTab({
  projectId,
  productId,
  detail,
  objectAssets,
  editable,
}: {
  projectId: string;
  productId: string;
  detail: GraphDetail | null;
  objectAssets: ObjectAssetOption[];
  editable: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const primaryModel = detail?.models[0] ?? null;
  const assetName =
    objectAssets.find((asset) => asset.id === primaryModel?.assetId)?.name ??
    primaryModel?.name ??
    null;
  const targetCount = primaryModel?.targets?.length ?? 0;
  const mappingCount = detail?.visualEffects.length ?? 0;
  const editorHref = primaryModel
    ? getEditorStudioPath(projectId, productId, primaryModel.id)
    : null;

  const mappingSummary = useMemo(() => {
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

    const byAttribute = new Map<string, number>();
    for (const effect of detail.visualEffects) {
      const valueMeta = valueById.get(effect.attributeValueId);
      const target = targetById.get(effect.modelTargetId);
      if (!valueMeta || !target) continue;
      byAttribute.set(
        valueMeta.attribute.name,
        (byAttribute.get(valueMeta.attribute.name) ?? 0) + 1
      );
    }
    return Array.from(byAttribute.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [detail]);

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
    return detail.visualEffects.slice(0, 6).map((effect) => {
      const valueMeta = valueById.get(effect.attributeValueId);
      const target = targetById.get(effect.modelTargetId);
      return {
        id: effect.id,
        label: valueMeta
          ? `${valueMeta.attribute.name}: ${valueMeta.value.name}`
          : 'Choice',
        behavior: humanizeEffectValue(effect.valueJson),
        target: target ? targetLabel(target) : 'Target',
      };
    });
  }, [detail]);

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
          <h2 className="text-[15px] font-semibold tracking-tight">
            3D experience
          </h2>
          <p className="mt-1 text-[13px] text-[var(--bo-muted)]">
            Options define what can change. The 3D editor defines how the model
            responds.
          </p>
        </div>

        <div className="rounded-[12px] border border-[var(--bo-line)] px-4 py-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[14px] font-semibold">
                {primaryModel ? assetName : 'No model attached'}
              </p>
              <p className="mt-1 text-[12px] text-[var(--bo-muted)]">
                {primaryModel
                  ? `${targetCount} targets · ${mappingCount} mappings`
                  : 'Attach a library object, then open the 3D editor to map options.'}
              </p>
            </div>
            {primaryModel ? (
              <span className="rounded-full bg-[var(--bo-live-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--bo-live)]">
                Ready
              </span>
            ) : null}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {editorHref ? (
              <Link
                href={editorHref}
                className="bo-btn-primary rounded-xl px-4 py-2 text-sm font-medium"
              >
                Open 3D editor
              </Link>
            ) : null}
          </div>

          {!primaryModel && editable ? (
            <form
              className="mt-4 grid gap-2 md:grid-cols-4"
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
            <p className="mt-2 text-[12px] text-[var(--bo-muted)]">{message}</p>
          ) : null}
        </div>
      </Panel>

      {primaryModel ? (
        <Panel className="space-y-3">
          <h3 className="text-[13px] font-semibold">Mappings</h3>
          {mappingSummary.length === 0 ? (
            <p className="text-sm text-[var(--bo-muted)]">
              No configuration mappings yet. Open the 3D editor to connect
              options to model targets.
            </p>
          ) : (
            <ul className="grid gap-2 sm:grid-cols-2">
              {mappingSummary.map((entry) => (
                <li
                  key={entry.name}
                  className="flex items-center justify-between rounded-lg border border-[var(--bo-line)] px-3 py-2 text-[13px]"
                >
                  <span className="font-medium">{entry.name}</span>
                  <span className="text-[var(--bo-muted)]">
                    {entry.count} {entry.count === 1 ? 'mapping' : 'mappings'}
                  </span>
                </li>
              ))}
            </ul>
          )}
          {mappingPreview.length > 0 ? (
            <ul className="space-y-1.5 border-t border-[var(--bo-line)] pt-3 text-[13px] text-[var(--bo-muted)]">
              {mappingPreview.map((row) => (
                <li key={row.id} className="flex flex-wrap gap-x-2">
                  <span className="font-medium text-[var(--bo-ink)]">
                    {row.label}
                  </span>
                  <span>→</span>
                  <span>
                    {row.behavior} → {row.target}
                  </span>
                </li>
              ))}
            </ul>
          ) : null}
        </Panel>
      ) : null}
    </div>
  );
}
