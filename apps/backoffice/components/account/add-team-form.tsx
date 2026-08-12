'use client';

import { useState, useTransition } from 'react';

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
      <input
        name="name"
        required
        placeholder="Team name"
        className="w-full rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
      />
      <button
        type="submit"
        disabled={pending}
        className="bo-btn-primary rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
      >
        {pending ? 'Creating…' : 'Create team'}
      </button>
      {message ? (
        <p className="text-sm text-[var(--bo-muted)]">{message}</p>
      ) : null}
    </form>
  );
}
