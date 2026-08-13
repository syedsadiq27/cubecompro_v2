import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
  Steps,
} from '@/components/docs-ui';

export const metadata = { title: 'Quickstart' };

export default function QuickstartPage() {
  return (
    <>
      <PageHeader
        title="Quickstart"
        description="Run the stack locally, sign in, and hit resolve against the seeded Demo Chair. You should leave this page with a valid configuration and a SKU projection."
      />

      <Section title="Run">
        <CodeBlock>{`yarn db:up && yarn db:migrate && yarn db:seed
yarn workspace api dev          # :3005
yarn workspace backoffice dev   # :3002`}</CodeBlock>
        <Prose>
          <p>
            Seed login: <code>owner@demo.cubecom.dev</code> / <code>demo1234</code>.
            API GraphQL is <code>http://localhost:3005/graphql</code>.
          </p>
        </Prose>
      </Section>

      <Section title="Authenticate">
        <CodeBlock>{`mutation {
  login(input: { email: "owner@demo.cubecom.dev", password: "demo1234" }) {
    token
    user { id email organizationId }
  }
}`}</CodeBlock>
        <Prose>
          <p>
            Send the token as <code>Authorization: Bearer &lt;token&gt;</code>
            on every subsequent request. Tokens are JWTs, 7-day expiry.
          </p>
        </Prose>
      </Section>

      <Section title="Resolve the demo chair">
        <Steps
          items={[
            {
              title: 'Find the product id',
              body: 'products(projectId) in GraphQL, or open the product in Backoffice and copy the id from the URL.',
            },
            {
              title: 'Call resolveConfiguration',
              body: 'Pass productId and selectionsJson with the demo option keys (color, size, frame, material).',
            },
            {
              title: 'Read both projections',
              body: 'valid must be true. threeD.effects is scene state. commerce.sku is the identity to sell.',
            },
          ]}
        />
        <CodeBlock>{`query {
  resolveConfiguration(input: {
    productId: "PRODUCT_ID"
    selectionsJson: "{\"color\":\"black\",\"size\":\"xl\",\"frame\":\"walnut\"}"
  }) {
    valid
    violations
    threeD { modelId effects { targetKey operation valueJson } }
    commerce { provider sku variantReference }
  }
}`}</CodeBlock>
        <Callout>
          If valid is false, do not add to cart. Fix selections or rules —
          do not concatenate a SKU on the client.
        </Callout>
      </Section>

      <Section title="Related">
        <Related
          links={[
            { href: '/developers/authentication', label: 'Authentication' },
            { href: '/guides/configurator', label: 'Build a product configurator' },
            { href: '/developers/graphql', label: 'GraphQL API' },
          ]}
        />
      </Section>
    </>
  );
}
