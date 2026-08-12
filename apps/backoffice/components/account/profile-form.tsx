'use client';

import { useState, useTransition } from 'react';

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
      className="grid max-w-xl gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          const result = await action(formData);
          setMessage(result.ok ? 'Profile updated.' : result.error || 'Failed.');
        });
      }}
    >
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Email</span>
        <input
          value={defaults.email}
          disabled
          className="w-full rounded-xl border border-[var(--bo-line)] bg-[var(--bo-surface)] px-3 py-2 text-sm"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">First name</span>
        <input
          name="firstname"
          defaultValue={defaults.firstname}
          className="w-full rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Last name</span>
        <input
          name="lastname"
          defaultValue={defaults.lastname}
          className="w-full rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium">Role</span>
        <input
          name="role"
          defaultValue={defaults.role}
          className="w-full rounded-xl border border-[var(--bo-line)] px-3 py-2 text-sm"
        />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="bo-btn-primary rounded-xl px-4 py-2 text-sm font-medium disabled:opacity-60"
      >
        {pending ? 'Saving…' : 'Save profile'}
      </button>
      {message ? (
        <p className="text-sm text-[var(--bo-muted)]">{message}</p>
      ) : null}
    </form>
  );
}
