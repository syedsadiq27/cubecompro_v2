'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState, type FormEvent } from 'react';
import { SITE_EMAIL } from '../../lib/site';

type Interest =
  | 'solution-session'
  | 'starter'
  | 'pro'
  | 'enterprise'
  | 'addons';

type FormState = {
  name: string;
  email: string;
  company: string;
  interest: Interest;
  message: string;
};

const initial: FormState = {
  name: '',
  email: '',
  company: '',
  interest: 'solution-session',
  message: '',
};

const interestLabels: Record<Interest, string> = {
  'solution-session': 'CubeCom session — map our catalog',
  starter: 'Starter — founding plan',
  pro: 'Pro — founding plan',
  enterprise: 'Enterprise / custom',
  addons: 'Add-ons (decoration / image generation)',
};

function isInterest(value: string | null): value is Interest {
  return Boolean(value && value in interestLabels);
}

const FORM_ACTION =
  process.env.NEXT_PUBLIC_GOOGLE_FORM_ACTION_URL ??
  'https://docs.google.com/forms/d/e/1FAIpQLSfwtbtFa3lTY6zwicYrRVMes_fO5BettdFGuCIUGbIsr8PjpQ/formResponse';

const ENTRIES = {
  name: process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_NAME ?? 'entry.435239021',
  email: process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_EMAIL ?? 'entry.1071731696',
  company:
    process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_COMPANY ?? 'entry.101350201',
  interest:
    process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_INTEREST ?? 'entry.1712282821',
  message:
    process.env.NEXT_PUBLIC_GOOGLE_FORM_ENTRY_MESSAGE ?? 'entry.841298509',
};

async function submitForm(values: FormState) {
  const body = new URLSearchParams();
  body.set(ENTRIES.name, values.name);
  body.set(ENTRIES.email, values.email);
  body.set(ENTRIES.company, values.company);
  body.set(ENTRIES.interest, interestLabels[values.interest]);
  body.set(
    ENTRIES.message,
    values.message ||
      'I’d like a CubeCom session to map our catalog, option rules, and commerce path.'
  );

  await fetch(FORM_ACTION, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
}

function ContactForm() {
  const searchParams = useSearchParams();
  const [form, setForm] = useState<FormState>(initial);
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>(
    'idle'
  );

  useEffect(() => {
    const interest = searchParams.get('interest');
    if (isInterest(interest)) {
      setForm((current) => ({ ...current, interest }));
    }
  }, [searchParams]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus('sending');
    try {
      await submitForm(form);
      setStatus('sent');
      setForm(initial);
    } catch {
      setStatus('error');
    }
  }

  const fieldClass =
    'mt-1.5 w-full rounded-lg border border-[var(--border-strong)] bg-[var(--surface-pure)] px-3.5 py-2.5 text-sm text-[var(--ink)] outline-none transition focus:border-[var(--ink)]';

  return (
    <form onSubmit={onSubmit} className="mt-10 grid gap-5 sm:grid-cols-2">
      <label className="block text-sm text-[var(--text-secondary)]">
        Name
        <input
          required
          name="name"
          value={form.name}
          onChange={(event) =>
            setForm((current) => ({ ...current, name: event.target.value }))
          }
          className={fieldClass}
        />
      </label>
      <label className="block text-sm text-[var(--text-secondary)]">
        Work email
        <input
          required
          type="email"
          name="email"
          value={form.email}
          onChange={(event) =>
            setForm((current) => ({ ...current, email: event.target.value }))
          }
          className={fieldClass}
        />
      </label>
      <label className="block text-sm text-[var(--text-secondary)] sm:col-span-2">
        Company
        <input
          name="company"
          value={form.company}
          onChange={(event) =>
            setForm((current) => ({ ...current, company: event.target.value }))
          }
          className={fieldClass}
        />
      </label>
      <label className="block text-sm text-[var(--text-secondary)] sm:col-span-2">
        Interest
        <select
          name="interest"
          value={form.interest}
          onChange={(event) =>
            setForm((current) => ({
              ...current,
              interest: event.target.value as Interest,
            }))
          }
          className={fieldClass}
        >
          {Object.entries(interestLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm text-[var(--text-secondary)] sm:col-span-2">
        Anything we should know
        <textarea
          name="message"
          rows={4}
          value={form.message}
          onChange={(event) =>
            setForm((current) => ({ ...current, message: event.target.value }))
          }
          className={fieldClass}
        />
      </label>

      <div className="sm:col-span-2">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded-lg bg-[var(--ink)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--ink)]/90 disabled:opacity-60"
        >
          {status === 'sending' ? 'Sending…' : 'Request a session'}
        </button>
        {status === 'sent' ? (
          <p className="mt-3 text-sm text-[var(--success)]">
            Thanks — we’ll follow up shortly.
          </p>
        ) : null}
        {status === 'error' ? (
          <p className="mt-3 text-sm text-[var(--danger)]">
            Something went wrong. Email us at {SITE_EMAIL}.
          </p>
        ) : null}
      </div>
    </form>
  );
}

export function Contact() {
  return (
    <section
      id="contact"
      className="border-t border-[var(--line)] bg-[var(--canvas)]"
    >
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-20 md:px-8 lg:grid-cols-[1fr_1.1fr] lg:py-28">
        <div>
          <p className="text-sm text-[var(--text-muted)]">CubeCom session</p>
          <h2 className="type-page mt-3 max-w-md text-[clamp(1.85rem,3.5vw,2.85rem)]">
            Thirty minutes on your product — not our slides.
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-[var(--text-secondary)]">
            Bring a catalog slice, your option rules, and how you sell today.
            We map the right surfaces and where the product graph should sit.
          </p>
        </div>
        <Suspense fallback={<div className="mt-10 h-64 animate-pulse rounded-lg bg-[var(--surface)]" />}>
          <ContactForm />
        </Suspense>
      </div>
    </section>
  );
}
