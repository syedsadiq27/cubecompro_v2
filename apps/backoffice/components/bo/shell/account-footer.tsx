'use client';

import { AccountFooter as SuiteAccountFooter } from '@repo/ui';

export function AccountFooter({
  userName,
  orgName = 'Default Org',
  accountHref = '/accounts/profile',
  signOutAction,
}: {
  userName: string;
  orgName?: string;
  accountHref?: string;
  orgHref?: string;
  signOutAction?: (formData: FormData) => void | Promise<void>;
}) {
  return (
    <SuiteAccountFooter
      userName={userName}
      subtitle={`Account · ${orgName}`}
      accountHref={accountHref}
      signOutAction={signOutAction}
    />
  );
}
