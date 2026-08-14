import { CreateOrgForm } from '@/components/create-org-form';
import { PageHeader } from '@/components/page-header';
import { loadPlans } from '@/lib/api';

export default async function NewOrganizationPage() {
  const plans = await loadPlans();
  return (
    <>
      <PageHeader
        title="New organization"
        description="Creates the tenant, owner role, and assigns a plan."
      />
      <CreateOrgForm plans={plans} />
    </>
  );
}
