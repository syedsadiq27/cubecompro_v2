'use client';

import { useState, useTransition } from 'react';
import { Button, Field, Input, Typography } from '@repo/ui';

type SettingsField = {
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
  fields: SettingsField[];
  onSave: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
  onDelete?: () => Promise<{ ok: boolean; error?: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="grid gap-3.5 md:grid-cols-2"
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
          <Field
            key={field.name}
            label={field.label}
            htmlFor={field.name}
          >
            <Input
              id={field.name}
              name={field.name}
              type={field.type || 'text'}
              defaultValue={field.value}
            />
          </Field>
        )
      )}
      <div className="flex flex-wrap gap-2 md:col-span-2">
        <Button type="submit" disabled={pending} size="md">
          {pending ? 'Saving…' : 'Save'}
        </Button>
        {onDelete ? (
          <Button
            type="button"
            disabled={pending}
            variant="danger"
            size="md"
            onClick={() => {
              if (!confirm('Delete this configuration?')) return;
              startTransition(async () => {
                const result = await onDelete();
                setMessage(
                  result.ok ? 'Deleted.' : result.error || 'Delete failed.'
                );
              });
            }}
          >
            Delete
          </Button>
        ) : null}
      </div>
      {message ? (
        <Typography variant="support" className="md:col-span-2">
          {message}
        </Typography>
      ) : null}
    </form>
  );
}
