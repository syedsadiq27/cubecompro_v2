import { Planned } from '@/components/planned';

export const metadata = { title: 'Synchronize price/inventory' };

export default function SyncCommercePage() {
  return (
    <Planned
      title="Synchronize price/inventory"
      description="Pull display amounts from commerce. Do not write them into the graph as source of truth."
      ships={false}
      contract="After mapping variants, sync price and stock by sku/externalId from your commerce API into whatever the storefront already uses. CubeCom Pro will not ingest price lists or ATP. A future display overlay on ResolvedSelection is optional cache, never checkout authority. Until webhooks ship, poll commerce — not CubeCom Pro — for stock changes."
      related={[
        { href: '/platform/pricing', label: 'Pricing' },
        { href: '/platform/inventory', label: 'Inventory' },
        { href: '/reference/events', label: 'Events' },
      ]}
    />
  );
}
