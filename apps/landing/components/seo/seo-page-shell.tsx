import Link from 'next/link';
import type { ReactNode } from 'react';
import type { SeoPageDef } from '../../lib/seo-pages';

export function SeoPageShell({
  page,
  children,
}: {
  page: SeoPageDef;
  children: ReactNode;
}) {
  return (
    <>
      <section className="border-b border-[var(--line)] bg-[var(--canvas)]">
        <div className="mx-auto max-w-[90rem] px-5 py-16 md:px-8 md:py-24 lg:py-28">
          <p className="text-sm text-[var(--text-muted)]">{page.eyebrow}</p>
          <h1 className="type-page mt-4 max-w-4xl text-[clamp(2rem,4.5vw,3.25rem)]">
            {page.h1}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-[var(--text-secondary)]">
            {page.lead}
          </p>
          <p className="mt-6 max-w-2xl border-l-2 border-[var(--stage-violet)]/50 pl-4 text-base leading-relaxed text-[var(--ink)]">
            {page.reframe}
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              href={page.primaryCta.href}
              className="rounded-lg bg-[var(--ink)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--ink)]/90"
            >
              {page.primaryCta.label}
            </Link>
            <Link
              href={page.secondaryCta.href}
              className="rounded-lg border border-[var(--border-strong)] px-5 py-3 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)]"
            >
              {page.secondaryCta.label}
            </Link>
          </div>
        </div>
      </section>
      {children}
    </>
  );
}
