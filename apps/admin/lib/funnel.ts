export const FUNNEL = [
  { id: 'new', label: 'New' },
  { id: 'contacted', label: 'Contacted' },
  { id: 'qualified', label: 'Qualified' },
  { id: 'session', label: 'Session' },
  { id: 'won', label: 'Won' },
  { id: 'lost', label: 'Lost' },
] as const;

export type FunnelId = (typeof FUNNEL)[number]['id'];

const ALIASES: Record<string, FunnelId> = {
  new: 'new',
  inbound: 'new',
  unread: 'new',
  open: 'new',
  contacted: 'contacted',
  reached: 'contacted',
  emailed: 'contacted',
  called: 'contacted',
  qualified: 'qualified',
  fit: 'qualified',
  session: 'session',
  demo: 'session',
  booked: 'session',
  scheduled: 'session',
  meeting: 'session',
  won: 'won',
  customer: 'won',
  closed: 'won',
  signed: 'won',
  converted: 'won',
  lost: 'lost',
  declined: 'lost',
  disqualified: 'lost',
  spam: 'lost',
  no: 'lost',
};

export function isFunnelId(value: string): value is FunnelId {
  return FUNNEL.some((stage) => stage.id === value);
}

export function normalizeFunnel(value: string | undefined | null): FunnelId {
  const key = (value ?? '').trim().toLowerCase();
  if (!key) return 'new';
  if (isFunnelId(key)) return key;
  return ALIASES[key] ?? 'new';
}

export const FUNNEL_TONE: Record<FunnelId, string> = {
  new: 'bg-[var(--brand-soft)] text-[var(--brand)]',
  contacted: 'bg-[var(--surface)] text-[var(--text-secondary)]',
  qualified: 'bg-[#eef4ff] text-[#2f5aa8]',
  session: 'bg-[#f3eefc] text-[#6b3fa0]',
  won: 'bg-[var(--success-soft)] text-[var(--success)]',
  lost: 'bg-[var(--danger-soft)] text-[var(--danger)]',
};
