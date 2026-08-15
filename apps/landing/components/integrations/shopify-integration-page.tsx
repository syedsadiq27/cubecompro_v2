import { OwnershipDiagram } from '@/components/integrations/ownership-diagram';
import { SeoMarketingPage } from '@/components/seo/seo-marketing-page';

export function ShopifyIntegrationPage() {
  return (
    <SeoMarketingPage
      path="/integrations/shopify"
      visual={
        <OwnershipDiagram
          leftTitle="Shopify keeps"
          leftItems={['Catalog & inventory', 'Cart & checkout', 'Orders & payments']}
          rightTitle="CubeCom adds"
          rightItems={[
            'Configuration rules',
            '3D / decoration experiences',
            'State → sellable variant',
          ]}
        />
      }
    />
  );
}
