import { OrganizationEntitlementsView } from '@/components/organizations/organization-entitlements-view';
import { loadCatalog, loadResolved } from '@/lib/api';

export default async function OrganizationEntitlementsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [resolved, catalog] = await Promise.all([
    loadResolved(id),
    loadCatalog(),
  ]);

  return (
    <OrganizationEntitlementsView
      organizationId={id}
      applications={catalog.applications}
      capabilities={resolved.capabilities}
      planName={resolved.planName}
    />
  );
}
