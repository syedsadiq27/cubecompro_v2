'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState, useTransition } from 'react';
import {
  createAttributeAction,
  createAttributeValueAction,
} from '@/actions/graph';
import { ValueDetailDrawer } from '@/components/products/workspace/value-detail-drawer';
import { Panel } from '@/components/ui';
import {
  humanizeEffectValue,
  targetLabel,
  type GraphAttribute,
  type GraphAttributeValue,
  type GraphDetail,
} from '@/lib/product-workspace';

const inputClass =
  'w-full rounded-lg border border-[var(--bo-line)] bg-white px-2.5 py-1.5 text-[13px]';

export function OptionsTab({
  projectId,
  productId,
  detail,
  editable,
}: {
  projectId: string;
  productId: string;
  detail: GraphDetail | null;
  editable: boolean;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const [selected, setSelected] = useState<{
    attribute: GraphAttribute;
    value: GraphAttributeValue;
  } | null>(null);

  const effectByValueId = useMemo(() => {
    const map = new Map<
      string,
      Array<{ binding: string; operation: string; value: string }>
    >();
    if (!detail) return map;
    const targetById = new Map(
      detail.models.flatMap((model) =>
        (model.targets ?? []).map(
          (target) => [target.id, targetLabel(target)] as const
        )
      )
    );
    for (const effect of detail.visualEffects) {
      const list = map.get(effect.attributeValueId) ?? [];
      list.push({
        binding: targetById.get(effect.modelTargetId) ?? 'Mapped part',
        operation: effect.operation,
        value: humanizeEffectValue(effect.valueJson),
      });
      map.set(effect.attributeValueId, list);
    }
    return map;
  }, [detail]);

  if (!detail) {
    return (
      <Panel>
        <p className="text-sm text-[var(--bo-muted)]">
          Start a configuration to add customer-facing options.
        </p>
      </Panel>
    );
  }

  return (
    <div className="space-y-4">
      <Panel className="space-y-6">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">Options</h2>
          <p className="mt-1 text-[13px] text-[var(--bo-muted)]">
            What shoppers choose. Values drive 3D look and commerce identity.
          </p>
        </div>

        {detail.attributes.length === 0 ? (
          <p className="text-sm text-[var(--bo-muted)]">No options yet.</p>
        ) : null}

        {detail.attributes.map((attribute) => (
          <section key={attribute.id} className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <div>
                <h3 className="text-[14px] font-semibold">{attribute.name}</h3>
                <p className="text-[12px] text-[var(--bo-muted)]">
                  {attribute.required ? 'Required' : 'Optional'} · Controls how
                  the customer chooses {attribute.name.toLowerCase()}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {(attribute.values ?? []).map((value, index) => (
                <button
                  key={value.id}
                  type="button"
                  onClick={() => setSelected({ attribute, value })}
                  className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition ${
                    index === 0
                      ? 'bo-btn-primary border-transparent'
                      : 'border-[var(--bo-line)] bg-white text-[var(--bo-ink)] hover:border-[var(--bo-line-strong)]'
                  }`}
                >
                  {value.name}
                </button>
              ))}
              {(attribute.values ?? []).length === 0 ? (
                <span className="text-[13px] text-[var(--bo-muted)]">
                  No choices yet
                </span>
              ) : null}
            </div>
            {editable &&
            (attribute.type === 'SELECT' ||
              attribute.type === 'MULTI_SELECT') ? (
              <form
                className="grid max-w-xl gap-2 sm:grid-cols-[1fr_1fr_auto]"
                onSubmit={(event) => {
                  event.preventDefault();
                  const form = event.currentTarget;
                  const formData = new FormData(form);
                  startTransition(async () => {
                    const result = await createAttributeValueAction(
                      projectId,
                      productId,
                      formData
                    );
                    setMessage(
                      result.ok ? 'Choice added.' : result.error || 'Failed.'
                    );
                    if (result.ok) {
                      form.reset();
                      router.refresh();
                    }
                  });
                }}
              >
                <input type="hidden" name="attributeId" value={attribute.id} />
                <input
                  name="name"
                  required
                  placeholder="Choice name"
                  className={inputClass}
                />
                <input
                  name="key"
                  required
                  placeholder="Internal key"
                  className={inputClass}
                />
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-[13px] disabled:opacity-60"
                >
                  Add choice
                </button>
              </form>
            ) : null}
          </section>
        ))}

        {editable ? (
          <form
            className="grid gap-2 border-t border-[var(--bo-line)] pt-4 md:grid-cols-[1fr_1fr_auto_auto]"
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
            />
            <input
              name="key"
              required
              placeholder="Key (e.g. color)"
              className={inputClass}
            />
            <button
              type="submit"
              disabled={pending}
              className="bo-btn-primary rounded-lg px-3 py-1.5 text-[13px] font-medium disabled:opacity-60"
            >
              + Add option
            </button>
          </form>
        ) : (
          <p className="text-[13px] text-[var(--bo-muted)]">
            Published configurations are read-only. Choose Edit configuration to
            make changes.
          </p>
        )}
        {message ? (
          <p className="text-[12px] text-[var(--bo-muted)]">{message}</p>
        ) : null}
      </Panel>

      {selected ? (
        <ValueDetailDrawer
          attribute={selected.attribute}
          value={selected.value}
          effects={effectByValueId.get(selected.value.id) ?? []}
          onClose={() => setSelected(null)}
        />
      ) : null}
    </div>
  );
}
