'use client';

import { Button, Heading, Lede, Wordmark } from '@repo/ui';
import Link from 'next/link';

import { DEFAULT_CONFIGURATION } from '../demo/sofa/catalog';
import { resolveConfiguration } from '../demo/sofa/resolve';
import { SofaCanvas } from '../demo/sofa/SofaCanvas';

const heroMaterials = resolveConfiguration(DEFAULT_CONFIGURATION).materials;

export function Hero() {
  return (
    <section id="home" className="relative text-[var(--ink)]">
      <div className="cube-stage absolute inset-0" aria-hidden>
        <div className="cube-stage-field landing-plane-pulse" />
      </div>

      <div className="relative z-10 mx-auto grid min-h-[calc(100svh-3.75rem)] max-w-[90rem] lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="landing-rise flex flex-col justify-center px-5 py-12 md:px-8 md:py-16 lg:py-20">
          <Wordmark size="lg" showPro className="landing-brand-in" />
          <Heading as="h1" variant="hero" spacing="brand">
            Product configuration infrastructure for visual commerce.
          </Heading>
          <p
            className="mt-7 max-w-sm text-[clamp(1.2rem,2.4vw,1.45rem)] leading-snug tracking-[-0.02em] text-[var(--ink)] italic"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 550 }}
          >
            Stage the product. Sell the state.
          </p>
          <Lede variant="support">
            CubeCom keeps product rules, 3D state, SKU, price, inventory, and
            cart aligned as shoppers configure.
          </Lede>

          <div className="mt-9 flex flex-wrap items-center gap-3">
            <Button as={Link} href="/#proof" variant="primary" size="lg">
              Open live demo
            </Button>
            <Button as={Link} href="/#contact" variant="secondary" size="lg">
              Book a solution session
            </Button>
          </div>
        </div>

        <div className="relative min-h-[52vh] lg:min-h-0">
          <div className="absolute inset-0 cube-stage lg:border-l lg:border-[var(--line)]/60">
            <div className="cube-stage-field" />
          </div>
          <div className="relative h-full min-h-[52vh] lg:min-h-full">
            <SofaCanvas materials={heroMaterials} />
            <div className="pointer-events-none absolute inset-x-4 bottom-4 z-10 flex items-end justify-between gap-3">
              <span className="rounded-lg bg-[var(--surface-pure)]/80 px-3 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] backdrop-blur">
                Drag to orbit
              </span>
              <Link
                href="/#proof"
                className="pointer-events-auto rounded-lg bg-[var(--ink)] px-3 py-1.5 text-[11px] font-medium text-white transition hover:bg-[var(--ink)]/90"
              >
                Configure below
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
