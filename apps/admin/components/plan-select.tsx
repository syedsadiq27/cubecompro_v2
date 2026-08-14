'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { assignPlanAction, setStatusAction } from '@/actions/tenants';
import type { Plan } from '@/lib/types';

export function PlanSelect({
  organizationId,
  planId,
  status,
  plans,
}: {
  organizationId: string;
  planId?: string | null;
  status: string;
  plans: Plan[];
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <label className="space-y-1 text-[12px]">
        <span className="type-meta block">Plan</span>
        <select
          defaultValue={planId ?? ''}
          disabled={pending}
          className="w-full rounded-lg border border-[var(--line)] px-2 py-2 text-[13px]"
          onChange={(event) => {
            const next = event.target.value;
            if (!next) return;
            start(async () => {
              await assignPlanAction(organizationId, next);
              router.refresh();
            });
          }}
        >
          <option value="">None</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>
              {plan.name}
              {plan.parentName ? ` · includes ${plan.parentName}` : ''}
            </option>
          ))}
        </select>
      </label>
      <label className="space-y-1 text-[12px]">
        <span className="type-meta block">Status</span>
        <select
          defaultValue={status}
          disabled={pending}
          className="w-full rounded-lg border border-[var(--line)] px-2 py-2 text-[13px]"
          onChange={(event) => {
            start(async () => {
              await setStatusAction(organizationId, event.target.value);
              router.refresh();
            });
          }}
        >
          <option value="ACTIVE">Active</option>
          <option value="TRIAL">Trial</option>
          <option value="SUSPENDED">Suspended</option>
        </select>
      </label>
    </div>
  );
}
