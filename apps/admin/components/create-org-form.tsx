'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button, Field, Input, Select } from '@repo/ui';
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
      <Field label="Name" htmlFor="org-name">
        <Input
          id="org-name"
          name="name"
          required
          onChange={(event) => setSlug(slugify(event.target.value))}
        />
      </Field>
      <Field label="Slug" htmlFor="org-slug">
        <Input
          id="org-slug"
          name="slug"
          required
          value={slug}
          onChange={(event) => setSlug(slugify(event.target.value))}
          className="ui:font-mono"
        />
      </Field>
      <Field label="Plan" htmlFor="org-plan">
        <Select id="org-plan" name="planId">
          <option value="">Default (Starter)</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Status" htmlFor="org-status">
        <Select id="org-status" name="status" defaultValue="TRIAL">
          <option value="TRIAL">Trial</option>
          <option value="ACTIVE">Active</option>
          <option value="SUSPENDED">Suspended</option>
        </Select>
      </Field>
      {error ? (
        <p className="text-[12px] text-[var(--danger)]">{error}</p>
      ) : null}
      <Button type="submit" disabled={pending}>
        Create organization
      </Button>
    </form>
  );
}
