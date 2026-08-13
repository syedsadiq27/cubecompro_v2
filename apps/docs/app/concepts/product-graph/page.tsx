import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
  TermList,
} from '@/components/docs-ui';

export const metadata = { title: 'Product graph' };

export default function ProductGraphPage() {
  return (
    <>
      <PageHeader
        title="Product graph"
        description="A product is not a row of SKUs. It is a versioned graph: options, 3D bindings, commerce bindings, and rules. Shoppers never mutate it. They submit a configuration against a published version."
      />

      <Section title="Shape">
        <CodeBlock>{`Product
  └── ProductGraphVersion          DRAFT | PUBLISHED | ARCHIVED
        ├── ProductAttribute[]     options (Color, Size, Frame)
        │     └── AttributeValue[]
        ├── ProductModel[]         attached library objects
        │     └── ModelTarget[]    parts that can change
        ├── VisualEffect[]         value → operation → target
        ├── ProductVariant[]       commerce identities
        │     └── VariantSelection[]  which values select this identity
        └── ConfigurationRule[]    constraints`}</CodeBlock>
      </Section>

      <Section title="Why a graph">
        <Prose>
          <p>
            A SKU list cannot express “Leather forbids White” and “Walnut
            sets the frame material” in one place. Those are edges on the
            same version. Resolve walks them together.
          </p>
        </Prose>
      </Section>

      <Section title="Status">
        <TermList
          items={[
            {
              term: 'DRAFT',
              meaning:
                'Editable in Backoffice and Studio. Resolve for storefronts rejects it unless graphVersionId is passed explicitly (preview).',
            },
            {
              term: 'PUBLISHED',
              meaning:
                'Immutable snapshot used when resolve is called with only productId.',
            },
            {
              term: 'ARCHIVED',
              meaning:
                'Historical published versions. Not the default for resolve.',
            },
          ]}
        />
        <Callout>
          Backoffice UI calls shopper-facing attributes Options. The graph
          type is still ProductAttribute. Do not expose that name in merchant
          or storefront copy.
        </Callout>
      </Section>

      <Section title="Authoring vs consuming">
        <SpecTable
          rows={[
            {
              label: 'Author',
              value: 'Backoffice + Studio write the graph. Publish freezes a version.',
            },
            {
              label: 'Consume',
              value: 'Customizer and storefronts only call resolveConfiguration.',
            },
          ]}
        />
      </Section>

      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/configuration', label: 'Configuration' },
            { href: '/concepts/rules', label: 'Rules & constraints' },
            { href: '/guides/configurator', label: 'Build a product configurator' },
          ]}
        />
      </Section>
    </>
  );
}
