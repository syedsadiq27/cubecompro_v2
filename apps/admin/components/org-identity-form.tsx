'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { updateTenantAction } from '@/actions/tenants';

export function OrgIdentityForm({
  organizationId,
  name,
  slug,
}: {
  organizationId: string;
  name: string;
  slug: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        start(async () => {
          const result = await updateTenantAction(organizationId, {
            name: String(form.get('name') ?? ''),
            slug: String(form.get('slug') ?? ''),
          });
          if (!result.ok) {
            setError(result.error ?? 'Failed');
            return;
          }
          setError(null);
          router.refresh();
        });
      }}
    >
      <label className="space-y-1 text-[12px]">
        <span className="type-meta block">Name</span>
        <input
          name="name"
          defaultValue={name}
          required
          className="w-full rounded-lg border border-[var(--line)] px-2 py-2 text-[13px]"
        />
      </label>
      <label className="space-y-1 text-[12px]">
        <span className="type-meta block">Slug</span>
        <input
          name="slug"
          defaultValue={slug}
          required
          className="w-full rounded-lg border border-[var(--line)] px-2 py-2 font-mono text-[13px]"
        />
      </label>
      <div className="sm:col-span-2 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-[var(--ink)] px-3 py-1.5 text-[12px] text-white disabled:opacity-50"
        >
          Save
        </button>
        {error ? (
          <p className="text-[12px] text-[var(--danger)]">{error}</p>
        ) : null}
      </div>
    </form>
  );
}
