import { Planned } from '@/components/planned';

export const metadata = { title: 'Pricing' };

export default function PricingPage() {
  return (
    <Planned
      title="Pricing"
      description="CubeCom Pro does not own list price. Commerce systems do."
      ships={false}
      contract="Resolve returns a commerce identity (sku / variantReference). Price lookup, currency, and discounts happen in the commerce backend after a valid resolve. A future price overlay may cache display amounts for the configurator UI; it will never be the checkout source of truth."
      related={[
        { href: '/platform/commerce', label: 'Commerce resolution' },
        { href: '/guides/sync-commerce', label: 'Synchronize price/inventory' },
      ]}
    />
  );
}
