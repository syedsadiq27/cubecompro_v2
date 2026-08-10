import { GetUserProfileDocument } from '@repo/graphql/generated';
import { updateProfileAction } from '../../../../actions/teams';
import { ProfileForm } from '../../../../components/account/profile-form';
import {
  ErrorState,
  PageHeader,
  Panel,
} from '../../../../components/ui';
import { createGlobalClient } from '../../../../lib/graphql';
import { getSessionUser } from '../../../../lib/session-server';

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) return null;

  try {
    const client = createGlobalClient(user.token);
    const data = await client.global(GetUserProfileDocument, {
      id: Number(user.userId),
    });
    const profile = data.userProfile;

    return (
      <div>
        <PageHeader
          title="Profile"
          description="Account details for the signed-in user."
        />
        <Panel>
          <ProfileForm
            defaults={{
              firstname: profile?.firstname ?? user.firstName,
              lastname: profile?.lastname ?? user.lastName,
              role: profile?.role ?? user.role,
              email: profile?.email ?? user.email,
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
