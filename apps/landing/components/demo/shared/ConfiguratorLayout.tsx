'use client';

import { Typography, Wordmark } from '@repo/ui';
import Link from 'next/link';
import type { ReactNode } from 'react';

import { ProductSwitcher } from '../ProductSwitcher';

type ConfiguratorLayoutProps = {
  active: 'sofa' | 'tshirt';
  demoLabel: string;
  productName: string;
  productMeta: string;
  notice?: string | null;
  onReset: () => void;
  stage: ReactNode;
  stageFooter?: ReactNode;
  children: ReactNode;
};

export function ConfiguratorLayout({
  active,
  demoLabel,
  productName,
  productMeta,
  notice = null,
  onReset,
  stage,
  stageFooter,
  children,
}: ConfiguratorLayoutProps) {
  return (
    <div className="min-h-screen bg-[var(--canvas)] text-[var(--ink)]">
      <header className="flex min-h-[4.75rem] flex-wrap items-center justify-between gap-3 border-b border-[var(--line)] bg-[var(--canvas)] px-5 py-4 md:px-7">
        <div>
          <Link href="/" aria-label="CubeCom Pro home">
            <Wordmark size="nav" showPro />
          </Link>
          <Typography variant="meta" className="mt-1 tracking-wide">
            {demoLabel} · live configurator
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <ProductSwitcher active={active} />
          <Typography
            as={Link}
            href="/"
            variant="support"
            className="type-nav hidden text-[var(--text-secondary)] transition hover:text-[var(--ink)] sm:block"
          >
            Home
          </Typography>
        </div>
      </header>

      {notice ? (
        <div className="border-b border-[var(--warning)]/30 bg-[var(--warning-soft)] px-5 py-2.5 text-sm text-[var(--warning)] md:px-8">
          {notice}
        </div>
      ) : null}

      <div className="grid min-h-[calc(100vh-4.75rem)] lg:grid-cols-[minmax(0,2.25fr)_minmax(27rem,1fr)]">
        <section className="relative min-h-[58vh] overflow-hidden border-b border-[var(--line)] bg-[var(--surface)] lg:min-h-[calc(100vh-4.75rem)] lg:border-r lg:border-b-0">
          {stage}

          <Link
            href="/3d-product-configurator"
            className="absolute top-4 left-4 z-10 rounded-lg border border-[var(--line)] bg-[var(--surface-pure)]/90 px-3 py-2 text-xs font-medium shadow-sm backdrop-blur-md transition hover:bg-white"
          >
            ← Back to products
          </Link>

          <div className="absolute top-4 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-1 rounded-xl border border-[var(--line)] bg-[var(--surface-pure)]/90 p-1.5 text-xs shadow-sm backdrop-blur-md sm:flex">
            <span className="rounded-lg px-3 py-2">◉ Orbit</span>
            <span className="rounded-lg px-3 py-2">⌕ Zoom</span>
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg px-3 py-2 transition hover:bg-[var(--surface)]"
            >
              ↻ Reset
            </button>
            <span className="mx-1 h-5 w-px bg-[var(--line)]" />
            <span className="rounded-lg px-3 py-2">◇ Studio</span>
          </div>

          {stageFooter}
        </section>

        <aside className="flex flex-col gap-4 bg-[var(--surface)] px-5 py-5 lg:max-h-[calc(100vh-4.75rem)] lg:overflow-y-auto">
          <div className="border-l-2 border-[var(--line)] pl-3">
            <Typography as="h1" variant="titleLg" className="text-2xl">
              {productName}
            </Typography>
            <Typography variant="support" className="mt-0.5">
              {productMeta}
            </Typography>
          </div>
          {children}
        </aside>
      </div>
    </div>
  );
}
