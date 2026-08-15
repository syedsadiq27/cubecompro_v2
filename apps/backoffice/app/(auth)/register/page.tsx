import { registerAction } from '@/actions/auth';
import { AuthForm, AuthTextField } from '@/components/auth/auth-form';
import { AuthShell } from '@/components/auth/auth-shell';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <AuthShell>
      <div className="space-y-1">
        <h2 className="text-[20px] font-bold tracking-tight text-[var(--ink)]">
          Create workspace
        </h2>
        <p className="text-[13px] text-[var(--text-secondary)]">
          Start authoring 3D product configurations.
        </p>
      </div>

      <AuthForm action={registerAction} submitLabel="Create account">
        <div className="grid grid-cols-2 gap-3">
          <AuthTextField label="First name" name="firstname" autoComplete="given-name" />
          <AuthTextField label="Last name" name="lastname" autoComplete="family-name" />
        </div>
        <AuthTextField label="Work email" name="email" type="email" autoComplete="email" />
        <AuthTextField
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
        />
      </AuthForm>

      <p className="text-center text-[12px] text-[var(--text-secondary)]">
        Already have a workspace?{' '}
        <Link href="/login" className="font-semibold text-[var(--ink)] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
