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
  const [managing, setManaging] = useState(false);

  if (!detail) {
    return (
      <Panel>
        <p className="text-sm text-[var(--bo-muted)]">
          Start a configuration before mapping commerce identities.
        </p>
      </Panel>
    );
  }

  const providers = Array.from(
    new Set(detail.variants.map((variant) => variant.provider))
  );
  const provider = providers[0] ?? 'generic';
  const mappedCount = detail.variants.filter(
    (variant) => (variant.selections?.length ?? 0) > 0
  ).length;
  const unmappedCount = detail.variants.length - mappedCount;
  const connected = detail.variants.length > 0;

  return (
    <div className="space-y-4">
      <Panel className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-semibold tracking-tight">
              Commerce
            </h2>
            <p className="mt-1 text-[13px] text-[var(--bo-muted)]">
              Configuration resolves to a sellable identity.
            </p>
          </div>
          <div className="text-right">
            <p className="text-[13px] font-medium text-[var(--bo-ink)]">
              {provider}{' '}
              <span
                className={
                  connected
                    ? 'text-[var(--bo-live)]'
                    : 'text-[var(--bo-muted)]'
                }
              >
                {connected ? '✓ Connected' : '· Not connected'}
              </span>
            </p>
            <p className="mt-0.5 text-[12px] text-[var(--bo-muted)]">
              {detail.variants.length} sellable{' '}
              {detail.variants.length === 1
                ? 'configuration'
                : 'configurations'}
            </p>
            <p className="text-[12px] text-[var(--bo-muted)]">
              {mappedCount} mapped · {unmappedCount} unmapped
            </p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-[var(--bo-line)]">
          <div className="grid grid-cols-[1fr_auto_1fr] gap-2 border-b border-[var(--bo-line)] bg-[var(--bo-surface)] px-3.5 py-2 text-[11px] font-semibold tracking-[0.06em] text-[var(--bo-muted)] uppercase">
            <span>Configuration</span>
            <span />
            <span>Commerce identity</span>
          </div>
          <ul>
            {detail.variants.map((variant) => (
              <li
                key={variant.id}
                className="grid grid-cols-[1fr_auto_1fr] items-start gap-2 border-b border-[var(--bo-line)] px-3.5 py-3 last:border-b-0"
              >
                <div>
                  <p className="text-[14px] font-medium text-[var(--bo-ink)]">
                    {variantConfigurationLabel(variant, detail.attributes)}
                  </p>
                </div>
                <span className="pt-0.5 text-[var(--bo-muted)]">→</span>
                <div>
                  <p className="text-[12px] font-medium tracking-[0.04em] text-[var(--bo-muted)] uppercase">
                    {variant.provider}
                  </p>
                  <p className="mt-0.5 text-[14px] font-semibold text-[var(--bo-ink)]">
                    {variant.sku || variant.externalId}
                  </p>
                  <p className="mt-1 text-[13px] text-[var(--bo-muted)]">$—</p>
                  <p className="text-[13px] text-[var(--bo-muted)]">
                    Inventory —
                  </p>
                </div>
              </li>
            ))}
            {detail.variants.length === 0 ? (
              <li className="px-3.5 py-6 text-sm text-[var(--bo-muted)]">
                No sellable configurations mapped yet.
              </li>
            ) : null}
          </ul>
        </div>

        {editable ? (
          managing ? (
            <div className="space-y-4 border-t border-[var(--bo-line)] pt-4">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-[13px] font-semibold">Manage mapping</h3>
                <button
                  type="button"
                  onClick={() => setManaging(false)}
                  className="text-[12px] text-[var(--bo-muted)] hover:underline"
                >
                  Done
                </button>
              </div>
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
                      result.ok
                        ? 'Identity added.'
                        : result.error || 'Failed.'
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
                  Add identity
                </button>
              </form>

              {detail.variants[0] ? (
                <form
                  className="grid gap-2 md:grid-cols-3"
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
                        result.ok
                          ? 'Selection mapped.'
                          : result.error || 'Failed.'
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
                    <select
                      name="attributeValueId"
                      required
                      className={inputClass}
                    >
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
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setManaging(true)}
              className="text-[13px] font-medium text-[var(--bo-ink)] hover:underline"
            >
              + Manage mapping
            </button>
          )
        ) : null}

        {message ? (
          <p className="text-[12px] text-[var(--bo-muted)]">{message}</p>
        ) : null}
      </Panel>
    </div>
  );
}
