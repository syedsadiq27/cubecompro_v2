import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Custom commerce backend' };

export default function CustomCommercePage() {
  return (
    <>
      <PageHeader
        title="Custom commerce backend"
        description="The default integration: generic provider + your cart API."
      />
      <Section title="Contract">
        <Prose>
          <p>
            Store your variant primary key as externalId. Optionally store
            SKU. Resolve returns them on commerce.*. Your backend prices,
            stocks, and checks out.
          </p>
        </Prose>
        <CodeBlock>{`provider: "generic"
externalId: "VAR-10492"
sku: "CHAIR-BLK-XL"`}</CodeBlock>
        <Callout>
          This is what ships today. commercetools / Shopify adapters are
          the same loop with a different client.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/start/commerce', label: 'Connect commerce' },
            { href: '/guides/add-to-cart', label: 'Add-to-cart' },
            { href: '/platform/commerce', label: 'Commerce resolution' },
          ]}
        />
      </Section>
    </>
  );
}
