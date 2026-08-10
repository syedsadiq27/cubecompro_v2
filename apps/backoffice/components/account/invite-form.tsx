'use client';

import { useState, useTransition } from 'react';

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
      <input
        name="email"
        type="email"
        required
        placeholder="user@example.com"
        className="w-full rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-xl bg-[var(--bo-ink)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {pending ? 'Inviting…' : 'Invite'}
      </button>
      {message ? (
        <p className="text-sm text-[var(--bo-muted)]">{message}</p>
      ) : null}
    </form>
  );
}
