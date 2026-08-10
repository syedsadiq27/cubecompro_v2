'use client';

import { useState, useTransition } from 'react';
import type { MutationResult } from '../../actions/products';

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
    Description: string;
    code: string;
    Department: string;
    Manufacture: string;
    active: boolean;
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
      {(
        [
          ['Name', 'Name'],
          ['code', 'Code'],
          ['Department', 'Department'],
          ['Manufacture', 'Manufacture'],
        ] as const
      ).map(([name, label]) => (
        <label key={name} className="block space-y-1.5">
          <span className="text-sm font-medium">{label}</span>
          <input
            name={name}
            defaultValue={defaults[name]}
            className="w-full rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
          />
        </label>
      ))}
      <label className="block space-y-1.5 md:col-span-2">
        <span className="text-sm font-medium">Description</span>
        <textarea
          name="Description"
          rows={4}
          defaultValue={defaults.Description}
          className="w-full rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
        />
      </label>
      <label className="flex items-center gap-2 text-sm md:col-span-2">
        <input
          type="checkbox"
          name="active"
          defaultChecked={defaults.active}
        />
        Active
      </label>
      <div className="md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-[var(--bo-ink)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
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
