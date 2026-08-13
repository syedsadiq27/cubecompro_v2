import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
} from '@/components/docs-ui';

export const metadata = { title: 'Add-to-cart' };

export default function AddToCartPage() {
  return (
    <>
      <PageHeader
        title="Add-to-cart"
        description="Handoff a resolved identity. CubeCom Pro does not create the line item."
      />
      <Section title="Sequence">
        <CodeBlock>{`1. resolveConfiguration
2. if !valid → show violations, disable CTA
3. commerce.addToCart({
     sku: commerce.sku,
     id:  commerce.variantReference,
     extras: JSON.parse(commerce.cartPayloadJson ?? '{}')
   })`}</CodeBlock>
        <Prose>
          <p>
            Use the resolved identity as the line item key, not the raw
            selection map. Re-resolve immediately before add-to-cart if the
            shopper paused — the published graph may have changed.
          </p>
        </Prose>
        <Callout>
          Payment, tax, and shipping are out of scope.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/guides/resolve-sku', label: 'Resolve configuration → SKU' },
            { href: '/platform/cart', label: 'Cart' },
            { href: '/start/commerce', label: 'Connect commerce' },
          ]}
        />
      </Section>
    </>
  );
}
