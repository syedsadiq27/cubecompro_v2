import { bookSessionCta } from '@/lib/navigation';
import { SolutionHero } from '@/components/solutions/solution-hero';
import { PcOptionGraph } from './pc-option-graph';

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
    >
      <PcOptionGraph compact />
    </SolutionHero>
  );
}
