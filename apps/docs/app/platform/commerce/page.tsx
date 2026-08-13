import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Commerce resolution' };

export default function PlatformCommercePage() {
  return (
    <>
      <PageHeader
        title="Commerce resolution"
        description="The commerce projection of a resolved selection: provider, sku, references, cart payload."
      />
      <Section title="Now">
        <Prose>
          <p>
            Variants on the graph map complete selections to a generic
            provider identity. resolveConfiguration fills commerce.* only
            when the selection is valid and mapped. Unmapped legal
            combinations return valid true with empty commerce — they can
            preview, they cannot sell.
          </p>
        </Prose>
        <Callout>
          See Commerce references for the field contract. See Connect
          commerce for the adapter loop.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/commerce', label: 'Commerce references' },
            { href: '/start/commerce', label: 'Connect commerce' },
            { href: '/platform/cart', label: 'Cart' },
          ]}
        />
      </Section>
    </>
  );
}
