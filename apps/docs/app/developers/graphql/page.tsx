import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export const metadata = { title: 'GraphQL API' };

export default function GraphQlPage() {
  return (
    <>
      <PageHeader
        title="GraphQL API"
        description="One endpoint. Authoring mutations for Backoffice/Studio. One query for storefronts: resolveConfiguration. Generated schema.gql is the machine contract — this page is the intended use."
      />

      <Section title="Endpoint">
        <CodeBlock>{`POST {API_URL}/graphql
Authorization: Bearer <token>`}</CodeBlock>
        <Prose>
          <p>
            Local default <code>http://localhost:3005/graphql</code>. Health:
            query <code>health</code> or HTTP <code>GET /healthz</code>.
          </p>
        </Prose>
      </Section>

      <Section title="Storefront operation">
        <SpecTable
          rows={[
            { label: 'Name', value: 'resolveConfiguration' },
            { label: 'Input', value: 'productId, selectionsJson, optional graphVersionId' },
            { label: 'Success', value: 'valid, threeD, commerce, graphVersion' },
            { label: 'Failure', value: 'valid false + violations[] — still 200 GraphQL' },
          ]}
        />
        <CodeBlock>{`query Resolve($input: ConfigurationStateInput!) {
  resolveConfiguration(input: $input) {
    valid
    violations
    selectionsJson
    graphVersionId
    graphVersion
    threeD {
      modelId
      effects { targetKey targetType nodePath operation valueJson materialAssetId documentUrl }
    }
    commerce { provider sku productReference variantReference cartPayloadJson }
  }
}`}</CodeBlock>
        <Callout>
          Invalid JSON in selectionsJson is a GraphQL/HTTP error. Invalid
          combinations are domain violations on a successful payload. Do not
          conflate them.
        </Callout>
      </Section>

      <Section title="Authoring (abridged)">
        <SpecTable
          rows={[
            { label: 'createProduct', value: 'Identity in a project' },
            { label: 'createProductGraphVersion', value: 'Start or copy a draft' },
            { label: 'publishProductGraphVersion', value: 'Make it the live graph' },
            { label: 'createProductAttribute / createAttributeValue', value: 'Options' },
            { label: 'createConfigurationRule', value: 'Constraints' },
            { label: 'createProductModel / createVisualEffect', value: '3D bindings' },
            { label: 'createProductVariant / createVariantSelection', value: 'Commerce bindings' },
          ]}
        />
        <Prose>
          <p>
            Full types live in <code>apps/api/src/schema.gql</code>. Generate
            clients from that file. Do not scrape this page for field lists.
          </p>
        </Prose>
      </Section>

      <Section title="Documents (not GraphQL)">
        <CodeBlock>{`GET {API_URL}/documents/objects/{id}
GET {API_URL}/documents/objects/{id}/metadata
GET {API_URL}/documents/materials/{id}`}</CodeBlock>
        <Prose>
          <p>
            Bearer required. These are byte streams for viewers, not a REST
            resource API. No public catalog REST surface exists.
          </p>
        </Prose>
      </Section>

      <Section title="Related">
        <Related
          links={[
            { href: '/developers/authentication', label: 'Authentication' },
            { href: '/concepts/configuration', label: 'Configuration state' },
            { href: '/developers/errors', label: 'Errors' },
          ]}
        />
      </Section>
    </>
  );
}
