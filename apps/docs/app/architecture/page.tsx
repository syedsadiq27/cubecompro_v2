import {
  Callout,
  CodeBlock,
  PageHeader,
  Prose,
  Related,
  Section,
  SpecTable,
} from '@/components/docs-ui';

export const metadata = { title: 'Architecture' };

export default function ArchitecturePage() {
  return (
    <>
      <PageHeader
        title="Architecture"
        description="Four runtimes, one graph. Authorship, assets, resolve, and experience are separate processes on purpose."
      />

      <Section title="Runtimes">
        <SpecTable
          rows={[
            {
              label: 'API',
              value: 'NestJS + GraphQL + Prisma. Source of truth for the product graph and resolve.',
            },
            {
              label: 'Backoffice',
              value: 'Merchant workspace. Authors products, options, mappings, rules, publish.',
            },
            {
              label: 'Studio',
              value: 'Separate 3D authoring app. Maps option values to model targets. Not a Backoffice panel.',
            },
            {
              label: 'Customizer',
              value: 'Shopper experience. Submits ConfigurationState, renders ResolvedSelection.',
            },
          ]}
        />
        <Callout>
          Studio is its own origin (iframe + postMessage auth). Sharing a
          WebGL process with the library grid is not supported.
        </Callout>
      </Section>

      <Section title="Tenancy">
        <CodeBlock>{`Organization
  └── Project
        ├── Products → ProductGraphVersion
        └── Library (objects, materials, textures)`}</CodeBlock>
        <Prose>
          <p>
            Every product and asset is project-scoped. Tokens are issued to a
            user in an organization; project membership decides what the
            token may load.
          </p>
        </Prose>
      </Section>

      <Section title="Versioning">
        <Prose>
          <p>
            Configuration is versioned as a <code>ProductGraphVersion</code>
            with status DRAFT, PUBLISHED, or ARCHIVED. Resolve against a
            product id uses the published version. Passing a draft
            <code>graphVersionId</code> is for preview only.
          </p>
          <p>
            Publish is a graph snapshot. Library assets are not copied. If a
            material document changes, published mappings still point at the
            same asset id.
          </p>
        </Prose>
      </Section>

      <Section title="Data plane vs document plane">
        <SpecTable
          rows={[
            {
              label: 'Postgres',
              value: 'Graph: products, attributes, values, rules, variants, targets, effects.',
            },
            {
              label: 'Document store',
              value: 'GLBs, material JSON, parsed object metadata. Local files now; GCS is the production target.',
            },
            {
              label: 'HTTP /documents',
              value: 'Authenticated byte delivery for objects and materials. Not a public catalog API.',
            },
          ]}
        />
      </Section>

      <Section title="Related">
        <Related
          links={[
            { href: '/concepts/product-graph', label: 'Product graph' },
            { href: '/developers/graphql', label: 'GraphQL API' },
            { href: '/developers/authentication', label: 'Authentication' },
          ]}
        />
      </Section>
    </>
  );
}
