import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';
import { docsMeta } from '@/lib/site';

export const metadata = docsMeta(
  'commercetools',
  '/integrations/commercetools',
  'Connect CubeCom Pro resolved configurations to commercetools products and variants.'
);

export default function CommercetoolsPage() {
  return (
    <>
      <PageHeader
        title="commercetools"
        description="CubeCom Pro maps a resolved configuration onto a commercetools product / variant. commercetools remains the system of record for price, inventory, and checkout."
      />

      <Section title="Status">
        <Prose>
          <p>
            The graph already stores <code>provider</code>,
            <code>externalId</code>, and <code>sku</code> on variants. A live
            commercetools client is not in this release. Design the adapter
            against resolve output so flipping provider from generic →
            commercetools does not change the customizer.
          </p>
        </Prose>
        <Callout>
          Do not sync the full CubeCom option tree into commercetools
          attributes as the source of truth. commercetools holds sellable
          variants; CubeCom Pro holds which option tuple selects them.
        </Callout>
      </Section>

      <Section title="Intended mapping">
        <SpecTable
          rows={[
            {
              label: 'provider',
              value: 'commercetools',
            },
            {
              label: 'productReference',
              value: 'commercetools product id',
            },
            {
              label: 'variantReference / externalId',
              value: 'variant id or SKU, depending on your catalog',
            },
            {
              label: 'cartPayload',
              value: 'Line item draft (sku, supplyChannel, custom fields)',
            },
          ]}
        />
        <CodeBlock>{`Black / XL / Walnut
        ↓
commercetools
SKU-BLK-XL-WAL
$699.00          ← from commercetools, not CubeCom
In stock         ← from commercetools, not CubeCom`}</CodeBlock>
      </Section>

      <Section title="Adapter">
        <Prose>
          <p>
            After resolve, fetch price and availability from commercetools
            using the returned identity. If CubeCom says invalid, do not
            query commerce. If CubeCom says valid but unmapped, the merchant
            must attach a variant — the shopper cannot check out.
          </p>
        </Prose>
      </Section>

      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/commerce', label: 'Commerce resolution' },
            { href: '/start/commerce', label: 'Connect commerce' },
            { href: '/reference/events', label: 'Events' },
          ]}
        />
      </Section>
    </>
  );
}
