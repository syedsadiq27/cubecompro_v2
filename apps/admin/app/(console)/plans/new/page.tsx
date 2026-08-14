import { PageHeader } from '@/components/page-header';
import { PlanEditor } from '@/components/plan-editor';
import { loadCatalog, loadPlans } from '@/lib/api';

export default async function NewPlanPage() {
  const [plans, catalog] = await Promise.all([loadPlans(), loadCatalog()]);
  return (
    <>
      <PageHeader
        title="New plan"
        description="Capabilities and limits on this plan. Include a parent to inherit, then override rows here."
      />
      <PlanEditor catalog={catalog} plans={plans} />
    </>
  );
}
