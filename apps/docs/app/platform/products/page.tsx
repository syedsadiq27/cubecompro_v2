import {
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export const metadata = { title: 'Products' };

export default function ProductsPage() {
  return (
    <>
      <PageHeader
        title="Products"
        description="A product is identity in a project. Configuration lives on graph versions attached to it, not on the product row."
      />
      <Section title="Fields">
        <SpecTable
          rows={[
            { label: 'name / key', value: 'Human label and stable slug' },
            { label: 'status', value: 'DRAFT | PUBLISHED | ARCHIVED' },
            { label: 'organizationId / projectId', value: 'Tenancy' },
          ]}
        />
        <Prose>
          <p>
            Creating a product does not create a graph. Start configuration
            to open draft v1. Publishing a graph does not rename the product.
          </p>
        </Prose>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/start/product', label: 'Add a product' },
            { href: '/concepts/product-graph', label: 'Product graph' },
            { href: '/platform/publishing', label: 'Publishing' },
          ]}
        />
      </Section>
    </>
  );
}
