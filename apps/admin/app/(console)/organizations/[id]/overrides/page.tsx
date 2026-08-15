import { OverrideForm } from '@/components/override-form';
import { Panel } from '@/components/suite-ui';
import { loadCatalog, loadResolved } from '@/lib/api';

export default async function OrganizationOverridesPage({
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
    <Panel title="Overrides">
      <p className="type-meta mb-4">
        Overrides beat the plan for this tenant only. Removing one restores the
        plan value.
      </p>
      <OverrideForm
        organizationId={id}
        overrides={resolved.overrides}
        catalog={catalog}
      />
    </Panel>
  );
}
