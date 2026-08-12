'use client';

import { useState, useTransition } from 'react';

type Field = {
  name: string;
  label: string;
  value?: string;
  type?: string;
};

export function SettingsForm({
  fields,
  onSave,
  onDelete,
}: {
  fields: Field[];
  onSave: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  onDelete?: () => Promise<{ ok: boolean; error?: string }>;
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
          const result = await onSave(formData);
          setMessage(result.ok ? 'Saved.' : result.error || 'Save failed.');
        });
      }}
    >
      {fields.map((field) =>
        field.type === 'hidden' ? (
          <input
            key={field.name}
            type="hidden"
            name={field.name}
            defaultValue={field.value}
          />
        ) : (
          <label key={field.name} className="block space-y-1.5">
            <span className="text-sm font-medium">{field.label}</span>
            <input
              name={field.name}
              type={field.type || 'text'}
              defaultValue={field.value}
              className="w-full rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
            />
          </label>
        )
      )}
      <div className="flex flex-wrap gap-2 md:col-span-2">
        <button
          type="submit"
          disabled={pending}
          className="bo-btn-primary rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
        {onDelete ? (
          <button
            type="button"
            disabled={pending}
            onClick={() => {
              if (!confirm('Delete this configuration?')) return;
              startTransition(async () => {
                const result = await onDelete();
                setMessage(
                  result.ok ? 'Deleted.' : result.error || 'Delete failed.'
                );
              });
            }}
            className="rounded-xl border border-[var(--bo-line)] px-4 py-2 text-sm text-[var(--bo-danger)]"
          >
            Delete
          </button>
        ) : null}
      </div>
      {message ? (
        <p className="text-sm text-[var(--bo-muted)] md:col-span-2">{message}</p>
      ) : null}
    </form>
  );
}
