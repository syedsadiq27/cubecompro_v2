'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import {
  createVariantAction,
  createVariantSelectionAction,
} from '@/actions/graph';
import { Panel } from '@/components/ui';
import {
  variantConfigurationLabel,
  type GraphDetail,
} from '@/lib/product-workspace';

const inputClass =
  'w-full rounded-lg border border-[var(--bo-line)] bg-white px-2.5 py-1.5 text-[13px]';

export function CommerceTab({
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

  if (!detail) {
    return (
      <Panel>
        <p className="text-sm text-[var(--bo-muted)]">
          Start a configuration before mapping commerce variants.
        </p>
      </Panel>
    );
  }

  const providers = Array.from(
    new Set(detail.variants.map((variant) => variant.provider))
  );

  return (
    <div className="space-y-4">
      <Panel className="space-y-4">
        <div>
          <h2 className="text-[15px] font-semibold tracking-tight">Commerce</h2>
          <p className="mt-1 text-[13px] text-[var(--bo-muted)]">
            Map complete configurations to sellable identities.
          </p>
        </div>

        <div className="rounded-xl border border-[var(--bo-line)] px-4 py-3">
          <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
            Provider
          </p>
          <p className="mt-1 text-sm font-medium">
            {providers[0] ?? 'generic'}{' '}
            <span className="text-[var(--bo-muted)]">
              · {providers.length > 0 ? 'Mapped' : 'Not connected'}
            </span>
          </p>
        </div>

        <div className="overflow-hidden rounded-[10px] border border-[var(--bo-line)]">
          <table className="w-full text-left text-[13px]">
            <thead className="border-b border-[var(--bo-line)] bg-[var(--bo-surface)] text-[11px] font-semibold tracking-[0.04em] text-[var(--bo-muted)] uppercase">
              <tr>
                <th className="px-3 py-2.5 font-semibold">Configuration</th>
                <th className="px-3 py-2.5 font-semibold">SKU</th>
                <th className="px-3 py-2.5 font-semibold">Reference</th>
              </tr>
            </thead>
            <tbody>
              {detail.variants.map((variant) => (
                <tr
                  key={variant.id}
                  className="border-b border-[var(--bo-line)] last:border-b-0"
                >
                  <td className="px-3 py-2.5 font-medium text-[var(--bo-ink)]">
                    {variantConfigurationLabel(variant, detail.attributes)}
                  </td>
                  <td className="px-3 py-2.5 text-[var(--bo-muted)]">
                    {variant.sku || '—'}
                  </td>
                  <td className="px-3 py-2.5 text-[var(--bo-muted)]">
                    {variant.externalId}
                  </td>
                </tr>
              ))}
              {detail.variants.length === 0 ? (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-6 text-[var(--bo-muted)]"
                  >
                    No sellable variants mapped yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </Panel>

      {editable ? (
        <Panel className="space-y-4">
          <h3 className="text-[13px] font-semibold">Manage mapping</h3>
          <form
            className="grid gap-2 md:grid-cols-4"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const formData = new FormData(form);
              startTransition(async () => {
                const result = await createVariantAction(
                  projectId,
                  productId,
                  formData
                );
                setMessage(
                  result.ok ? 'Variant added.' : result.error || 'Failed.'
                );
                if (result.ok) {
                  form.reset();
                  router.refresh();
                }
              });
            }}
          >
            <input type="hidden" name="graphVersionId" value={detail.id} />
            <input
              name="provider"
              required
              defaultValue="generic"
              className={inputClass}
            />
            <input
              name="externalId"
              required
              placeholder="External id"
              className={inputClass}
            />
            <input name="sku" placeholder="SKU" className={inputClass} />
            <button
              type="submit"
              disabled={pending}
              className="bo-btn-primary rounded-lg px-3 py-1.5 text-[13px] font-medium disabled:opacity-60"
            >
              Add variant
            </button>
          </form>

          {detail.variants[0] ? (
            <form
              className="grid gap-2 border-t border-[var(--bo-line)] pt-4 md:grid-cols-3"
              onSubmit={(event) => {
                event.preventDefault();
                const form = event.currentTarget;
                const formData = new FormData(form);
                startTransition(async () => {
                  const result = await createVariantSelectionAction(
                    projectId,
                    productId,
                    formData
                  );
                  setMessage(
                    result.ok ? 'Selection mapped.' : result.error || 'Failed.'
                  );
                  if (result.ok) {
                    form.reset();
                    router.refresh();
                  }
                });
              }}
            >
              <select name="variantId" required className={inputClass}>
                {detail.variants.map((variant) => (
                  <option key={variant.id} value={variant.id}>
                    {variant.sku || variant.externalId}
                  </option>
                ))}
              </select>
              <select name="attributeId" required className={inputClass}>
                {detail.attributes.map((attribute) => (
                  <option key={attribute.id} value={attribute.id}>
                    {attribute.name}
                  </option>
                ))}
              </select>
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <select name="attributeValueId" required className={inputClass}>
                  {detail.attributes.flatMap((attribute) =>
                    (attribute.values ?? []).map((value) => (
                      <option key={value.id} value={value.id}>
                        {attribute.name}: {value.name}
                      </option>
                    ))
                  )}
                </select>
                <button
                  type="submit"
                  disabled={pending}
                  className="rounded-lg border border-[var(--bo-line)] px-3 py-1.5 text-[13px] disabled:opacity-60"
                >
                  Map
                </button>
              </div>
            </form>
          ) : null}
          {message ? (
            <p className="text-[12px] text-[var(--bo-muted)]">{message}</p>
          ) : null}
        </Panel>
      ) : null}
    </div>
  );
}
