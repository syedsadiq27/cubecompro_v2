'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button } from '@repo/ui';
import { createAttributeValueAction } from '@/actions/graph';
import type {
  GraphAttribute,
  GraphAttributeValue,
} from '@/lib/product-workspace';

import { CloseIcon } from '@/components/bo/icons';

const inputClass =
  'w-full rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] px-2.5 py-1.5 text-[13px] text-[var(--ink)] outline-none focus:border-[var(--ink)]';

export function AttributeDrawer({
  projectId,
  productId,
  attribute,
  editable,
  open = true,
  onClose,
  onSelectValue,
}: {
  projectId: string;
  productId: string;
  attribute: GraphAttribute | null;
  editable?: boolean;
  open?: boolean;
  onClose: () => void;
  onSelectValue?: (value: GraphAttributeValue) => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  if (!open || !attribute) return null;

  const values = attribute.values ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/20 animate-in fade-in duration-150">
      <button
        type="button"
        aria-label="Close"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <aside className="relative z-10 flex h-full w-full max-w-md flex-col border-l border-[var(--line)] bg-[var(--surface-pure)] shadow-2xl animate-in slide-in-from-right duration-200">
        <div className="flex items-start justify-between gap-3 border-b border-[var(--line)] p-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold tracking-wide text-[var(--text-muted)] uppercase">
              Option Details
            </p>
            <h2 className="mt-1 truncate text-[16px] font-semibold text-[var(--ink)]">
              {attribute.name}
            </h2>
            <p className="mt-0.5 text-[12px] text-[var(--text-muted)]">
              {attribute.required ? 'Required' : 'Optional'} · <span className="font-mono">{attribute.key}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center rounded text-[var(--text-muted)] hover:bg-[var(--canvas)] hover:text-[var(--ink)]"
          >
            <CloseIcon size={14} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5">
          <p className="mb-2 text-[11px] font-semibold tracking-[0.08em] text-[var(--text-secondary)] uppercase">
            Values
          </p>
          <ul className="overflow-hidden rounded-xl border border-[var(--line)]">
            {values.map((value, index) => (
              <li
                key={value.id}
                className="border-b border-[var(--line)] last:border-b-0"
              >
                <button
                  type="button"
                  onClick={() => onSelectValue?.(value)}
                  className="flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left hover:bg-black/[0.02]"
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[13px] font-medium text-[var(--ink)]">
                      {value.name}
                    </span>
                    <span className="block truncate text-[11px] text-[var(--text-secondary)]">
                      {value.key}
                      {index === 0 ? ' · Default' : ''}
                    </span>
                  </span>
                  <span className="text-[var(--text-secondary)]">→</span>
                </button>
              </li>
            ))}
            {values.length === 0 ? (
              <li className="px-3 py-4 text-sm text-[var(--text-secondary)]">
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
              <Button type="submit" size="sm" disabled={pending}>
                {pending ? 'Adding…' : 'Add value'}
              </Button>
            </form>
          ) : null}

          {message ? (
            <p className="mt-3 text-[12px] text-[var(--text-secondary)]">{message}</p>
          ) : null}
        </div>
      </aside>
    </div>
  );
}
