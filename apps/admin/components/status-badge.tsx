import { trialLabel } from '@/lib/format';

const TONE: Record<string, string> = {
  ACTIVE: 'bg-[var(--success-soft)] text-[var(--success)]',
  TRIAL: 'bg-[var(--brand-soft)] text-[var(--brand)]',
  SUSPENDED: 'bg-[var(--danger-soft)] text-[var(--danger)]',
};

export function StatusBadge({
  status,
  trialEndsAt,
}: {
  status: string;
  trialEndsAt?: string | null;
}) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${
        TONE[status] ?? 'bg-[var(--surface)] text-[var(--text-muted)]'
      }`}
    >
      {trialLabel(status, trialEndsAt)}
    </span>
  );
}
