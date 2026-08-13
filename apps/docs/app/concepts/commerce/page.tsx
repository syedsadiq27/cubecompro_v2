import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export const metadata = { title: 'Commerce references' };

export default function CommerceConceptPage() {
  return (
    <>
      <PageHeader
        title="Commerce references"
        description="A complete, valid configuration projects onto a commerce identity. CubeCom Pro does not own price or inventory. It tells your commerce system which identity the shopper is holding."
      />

      <Section title="Mapping">
        <Prose>
          <p>
            A <code>ProductVariant</code> is a commerce identity (provider,
            external id, optional SKU) plus selections that uniquely identify
            it. Resolve matches the normalized configuration to a variant.
          </p>
        </Prose>
        <CodeBlock>{`Black / XL / Walnut
        ↓
generic | commercetools
SKU-BLK-XL-WAL
externalId
cartPayload`}</CodeBlock>
      </Section>

      <Section title="What resolve returns">
        <SpecTable
          rows={[
            { label: 'provider', value: 'generic today; commercetools later' },
            { label: 'sku', value: 'Optional merchant SKU string' },
            {
              label: 'productReference / variantReference',
              value: 'Ids in the external catalog',
            },
            {
              label: 'cartPayload',
              value: 'Opaque JSON for add-to-cart adapters',
            },
          ]}
        />
        <Callout>
          Price and inventory are not CubeCom Pro fields. They belong on the
          commerce identity after mapping. Until a provider is connected,
          Backoffice shows $— and Inventory — as placeholders, not zeros.
        </Callout>
      </Section>

      <Section title="Unmapped">
        <Prose>
          <p>
            A valid look with no matching variant is not sellable. Resolve
            returns commerce fields null. The storefront must not invent a
            SKU. That gap is a merchant mapping task, not a client fallback.
          </p>
        </Prose>
      </Section>

      <Section title="Related">
        <Related
          links={[
            { href: '/start/commerce', label: 'Connect commerce' },
            { href: '/integrations/commercetools', label: 'commercetools' },
            { href: '/developers/graphql', label: 'resolveConfiguration' },
          ]}
        />
      </Section>
    </>
  );
}
