export const SESSION_COOKIES = {
  token: 'bo_token',
  userId: 'bo_user_id',
  email: 'bo_email',
  firstName: 'bo_first_name',
  lastName: 'bo_last_name',
  role: 'bo_role',
  projectId: 'bo_project_id',
  projectName: 'bo_project_name',
  projectToken: 'bo_project_token',
} as const;

export type SessionUser = {
  token: string;
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
};

export type ProjectSession = {
  projectId: string;
  projectName: string;
  projectToken: string;
};

export const COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
