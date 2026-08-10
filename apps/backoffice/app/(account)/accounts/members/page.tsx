import {
  GetAllUsersDocument,
  GetOrganizationsByUserIdDocument,
} from '@repo/graphql/generated';
import { inviteUserAction } from '../../../../actions/teams';
import { InviteForm } from '../../../../components/account/invite-form';
import {
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
} from '../../../../components/ui';
import { createGlobalClient } from '../../../../lib/graphql';
import { getSessionUser } from '../../../../lib/session-server';

export default async function MembersPage() {
  const user = await getSessionUser();
  if (!user) return null;

  let error: string | null = null;
  let users: Array<{
    id: string | number;
    email?: string | null;
    firstname?: string | null;
    lastname?: string | null;
    role?: string | null;
  }> = [];
  let organizationId = '';
  let userGroupId = '';

  try {
    const client = createGlobalClient(user.token);
    const [usersData, orgsData] = await Promise.all([
      client.global(GetAllUsersDocument),
      client.global(GetOrganizationsByUserIdDocument, { id: user.userId }),
    ]);
    users = usersData.allUsers ?? [];
    const org = orgsData.getOrganizationByUserId?.[0];
    organizationId = org?.id ? String(org.id) : '';
    userGroupId = org?.usergroups?.[0]?.id
      ? String(org.usergroups[0].id)
      : '';
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load members.';
  }

  return (
    <div>
      <PageHeader
        title="Members"
        description="Users visible to this account and invite flow."
      />
      {error ? <ErrorState message={error} /> : null}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Panel>
          <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
            Invite user
          </h3>
          {organizationId && userGroupId ? (
            <InviteForm
              organizationId={organizationId}
              userGroupId={userGroupId}
              action={inviteUserAction}
            />
          ) : (
            <p className="text-sm text-[var(--bo-muted)]">
              Join an organization with a user group before inviting members.
            </p>
          )}
        </Panel>
        <div className="space-y-3">
          {!error && users.length === 0 ? (
            <EmptyState message="No users returned." />
          ) : null}
          {users.map((member) => (
            <Panel
              key={String(member.id)}
              className="flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold">
                  {[member.firstname, member.lastname]
                    .filter(Boolean)
                    .join(' ') || member.email}
                </h3>
                <p className="text-sm text-[var(--bo-muted)]">
                  {member.email} · {member.role || 'no role'}
                </p>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
