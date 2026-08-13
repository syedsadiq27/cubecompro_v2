import { Planned } from '@/components/planned';

export const metadata = { title: 'PIM' };

export default function PimPage() {
  return (
    <Planned
      title="PIM"
      description="Product copy and attributes may originate in a PIM. The graph remains CubeCom Pro’s configuration source of truth."
      ships={false}
      contract="Inbound sync should create or update product identity, option labels, and value keys. It must not publish a graph or invent visual/commerce bindings. Outbound: after publish, a PIM may store the published graphVersion id as a reference. No PIM connector ships in this release."
      related={[
        { href: '/platform/products', label: 'Products' },
        { href: '/concepts/product-graph', label: 'Product graph' },
      ]}
    />
  );
}
