import { OrganizationsView } from '@/components/organizations/organizations-view';
import { loadTenants } from '@/lib/api';
import type { Tenant } from '@/lib/types';

export default async function OrganizationsPage() {
  let initialTenants: Tenant[] = [];
  try {
    initialTenants = await loadTenants();
  } catch {
    initialTenants = [];
  }

  return <OrganizationsView initialTenants={initialTenants} />;
}
