import { ProductPlaceholder } from '../../components/product-placeholder';

export const metadata = { title: 'Backoffice' };

export default function BackofficeDocsPage() {
  return (
    <ProductPlaceholder
      title="Backoffice"
      description="Admin console for catalog, commerce mappings, workflow, assets, and platform settings."
      bullets={[
        'Getting started and project setup',
        'Products, categories, and assets',
        'Commerce channels, mappings, and pricing',
        'Workflow, analytics, and integrations',
      ]}
    />
  );
}
