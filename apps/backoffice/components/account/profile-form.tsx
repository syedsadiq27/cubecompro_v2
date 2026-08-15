'use client';

import { useState, useTransition } from 'react';
import { Button, Field, Input, Typography } from '@repo/ui';

export function ProfileForm({
  defaults,
  action,
}: {
  defaults: {
    firstname: string;
    lastname: string;
    role: string;
    email: string;
  };
  action: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="grid max-w-xl gap-3.5"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await action(formData);
          setMessage(result.ok ? 'Profile updated.' : result.error || 'Failed.');
        });
      }}
    >
      <Field label="Email" htmlFor="email">
        <Input id="email" value={defaults.email} disabled />
      </Field>
      <Field label="First name" htmlFor="firstname">
        <Input
          id="firstname"
          name="firstname"
          defaultValue={defaults.firstname}
        />
      </Field>
      <Field label="Last name" htmlFor="lastname">
        <Input
          id="lastname"
          name="lastname"
          defaultValue={defaults.lastname}
        />
      </Field>
      <Field label="Role" htmlFor="role">
        <Input id="role" name="role" defaultValue={defaults.role} />
      </Field>
      <Button type="submit" disabled={pending} size="md">
        {pending ? 'Saving…' : 'Save profile'}
      </Button>
      {message ? (
        <Typography variant="support">{message}</Typography>
      ) : null}
    </form>
  );
}
