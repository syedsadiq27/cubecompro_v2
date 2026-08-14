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
