import Image from 'next/image';
import { bookSessionCta } from '@/lib/navigation';
import { SolutionHero } from '@/components/solutions/solution-hero';

export function PcHero() {
  return (
    <SolutionHero
      eyebrow="Product Configurator"
      title="Rules first. Variants last."
      lead="Model product options, dependencies, and exclusions once. Resolve every valid configuration to SKU, price, inventory, and cart. Configuration logic and commerce resolution — 3D is optional."
      primaryCta={bookSessionCta}
      secondaryCta={{
        href: '/3d-product-configurator',
        label: 'Need visual 3D?',
      }}
      visualPriority
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[var(--ink)]/15 bg-[var(--surface-pure)] shadow-[0_24px_56px_-16px_rgba(14,15,18,0.2)]">
        <Image
          src="/images/product-configurator-hero-rules-v2.jpg"
          alt="Product inputs passing through a rules lattice into one resolved modular product and valid commerce state"
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 55vw"
          className="object-cover select-none"
        />
      </div>
    </SolutionHero>
  );
}
