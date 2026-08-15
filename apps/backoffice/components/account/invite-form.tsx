'use client';

import { useState, useTransition } from 'react';
import { Button, Field, Input, Typography } from '@repo/ui';

export function InviteForm({
  organizationId,
  userGroupId,
  action,
}: {
  organizationId: string;
  userGroupId: string;
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
        formData.set('userGroupId', userGroupId);
        startTransition(async () => {
          const result = await action(formData);
          setMessage(result.ok ? 'Invite sent.' : result.error || 'Failed.');
          if (result.ok) event.currentTarget.reset();
        });
      }}
    >
      <Field label="Email" htmlFor="invite-email">
        <Input
          id="invite-email"
          name="email"
          type="email"
          required
          placeholder="user@example.com"
        />
      </Field>
      <Button type="submit" disabled={pending} size="md">
        {pending ? 'Inviting…' : 'Invite'}
      </Button>
      {message ? (
        <Typography variant="support">{message}</Typography>
      ) : null}
    </form>
  );
}
