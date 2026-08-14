export const SESSION_COOKIES = {
  token: 'admin_token',
  userId: 'admin_user_id',
  email: 'admin_email',
  name: 'admin_name',
  role: 'admin_role',
  organizationId: 'admin_org_id',
} as const;

export type SessionUser = {
  token: string;
  userId: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
};

export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
