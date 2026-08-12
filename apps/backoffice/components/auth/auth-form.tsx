'use client';

import { useActionState } from 'react';
import type { ActionResult } from '@/actions/auth';

const initial: ActionResult = { ok: false };

export function AuthForm({
  action,
  submitLabel,
  children,
  successMessage,
}: {
  action: (prev: ActionResult, formData: FormData) => Promise<ActionResult>;
  submitLabel: string;
  children: React.ReactNode;
  successMessage?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-4">
      {children}
      {state.error ? (
        <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-[var(--bo-danger)]">
          {state.error}
        </p>
      ) : null}
      {state.ok && successMessage ? (
        <p className="rounded-xl bg-emerald-50 px-3 py-2 text-sm text-[var(--bo-success)]">
          {successMessage}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="w-full bo-btn-primary rounded-xl px-4 py-3 text-sm font-medium transition disabled:opacity-60"
      >
        {pending ? 'Please wait…' : submitLabel}
      </button>
    </form>
  );
}

export function Field({
  label,
  name,
  type = 'text',
  required = true,
  autoComplete,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  autoComplete?: string;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-medium text-[var(--bo-ink)]">{label}</span>
      <input
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-[var(--bo-line)] bg-white px-3 py-2.5 text-sm outline-none ring-[var(--bo-accent)] focus:ring-2"
      />
    </label>
  );
}
