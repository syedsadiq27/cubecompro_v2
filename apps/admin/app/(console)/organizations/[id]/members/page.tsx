import { OrganizationMembersView } from '@/components/organizations/organization-members-view';
import { loadResolved } from '@/lib/api';

export default async function OrganizationMembersPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const resolved = await loadResolved(id);

  return <OrganizationMembersView members={resolved.members} />;
}
