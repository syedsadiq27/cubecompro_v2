import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export default function IntroductionPage() {
  return (
    <>
      <PageHeader
        title="What is CubeCom Pro?"
        description="CubeCom Pro is a configuration platform for physical products. It does not replace your PIM, DAM, or commerce engine. It sits between them and a shopper experience, and it is the only place a combination of options becomes a look and a sellable identity."
      />

      <Section title="Why it has to exist">
        <Prose>
          <p>
            Commerce systems sell SKUs. 3D tools author scenes. Neither knows
            whether Black + XL + Leather is legal, what material that choice
            applies, or which catalog item to add to cart.
          </p>
          <p>
            CubeCom Pro owns that contract. Merchants define a product graph.
            Shoppers submit a configuration state. Resolve returns scene state
            and commerce state from the same selection — or it returns
            violations and refuses the commerce action.
          </p>
        </Prose>
      </Section>

      <Section title="The pipeline">
        <CodeBlock>{`Product data
      ↓
ConfigurationState
      ↓
Rules / constraints
      ↓
ResolvedSelection
      ↓
┌──────────────┬───────────────┐
│ Scene state  │ Commerce state│
│ materials    │ SKU           │
│ visibility   │ price         │
│ transforms   │ inventory     │
└──────────────┴───────────────┘`}</CodeBlock>
      </Section>

      <Section title="Invariants">
        <SpecTable
          rows={[
            {
              label: 'Configuration ≠ SKU',
              value: 'A ConfigurationState is a set of option values, not a catalog item.',
            },
            {
              label: 'SKU is a projection',
              value: 'A SKU may be one projection of a resolved configuration.',
            },
            {
              label: 'One selection, two states',
              value: 'Scene state and commerce state originate from the same resolved selection.',
            },
            {
              label: 'Invalid never sells',
              value: 'Invalid configurations never resolve to a commerce action.',
            },
          ]}
        />
        <Callout>
          If a storefront can add an illegal combination to cart, CubeCom Pro
          was bypassed — not misconfigured.
        </Callout>
      </Section>

      <Section title="What CubeCom Pro is not">
        <Prose>
          <p>
            It is not a storefront, not a renderer SDK you drop on a PDP by
            itself, and not a replacement for commercetools or Shopify. Those
            systems remain the system of record for price, stock, and checkout.
            CubeCom Pro tells them which identity the current configuration
            maps to.
          </p>
        </Prose>
      </Section>

      <Section title="Next">
        <Related
          links={[
            { href: '/architecture', label: 'Architecture' },
            { href: '/concepts/product-graph', label: 'Product graph' },
            { href: '/start/project', label: 'Create a project' },
          ]}
        />
      </Section>
    </>
  );
}
