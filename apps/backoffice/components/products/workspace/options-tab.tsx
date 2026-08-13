'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import { createAttributeAction } from '@/actions/graph';
import { AttributeDrawer } from '@/components/products/workspace/attribute-drawer';
import { ValueDetailDrawer } from '@/components/products/workspace/value-detail-drawer';
import { Panel } from '@/components/ui';
import {
  humanizeEffectOperation,
  humanizeEffectValue,
  partLabel,
  type GraphAttribute,
  type GraphAttributeValue,
  type GraphDetail,
  type MaterialAssetOption,
} from '@/lib/product-workspace';

const inputClass =
  'w-full rounded-lg border border-[var(--bo-line)] bg-white px-2.5 py-1.5 text-[13px]';

export function OptionsTab({
  projectId,
  productId,
  detail,
  editable,
  materialAssets = [],
}: {
  projectId: string;
  productId: string;
  detail: GraphDetail | null;
  editable: boolean;
  materialAssets?: MaterialAssetOption[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [selectedAttribute, setSelectedAttribute] =
    useState<GraphAttribute | null>(null);
  const [selectedValue, setSelectedValue] = useState<{
    attribute: GraphAttribute;
    value: GraphAttributeValue;
  } | null>(null);

  const materialNames = useMemo(
    () => new Map(materialAssets.map((asset) => [asset.id, asset.name])),
    [materialAssets]
  );

  const effectByValueId = useMemo(() => {
    const map = new Map<
      string,
      Array<{ binding: string; operation: string; value: string }>
    >();
    if (!detail) return map;
    const targetById = new Map(
      detail.models.flatMap((model) =>
        (model.targets ?? []).map(
          (target) => [target.id, partLabel(target)] as const
        )
      )
    );
    for (const effect of detail.visualEffects) {
      const list = map.get(effect.attributeValueId) ?? [];
      list.push({
        binding: targetById.get(effect.modelTargetId) ?? 'Mapped part',
        operation: humanizeEffectOperation(effect.operation),
        value: humanizeEffectValue(effect.valueJson, materialNames),
      });
      map.set(effect.attributeValueId, list);
    }
    return map;
  }, [detail, materialNames]);

  if (!detail) {
    return (
      <Panel>
        <p className="text-sm text-[var(--bo-muted)]">
          Start a configuration to add customer-facing options.
        </p>
      </Panel>
    );
  }

  const activeAttribute =
    selectedAttribute &&
    detail.attributes.find((entry) => entry.id === selectedAttribute.id);

  return (
    <div className="space-y-4">
      <Panel className="space-y-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">
              Options
            </h2>
            <p className="mt-1 text-[13px] text-[var(--bo-muted)]">
              What shoppers can choose. Values drive 3D look and commerce
              identity.
            </p>
          </div>
          <p className="text-[12px] text-[var(--bo-muted)]">
            {detail.attributes.length}{' '}
            {detail.attributes.length === 1 ? 'option' : 'options'}
          </p>
        </div>

        <ul className="overflow-hidden rounded-xl border border-[var(--bo-line)]">
          {detail.attributes.map((attribute) => {
            const values = attribute.values ?? [];
            const preview = values
              .slice(0, 4)
              .map((value) => value.name)
              .join(', ');
            const extra =
              values.length > 4 ? ` +${values.length - 4}` : '';
            return (
              <li
                key={attribute.id}
                className="border-b border-[var(--bo-line)] last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => {
                    setSelectedValue(null);
                    setSelectedAttribute(attribute);
                  }}
                  className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition hover:bg-black/[0.02]"
                >
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="text-[14px] font-semibold text-[var(--bo-ink)]">
                        {attribute.name}
                      </span>
                      <span className="text-[12px] text-[var(--bo-muted)]">
                        {attribute.required ? 'Required' : 'Optional'}
                      </span>
                    </span>
                    <span className="mt-0.5 block text-[13px] text-[var(--bo-muted)]">
                      {values.length}{' '}
                      {values.length === 1 ? 'value' : 'values'}
                      {preview ? ` · ${preview}${extra}` : ''}
                    </span>
                  </span>
                  <span className="text-[var(--bo-muted)]">→</span>
                </button>
              </li>
            );
          })}
          {detail.attributes.length === 0 ? (
            <li className="px-3.5 py-6 text-sm text-[var(--bo-muted)]">
              No options yet.
            </li>
          ) : null}
        </ul>

        {editable ? (
          adding ? (
            <form
              className="grid gap-2 rounded-xl border border-[var(--bo-line)] p-3 sm:grid-cols-[1fr_1fr_auto_auto]"
              onSubmit={(event) => {
                event.preventDefault();
                const form = event.currentTarget;
                const formData = new FormData(form);
                startTransition(async () => {
                  const result = await createAttributeAction(
                    projectId,
                    productId,
                    formData
                  );
                  setMessage(
                    result.ok ? 'Option added.' : result.error || 'Failed.'
                  );
                  if (result.ok) {
                    form.reset();
                    setAdding(false);
                    router.refresh();
                  }
                });
              }}
            >
              <input type="hidden" name="graphVersionId" value={detail.id} />
              <input type="hidden" name="type" value="SELECT" />
              <input type="hidden" name="required" value="on" />
              <input
                name="name"
                required
                placeholder="Option name (e.g. Color)"
                className={inputClass}
                autoFocus
              />
              <input
                name="key"
                required
                placeholder="Key (e.g. color)"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-[13px]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={pending}
                className="bo-btn-primary rounded-lg px-3 py-1.5 text-[13px] font-medium disabled:opacity-60"
              >
                {pending ? 'Adding…' : 'Add'}
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="text-[13px] font-medium text-[var(--bo-ink)] hover:underline"
            >
              + Add option
            </button>
          )
        ) : null}

        {message ? (
          <p className="text-[12px] text-[var(--bo-muted)]">{message}</p>
        ) : null}
      </Panel>

      {activeAttribute ? (
        <AttributeDrawer
          projectId={projectId}
          productId={productId}
          attribute={activeAttribute}
          editable={editable}
          onClose={() => setSelectedAttribute(null)}
          onSelectValue={(value) => {
            setSelectedValue({ attribute: activeAttribute, value });
          }}
        />
      ) : null}

      {selectedValue ? (
        <ValueDetailDrawer
          attribute={selectedValue.attribute}
          value={selectedValue.value}
          effects={effectByValueId.get(selectedValue.value.id) ?? []}
          onClose={() => setSelectedValue(null)}
        />
      ) : null}
    </div>
  );
}
