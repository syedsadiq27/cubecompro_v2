import { forgotPasswordAction } from '@/actions/auth';
import { AuthForm, Field } from '@/components/auth/auth-form';
import { AuthShell } from '@/components/auth/auth-shell';

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Reset password"
      subtitle="We’ll email reset instructions if the account exists."
    >
      <AuthForm
        action={forgotPasswordAction}
        submitLabel="Send reset link"
        successMessage="If that email exists, reset instructions were sent."
      >
        <Field label="Email" name="email" type="email" autoComplete="email" />
      </AuthForm>
    </AuthShell>
  );
}
