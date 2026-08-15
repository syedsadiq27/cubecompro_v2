import { cn } from '@repo/ui';
import type { ReactNode } from 'react';

type FeedbackTone = 'neutral' | 'success' | 'warning' | 'danger';

const TONE: Record<FeedbackTone, string> = {
  neutral: 'border-[var(--line)] bg-[var(--surface)] text-[var(--text-secondary)]',
  success: 'border-[var(--success)]/25 bg-[var(--success-soft)] text-[var(--success)]',
  warning: 'border-[var(--warning)]/25 bg-[var(--warning-soft)] text-[var(--warning)]',
  danger: 'border-[var(--danger)]/25 bg-[var(--danger-soft)] text-[var(--danger)]',
};

/** Field/section-tied feedback — not for toastable background events. */
export function InlineFeedback({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: FeedbackTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="status"
      className={cn(
        'rounded border px-2.5 py-1.5 text-[12px]',
        TONE[tone],
        className
      )}
    >
      {children}
    </div>
  );
}

/**
 * Toast pattern (local until a shared toaster exists):
 * Use for saved / copied / background complete / non-blocking failure.
 * Do not use for validation, destructive confirmation, or blocking errors —
 * use InlineFeedback or a confirmation dialog instead.
 */
export function ToastCopy({
  kind,
  subject,
}: {
  kind: 'saved' | 'copied' | 'completed' | 'failed';
  subject?: string;
}) {
  const label = subject ? `${subject} ` : '';
  if (kind === 'saved') return `${label}saved`;
  if (kind === 'copied') return 'Copied to clipboard';
  if (kind === 'completed') return `${label}completed`;
  return `${label}failed`;
}
