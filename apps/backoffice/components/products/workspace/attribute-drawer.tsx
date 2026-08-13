'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createAttributeValueAction } from '@/actions/graph';
import type {
  GraphAttribute,
  GraphAttributeValue,
} from '@/lib/product-workspace';

const inputClass =
  'w-full rounded-lg border border-[var(--bo-line)] bg-white px-2.5 py-1.5 text-[13px]';

export function AttributeDrawer({
  projectId,
  productId,
  attribute,
  editable,
  onClose,
  onSelectValue,
}: {
  projectId: string;
  productId: string;
  attribute: GraphAttribute;
  editable: boolean;
  onClose: () => void;
  onSelectValue?: (value: GraphAttributeValue) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const values = attribute.values ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[var(--bo-line)] bg-white shadow-[var(--bo-shadow)]">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--bo-line)] px-5 py-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
              Option
            </p>
            <h2 className="mt-1 truncate text-[18px] font-semibold tracking-tight">
              {attribute.name}
            </h2>
            <p className="mt-1 text-[12px] text-[var(--bo-muted)]">
              {attribute.required ? 'Required' : 'Optional'} · {attribute.key}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-2 py-1 text-[13px] text-[var(--bo-muted)] hover:bg-black/[0.04]"
          >
            Close
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <p className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-[var(--bo-muted)] uppercase">
            Values
          </p>
          <ul className="overflow-hidden rounded-xl border border-[var(--bo-line)]">
            {values.map((value, index) => (
              <li
                key={value.id}
                className="border-b border-[var(--bo-line)] last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => onSelectValue?.(value)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-black/[0.02]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-[var(--bo-ink)]">
                      {value.name}
                    </span>
                    <span className="block truncate text-[11px] text-[var(--bo-muted)]">
                      {value.key}
                      {index === 0 ? ' · Default' : ''}
                    </span>
                  </span>
                  <span className="text-[var(--bo-muted)]">→</span>
                </button>
              </li>
            ))}
            {values.length === 0 ? (
              <li className="px-3 py-4 text-sm text-[var(--bo-muted)]">
                No values yet.
              </li>
            ) : null}
          </ul>

          {editable &&
          (attribute.type === 'SELECT' ||
            attribute.type === 'MULTI_SELECT') ? (
            <form
              className="mt-4 grid gap-2"
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
                    result.ok ? 'Value added.' : result.error || 'Failed.'
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
                placeholder="Value name"
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
                className="bo-btn-primary rounded-lg px-3 py-1.5 text-[13px] font-medium disabled:opacity-60"
              >
                {pending ? 'Adding…' : 'Add value'}
              </button>
            </form>
          ) : null}

          {message ? (
            <p className="mt-3 text-[12px] text-[var(--bo-muted)]">{message}</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
