import { loadPlans } from '@/lib/api';
import Link from 'next/link';
import { PageHeader } from '@/components/suite-ui';
import type { Plan } from '@/lib/types';

export default async function PlansPage() {
  let plans: Plan[] = [];
  try {
    plans = await loadPlans();
  } catch {
    plans = [];
  }

  return (
    <div className="flex h-full min-h-0 flex-1 overflow-hidden bg-[var(--canvas)] select-none">
      <div className="flex min-w-0 flex-1 flex-col overflow-y-auto">
        <PageHeader
          title="Plans"
          count={plans.length}
          description="Commercial packages, default limits, quotas, and pricing tier definitions."
          action={
            <Link
              href="/plans/new"
              className="rounded-lg bg-[var(--ink)] hover:bg-black px-3.5 py-1.5 text-[12px] font-semibold text-white transition-colors cursor-pointer"
            >
              + New plan
            </Link>
          }
        />

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.length > 0 ? (
              plans.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-4 shadow-2xs space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[14px] font-bold text-[var(--ink)]">{plan.name}</h3>
                      <p className="font-mono text-[11px] text-[var(--text-muted)] mt-0.5">{plan.key}</p>
                    </div>
                    {plan.parentName && (
                      <span className="rounded border border-[var(--line)] bg-[var(--canvas)] px-1.5 py-0.2 font-mono text-[9px] text-[var(--text-secondary)]">
                        inherits {plan.parentName}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 text-[11px] pt-2 border-t border-[var(--line)]">
                    <span className="font-mono text-[10px] text-[var(--text-muted)] uppercase tracking-wider block font-semibold">
                      Entitlements ({plan.entitlements.length})
                    </span>
                    <ul className="space-y-1">
                      {plan.entitlements.slice(0, 4).map((ent: { id: string; key: string; value: string }) => (
                        <li key={ent.id} className="flex items-center justify-between text-[var(--text-secondary)]">
                          <span>{ent.key}</span>
                          <span className="font-mono text-[10px]">{ent.value}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2">
                    <Link
                      href={`/plans/${plan.id}`}
                      className="block text-center rounded border border-[var(--line)] bg-[var(--canvas)]/40 py-1 text-[11px] font-medium text-[var(--ink)] hover:bg-[var(--canvas)]"
                    >
                      Edit plan limits →
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)] p-8 text-center text-[12px] text-[var(--text-muted)]">
                No custom plans created yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
