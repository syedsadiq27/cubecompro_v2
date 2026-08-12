import {
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
} from '@/components/ui';
import { graphRequest } from '@repo/product-graph';
import {
  ME_QUERY,
  ORGANIZATION_MEMBERS_QUERY,
} from '@repo/product-graph';
import { getSessionUser } from '@/lib/session-server';

export default async function MembersPage() {
  const user = await getSessionUser();
  if (!user) return null;

  let error: string | null = null;
  let members: Array<{
    id: string;
    email: string;
    name?: string | null;
    roleName: string;
  }> = [];

  try {
    const me = await graphRequest<{
      me: { organizationId?: string | null };
    }>(ME_QUERY, undefined, user.token);
    const organizationId = me.me.organizationId;
    if (organizationId) {
      const data = await graphRequest<{
        organizationMembers: Array<{
          id: string;
          email: string;
          name?: string | null;
          roleName: string;
        }>;
      }>(
        ORGANIZATION_MEMBERS_QUERY,
        { organizationId },
        user.token
      );
      members = data.organizationMembers;
    }
  } catch (err) {
    error = err instanceof Error ? err.message : 'Failed to load members.';
  }

  return (
    <div>
      <PageHeader
        title="Members"
        description="Organization memberships from CubeCom."
      />
      {error ? <ErrorState message={error} /> : null}
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Panel>
          <h3 className="mb-4 text-sm font-semibold tracking-wide uppercase">
            Invite user
          </h3>
          <p className="text-sm text-[var(--bo-muted)]">
            Member invites are not enabled on CubeCom API yet.
          </p>
        </Panel>
        <div className="space-y-3">
          {!error && members.length === 0 ? (
            <EmptyState message="No members returned." />
          ) : null}
          {members.map((member) => (
            <Panel
              key={member.id}
              className="flex items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold">
                  {member.name || member.email}
                </h3>
                <p className="text-sm text-[var(--bo-muted)]">
                  {member.email} · {member.roleName}
                </p>
              </div>
            </Panel>
          ))}
        </div>
      </div>
    </div>
  );
}
