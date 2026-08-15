import { OwnershipDiagram } from '@/components/integrations/ownership-diagram';
import { SeoMarketingPage } from '@/components/seo/seo-marketing-page';

export function CommercetoolsIntegrationPage() {
  return (
    <SeoMarketingPage
      path="/integrations/commercetools"
      visual={
        <OwnershipDiagram
          leftTitle="commercetools keeps"
          leftItems={[
            'Catalog & cart',
            'Your frontend & design system',
            'OMS / fulfillment',
          ]}
          rightTitle="CubeCom adds"
          rightItems={[
            'Constraint-aware configuration',
            'Optional 3D experiences',
            'Shareable configuration state',
          ]}
        />
      }
    />
  );
}
