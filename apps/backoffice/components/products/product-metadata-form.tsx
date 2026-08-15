'use client';

import { useState, useTransition } from 'react';
import { Button, Field, Input, Typography } from '@repo/ui';
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
      <Field label="Name" htmlFor="product-meta-name">
        <Input
          id="product-meta-name"
          name="Name"
          defaultValue={defaults.Name}
        />
      </Field>
      <Field label="Key" htmlFor="product-meta-key">
        <Input
          id="product-meta-key"
          name="key"
          defaultValue={defaults.key}
        />
      </Field>
      <div className="md:col-span-2">
        <Button type="submit" size="md" disabled={pending}>
          {pending ? 'Saving…' : 'Save metadata'}
        </Button>
        {message ? (
          <Typography variant="support" className="mt-3">
            {message}
          </Typography>
        ) : null}
      </div>
    </form>
  );
}
