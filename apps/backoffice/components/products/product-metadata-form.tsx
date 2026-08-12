'use client';

import { useState, useTransition } from 'react';
import type { MutationResult } from '@/actions/products';

export function ProductMetadataForm({
  projectId,
  productId,
  defaults,
  action,
}: {
  projectId: string;
  productId: string;
  defaults: {
    Name: string;
    key: string;
  };
  action: (
    projectId: string,
    productId: string,
    formData: FormData
  ) => Promise<MutationResult>;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="grid gap-4 md:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await action(projectId, productId, formData);
          setMessage(
            result.ok
              ? 'Saved product metadata.'
              : result.error || 'Save failed.'
          );
        });
      }}
    >
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Name</span>
        <input
          name="Name"
          defaultValue={defaults.Name}
          className="w-full rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Key</span>
        <input
          name="key"
          defaultValue={defaults.key}
          className="w-full rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
        />
      </label>
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="bo-btn-primary rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save metadata'}
        </button>
        {message ? (
          <p className="mt-3 text-sm text-[var(--bo-muted)]">{message}</p>
        ) : null}
      </div>
    </form>
  );
}
