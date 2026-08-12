import { redirect } from 'next/navigation';

export function isStaleAuthError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const message = error.message.toLowerCase();
  return (
    message.includes('user not found') ||
    message.includes('unauthorized') ||
    message.includes('invalid token')
  );
}

export function forceRelogin(): never {
  redirect('/login?force=1');
}
