import type { Metadata } from 'next';
import { Pricing } from '@/components/landing/pricing';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: `Pricing | ${SITE_NAME}`,
  description:
    'CubeCom Pro founding pricing for product configuration infrastructure — Starter, Pro, and Enterprise.',
};

export default function PricingPage() {
  return (
    <div className="border-b border-[var(--line)]">
      <div className="mx-auto max-w-[90rem] px-5 pt-12 md:px-8 md:pt-16">
        <p className="text-sm text-[var(--text-muted)]">Pricing</p>
        <h1 className="type-page mt-3 max-w-3xl text-[clamp(2rem,4vw,3rem)]">
          Plans for configuration infrastructure
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--text-secondary)]">
          Founding rates while we’re early. Lock in before regular pricing —
          decorations and image generation stay modular.
        </p>
      </div>
      <Pricing compact />
    </div>
  );
}
