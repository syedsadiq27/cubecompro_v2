'use client';

import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Field, Select } from '@repo/ui';
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
      <Field label="Plan" htmlFor="plan-select">
        <Select
          id="plan-select"
          defaultValue={planId ?? ''}
          disabled={pending}
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
        </Select>
      </Field>
      <Field label="Status" htmlFor="status-select">
        <Select
          id="status-select"
          defaultValue={status}
          disabled={pending}
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
        </Select>
      </Field>
    </div>
  );
}
