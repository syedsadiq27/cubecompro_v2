'use client';

import { useTransition } from 'react';
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
      <input
        name="name"
        required
        placeholder="Name"
        className="w-full rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
      />
      <textarea
        name="description"
        placeholder="Description"
        rows={3}
        className="w-full rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="bo-btn-primary rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
      >
        {pending ? 'Adding…' : 'Add category'}
      </button>
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
      className="text-sm text-[var(--bo-danger)] hover:underline disabled:opacity-60"
    >
      {pending ? 'Deleting…' : 'Delete'}
    </button>
  );
}
