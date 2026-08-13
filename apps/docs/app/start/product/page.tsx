import {
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Add a product' };

export default function StartProductPage() {
  return (
    <>
      <PageHeader
        title="Add a product"
        description="Identity first. A product with no graph version cannot be resolved."
      />
      <Section title="Create">
        <Prose>
          <p>
            In Backoffice: Products → New. Name and key only. Then Start
            configuration to create draft v1.
          </p>
        </Prose>
        <CodeBlock>{`mutation {
  createProduct(input: {
    organizationId: "ORG_ID"
    projectId: "PROJECT_ID"
    name: "Studio Chair"
    key: "studio-chair"
  }) { id }
}`}</CodeBlock>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/platform/products', label: 'Products' },
            { href: '/start/options', label: 'Define options & values' },
            { href: '/concepts/product-graph', label: 'Product graph' },
          ]}
        />
      </Section>
    </>
  );
}
