'use client';

import { useActionState } from 'react';
import { loginAction, type ActionResult } from '@/actions/auth';

const initial: ActionResult = { ok: false };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-[var(--ink)]">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue="owner@demo.cubecom.dev"
          className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm outline-none ring-[var(--stage-violet)] focus:ring-2"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-sm font-medium text-[var(--ink)]">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-[var(--line)] bg-white px-3 py-2.5 text-sm outline-none ring-[var(--stage-violet)] focus:ring-2"
        />
      </label>
      {state.error ? (
        <p className="rounded-xl bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">
          {state.error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-[var(--ink)] px-4 py-3 text-sm font-medium text-white transition hover:bg-black disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
