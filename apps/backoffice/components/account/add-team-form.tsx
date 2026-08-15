'use client';

import { useState, useTransition } from 'react';
import { Button, Field, Input, Typography } from '@repo/ui';

export function AddTeamForm({
  organizationId,
  action,
}: {
  organizationId: string;
  action: (formData: FormData) => Promise<{ ok: boolean; error?: string }>;
}) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <form
      className="space-y-3"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        formData.set('organizationId', organizationId);
        startTransition(async () => {
          const result = await action(formData);
          setMessage(result.ok ? 'Team created.' : result.error || 'Failed.');
          if (result.ok) event.currentTarget.reset();
        });
      }}
    >
      <Field label="Team name" htmlFor="team-name">
        <Input
          id="team-name"
          name="name"
          required
          placeholder="Team name"
        />
      </Field>
      <Button type="submit" disabled={pending} size="md">
        {pending ? 'Creating…' : 'Create team'}
      </Button>
      {message ? (
        <Typography variant="support">{message}</Typography>
      ) : null}
    </form>
  );
}
