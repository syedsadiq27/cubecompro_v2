import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export const metadata = { title: 'API overview' };

export default function ApiOverviewPage() {
  return (
    <>
      <PageHeader
        title="API overview"
        description="One GraphQL endpoint for authoring and resolve. A small REST surface for document bytes and health."
      />
      <Section title="Surface">
        <SpecTable
          rows={[
            { label: 'GraphQL', value: 'POST /graphql — products, graphs, resolve' },
            { label: 'Documents', value: 'GET /documents/objects/:id, /documents/materials/:id' },
            { label: 'Health', value: 'GET /healthz' },
          ]}
        />
        <CodeBlock>{`Authorization: Bearer <jwt>
Content-Type: application/json`}</CodeBlock>
        <Callout>
          There is no public REST CRUD for products. Generate clients from
          schema.gql. Do not scrape these pages for field lists.
        </Callout>
      </Section>
      <Section title="Related">
        <Related
          links={[
            { href: '/developers/graphql', label: 'GraphQL API' },
            { href: '/developers/rest', label: 'REST API' },
            { href: '/developers/authentication', label: 'Authentication' },
          ]}
        />
      </Section>
    </>
  );
}
