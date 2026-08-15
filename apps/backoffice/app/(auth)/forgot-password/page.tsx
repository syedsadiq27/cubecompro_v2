import { forgotPasswordAction } from '@/actions/auth';
import { AuthForm, AuthTextField } from '@/components/auth/auth-form';
import { AuthShell } from '@/components/auth/auth-shell';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <AuthShell>
      <div className="space-y-1">
        <h2 className="text-[20px] font-bold tracking-tight text-[var(--ink)]">
          Reset password
        </h2>
        <p className="text-[13px] text-[var(--text-secondary)]">
          We’ll email reset instructions if the account exists.
        </p>
      </div>

      <AuthForm
        action={forgotPasswordAction}
        submitLabel="Send reset link"
        successMessage="If that email exists, reset instructions were sent."
      >
        <AuthTextField label="Email" name="email" type="email" autoComplete="email" />
      </AuthForm>

      <p className="text-center text-[12px] text-[var(--text-secondary)]">
        Remember your password?{' '}
        <Link href="/login" className="font-semibold text-[var(--ink)] hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
