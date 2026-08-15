import {
  EmptyState,
  ErrorState,
} from '@/components/ui';
import { PageChrome } from '@/components/ui/page-chrome';
import { Panel } from '@repo/ui';
import { graphRequest } from '@repo/product-graph';
import {
  ME_QUERY,
  ORGANIZATION_ROLES_QUERY,
} from '@repo/product-graph';
import { getSessionUser } from '@/lib/session-server';

export default async function UserGroupsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  let error: string | null = null;
  let roles: Array<{ id: string; name: string }> = [];

  try {
    const me = await graphRequest<{
      me: { organizationId?: string | null };
    }>(ME_QUERY, undefined, user.token);
    const organizationId = me.me.organizationId;
    if (organizationId) {
      const data = await graphRequest<{
        organizationRoles: Array<{ id: string; name: string }>;
      }>(
        ORGANIZATION_ROLES_QUERY,
        { organizationId },
        user.token
      );
      roles = data.organizationRoles;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load roles.';
  }

  return (
    <PageChrome
      title="Roles"
      description="Organization roles replace legacy user groups in CubeCom v1."
    >
      {error ? <ErrorState message={error} /> : null}
      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Panel>
          <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
            Create role
          </h3>
          <p className="text-sm text-[var(--text-secondary)]">
            Creating roles is not enabled on CubeCom API yet.
          </p>
        </Panel>
        <div className="space-y-3">
          {!error && roles.length === 0 ? (
            <EmptyState message="No roles yet." />
          ) : null}
          {roles.map((role) => (
            <Panel key={role.id}>
              <h3 className="font-semibold">{role.name}</h3>
            </Panel>
          ))}
        </div>
      </div>
    </PageChrome>
  );
}
