'use client';

import { useActionState } from 'react';
import { Button, Field, Input } from '@repo/ui';
import { loginAction, type ActionResult } from '@/actions/auth';

const initial: ActionResult = { ok: false };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initial);

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Email" htmlFor="admin-email">
        <Input
          id="admin-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          defaultValue="owner@demo.cubecom.dev"
        />
      </Field>
      <Field label="Password" htmlFor="admin-password">
        <Input
          id="admin-password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </Field>
      {state.error ? (
        <p className="rounded-xl bg-[var(--danger-soft)] px-3 py-2 text-sm text-[var(--danger)]">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" disabled={pending} className="ui:w-full" size="lg">
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
