import {
  Callout,
  PageHeader,
  Prose,
  Related,
  Section,
  Steps,
} from '@/components/docs-ui';

export const metadata = { title: 'Build a product configurator' };

export default function ConfiguratorGuidePage() {
  return (
    <>
      <PageHeader
        title="Build a product configurator"
        description="When you finish, a shopper selection resolves to a look and a SKU."
      />
      <Section title="Order of work">
        <Steps
          items={[
            {
              title: 'Create a project and product',
              body: 'Identity only: name + key.',
            },
            {
              title: 'Start a draft graph',
              body: 'Backoffice: Start configuration. ProductGraphVersion DRAFT v1.',
            },
            {
              title: 'Define options and values',
              body: 'Keys go in selectionsJson. Names go on screen.',
            },
            {
              title: 'Upload a GLB and attach it',
              body: 'Library → Objects, then product 3D tab.',
            },
            {
              title: 'Map looks in Studio',
              body: 'Bind values to materials / visibility.',
            },
            {
              title: 'Map commerce identities',
              body: 'Complete combinations → provider + externalId + optional SKU.',
            },
            {
              title: 'Add rules',
              body: 'IF / THEN. Evaluated at resolve.',
            },
            {
              title: 'Publish',
              body: 'Storefront resolve with productId uses this version.',
            },
          ]}
        />
        <Callout>
          Skip a step and resolve still runs — with violations or null
          commerce. That is the model working.
        </Callout>
      </Section>
      <Section title="Done when">
        <Prose>
          <p>
            A legal selection returns valid true, at least one threeD.effect,
            and a sku or variantReference. An illegal selection returns
            violations and must not produce a cart action.
          </p>
        </Prose>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/start/project', label: 'Get started' },
            { href: '/concepts/product-graph', label: 'Product graph' },
            { href: '/start/embed', label: 'Embed the configurator' },
          ]}
        />
      </Section>
    </>
  );
}
