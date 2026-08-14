'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { createTenantAction } from '@/actions/tenants';
import { slugify } from '@/lib/format';
import type { Plan } from '@/lib/types';

export function CreateOrgForm({ plans }: { plans: Plan[] }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState('');

  return (
    <form
      className="max-w-lg space-y-4"
      onSubmit={(event) => {
        event.preventDefault();
        const form = new FormData(event.currentTarget);
        start(async () => {
          const result = await createTenantAction({
            name: String(form.get('name') ?? ''),
            slug: String(form.get('slug') ?? ''),
            planId: String(form.get('planId') ?? '') || null,
            status: String(form.get('status') ?? 'TRIAL'),
          });
          if (!result.ok || !result.id) {
            setError(result.error ?? 'Failed');
            return;
          }
          router.push(`/organizations/${result.id}`);
        });
      }}
    >
      <label className="block space-y-1 text-[12px]">
        <span className="type-meta block">Name</span>
        <input
          name="name"
          required
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-[13px]"
          onChange={(event) => setSlug(slugify(event.target.value))}
        />
      </label>
      <label className="block space-y-1 text-[12px]">
        <span className="type-meta block">Slug</span>
        <input
          name="slug"
          required
          value={slug}
          onChange={(event) => setSlug(slugify(event.target.value))}
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2 font-mono text-[13px]"
        />
      </label>
      <label className="block space-y-1 text-[12px]">
        <span className="type-meta block">Plan</span>
        <select
          name="planId"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-[13px]"
        >
          <option value="">Default (Starter)</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block space-y-1 text-[12px]">
        <span className="type-meta block">Status</span>
        <select
          name="status"
          defaultValue="TRIAL"
          className="w-full rounded-lg border border-[var(--line)] px-3 py-2 text-[13px]"
        >
          <option value="TRIAL">Trial</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </label>
      {error ? (
        <p className="text-[12px] text-[var(--danger)]">{error}</p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-[var(--ink)] px-4 py-2 text-[13px] text-white disabled:opacity-50"
      >
        Create organization
      </button>
    </form>
  );
}
