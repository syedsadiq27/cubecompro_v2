import { ProductPlaceholder } from '../../components/product-placeholder';

export const metadata = { title: 'Customizer' };

export default function CustomizerDocsPage() {
  return (
    <ProductPlaceholder
      title="Customizer"
      description="Shopper-facing product configuration experience connected to commerce."
      bullets={[
        'Embedding and project setup',
        'Configuration flows and variants',
        'Pricing, cart, and checkout handoff',
        'Theming and experience rules',
      ]}
    />
  );
}
