import Link from 'next/link';
import { loginAction } from '@/actions/auth';
import { AuthForm, Field } from '@/components/auth/auth-form';
import { AuthShell } from '@/components/auth/auth-shell';

export default function LoginPage() {
  return (
    <AuthShell
      title="Sign in"
      subtitle="Access your projects and product catalog."
      footer={
        <Link
          href="/forgot-password"
          className="underline-offset-2 hover:underline"
        >
          Forgot password?
        </Link>
      }
    >
      <AuthForm action={loginAction} submitLabel="Sign in">
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
        />
      </AuthForm>
    </AuthShell>
  );
}
