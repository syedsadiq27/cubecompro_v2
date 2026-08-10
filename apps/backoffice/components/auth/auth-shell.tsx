import Link from 'next/link';
import { Stage } from '@repo/ui/stage';
import { Wordmark } from '@repo/ui/wordmark';

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <main className="grid min-h-screen lg:grid-cols-[1.15fr_0.85fr]">
      <section className="relative hidden overflow-hidden lg:block">
        <Stage
          size="full"
          product
          className="absolute inset-0 h-full"
          style={{ minHeight: '100%' }}
        />
        <div className="absolute inset-x-0 bottom-0 z-[2] bg-gradient-to-t from-[rgba(242,241,237,0.92)] to-transparent px-12 pb-12 pt-24">
          <Wordmark size="lg" showPro />
          <p className="type-body mt-4 max-w-sm">
            Configure physical products on a digital stage — catalog, commerce,
            and experience in one place.
          </p>
        </div>
      </section>
      <section className="flex items-center justify-center bg-[var(--canvas)] px-6 py-12">
        <div className="w-full max-w-md rounded-[10px] border border-[var(--bo-line)] bg-[var(--bo-panel)] p-8">
          <Wordmark size="md" showPro className="mb-8" />
          <h1 className="type-page text-[28px]">{title}</h1>
          <p className="type-body mt-2">{subtitle}</p>
          <div className="mt-8">{children}</div>
          {footer ? (
            <div className="type-meta mt-6">{footer}</div>
          ) : null}
          <p className="type-meta mt-8">
            <Link href="/login" className="underline-offset-2 hover:underline">
              Sign in
            </Link>
            {' · '}
            <Link
              href="/register"
              className="underline-offset-2 hover:underline"
            >
              Create account
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
}
