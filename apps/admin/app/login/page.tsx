
import { Wordmark } from '@repo/ui';
import { LoginForm } from '@/components/login-form';

export default function LoginPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[var(--canvas)] px-6">
      <div className="w-full max-w-sm rounded-[10px] border border-[var(--line)] bg-[var(--surface-pure)] p-8">
        <div className="mb-6 flex items-center gap-2">
          <Wordmark size="md" />
          <span className="text-[10px] font-semibold tracking-[0.08em] text-[var(--text-muted)] uppercase">
            Admin
          </span>
        </div>
        <h1 className="type-page text-[24px]">Control plane</h1>
        <p className="type-body mt-2">
          Organizations, plans, entitlements. Same owner credentials as seed.
        </p>
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
