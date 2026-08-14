import type { Plan, PlanEntitlement, ResolvedRow } from './types';

export function trialLabel(status: string, trialEndsAt?: string | null) {
  if (status === 'SUSPENDED') return 'Suspended';
  if (status !== 'TRIAL' || !trialEndsAt) {
    return status === 'ACTIVE' ? 'Active' : status;
  }
  const days = Math.ceil(
    (new Date(trialEndsAt).getTime() - Date.now()) / 86_400_000
  );
  if (days < 0) return 'Trial expired';
  return `Expires in ${days} day${days === 1 ? '' : 's'}`;
}

export function sourceLabel(source: string, planName?: string | null) {
  if (source === 'OVERRIDE') return 'Override';
  if (source === 'PARENT_PLAN') {
    return planName ? `via parent of ${planName}` : 'Parent plan';
  }
  if (source === 'PLAN') return planName ? `via ${planName}` : 'Plan';
  return 'Not included';
}

export function isOn(value: string | undefined) {
  return value === 'true' || value === '1';
}

export function limitDisplay(row: Pick<ResolvedRow, 'used' | 'limit' | 'key'>) {
  const used = row.used ?? 0;
  const limit = row.limit ?? 0;
  if (row.key === 'limits.storage.gb') return `${used} / ${limit} GB`;
  if (row.key === 'limits.ai.generations.monthly') {
    return `${used} / ${limit}`;
  }
  return `${used} / ${limit}`;
}

export function limitValueLabel(key: string, value: string) {
  if (key === 'limits.storage.gb') return `${value} GB`;
  if (key === 'limits.ai.generations.monthly') return `${value}/mo`;
  return value;
}

export function resolvePlanRows(plan: Plan, plans: Plan[]): PlanEntitlement[] {
  const chain: Plan[] = [];
  let current: Plan | undefined = plan;
  const seen = new Set<string>();
  while (current && !seen.has(current.id)) {
    seen.add(current.id);
    chain.unshift(current);
    current = plans.find((item) => item.id === current?.parentPlanId);
  }
  const map = new Map<string, PlanEntitlement>();
  for (const node of chain) {
    for (const row of node.entitlements) {
      map.set(row.key, row);
    }
  }
  return [...map.values()];
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
