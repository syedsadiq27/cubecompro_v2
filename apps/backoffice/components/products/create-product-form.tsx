'use client';

import { useState, useTransition } from 'react';
import type { MutationResult } from '@/actions/products';

export function CreateProductForm({
  projectId,
  action,
}: {
  projectId: string;
  action: (projectId: string, formData: FormData) => Promise<MutationResult>;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="grid max-w-lg gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await action(projectId, formData);
          if (result?.error) {
            setMessage(result.error);
          }
        });
      }}
    >
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Name</span>
        <input
          name="Name"
          required
          className="w-full rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Key</span>
        <input
          name="key"
          required
          className="w-full rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="bo-btn-primary rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
      >
        {pending ? 'Creating…' : 'Create product'}
      </button>
      {message ? (
        <p className="text-sm text-[var(--bo-muted)]">{message}</p>
      ) : null}
    </form>
  );
}
