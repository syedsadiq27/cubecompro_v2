import { EntitlementsCatalogView } from '@/components/entitlements/entitlements-catalog-view';
import { loadCatalog } from '@/lib/api';

export default async function EntitlementsPage() {
  let catalog = null;
  try {
    catalog = await loadCatalog();
  } catch {
    catalog = null;
  }

  const capabilities = catalog?.capabilities ?? [
    {
      key: '3d.configurator',
      label: '3D Configurator Engine',
      application: 'studio',
    },
    {
      key: 'rules.advanced',
      label: 'Advanced Dependency Rules',
      application: 'studio',
    },
    {
      key: 'api.access',
      label: 'Programmatic API Access',
      application: 'platform',
    },
    {
      key: 'connectors.commerce',
      label: 'Headless Commerce Connectors',
      application: 'platform',
    },
  ];

  return <EntitlementsCatalogView capabilities={capabilities} />;
}
