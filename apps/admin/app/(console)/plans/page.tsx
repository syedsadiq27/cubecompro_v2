import Link from 'next/link';
import { PageHeader } from '@/components/page-header';
import { Panel } from '@/components/panel';
import { PlanSummary } from '@/components/plan-summary';
import { loadCatalog, loadPlans } from '@/lib/api';
import { resolvePlanRows } from '@/lib/format';

export default async function PlansPage() {
  const [plans, catalog] = await Promise.all([loadPlans(), loadCatalog()]);

  return (
    <>
      <PageHeader
        title="Plans"
        description="Commercial packages. A plan is a bundle of capabilities and limits. Child plans include their parent."
        action={{ href: '/plans/new', label: 'New plan' }}
      />
      <div className="space-y-4">
        {plans.map((plan) => (
          <Panel
            key={plan.id}
            title={plan.name}
            action={
              <Link
                href={`/plans/${plan.id}`}
                className="type-meta hover:text-[var(--ink)]"
              >
                Edit
              </Link>
            }
          >
            <p className="type-meta mb-4 font-mono">{plan.key}</p>
            <PlanSummary
              catalog={catalog}
              rows={resolvePlanRows(plan, plans)}
              parentName={plan.parentName}
            />
          </Panel>
        ))}
      </div>
    </>
  );
}
