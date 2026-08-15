'use client';

import { useTransition } from 'react';
import { Button, Field, Input, Textarea } from '@repo/ui';
import type { CategoryResult } from '@/actions/categories';

export function CategoryAddForm({
  projectId,
  action,
}: {
  projectId: string;
  action: (projectId: string, formData: FormData) => Promise<CategoryResult>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          await action(projectId, formData);
          event.currentTarget.reset();
        });
      }}
    >
      <Field label="Name" htmlFor="category-name">
        <Input
          id="category-name"
          name="name"
          required
          placeholder="Name"
        />
      </Field>
      <Field label="Description" htmlFor="category-description">
        <Textarea
          id="category-description"
          name="description"
          placeholder="Description"
          rows={3}
        />
      </Field>
      <Button type="submit" size="md" disabled={pending}>
        {pending ? 'Adding…' : 'Add category'}
      </Button>
    </form>
  );
}

export function CategoryDeleteButton({
  projectId,
  categoryId,
  action,
}: {
  projectId: string;
  categoryId: string;
  action: (projectId: string, categoryId: string) => Promise<CategoryResult>;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm('Delete this category?')) return;
        startTransition(async () => {
          await action(projectId, categoryId);
        });
      }}
      className="text-sm text-[var(--danger)] hover:underline disabled:opacity-60"
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
