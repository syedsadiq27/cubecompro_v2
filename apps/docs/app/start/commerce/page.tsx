import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
  Steps,
} from '@/components/docs-ui';

export const metadata = { title: 'Connect commerce' };

export default function StartCommercePage() {
  return (
    <>
      <PageHeader
        title="Connect commerce"
        description="CubeCom Pro resolves an identity. Your commerce system prices it, stocks it, and checks out."
      />
      <Section title="Generic provider (now)">
        <Steps
          items={[
            {
              title: 'Create variants on the draft graph',
              body: 'provider = generic, externalId required, sku optional.',
            },
            {
              title: 'Map selections',
              body: 'Each variant gets the attribute values that uniquely select it.',
            },
            {
              title: 'Resolve',
              body: 'commerce.sku / variantReference / cartPayload are what you send downstream.',
            },
            {
              title: 'Add to cart in your system',
              body: 'Only if valid === true. Pass the resolved identity as the line item key.',
            },
          ]}
        />
      </Section>
      <Section title="Adapter">
        <CodeBlock>{`const resolved = await resolveConfiguration({ productId, selectionsJson })
if (!resolved.valid) throw new InvalidConfiguration(resolved.violations)
await commerce.addToCart({
  sku: resolved.commerce.sku,
  externalId: resolved.commerce.variantReference,
  payload: JSON.parse(resolved.commerce.cartPayloadJson ?? '{}'),
})`}</CodeBlock>
        <Callout>
          Price and inventory stay in the commerce system. Do not cache them
          as CubeCom Pro source of truth.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/commerce', label: 'Commerce references' },
            { href: '/integrations/commercetools', label: 'commercetools' },
            { href: '/guides/add-to-cart', label: 'Add-to-cart' },
          ]}
        />
      </Section>
    </>
  );
}
