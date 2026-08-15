import {
  EmptyState,
  ErrorState,
} from '@/components/ui';
import { PageChrome } from '@/components/ui/page-chrome';
import { Panel } from '@repo/ui';
import { graphRequest } from '@repo/product-graph';
import {
  ME_QUERY,
  ORGANIZATION_QUERY,
  ORGANIZATION_ROLES_QUERY,
} from '@repo/product-graph';
import { getSessionUser } from '@/lib/session-server';

export default async function OrganizationsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  let error: string | null = null;
  let organization: {
    id: string;
    name: string;
    slug: string;
  } | null = null;
  let roles: Array<{ id: string; name: string }> = [];

  try {
    const me = await graphRequest<{
      me: { organizationId?: string | null };
    }>(ME_QUERY, undefined, user.token);

    const organizationId = me.me.organizationId;
    if (organizationId) {
      const [orgData, rolesData] = await Promise.all([
        graphRequest<{
          organization: { id: string; name: string; slug: string };
        }>(ORGANIZATION_QUERY, { id: organizationId }, user.token),
        graphRequest<{
          organizationRoles: Array<{ id: string; name: string }>;
        }>(
          ORGANIZATION_ROLES_QUERY,
          { organizationId },
          user.token
        ),
      ]);
      organization = orgData.organization;
      roles = rolesData.organizationRoles;
    }
  } catch (err) {
    error =
      err instanceof Error ? err.message : 'Failed to load organizations.';
  }

  return (
    <PageChrome
      title="Organizations"
      description="Organization associated with your account."
    >
      {error ? <ErrorState message={error} /> : null}
      {!error && !organization ? (
        <EmptyState message="No organizations found." />
      ) : null}
      {organization ? (
        <div className="grid gap-3 md:grid-cols-2">
          <Panel>
            <h3 className="text-base font-semibold">{organization.name}</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              {organization.slug} · {roles.length} roles
            </p>
            <ul className="mt-4 space-y-1 text-sm text-[var(--text-secondary)]">
              {roles.map((role) => (
                <li key={role.id}>{role.name}</li>
              ))}
            </ul>
          </Panel>
        </div>
      ) : null}
    </PageChrome>
  );
}
