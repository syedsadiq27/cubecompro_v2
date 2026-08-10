import {
  GetOrganizationsByUserIdDocument,
  GetUserGroupsByOrganizationIdDocument,
} from '@repo/graphql/generated';
import { addUserGroupAction } from '../../../../actions/teams';
import { AddTeamForm } from '../../../../components/account/add-team-form';
import {
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
} from '../../../../components/ui';
import { createGlobalClient } from '../../../../lib/graphql';
import { getSessionUser } from '../../../../lib/session-server';

export default async function UserGroupsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  let error: string | null = null;
  let groups: Array<{
    id: string | number;
    name?: string | null;
    organizationId?: string | number | null;
    members?: Array<unknown> | null;
  }> = [];
  let organizationId = '';

  try {
    const client = createGlobalClient(user.token);
    const orgs = await client.global(GetOrganizationsByUserIdDocument, {
      id: user.userId,
    });
    const org = orgs.getOrganizationByUserId?.[0];
    organizationId = org?.id ? String(org.id) : '';
    if (organizationId) {
      const data = await client.global(GetUserGroupsByOrganizationIdDocument, {
        id: organizationId,
      });
      groups = data.getUsergroupByOrganizationId ?? [];
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load teams.';
  }

  return (
    <div>
      <PageHeader
        title="Teams"
        description="User groups within your organization."
      />
      {error ? <ErrorState message={error} /> : null}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Panel>
          <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
            Create team
          </h3>
          {organizationId ? (
            <AddTeamForm
              organizationId={organizationId}
              action={addUserGroupAction}
            />
          ) : (
            <p className="text-sm text-[var(--bo-muted)]">
              No organization available for creating teams.
            </p>
          )}
        </Panel>
        <div className="space-y-3">
          {!error && groups.length === 0 ? (
            <EmptyState message="No teams yet." />
          ) : null}
          {groups.map((group) => (
            <Panel key={String(group.id)}>
              <h3 className="font-semibold">{group.name}</h3>
              <p className="mt-1 text-sm text-[var(--bo-muted)]">
                {group.members?.length ?? 0} members
              </p>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
