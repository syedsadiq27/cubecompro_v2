'use client';

import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Button, Field, Input } from '@repo/ui';
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
      <Field label="Name" htmlFor="identity-name">
        <Input
          id="identity-name"
          name="name"
          defaultValue={name}
          required
        />
      </Field>
      <Field label="Slug" htmlFor="identity-slug">
        <Input
          id="identity-slug"
          name="slug"
          defaultValue={slug}
          required
          className="ui:font-mono"
        />
      </Field>
      <div className="sm:col-span-2 flex items-center gap-3">
        <Button type="submit" disabled={pending} size="sm">
          Save
        </Button>
        {error ? (
          <p className="text-[12px] text-[var(--danger)]">{error}</p>
        ) : null}
      </div>
    </form>
  );
}
