import { Planned } from '@/components/planned';

export const metadata = { title: 'Inventory' };

export default function InventoryPage() {
  return (
    <Planned
      title="Inventory"
      description="Stock is a commerce concern. CubeCom Pro only knows whether a selection is legal."
      ships={false}
      contract="After a valid resolve, query inventory by sku or variantReference in your commerce system. Do not treat an in-stock flag on the graph as authoritative. A later availability hint on ResolvedSelection will be advisory only."
      related={[
        { href: '/platform/commerce', label: 'Commerce resolution' },
        { href: '/guides/sync-commerce', label: 'Synchronize price/inventory' },
      ]}
    />
  );
}
