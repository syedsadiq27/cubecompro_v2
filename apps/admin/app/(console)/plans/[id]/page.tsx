import { notFound } from 'next/navigation';
import { PageHeader } from '@/components/page-header';
import { Panel } from '@/components/panel';
import { PlanEditor } from '@/components/plan-editor';
import { PlanSummary } from '@/components/plan-summary';
import { loadCatalog, loadPlans } from '@/lib/api';
import { resolvePlanRows } from '@/lib/format';

export default async function PlanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [plans, catalog] = await Promise.all([loadPlans(), loadCatalog()]);
  const plan = plans.find((item) => item.id === id);
  if (!plan) notFound();

  return (
    <>
      <PageHeader
        title={plan.name}
        description={
          plan.parentName
            ? `Includes ${plan.parentName}. Rows on this plan override the parent.`
            : 'Base package.'
        }
      />
      <div className="space-y-4">
        <Panel title="Resolved package">
          <PlanSummary
            catalog={catalog}
            rows={resolvePlanRows(plan, plans)}
            parentName={plan.parentName}
          />
        </Panel>
        <Panel title="Edit this plan">
          <PlanEditor catalog={catalog} plans={plans} plan={plan} />
        </Panel>
      </div>
    </>
  );
}
