import { Planned } from '@/components/planned';
import { docsMeta } from '@/lib/site';

export const metadata = docsMeta(
  'Shopify',
  '/integrations/shopify',
  'Map CubeCom Pro resolved selections to Shopify variants while cart and checkout stay in Shopify.'
);

export default function ShopifyPage() {
  return (
    <Planned
      title="Shopify"
      description="Map resolved selections to Shopify variants. No first-party app in this release."
      ships={false}
      contract="Treat Shopify as a commerce backend: store variant id as externalId, SKU as sku. After valid resolve, call Shopify cart AJAX / Storefront API with that variant. Price, inventory, and checkout stay in Shopify. A CubeCom Pro Shopify app (theme extension, metafields sync) is not shipping yet."
      related={[
        { href: '/integrations/custom', label: 'Custom commerce backend' },
        { href: '/integrations/commercetools', label: 'commercetools' },
        { href: '/start/commerce', label: 'Connect commerce' },
      ]}
    />
  );
}
