import { cache } from 'react';
import { redirect } from 'next/navigation';
import { graphRequest } from '@repo/product-graph';
import { ME_QUERY } from '@repo/product-graph';
import { forceRelogin, isStaleAuthError } from './auth-recovery';
import { getSessionUser } from './session-server';
import type { SessionUser } from './session';

type MePayload = {
  me: {
    id: string;
    email: string;
    name?: string | null;
    role?: string | null;
    organizationId?: string | null;
  };
};

export const requireAuthenticatedUser = cache(
  async (): Promise<SessionUser> => {
    const session = await getSessionUser();
    if (!session) {
      redirect('/login');
    }

    try {
      const data = await graphRequest<MePayload>(
        ME_QUERY,
        undefined,
        session.token
      );

      const name = data.me.name?.trim() ?? '';
      const [firstName = '', ...rest] = name
        ? name.split(/\s+/)
        : [session.firstName, session.lastName];

      return {
        token: session.token,
        userId: data.me.id,
        email: data.me.email || session.email,
        firstName: firstName || session.firstName,
        lastName: rest.join(' ') || session.lastName,
        role: data.me.role ?? session.role,
      };
    } catch (error) {
      if (isStaleAuthError(error)) {
        forceRelogin();
      }
      throw error;
    }
  }
);
