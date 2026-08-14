import Link from 'next/link';
import { bookSessionCta } from '@/lib/navigation';
import { PcOptionGraph } from './pc-option-graph';

export function PcHero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--line)] bg-[var(--canvas)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        aria-hidden
        style={{
          backgroundImage:
            'radial-gradient(circle at 16% 18%, rgba(95,87,247,0.09), transparent 40%)',
        }}
      />
      <div className="relative mx-auto grid max-w-[90rem] gap-9 px-5 py-10 md:gap-10 md:px-8 md:py-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:items-center lg:gap-14 lg:py-20">
        <div className="landing-rise">
          <p className="text-sm text-[var(--text-muted)]">Product Configurator</p>
          <h1 className="type-page mt-3 max-w-[13ch] text-[clamp(2.2rem,5.2vw,4rem)] md:mt-4">
            Rules first. Variants last.
          </h1>
          <p className="mt-4 max-w-lg text-[15px] leading-relaxed text-[var(--text-secondary)] md:mt-5 md:text-lg">
            Encode dependency rules once. Block illegal combinations. Resolve
            every legal state to price, inventory, and cart.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 md:mt-8">
            <Link
              href={bookSessionCta.href}
              className="rounded-lg bg-[var(--ink)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--ink)]/90"
            >
              {bookSessionCta.label}
            </Link>
            <Link
              href="/demo"
              className="rounded-lg border border-[var(--border-strong)] px-5 py-3 text-sm font-medium text-[var(--ink)] transition hover:border-[var(--ink)]"
            >
              Open live demo
            </Link>
          </div>
        </div>

        <div className="landing-rise min-w-0" style={{ animationDelay: '120ms' }}>
          <PcOptionGraph compact />
        </div>
      </div>
    </section>
  );
}
