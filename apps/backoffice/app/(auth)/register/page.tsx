import { registerAction } from '../../../actions/auth';
import { AuthForm, Field } from '../../../components/auth/auth-form';
import { AuthShell } from '../../../components/auth/auth-shell';

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create account"
      subtitle="Register to manage Cube projects."
    >
      <AuthForm action={registerAction} submitLabel="Create account">
        <Field label="First name" name="firstname" autoComplete="given-name" />
        <Field label="Last name" name="lastname" autoComplete="family-name" />
        <Field label="Email" name="email" type="email" autoComplete="email" />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="new-password"
        />
      </AuthForm>
    </AuthShell>
  );
}
