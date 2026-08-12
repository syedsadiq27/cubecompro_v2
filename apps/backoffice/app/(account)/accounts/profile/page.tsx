import { updateProfileAction } from '@/actions/teams';
import { ProfileForm } from '@/components/account/profile-form';
import {
  ErrorState,
  PageHeader,
  Panel,
} from '@/components/ui';
import { graphRequest } from '@repo/product-graph';
import { ME_QUERY } from '@repo/product-graph';
import { getSessionUser } from '@/lib/session-server';

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) return null;

  try {
    const data = await graphRequest<{
      me: {
        email: string;
        name?: string | null;
        role?: string | null;
      };
    }>(ME_QUERY, undefined, user.token);

    const name = data.me.name?.trim() ?? '';
    const [firstname = user.firstName, ...rest] = name
      ? name.split(/\s+/)
      : [user.firstName, user.lastName];

    return (
      <div>
        <PageHeader
          title="Profile"
          description="Account details for the signed-in user."
        />
        <Panel>
          <ProfileForm
            defaults={{
              firstname: firstname ?? '',
              lastname: rest.join(' ') || user.lastName,
              role: data.me.role ?? user.role,
              email: data.me.email ?? user.email,
            }}
            action={updateProfileAction}
          />
        </Panel>
      </div>
    );
  } catch (error) {
    return (
      <ErrorState
        message={
          error instanceof Error ? error.message : 'Failed to load profile.'
        }
      />
    );
  }
}
