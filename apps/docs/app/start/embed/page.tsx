import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export const metadata = { title: 'Embed the configurator' };

export default function StartEmbedPage() {
  return (
    <>
      <PageHeader
        title="Embed the configurator"
        description="A PDP should submit ConfigurationState and apply ResolvedSelection. It should not reimplement resolve."
      />
      <Section title="Pattern">
        <CodeBlock>{`Shopper changes Color → Black
        ↓
POST /graphql  resolveConfiguration
        ↓
if !valid  →  block cart, show violations
if valid   →  apply threeD.effects
           →  pass commerce.* to add-to-cart`}</CodeBlock>
      </Section>
      <Section title="Studio embed (merchant)">
        <SpecTable
          rows={[
            {
              label: 'URL',
              value: '/{projectId}/{productId}/{modelId}?embed=1',
            },
            {
              label: 'Auth',
              value: 'Host waits for READY, posts AUTH { token, apiUrl, graphVersionId }',
            },
            {
              label: 'Close',
              value: 'Studio posts CLOSE + returnTo; Backoffice routes back',
            },
          ]}
        />
        <Callout>
          Studio is a separate app. Do not load it as a same-document React
          tree inside Backoffice.
        </Callout>
      </Section>
      <Section title="Storefront">
        <Prose>
          <p>
            Point the customizer at the published product with a project
            token, API URL, and product id. Resolve uses the published graph
            unless you pass a draft id for preview.
          </p>
        </Prose>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/experiences/embedded', label: 'Embedded experience' },
            { href: '/guides/custom-ui', label: 'Build custom UI' },
            { href: '/developers/graphql', label: 'GraphQL API' },
          ]}
        />
      </Section>
    </>
  );
}
