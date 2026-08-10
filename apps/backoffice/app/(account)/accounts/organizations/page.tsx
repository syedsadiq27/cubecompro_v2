import { GetOrganizationsByUserIdDocument } from '@repo/graphql/generated';
import {
  EmptyState,
  ErrorState,
  PageHeader,
  Panel,
} from '../../../../components/ui';
import { createGlobalClient } from '../../../../lib/graphql';
import { getSessionUser } from '../../../../lib/session-server';

export default async function OrganizationsPage() {
  const user = await getSessionUser();
  if (!user) return null;

  let error: string | null = null;
  let organizations: Array<{
    id: string | number;
    name?: string | null;
    active?: boolean | null;
    usergroups?: Array<{ id: string | number; name?: string | null }> | null;
  }> = [];

  try {
    const client = createGlobalClient(user.token);
    const data = await client.global(GetOrganizationsByUserIdDocument, {
      id: user.userId,
    });
    organizations = data.getOrganizationByUserId ?? [];
  } catch (err) {
    error =
      err instanceof Error ? err.message : 'Failed to load organizations.';
  }

  return (
    <div>
      <PageHeader
        title="Organizations"
        description="Organizations associated with your account."
      />
      {error ? <ErrorState message={error} /> : null}
      {!error && organizations.length === 0 ? (
        <EmptyState message="No organizations found." />
      ) : null}
      <div className="grid gap-4 md:grid-cols-2">
        {organizations.map((org) => (
          <Panel key={String(org.id)}>
            <h3 className="text-lg font-semibold">{org.name}</h3>
            <p className="mt-1 text-sm text-[var(--bo-muted)]">
              {org.active === false ? 'Inactive' : 'Active'} ·{' '}
              {org.usergroups?.length ?? 0} teams
            </p>
            <ul className="mt-4 space-y-1 text-sm text-[var(--bo-muted)]">
              {(org.usergroups ?? []).map((group) => (
                <li key={String(group.id)}>{group.name}</li>
              ))}
            </ul>
          </Panel>
        ))}
      </div>
    </div>
  );
}
