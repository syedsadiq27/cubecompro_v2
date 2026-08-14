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
  'API overview',
  '/developers/api',
  'CubeCom Pro API surface — GraphQL for authoring and resolve, REST for document bytes and health.'
);

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
