'use client';

import { useActionState, useState } from 'react';
import { Button, Field, Input } from '@repo/ui';
import type { ActionResult } from '@/actions/auth';

const initial: ActionResult = { ok: false };

export function AuthForm({
  action,
  submitLabel,
  children,
  successMessage,
}: {
  action: (
    prev: ActionResult,
    formData: FormData
  ) => Promise<ActionResult>;
  submitLabel: string;
  children: React.ReactNode;
  successMessage?: string;
}) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-4">
      {children}

      {state.error ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-3 text-[12px] text-red-800">
          <span className="font-bold">!</span>
          <span>{state.error}</span>
        </div>
      ) : null}

      {state.ok && successMessage ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-[12px] text-emerald-800">
          {successMessage}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="w-full ui:h-11 ui:rounded-xl ui:text-[13px]"
      >
        {pending ? 'Signing in…' : submitLabel}
      </Button>
    </form>
  );
}

export function EmailField({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <Field label="Work email" htmlFor="email">
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </span>
        <Input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="name@company.com"
          value={value}
          onChange={onChange}
          className="ui:h-11 ui:rounded-xl ui:pl-10"
        />
      </div>
    </Field>
  );
}

export function PasswordField({
  value,
  onChange,
}: {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Field label="Password" htmlFor="password">
      <div className="relative">
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </span>
        <Input
          id="password"
          name="password"
          type={showPassword ? 'text' : 'password'}
          required
          autoComplete="current-password"
          placeholder="Enter your password"
          value={value}
          onChange={onChange}
          className="ui:h-11 ui:rounded-xl ui:pl-10 ui:pr-10"
        />
        <button
          type="button"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--ink)]"
        >
          {showPassword ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </button>
      </div>
    </Field>
  );
}

export function AuthTextField({
  label,
  name,
  type = 'text',
  autoComplete,
  required = true,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <Field label={label} htmlFor={name}>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className="ui:h-11 ui:rounded-xl"
      />
    </Field>
  );
}
