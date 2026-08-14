import { OrgIdentityForm } from '@/components/org-identity-form';
import { Panel } from '@/components/panel';
import { PlanSelect } from '@/components/plan-select';
import { PlanSummary } from '@/components/plan-summary';
import { loadCatalog, loadPlans, loadResolved } from '@/lib/api';
import { resolvePlanRows } from '@/lib/format';

export default async function OrganizationPlanPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [resolved, plans, catalog] = await Promise.all([
    loadResolved(id),
    loadPlans(),
    loadCatalog(),
  ]);
  const plan = plans.find((item) => item.id === resolved.planId);

  return (
    <div className="space-y-4">
      <Panel title="Assignment">
        <PlanSelect
          organizationId={id}
          planId={resolved.planId}
          status={resolved.status}
          plans={plans}
        />
        <p className="type-meta mt-3">
          Source is manual. Billing is not wired.
        </p>
      </Panel>
      <Panel title="Identity">
        <OrgIdentityForm
          organizationId={id}
          name={resolved.organizationName}
          slug={resolved.slug}
        />
      </Panel>
      {plan ? (
        <Panel title={`Resolved ${plan.name}`}>
          <PlanSummary
            catalog={catalog}
            rows={resolvePlanRows(plan, plans)}
            parentName={plan.parentName}
          />
        </Panel>
      ) : null}
    </div>
  );
}
